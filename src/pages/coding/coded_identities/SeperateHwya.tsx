import { t } from "i18next";
import { useEffect, useState } from "react";
import { Button } from "../../../components/atoms";
import TableOfSeperate from "./TableOfSeperate";
import { Form, Formik } from "formik";
import { initialValues } from "../../System";
import { BaseInputField } from "../../../components/molecules";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useMutate } from "../../../hooks";

const SeperateHwya = ({
  setIsSuccessPost,
  operationTypeSelect,
  setFormData,
  formData,
  refetch,
  setPage,
  setOpenSeperateModal,
  setOperationTypeSelect,
  seperateModal
}) => {
  console.log(
    "🚀 ~ file: SeperateHwya.tsx:7 ~ SeperateHwya ~ operationTypeSelect:",
    operationTypeSelect
  );
  const [selectedOption, setSelectedOption] = useState("normal supply"); // Initialize the selected option.
  const [totalWeight, setTotalWeight] = useState(
    +operationTypeSelect[0]?.weight
  );
  console.log("🚀 ~ file: SeperateHwya.tsx:24 ~ totalWeight:", totalWeight);
  const valuesOfForm = Object.values(formData);
  const isAnyPieceEmpty = valuesOfForm.some((el) => (+el === 0 || el === ""))
  console.log("🚀 ~ file: SeperateHwya.tsx:34 ~ isAnyPieceEmpty:", isAnyPieceEmpty)
  const totalOfValuesOfForm = valuesOfForm.reduce((acc: any, curr: any) => {
    return +acc + +curr;
  }, 0);
  console.log(
    "🚀 ~ file: SeperateHwya.tsx:142 ~ totalOfValuesOfForm ~ totalOfValuesOfForm:",
    totalOfValuesOfForm
  );
  
  useEffect(() => {
    const formula = +operationTypeSelect[0]?.weight - +totalOfValuesOfForm;
    console.log(
      "🚀 ~ file: SeperateHwya.tsx:33 ~ useEffect ~ formula:",
      formula
    );
    setTotalWeight(formula);

    if (+formula < 0) {
      notify("error", t("available weight is negative"))
    }
  }, [totalOfValuesOfForm]);

  // useEffect(() => {
  //   setTotalWeight(+operationTypeSelect[0]?.weight)
  // }, [seperateModal])

  const initialValues = {
    hwya: "",
    // classificationName: "",
  };

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const weightInputDisabledCheck =
    operationTypeSelect[0]?.category_items?.every(
      (item: any) => item.item_weight === "0"
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { mutate, isLoading: seperateLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["seperate-api"],
    onSuccess: (data) => {
      notify("success");
      setIsSuccessPost(data);
    },
    onError: (error) => {
      notify("error", `${error.response.data.msg}`);
    },
  });

  function PostNewValue(value: any) {
    mutate({
      endpointName: "/identity/api/v1/api-fasl",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  return (
    <Formik
      onSubmit={(values) => console.log(values)}
      initialValues={initialValues}
    >
      {(values) => {
        return (
          <div className="flex flex-col gap-10 mt-6">
            <h2>
              <span className="text-xl ml-4 font-bold text-slate-700">
                {t("identity and numbering management")}
              </span>
              <span>{t("seperating identities")}</span>
            </h2>

            <div className="flex items-center gap-32 justify-center">
              <Button className="bg-mainGreen w-60 gap-1 text-white flex items-center justify-center flex-col self-end">
                <p>{t("hwya")}</p>
                <p className="font-normal">{operationTypeSelect[0]?.hwya}</p>
              </Button>
              <Button className="bg-mainGreen w-60 text-white self-end flex flex-col gap-1 items-center justify-center">
                <p>{t("classification name")}</p>
                <p className="font-normal">
                  {operationTypeSelect[0]?.category}
                </p>
              </Button>
            </div>

            <Form className="flex flex-col">
              <p className="mb-1 self-end text-red-600 pl-6 pt-6 flex items-center">{`${t(
                "total weight"
              )}: ${totalWeight}`}</p>
              <div className="grid grid-cols-1 lg:grid-cols-4  gap-8">
                {operationTypeSelect[0]?.category_items?.map((item) => {
                  return (
                    <BaseInputField
                      id={`item_${item.id}`}
                      className={`${
                        !weightInputDisabledCheck && "bg-mainDisabled"
                      }`}
                      key={item.id}
                      placeholder={(!weightInputDisabledCheck && item.item_weight !== 0) ? item.item_weight : t("type weight")}
                      label={`${item.child}`}
                      disabled={!weightInputDisabledCheck}
                      onChange={handleChange}
                      name={`item_${item.id}`}
                      type="text"
                    />
                  );
                })}
              </div>
            </Form>

            {/* TABLE OF seperating identities */}
            <TableOfSeperate operationTypeSelect={operationTypeSelect} />

            <Button
              type="submit"
              action={() => {
                console.log({
                  category_id: operationTypeSelect[0]?.id,
                  items: operationTypeSelect[0]?.id,
                  weights:
                    valuesOfForm.length === 0
                      ? operationTypeSelect[0]?.category_items.map(
                          (item) => `${item.item_weight}`
                        )
                      : valuesOfForm,
                });

                console.log(
                  "🚀 ~ file: SeperateHwya.tsx:135 ~ valuesOfForm:",
                  valuesOfForm
                );

                console.log(formData);

                console.log("🚀 ~ file: SeperateHwya.tsx:181 ~ isAnyPieceEmpty:", isAnyPieceEmpty)
                if (isAnyPieceEmpty) {
                  notify("error", t("type details weight per piece"))
                  return;
                }

                if (totalOfValuesOfForm > +operationTypeSelect[0]?.weight) {
                  notify(
                    "error",
                    t("total edited weight greater than available weight") 
                  );
                  return;
                }

                PostNewValue({
                  category_id: operationTypeSelect[0]?.id,
                  items: operationTypeSelect[0]?.id,
                  weights:
                    valuesOfForm?.length === 0
                      ? operationTypeSelect[0]?.category_items.map(
                          (item) => `${item.item_weight}`
                        )
                      : valuesOfForm,
                });

                // refetch();
                // setOpenSeperateModal(false);
                setOperationTypeSelect([])
                setPage(1)
              }}
              className="bg-mainGreen text-white self-end"
            >
              {t("confirm")}
            </Button>
          </div>
        );
      }}
    </Formik>
  );
};

export default SeperateHwya;
