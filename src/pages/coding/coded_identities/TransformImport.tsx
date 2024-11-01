import React, { useEffect, useLayoutEffect, useState } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { SelectOption_TP } from "../../../types";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import {
  BaseInputField,
  InnerFormLayout,
  Select,
} from "../../../components/molecules";
import TableOfTransformBranch from "./TableOfTransformBranch";
import { Button } from "../../../components/atoms";
import TableOfTransformImport from "./TableOfTransformImport";
import TransformImportBoxes from "./TransformImportBoxes";
import { Employee_TP } from "../../employees/employees-types";

interface TransformImport_TP {
  setTransformImportModal: boolean;
  setIsSuccessPost: () => void;
  transformImportModal: boolean;
}

const TransformImport = ({
  setTransformImportModal,
  setIsSuccessPost,
  transformImportModal,
}: TransformImport_TP) => {
  const { formatReyal } = numberContext();
  const [selectedOption, setSelectedOption] = useState("normal");
  const [inputWeight, setInputWeight] = useState([]);
  const [rowWage, setRowWage] = useState(null);
  const [goldPriceToday, setGoldPriceToday] = useState("");
  const [branchId, setBranchId] = useState(null);
  const [thwelIds, setThwelIds] = useState([]);

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const initialValues = {
    branch_id: "",
    gold_price: goldPriceToday || "",
    sanad_type: "",
    weight_input: "",
  };

  const { data: GoldPrice } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "/attachment/api/v1/goldPrice",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data["price_gram_24k"]);
    },
  });

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
  console.log("🚀 ~ branchesOptions:", branchesOptions);

  const filterBranchesOptions = branchesOptions?.filter(
    (branch: any) => branch.id !== 1
  );
  console.log("🚀 ~ filterBranchesOptions:", filterBranchesOptions);

  const {
    data: operationTypeSelect,
    isLoading: operationTypeSelectLoading,
    refetch: refetchOperationTypeSelect,
    isFetching: operationTypeSelectisFetching,
    failureReason: operationTypeSelectErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: `identity/api/v1/getItemBarnch/${branchId}`,
    queryKey: ["operation-import-data"],
    onError: (err) => console.log(err),
  });
  console.log("🚀 ~ operationTypeSelect:", operationTypeSelect);

  useEffect(() => {
    refetchOperationTypeSelect();
  }, [branchId]);

  const operationTypeSelectWeight = operationTypeSelect?.filter(
    (el: any) => el.check_input_weight !== 0
  );

  // BOXES DATA
  const totalWages = operationTypeSelect?.reduce(
    (accumulator: any, currentValue: any) => {
      return accumulator + currentValue.weight * currentValue.wage;
    },
    0
  );

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
  operationTypeSelect?.map((select: any) => {
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
    mutationKey: ["thwel-import-api"],
    onSuccess: (data) => {
      setIsSuccessPost(data);
      notify("success");
      // QueryClient.refetchQueries(["thwel-api"]);
      setTransformImportModal(false);
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

  const operationTypeSelectInclude = operationTypeSelect?.map(
    (operation: any) => operation.id
  );
  console.log("🚀 ~ operationTypeSelectInclude:", operationTypeSelectInclude);

  // useEffect(() => {
  // const operationTypeSelectInclude = operationTypeSelect?.map(
  //   (operation: any) => !thwelIds.includes(`${operation.id}`)
  // );

  // operationTypeSelect?.map((operation: any) => {
  // if (!thwelIds.includes(`${operation.id}`)) {
  // }
  // });
  // }, []);

  const isContainCheckInputWeight = operationTypeSelect?.some(
    (el) => el.check_input_weight === 1
  );

  const filterPiecesContainWeight = operationTypeSelect?.filter((el) => {
    return el.check_input_weight === 1;
  });

  return (
    <Formik
      validationSchema=""
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values) => {
        if (!values.branch_id) {
          notify("info", "قم باختيار الفرع");
          return;
        }

        if (!values.gold_price) {
          notify("info", "قم بكتابة سعر الدهب");
          return;
        }

        const inputWeightItem = inputWeight?.every((item) => item.value !== "");

        // if (inputWeight?.length !== operationTypeSelectWeight?.length) {
        //   notify("info", `${t("You must add weight first")}`);
        //   return;
        // }

        // if (isContainCheckInputWeight && inputWeight?.length === 0) {
        //   notify(
        //     "info",
        //     `${t(
        //       `There are ${filterPiecesContainWeight?.length}  pieces contain weight`
        //     )}`
        //   );
        //   return;
        // }

        if (inputWeightItem === false) {
          notify("info", `${t("You must add weight first")}`);
          return;
        }

        PostNewValue({
          Branch: values.branch_id.toString(),
          goldPrice: values.gold_price,
          sanadType: "normal", // selectedOption,
          ThwilType: "normal",
          thwilItems: operationTypeSelectInclude,
          editWeight: operationTypeSelectWeight?.map((el, i) => {
            return {
              id: el.id.toString(),
              weight: el.weight,
              hwya: el.hwya,
              type: "all",
              wage: el.wage,
              category: el.category,
              classification: el.classification_name,
              totalWage: Number(el.wage) * el.weight,
              karat: el.karat_name,
              selling_price: el.selling_price,
            };
          }),
        });

        // setOperationTypeSelect([]);
      }}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form>
            <div className="flex flex-col gap-10 mt-6">
              <h2>
                <span className="text-xl ml-4 font-bold text-slate-700">
                  {t("identity and numbering management")}
                </span>
                <span>{t("transfer to branch")}</span>
              </h2>

              {/* INNER LAYOUT */}
              <InnerFormLayout
                title={t("basic bond data")}
                customStyle="bg-slate-200 p-6 rounded-lg"
              >
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xl font-bold">#000762</p>
                  <p className=" text-gray-800">2023-11-06</p>
                </div>

                <div className="bg-white p-6 rounded-lg mt-8 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-700">
                      {t("bond type")}
                    </h2>
                    <label className="flex items-center gap-2">
                      {t("normal supply")}
                      <input
                        type="radio"
                        name="sanad_type"
                        value="normal"
                        checked={selectedOption === "normal"}
                        onChange={handleOptionChange}
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      {t("beginning")}
                      <input
                        type="radio"
                        value="beginning"
                        name="sanad_type"
                        checked={selectedOption === "beginning"}
                        onChange={handleOptionChange}
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      {t("increase balance")}
                      <input
                        type="radio"
                        value="increase balance"
                        name="sanad_type"
                        checked={selectedOption === "increase balance"}
                        onChange={handleOptionChange}
                      />
                    </label>
                  </div>

                  <div>
                    <h2 className="text-xl ml-4 mb-2 font-bold text-slate-700">
                      {t("branch name")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6">
                      <div className="col-span-1">
                        {/* <SelectBranches required name="branch_id" /> */}
                        <div className="">
                          <Select
                            id="branch_id"
                            label={`${t("branches")}`}
                            name="branch_id"
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
                            onChange={(e) => {
                              setBranchId(e?.value);
                            }}
                          />
                        </div>
                      </div>

                      <BaseInputField
                        className="col-span-1"
                        id="gold_price"
                        name="gold_price"
                        type="text"
                        placeholder={`${t("current gold price")}`}
                        onChange={(e) => {
                          setGoldPriceToday(e.target.value);
                          setFieldValue("api_gold_price", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </InnerFormLayout>

              {/* BOXES OF TOTALS */}
              <TransformImportBoxes
                operationTypeSelect={operationTypeSelect}
                operationTypeLoading={operationTypeSelectLoading}
                itemTransferBoxes={itemTransferBoxes}
                operationTypeSelectisFetching={operationTypeSelectisFetching}
              />

              {/* TABLE OF TRANSFORM TO BRANCH */}
              <TableOfTransformImport
                operationTypeSelect={operationTypeSelect}
                setInputWeight={setInputWeight}
                setRowWage={setRowWage}
              />

              <Button
                type="submit"
                loading={thwelLoading}
                className="self-end"
                disabled={!operationTypeSelect?.length}
              >
                {t("confirm")}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TransformImport;
