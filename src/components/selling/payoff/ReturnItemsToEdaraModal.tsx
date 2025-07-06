// @ts-nocheck

import { t } from "i18next";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  BaseInputField,
  Checkbox,
  CheckBoxField,
  InnerFormLayout,
  Modal,
  Select,
} from "../../../components/molecules";
import { Form, Formik, useFormikContext } from "formik";
import { Button } from "../../../components/atoms";
import { numberContext } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { SelectOption_TP } from "../../../types";
import { BiSearchAlt } from "react-icons/bi";
import { formatDate } from "../../../utils/date";
import { Loading } from "../../../components/organisms/Loading";
import ReturnItemsToEdaraTable from "./ReturnItemsToEdaraTable";
import { Employee_TP } from "../../../pages/employees/employees-types";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useQueryClient } from "@tanstack/react-query";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import RejectedItemsInvoice from "../recieve items/RejectedItemsInvoice";
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase";

const ReturnItemsToEdaraModal = ({
  transformToBranchDynamicModal,
  refetch,
  setReturnItemsModel,
  setDataSourcePrint,
  setPrintModalData,
  printModal,
  setPrintModal,
}: any) => {
  const [goldPriceToday, setGoldPriceToday] = useState("");
  const [search, setSearch] = useState("");
  const [dataSource, setDataSource] = useState([]);

  const [successData, setSuccessData] = useState([]);
  const { userData } = useContext(authCtx);
  const queryClient = useQueryClient();
  const [mainData, setMainData] = useState([]);
  const [steps, setSteps] = useState(1);
  const [isBranchWaste, setIsBranchWaste] = useState(false);
  const { gold_price } = GlobalDataContext();
  const { values, resetForm, setFieldValue } = useFormikContext<any>();

  const operationTypeSelectWeight = dataSource?.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const isSearch =
    !!search && search.split("").map((item) => item)?.length >= 6;

  const { data, isLoading, isFetching, isRefetching } = useFetch({
    queryKey: ["return-edara", search],
    endpoint: `/branchManage/api/v1/all-accepted/${userData?.branch_id}?hwya[eq]=${search}`,

    onSuccess: (data) => {
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
          setDataSourcePrint((prev) => [...prev, branchWasteItems?.[0]]);
        } else if (!isBranchWaste) {
          setDataSource((prev) => [...prev, data?.data?.[0]]);
          setMainData((prev) => [...prev, data?.data?.[0]]);
          setDataSourcePrint((prev) => [...prev, data?.data?.[0]]);
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
      setPrintModalData({
        bondNumber: data?.bond?.bond_number,
        bond_date: data?.bond?.date,
        itemsCount: data?.bond?.items?.length,
      });
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
      setPrintModal(true);
    },
    onError: (error) => {
      notify("error", error.response.data.msg);
    },
  });

  function PostNewValue(value: any) {
    mutate({
      endpointName: "/mordItems/api/v1/morditems-to-edraa",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  useEffect(() => {
    document.getElementById("search")?.focus();
  }, [transformToBranchDynamicModal]);

  useEffect(() => {
    if (!printModal) {
      setDataSourcePrint([]);
    }
  }, [printModal]);

  const handleSubmit = (values: any) => {
    const weightComparison = mainData.map((mainItem, index) => {
      const operationItem = operationTypeSelectWeight[index];

      if (!operationItem) return null;

      return {
        mainDataId: mainItem.id,
        operationTypeSelectWeightId: operationItem.id,
        isOperationWeightLess:
          Number(operationItem.weight) > Number(mainItem.remaining_weight),
      };
    });

    if (weightComparison?.some((item) => item.isOperationWeightLess === true)) {
      notify("info", `${t("Weight is greater than the maximum limit")}`);
      return;
    }

    PostNewValue({
      branch_id: userData?.branch_id,
      api_gold_price: gold_price?.price_gram_24k,
      entity_gold_price: gold_price?.price_gram_24k,
      type: "normal",
      branch_is_wasting: isBranchWaste ? 1 : 0,
      items: operationTypeSelectWeight.map((el, i) => {
        return {
          id: el.thwelbond_id,
          hwya: el.hwya,
          front: el.front,
          weight: el.weight,
          isItemWeight: el.category_selling_type === "all" ? 1 : 0,
        };
      }),
    });
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
        <h2 className="text-xl font-semibold">
          {t("Return the parts to the administration")}
        </h2>

        <div>
          <Checkbox
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
          />
        </div>

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
              setDataSourcePrint={setDataSourcePrint}
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

export default ReturnItemsToEdaraModal;
