import { t } from "i18next";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  BaseInputField,
  InnerFormLayout,
  Select,
} from "../../../components/molecules";
import { Form, Formik } from "formik";
import TableOfTransformBranch from "./TableOfTransformBranch";
import { Button } from "../../../components/atoms";
import { numberContext } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { SelectOption_TP } from "../../../types";
import { Employee_TP } from "../../employees/employees-types";
import { BiSearchAlt } from "react-icons/bi";
import TableOfDynamicTransformToBranch from "./TableOfDynamicTransformToBranch";
import { formatDate } from "../../../utils/date";
import { Loading } from "../../../components/organisms/Loading";

const DynamicTransformToBranch = ({
  // operationTypeSelect,
  transformToBranchDynamicModal,
  setOpenTransformToBranchDynamicModal,
  setIsSuccessPost,
  refetch,
  setOperationTypeSelect,
  setOpenSeperateModal,
  setTransformPrintBondsModal,
  setBondDataPrint,
}: any) => {
  const { formatReyal } = numberContext();
  const [inputWeight, setInputWeight] = useState([]);
  const [rowWage, setRowWage] = useState(null);
  const [thwelIds, setThwelIds] = useState([]);
  const [goldPriceToday, setGoldPriceToday] = useState("");
  const [search, setSearch] = useState("-");
  console.log("🚀 ~ search:", search);
  const [dataSource, setDataSource] = useState([]);
  const [successData, setSuccessData] = useState([]);
  console.log("🚀 ~ successData:", successData);

  const operationTypeSelectWeight = dataSource.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const { data: GoldPrice } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "/buyingUsedGold/api/v1/get-gold-price",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data["24"]);
    },
  });

  const initialValues = {
    branch_id: "",
    gold_price: goldPriceToday || "",
    sanad_type: "",
    weight_input: "",
    search: "",
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
    queryKey: ["dynamic-edara"],
    endpoint: `identity/api/v1/pieces_in_edara?hwya[eq]=${search}`,
    onSuccess: (data) => {
      if (search !== "-" && data?.data?.length === 0) {
        notify("info", t("piece doesn't exist"));
      }

      if (data?.data?.length !== 0) {
        notify("success", t("piece was added"));
      }
      setSearch("");
    },
    pagination: true,
  });

  // BOXES DATA
  const totalWages = dataSource.reduce(
    (accumulator: any, currentValue: any) => {
      return accumulator + currentValue.weight * currentValue.wage;
    },
    0
  );

  useEffect(() => {
    if (data) {
      setSuccessData(data?.data);
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
    }
  }, [successData, search]);

  // console.log(data?.data?.length);

  // useEffect(() => {

  // }, [search, data]);

  // useEffect(() => {
  //   if (successData?.length === 0) {
  //     setSearch("");
  //     notify("info", t("piece doesn't exist"));
  //   }
  // }, [successData]);

  // GOLD DATA
  let goldPiecesCount = 0;
  let goldStonesDetails = 0;

  // DIAMOND DATA
  let diamondPiecesCount = 0;
  let diamondStonesDetails = 0;
  let diamondSellingPrice = 0;

  // MiSCELLANEOUS
  let miscellaneousPiecesCount = 0;
  let miscellaneoustonesDetails = 0;
  let miscellaneousSellingPrice = 0;

  // KARAT NAME = 18
  let totalWeightKarat18 = 0;

  // KARAT NAME = 21
  let totalWeightKarat21 = 0;

  // KARAT NAME = 22
  let totalWeightKarat22 = 0;

  // KARAT NAME = 24
  let totalWeightKarat24 = 0;

  // TOTAL METAL WEIGHT FOR DIAMOND AND MISCELLANEOUS
  let metalWeight = 0;

  // LOOP IN SELECTED DATA
  dataSource.map((select: any) => {
    if (select?.classification_id === 1) {
      goldPiecesCount += 1;
      goldStonesDetails += select.stonesDetails.length;
    }

    if (select?.classification_id === 2) {
      diamondPiecesCount += 1;
      diamondStonesDetails += select.stonesDetails.length;
      diamondSellingPrice += select.selling_price;
    }

    if (select?.classification_id === 3) {
      miscellaneousPiecesCount += 1;
      miscellaneoustonesDetails += select.stonesDetails.length;
      miscellaneousSellingPrice += select.selling_price;
    }

    if (select?.karat_name == "18") {
      totalWeightKarat18 += Number(select.weight);
    }

    if (select?.karat_name == "21") {
      totalWeightKarat21 += Number(select.weight);
    }

    if (select?.karat_name == "22") {
      totalWeightKarat22 += Number(select.weight);
    }

    if (select?.karat_name == "24") {
      totalWeightKarat24 += Number(select.weight);
    }
  });

  const itemTransferBoxes = [
    {
      account: "total number of gold pieces",
      id: 1,
      value: goldPiecesCount,
      unit: "piece",
    },
    {
      account: "total number of diamonds pieces",
      id: 2,
      value: diamondPiecesCount,
      unit: "piece",
    },
    {
      account: "total number of miscellaneous pieces",
      id: 3,
      value: miscellaneousPiecesCount,
      unit: "piece",
    },
    {
      account: "total number of stones in gold",
      id: 4,
      value: goldStonesDetails,
      unit: "piece",
    },
    {
      account: "total number of stones in diamond",
      id: 5,
      value: diamondStonesDetails,
      unit: "piece",
    },
    {
      account: "total number of stones in miscellaneous",
      id: 6,
      value: miscellaneoustonesDetails,
      unit: "piece",
    },
    {
      account: "total wages",
      id: 7,
      value: formatReyal(totalWages),
      unit: "ryal",
    },
    {
      account: "total weight of 18 karat",
      id: 8,
      value: totalWeightKarat18,
      unit: "gram",
    },
    {
      account: "total weight of 21 karat",
      id: 9,
      value: totalWeightKarat21,
      unit: "gram",
    },

    {
      account: "total weight of 22 karat",
      id: 10,
      value: totalWeightKarat22,
      unit: "gram",
    },

    {
      account: "total weight of 24 karat",
      id: 11,
      value: totalWeightKarat24,
      unit: "gram",
    },

    {
      account: "total diamond value",
      id: 12,
      value: formatReyal(diamondSellingPrice),
      unit: "ryal",
    },

    {
      account: "total miscellaneous value",
      id: 13,
      value: formatReyal(miscellaneousSellingPrice),
      unit: "ryal",
    },

    {
      account: "total metal weight",
      id: 13,
      value: 0,
      unit: "gram",
    },
  ];

  const { mutate, isLoading: thwelLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["thwel-api"],
    onSuccess: (data) => {
      setIsSuccessPost(data);
      notify("success");
      // QueryClient.refetchQueries(["thwel-api"]);
      setTransformPrintBondsModal(true);
      setOpenTransformToBranchDynamicModal(false);

      setBondDataPrint(data?.bond);
      setOperationTypeSelect([]);
      refetch();
    },
    onError: (error) => {
      notify("error", error.response.data.msg);
    },
  });

  function PostNewValue(value: any) {
    mutate({
      endpointName: "/identity/api/v1/api-thwel",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  useEffect(() => {
    setDataSource([]);
    setSearch("-");
    document.getElementById("search")?.focus();
  }, [transformToBranchDynamicModal]);

  useEffect(() => {
    dataSource.map((operation: any) => {
      if (!thwelIds.includes(`${operation.id}`)) {
        setThwelIds((prev) => [...prev, `${operation.id}`]);
      }
    });
  }, []);

  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        return {
          id: branch.id,
          value: branch.id || "",
          label: branch.name || "",
          number: branch.number || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const filterBranchesOptions = branchesOptions?.filter(
    (branch: any) => branch.id !== 1
  );

  const handleSubmit = (values: any) => {
    const inputWeightItem = inputWeight?.every((item) => item.value !== "");

    if (inputWeight?.length !== operationTypeSelectWeight?.length) {
      notify("info", `${t("You must add weight first")}`);
      return;
    }

    if (inputWeightItem === false) {
      notify("info", `${t("You must add weight first")}`);
      return;
    }

    if (values?.branch_id === "") {
      notify("info", `${t("you should select branch")}`);
      return;
    }

    PostNewValue({
      Branch: values.branch_id.toString(),
      goldPrice: values.gold_price,
      sanadType: "normal", // selectedOption,
      ThwilType: "normal",
      thwilItems: thwelIds,
      editWeight: operationTypeSelectWeight.map((el, i) => {
        return {
          id: el.id.toString(),
          weight: Number(inputWeight[i].value),
          hwya: el.hwya,
          type: "all",
          wage: el.wage,
          category: el.category,
          classification: el.classification_name,
          totalWage: Number(el.wage) * Number(inputWeight[i].value),
          karat: el.karat_name,
          selling_price: el.selling_price,
        };
      }),
      // media: files
    });

    // setOperationTypeSelect([]);
  };

  // if (isLoading || isFetching || isRefetching)
  //   return <Loading mainTitle={t("loading")} />;

  return (
    <Formik
      validationSchema=""
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values) => {}}
    >
      {({ values, setValue }) => {
        return (
          <Form>
            <div className="flex flex-col gap-10 mt-6">
              <h2>
                <span>{t("dynamic transfer to branch")}</span>
              </h2>
              <div className="flex items-center gap-6">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6">
                    <BaseInputField
                      className="col-span-1 bg-mainDisabled"
                      id="gold_price"
                      label={t("current gold price")}
                      name="gold_price"
                      disabled
                      type="text"
                      placeholder={`${t("current gold price")}`}
                    />
                    <div className="col-span-1">
                      {/* <SelectBranches required name="branch_id" /> */}

                      <div className="">
                        <Select
                          id="branch_id"
                          name="branch_id"
                          label={`${t("branches")}`}
                          placeholder={`${t("branches")}`}
                          loadingPlaceholder={`${t("loading")}`}
                          options={filterBranchesOptions}
                          formatOptionLabel={(option) => (
                            <div className="flex justify-between">
                              <span>{option.label}</span>
                              <p>
                                {t("Branch")} - <span>{option.number}</span>
                              </p>
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 items-center justify-center rounded-md  p-1">
                      <BaseInputField
                        id="search"
                        name="search"
                        value={search}
                        autoFocus
                        label={t("id code")}
                        // disabled
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`${t("id code")}`}
                        className="placeholder-slate-400  p-[.18rem] w-80 !shadow-transparent focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* BOXES OF TOTALS */}
              {dataSource?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                  {itemTransferBoxes?.map((data: any) => (
                    <li
                      key={data.id}
                      className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md"
                    >
                      <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                        {t(`${data.account}`)}
                      </p>
                      <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                        {data.value} <span>{t(`${data.unit}`)}</span>
                      </p>
                    </li>
                  ))}
                </div>
              )}

              {/* TABLE OF TRANSFORM TO BRANCH */}
              {dataSource?.length > 0 && (
                <>
                  <TableOfDynamicTransformToBranch
                    operationTypeSelect={dataSource}
                    setOperationTypeSelect={setDataSource}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    isRefetching={isRefetching}
                    setInputWeight={setInputWeight}
                    setRowWage={setRowWage}
                    inputWeight={inputWeight}
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

export default DynamicTransformToBranch;
