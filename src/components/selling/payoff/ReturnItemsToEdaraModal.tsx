import { t } from "i18next";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  BaseInputField,
  InnerFormLayout,
  Select,
} from "../../../components/molecules";
import { Form, Formik } from "formik";
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

const ReturnItemsToEdaraModal = ({
  // operationTypeSelect,
  transformToBranchDynamicModal,
  setIsSuccessPost,
  refetch,
  setOperationTypeSelect,
  setReturnItemsModel,
}: any) => {
  const [thwelIds, setThwelIds] = useState([]);
  const [goldPriceToday, setGoldPriceToday] = useState("");
  const [search, setSearch] = useState("-");
  console.log("🚀 ~ search:", search);
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ dataSource:", dataSource);
  const [successData, setSuccessData] = useState([]);
  console.log("🚀 ~ successData:", successData);
  const { userData } = useContext(authCtx);
  const queryClient = useQueryClient();
  const [mainData, setMainData] = useState([]);
  console.log("🚀 ~ SellingBranchIdentity ~ mainData:", mainData);
  const [steps, setSteps] = useState(1);
  const [files, setFiles] = useState([]);

  const operationTypeSelectWeight = dataSource.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const initialValues = {
    branch_id: "",
    gold_price: goldPriceToday || "",
    sanad_type: "",
    weight_input: "",
    search: "",
    ManualSearch: "",
  };

  // FETCHING DATA FROM API
  const {
    data,
    isLoading,
    isFetching,
    isRefetching,
    isSuccess,
    refetch: edaraRefetch,
  } = useFetch({
    queryKey: ["return-edara"],
    endpoint: `/branchManage/api/v1/all-accepted/${userData?.branch_id}?hwya[eq]=${search}`,
    onSuccess: (data) => {
      if (search !== "كود الهوية" && data?.data?.length === 0) {
        notify("info", t("piece doesn't exist"));
      }

      if (data?.data?.length !== 0) {
        notify("success", t("piece was added"));
      }
      setSearch("");
    },
    pagination: true,
  });

  const { data: GoldPrice } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "/attachment/api/v1/goldPrice",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data["price_gram_24k"]);
    },
  });

  useEffect(() => {
    if (data) {
      setSuccessData(data?.data);
      // setMainData(data?.data)
    }
  }, [data]);

  useEffect(() => {
    if (isRefetching) {
      setSearch("");
    }
  }, []);

  // EFFECTS
  useEffect(() => {
    if (search.trim().length > 0) {
      const timeout = setTimeout(() => {
        edaraRefetch();
      }, 200);

      return () => clearTimeout(timeout);
    }

    const findPiece = dataSource.findIndex(
      (item) => item.id === successData?.[0]?.id
    );

    if (successData?.length > 0 && findPiece === -1) {
      setDataSource((prev) => [...prev, successData?.[0]]);
      setMainData((prev) => [...prev, successData?.[0]]);
    }
  }, [successData, search]);

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
      setReturnItemsModel(false);
      setOperationTypeSelect([]);
      refetch();
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
    setDataSource([]);
    setMainData([]);
    setSearch("كود الهوية");
    document.getElementById("search")?.focus();
  }, [transformToBranchDynamicModal]);

  useEffect(() => {
    dataSource.map((operation: any) => {
      if (!thwelIds.includes(`${operation.id}`)) {
        setThwelIds((prev) => [...prev, `${operation.id}`]);
      }
    });
  }, []);

  const handleSubmit = (values: any) => {

    const weightComparison = mainData.map((mainItem, index) => {
      const operationItem = operationTypeSelectWeight[index];

      if (!operationItem) return null; 

      return {
        mainDataId: mainItem.id,
        operationTypeSelectWeightId: operationItem.id,
        isOperationWeightLess: operationItem.weight > mainItem.weight,
      };
    });
    console.log(
      "🚀 ~ weightComparison ~ weightComparison:",
      weightComparison?.some((item) => item.isOperationWeightLess === true)
    );

    if (weightComparison?.some((item) => item.isOperationWeightLess === true)) {
      notify("info", `${t("Weight is greater than the maximum limit")}`);
      return;
    }

    PostNewValue({
      branch_id: userData?.branch_id,
      api_gold_price: values.gold_price,
      entity_gold_price: values.gold_price,
      type: "normal",
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

    setOperationTypeSelect([]);
  };

  if (isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("loading")} />;

  return (
    <Formik
      validationSchema=""
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values) => {}}
    >
      {({ values, setValue, resetForm }) => {
        console.log("🚀 ~ values:", values);
        return (
          <Form>
            <div className="flex flex-col gap-10 mt-6">
              <h2>
                <span>{t("Return the parts to the administration")}</span>
              </h2>

              <div className="flex items-center gap-4">
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
              </div>
              {steps === 1 && (
                <div className="flex items-end justify-between">
                  <div className="flex gap-2 rounded-md  p-1">
                    <BaseInputField
                      id="search"
                      name="search"
                      value={search}
                      autoFocus
                      label={t("id code")}
                      type="search"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={`${t("id code")}`}
                      className=""
                    />
                  </div>
                  <div className="">
                    <FilesUpload setFiles={setFiles} files={files} />
                  </div>
                </div>
              )}

              {steps === 2 && (
                <div className="flex items-end justify-between">
                  <div className="flex items-end gap-4">
                    <div className="flex gap-2 rounded-md  p-1">
                      <BaseInputField
                        id="ManualSearch"
                        name="ManualSearch"
                        // value={search}
                        autoFocus
                        label={t("id code")}
                        type="text"
                        // onChange={(e) => setSearch(e.target.value)}
                        placeholder={`${t("id code")}`}
                        className=""
                      />
                    </div>
                    <Button
                      action={() => {
                        setSearch(values.ManualSearch);

                        resetForm();
                      }}
                    >
                      {t("search")}
                    </Button>
                  </div>
                  <div className="">
                    <FilesUpload setFiles={setFiles} files={files} />
                  </div>
                </div>
              )}

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
                    className="bg-mainGreen text-white self-end"
                  >
                    {t("confirm")}
                  </Button>
                </>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReturnItemsToEdaraModal;
