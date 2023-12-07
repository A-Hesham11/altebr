import { t } from "i18next";
import { useEffect, useState } from "react";
import { BaseInputField, InnerFormLayout } from "../../../components/molecules";
import { Form, Formik } from "formik";
import TableOfTransformBranch from "./TableOfTransformBranch";
import { Button } from "../../../components/atoms";
import { numberContext } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { SelectBranches } from "../../../components/templates/reusableComponants/branches/SelectBranches";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";

const TransformToBranch = ({
  operationTypeSelect,
  setOpenTransformToBranchModal,
  setIsSuccessPost,
}: any) => {
  const { formatReyal } = numberContext();
  const [selectedOption, setSelectedOption] = useState("normal"); // Initialize the selected option.
  const [inputWeight, setInputWeight] = useState([]);
  const [rowWage, setRowWage] = useState(null);
  const [files, setFiles] = useState([]);
  const [thwelIds, setThwelIds] = useState([]);

  const operationTypeSelectWeight = operationTypeSelect.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const initialValues = {
    branch_id: "",
    gold_price: "",
    sanad_type: "",
    weight_input: "",
  };

  // BOXES DATA
  const totalWages = operationTypeSelect.reduce(
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
  operationTypeSelect.map((select: any) => {
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

  const {
    mutate,
    isLoading: thwelLoading,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["thwel-api"],
    onSuccess: (data) => {
      setIsSuccessPost(data);
      notify("success");
      // QueryClient.refetchQueries(["thwel-api"]);
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
    operationTypeSelect.map((operation) => {
      if (!thwelIds.includes(`${operation.id}`)) {
        setThwelIds((prev) => [...prev, `${operation.id}`]);
      }
    });
  }, []);

  return (
    <Formik
      validationSchema=""
      initialValues={initialValues}
      onSubmit={(values) => {
        if (!values.branch_id) {
          notify("info", "قم باختيار الفرع");
          return;
        }

        if (!values.gold_price) {
          notify("info", "قم بكتابة سعر الدهب");
          return;
        }

        // CLOSE THE POPUP
        setOpenTransformToBranchModal(false);

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
      }}
    >
      <Form>
        <div className="flex flex-col gap-10 mt-6">
          <h2>
            <span className="text-xl ml-4 font-bold text-slate-700">
              {t("identity and numbering management")}
            </span>
            <span>{t("transfer to branch")}</span>
          </h2>

          {/* ATTACHMENT */}
          <div className="w-44">
            <FilesUpload files={files} setFiles={setFiles} />
          </div>

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
                    <SelectBranches required name="branch_id" />
                  </div>

                  <BaseInputField
                    className="col-span-1"
                    id="gold_price"
                    name="gold_price"
                    type="text"
                    placeholder={`${t("current gold price")}`}
                  />
                </div>
              </div>
            </div>
          </InnerFormLayout>

          {/* BOXES OF TOTALS */}
          {operationTypeSelect.length > 0 && (
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
          <TableOfTransformBranch
            operationTypeSelect={operationTypeSelect}
            setInputWeight={setInputWeight}
            setRowWage={setRowWage}
            inputWeight={inputWeight}
          />

          <Button
            type="submit"
            loading={thwelLoading}
            className="bg-mainGreen text-white self-end"
          >
            {t("confirm")}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default TransformToBranch;
