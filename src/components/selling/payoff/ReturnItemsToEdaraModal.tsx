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
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import RejectedItemsInvoice from "../recieve items/RejectedItemsInvoice";

const ReturnItemsToEdaraModal = ({
  transformToBranchDynamicModal,
  refetch,
  setOperationTypeSelect,
  setReturnItemsModel,
  setDataSourcePrint,
  printModal,
  setPrintModal,
}: any) => {
  const [goldPriceToday, setGoldPriceToday] = useState("");
  const [search, setSearch] = useState("");
  console.log("🚀 ~ search:", search);
  const [dataSource, setDataSource] = useState([]);

  console.log("🚀 ~ dataSource:", dataSource);
  const [successData, setSuccessData] = useState([]);
  console.log("🚀 ~ successData:", successData);
  const { userData } = useContext(authCtx);
  const queryClient = useQueryClient();
  const [mainData, setMainData] = useState([]);
  console.log("🚀 ~ mainData:", mainData);
  const [steps, setSteps] = useState(1);
  // const [files, setFiles] = useState([]);
  const [isBranchWaste, setIsBranchWaste] = useState(false);
  console.log("🚀 ~ isBranchWaste:", isBranchWaste);
  const { gold_price } = GlobalDataContext();
  console.log("🚀 ~ gold_price:", gold_price);

  const operationTypeSelectWeight = dataSource?.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const initialValues = {
    branch_id: "",
    gold_price: gold_price?.price_gram_24k || "",
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
    queryKey: ["return-edara", search],
    endpoint: `/branchManage/api/v1/all-accepted/${userData?.branch_id}?hwya[eq]=${search}`,
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
          setDataSourcePrint((prev) => [...prev, branchWasteItems?.[0]]);
        } else if (!isBranchWaste) {
          setDataSource((prev) => [...prev, data?.data?.[0]]);
          setMainData((prev) => [...prev, data?.data?.[0]]);
          setDataSourcePrint((prev) => [...prev, data?.data?.[0]]);
        }
      }

      setSearch("");
    },
    pagination: true,
    enabled: !!search,
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
      // setReturnItemsModel(false);
      setPrintModal(true);
      setOperationTypeSelect([]);
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
        isOperationWeightLess: operationItem.weight > mainItem.weight,
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
      {({ values, resetForm }) => {
        return (
          <>
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
                {steps === 1 && (
                  <div className="flex items-end justify-between">
                    <div className="flex gap-2 rounded-md  p-1">
                      <BaseInputField
                        id="search"
                        name="search"
                        value={search}
                        autoFocus
                        label={t("id code")}
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`${t("id code")}`}
                      />
                    </div>
                    {/* <div className="">
                    <FilesUpload setFiles={setFiles} files={files} />
                  </div> */}
                  </div>
                )}

                {steps === 2 && (
                  <div className="flex items-end justify-between">
                    <div className="flex items-end gap-4">
                      <div className="flex gap-2 rounded-md  p-1">
                        <BaseInputField
                          id="ManualSearch"
                          name="ManualSearch"
                          autoFocus
                          label={t("id code")}
                          type="text"
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
                    {/* <div className="">
                    <FilesUpload setFiles={setFiles} files={files} />
                  </div> */}
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
                      className="self-end"
                    >
                      {t("confirm")}
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default ReturnItemsToEdaraModal;
