import { t } from "i18next";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { BaseInputField } from "../../../components/molecules";
import { Form, Formik, useFormikContext } from "formik";
import { Button } from "../../../components/atoms";
import { notify } from "../../../utils/toast";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { Loading } from "../../../components/organisms/Loading";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useQueryClient } from "@tanstack/react-query";
import ReturnItemsToEdaraTable from "../../../components/selling/payoff/ReturnItemsToEdaraTable";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";

const WastedItemsInEdara = ({
  transformToBranchDynamicModal,
  refetch,
  setOperationTypeSelect,
  setReturnItemsModel,
}: any) => {
  const [search, setSearch] = useState("");
  console.log("🚀 ~ search:", search);
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ dataSource:", dataSource);
  const [successData, setSuccessData] = useState([]);
  const { userData } = useContext(authCtx);
  const queryClient = useQueryClient();
  const [mainData, setMainData] = useState([]);
  const [steps, setSteps] = useState(1);
  const [files, setFiles] = useState([]);
  const [isBranchWaste, setIsBranchWaste] = useState(true);
  const { values, setFieldValue } = useFormikContext<any>();

  const operationTypeSelectWeight = dataSource?.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const isSearch =
    !!search && search?.split("").map((item) => item)?.length >= 6;

  const {
    data,
    isLoading,
    isFetching,
    isRefetching,
    isSuccess,
    refetch: edaraRefetch,
  } = useFetch({
    queryKey: ["return-edara", search],
    endpoint: `/identity/api/v1/getWastingEdaraaPieces?hwya[eq]=${search}`,
    onSuccess: (data) => {
      console.log("🚀 ~ data:", data);
      if (data?.data?.length === 0) {
        notify("info", `${t("piece doesn't exist")}`);
        return;
      }

      const branchWasteItems = data?.data?.filter(
        (item) =>
          item.classification_id === 1 && item.category_selling_type !== "all"
      );

      if (branchWasteItems?.length === 0 && isBranchWaste) {
        notify("info", `${t("The piece cannot be wasted.")}`);
        return;
      }

      const findPiece = dataSource.findIndex(
        (item) => item.id === data?.data?.[0]?.id
      );

      if (data?.data?.length > 0 && findPiece === -1) {
        if (isBranchWaste && branchWasteItems?.length > 0) {
          setDataSource((prev) => [...prev, branchWasteItems?.[0]]);
          setMainData((prev) => [...prev, branchWasteItems?.[0]]);
        } else if (!isBranchWaste) {
          setDataSource((prev) => [...prev, data?.data?.[0]]);
          setMainData((prev) => [...prev, data?.data?.[0]]);
        }
      }

      setFieldValue("search", "");

      setSearch("");
    },
    pagination: true,
    enabled: !!isSearch,
  });

  const { mutate, isLoading: thwelLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["thwel-api"],
    onSuccess: (data) => {
      queryClient.refetchQueries(["thwel-api"]);
      notify(
        "success",
        `${t(
          "The parts have been returned to the administration successfully."
        )}`
      );
      refetch();
      setDataSource([]);
      setMainData([]);
      setIsBranchWaste(false);
      setReturnItemsModel(false);
      setOperationTypeSelect([]);
    },
    onError: (error) => {
      notify("error", error.response.data.msg);
    },
  });

  function PostNewValue(value: any) {
    mutate({
      endpointName: "/wastingGold/api/v1/wastingitems-to-edraa",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  useEffect(() => {
    document.getElementById("search")?.focus();
  }, [transformToBranchDynamicModal]);

  const handleSubmit = (values: any) => {
    PostNewValue({
      items: dataSource?.map((el, i) => {
        return {
          id: el.id,
          hwya: el.hwya,
          front: el.front,
        };
      }),
    });

    setOperationTypeSelect([]);
  };

  const total18 = dataSource
    ?.filter((item) => item.karat_name === "18")
    ?.reduce((acc, curr) => {
      acc += +curr.weight;
      return acc;
    }, 0);

  const total21 = dataSource
    ?.filter((item) => item.karat_name === "21")
    ?.reduce((acc, curr) => {
      acc += +curr.weight;
      return acc;
    }, 0);

  const total22 = dataSource
    ?.filter((item) => item.karat_name === "22")
    ?.reduce((acc, curr) => {
      acc += +curr.weight;
      return acc;
    }, 0);

  const total24 = dataSource
    ?.filter((item) => item.karat_name === "24")
    ?.reduce((acc, curr) => {
      acc += +curr.weight;
      return acc;
    }, 0);

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: dataSource?.length,
    },
    {
      name: "إجمالي وزن 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total24,
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total22,
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total21,
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total18,
    },
  ];

  if (isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("loading")} />;

  return (
    <Form>
      <div className="flex flex-col gap-10 mt-6">
        <h2>
          <span>{t("waste of parts")}</span>
        </h2>

        <div className="flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="flex gap-2 rounded-md  p-1">
              <BaseInputField
                id="search"
                name="search"
                autoFocus
                label={t("id code")}
                type="text"
                placeholder={`${t("id code")}`}
                className=""
              />
            </div>
            <Button
              type="submit"
              action={() => {
                setSearch(values.search);
              }}
            >
              {t("search")}
            </Button>
          </div>
          <div className="">
            <FilesUpload setFiles={setFiles} files={files} />
          </div>
        </div>

        <ul className="grid grid-cols-4 gap-6 mb-5">
          {totals.map(({ name, key, unit, value }) => (
            <BoxesDataBase variant="secondary" key={key}>
              <p className="bg-mainGreen px-2 py-4 flex items-center justify-center rounded-t-xl">
                {name}
              </p>
              <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                {value} {t(unit)}
              </p>
            </BoxesDataBase>
          ))}
        </ul>

        {dataSource?.length > 0 && (
          <>
            <ReturnItemsToEdaraTable
              mainData={mainData}
              operationTypeSelect={dataSource}
              setOperationTypeSelect={setDataSource}
              successData={successData}
              isLoading={isLoading}
              isFetching={isFetching}
              isRefetching={isRefetching}
              setMainData={setMainData}
            />
            <Button
              type="button"
              loading={thwelLoading}
              action={() => handleSubmit(values)}
              className="self-end"
            >
              {t("confirm")}
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};

export default WastedItemsInEdara;

{
  /* <div className="flex items-center gap-4">
          <Button
            bordered={steps === 2}
            action={() => {
              setSteps(1);
              setSearch("");
              resetForm();
            }}
          >
            {t("Enter barcode")}
          </Button>
          <Button
            bordered={steps === 1}
            action={() => {
              setSteps(2);
              setSearch("");
              resetForm();
            }}
          >
            {t("Manual entry")}
          </Button>
        </div> */
}

{
  /* <Checkbox
                  label={t("The branch bears the waste")}
                  labelClassName="text-lg"
                  type="checkbox"
                  id="branch_waste"
                  name="branch_waste"
                  checked={isBranchWaste}
                  onChange={(e: any) => {
                    e.target.checked
                      ? setIsBranchWaste(true)
                      : setIsBranchWaste(false);
                  }}
                  disabled={!isBranchWaste && dataSource?.length !== 0}
                  className={
                    !isBranchWaste && dataSource?.length !== 0
                      ? "bg-mainDisabled cursor-not-allowed"
                      : "cursor-pointer"
                  }
                /> */
}
{
  /* {steps === 1 && (
          <div className="flex items-end justify-between">
            <div className="flex gap-2 rounded-md  p-1">
              <BaseInputField
                id="search"
                name="search"
                // value={search}
                autoFocus
                label={t("id code")}
                type="text"
                // onChange={(e) => {
                //   console.log("🚀 ~ e:", values.search);
                //   setSearch(values.search);
                //   setFieldValue("search", values.search);
                // }}
                // onMouseLeave={() => {
                //   setSearch(values.search);
                // }}
                placeholder={`${t("id code")}`}
              />
            </div>
          </div>
        )} */
}
