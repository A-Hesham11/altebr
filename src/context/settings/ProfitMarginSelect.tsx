import { Form, Formik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Button } from "../../components/atoms";
import { BaseInputField, Select } from "../../components/molecules";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";

export type ModifiedProfitValues_TP = {
  factorial: string;
  percentage: string;
  profit: "factorial" | "percentage";
};

// employee main data validation

const ProfitMarginSelect = () => {
  const [ProfitStatus, setProfitStatus] = useState(1);
  const [selectProfitValue, setSelectProfitValue] = useState({
    id: "",
    value: "",
    label: "",
  });
  const [profitVal, setProfitInputVal] = useState("");
  const [percentageVal, setPercentageInputVal] = useState("");
  const factorial = {
    id: 1,
    value: "factorial",
    label: `${t("factorial")}`,
  };
  const percentage = {
    id: 2,
    value: "percentage",
    label: `${t("add percentage")}`,
  };
  const { data: profitData, refetch } = useFetch({
    endpoint: "classification/api/v1/profitMargins",
    queryKey: ["profit_margin"],
    select: (data) => data,
  });

  const { mutate, isLoading } = useMutate({
    mutationKey: ["profit_margin"],
    mutationFn: mutateData,
    onSuccess: () => {
      refetch();
      notify("success");
    },
  });
  useEffect(() => {
    setSelectProfitValue({
      id: profitData && profitData[0].id,
      value: profitData && profitData[0].profit,
      label:
        profitData && profitData[0].profit === "factorial"
          ? `${t("factorial")}`
          : `${t("add percentage")}`,
    });
    if (profitData) {
      if (profitData[0].profit === "percentage") {
        setProfitStatus(2);
        setPercentageInputVal(profitData[0].value * 100);
      } else {
        setProfitInputVal(profitData[0].value);
        setProfitStatus(1);
      }
    }
  }, [profitData]);

  const options = [factorial, percentage];
  return (
    <Formik
      initialValues={{
        factorial: (profitData && profitData[0]?.value) || 1,
        percentage:
          profitData && profitData[0].profit === "percentage"
            ? profitData[0].value * 100
            : 0,
        profit: (profitData && profitData[0]?.profit) || "",
      }}
      onSubmit={(values) => {
        const modifiedValue = {
          profit: values?.profit === "factorial" ? "factorial" : "percentage",
          value:
            values?.profit === "factorial"
              ? values.factorial
              : +values.percentage / 100,
        };
        if (profitData?.length) {
          mutate({
            endpointName: "/classification/api/v1/profitMargins/1",
            values: modifiedValue,
            method: "put",
          });
        } else {
          mutate({
            endpointName: "/classification/api/v1/profitMargins",
            values: modifiedValue,
          });
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="flex gap-2 items-center justify-start p-8">
            <div className="w-1/3 mt-2">
              <Select
                options={options}
                label={`${t("profit margin")}`}
                id="profit"
                name="profit"
                value={selectProfitValue}
                onChange={(option) => {
                  //@ts-ignore
                  setProfitStatus(option?.id);
                  setSelectProfitValue({
                    id: option?.id,
                    value: option.value,
                    label:
                      option.id === 1
                        ? `${t("factorial")}`
                        : `${t("add percentage")}`,
                  });
                  setFieldValue("percentage", "");
                  setFieldValue("factorial", "");
                }}
              />
            </div>
            {ProfitStatus === 1 ? (
              <BaseInputField
                name="factorial"
                label={`${t("factorial")}`}
                type="number"
                max={50}
                min={1}
                step={0.1}
                placeholder="1"
                id="factorial"
                className="w-[200px]"
                value={profitVal}
                onChange={(e) => {
                  setProfitInputVal(e.target.value);
                  setFieldValue("factorial", e.target.value);
                }}
              />
            ) : (
              <div className="flex gap-2 relative">
                <BaseInputField
                  name="percentage"
                  type="number"
                  className="w-[200px]"
                  label={`${t("add percentage")}`}
                  placeholder="1"
                  id="percentage"
                  value={percentageVal}
                  onChange={(e) => {
                    setPercentageInputVal(e.target.value);
                    setFieldValue("percentage", e.target.value);
                  }}
                />
                <span className="absolute right-44 top-9 font-bold text-mainGreen">
                  %
                </span>
              </div>
            )}
            <Button className="mt-7 mr-5" type="submit" loading={isLoading}>
              {t("save")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProfitMarginSelect;
