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
import WasteSupplyReturnTable from "./WasteSupplyReturnTable";
import { date } from "yup";
import RadioGroup from "../../molecules/RadioGroup";
import { GlobalDataContext } from "../../../context/settings/GlobalData";

const WasteSupplyReturn = () => {
  const [thwelIds, setThwelIds] = useState([]);
  const [search, setSearch] = useState("-");
  const [dataSource, setDataSource] = useState([]);
  const [successData, setSuccessData] = useState([]);
  const { userData } = useContext(authCtx);
  const queryClient = useQueryClient();
  const [mainData, setMainData] = useState([]);
  const [steps, setSteps] = useState(1);
  const [files, setFiles] = useState([]);
  const [isBranchWasting, setIsBranchWasting] = useState(null);
  const { gold_price } = GlobalDataContext();

  const operationTypeSelectWeight = dataSource.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const initialValues = {
    branch_id: "",
    gold_price: gold_price?.price_gram_24k || "1000",
    sanad_type: "",
    weight_input: "",
    search: "",
    ManualSearch: "",
    branch_is_wasting: 0,
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
        notify("info", `${t("piece doesn't exist")}`);
      }

      //   if (data?.data?.length !== 0) {
      //     notify("success", `${t("piece was added")}`);
      //   }

      setSearch("");
    },
    pagination: true,
  });

  useEffect(() => {
    if (data?.data?.length) {
      if (data?.data?.[0]?.weight != 0) {
        notify("success", `${t("piece was added")}`);
        setSuccessData(data?.data);
      } else {
        notify(
          "info",
          `${t("The weight of the piece must be greater than zero.")}`
        );
      }
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
    mutationKey: ["wastingitems-to-edraa"],
    onSuccess: (data) => {
      queryClient.refetchQueries(["wastingitems-to-edraa"]);
      notify(
        "success",
        `${t("The parts were returned to the administration.")}`
      );
      location.reload();
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
    setDataSource([]);
    setMainData([]);
    setSearch("كود الهوية");
    document.getElementById("search")?.focus();
  }, []);

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

    if (weightComparison?.some((item) => item.isOperationWeightLess === true)) {
      notify("info", `${t("Weight is greater than the maximum limit")}`);
      return;
    }

    if (!isBranchWasting) {
      notify("info", `${t("Who should bear the waste?")}`);
      return;
    }

    PostNewValue({
      branch_id: userData?.branch_id,
      api_gold_price: values.gold_price,
      entity_gold_price: values.gold_price,
      branch_is_wasting: values.branch_is_wasting === "yes" ? 1 : 0,
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
  };

  //   if (isLoading || isFetching || isRefetching)
  //     return <Loading mainTitle={t("loading")} />;

  return (
    <Formik
      validationSchema=""
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values) => {}}
    >
      {({ values, resetForm, setFieldValue }) => {
        return (
          <Form>
            <div className="flex flex-col gap-10 mt-6 p-8">
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

              <RadioGroup
                name="branch_is_wasting"
                onChange={(e) => {
                  setFieldValue("branch_is_wasting", e);
                  setIsBranchWasting(e);
                }}
              >
                <div className="flex gap-x-2">
                  <label>{t("The branch bears the waste")}</label>
                  <RadioGroup.RadioButton
                    value="yes"
                    label={`${t("yes")}`}
                    id="yes"
                  />
                  <RadioGroup.RadioButton
                    value="no"
                    label={`${t("no")}`}
                    id="no"
                  />
                </div>
              </RadioGroup>
              {dataSource?.length > 0 ? (
                <>
                  {(dataSource?.length > 0 && !isLoading) ||
                  (!isFetching && !isRefetching) ? (
                    <>
                      <WasteSupplyReturnTable
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
                        action={() => {
                          handleSubmit(values);
                          resetForm();
                        }}
                        className="self-end"
                      >
                        {t("confirm")}
                      </Button>
                    </>
                  ) : (
                    <div>
                      <Loading mainTitle={t("loading")} />
                    </div>
                  )}
                </>
              ) : (
                <p className="w-full text-center mt-12 text-2xl">
                  {t("ID code must be entered")}
                </p>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default WasteSupplyReturn;
