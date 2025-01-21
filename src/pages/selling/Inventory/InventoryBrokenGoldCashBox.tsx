import React, { useContext } from "react";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { Button } from "../../../components/atoms";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Form, Formik } from "formik";
import { BaseInputField } from "../../../components/molecules";
import * as Yup from "yup";
import { notify } from "../../../utils/toast";

interface Totals {
  name: string;
  key: number;
  value: number;
}

interface InventoryBrokenGoldCashBoxProps {
  setSteps: (value: number) => void;
  goldBrokenAndCash: any;
  goldBrokenAndCashData?: any;
  setGoldBrokenAndCashData: (value: any) => void;
}

const InventoryBrokenGoldCashBox: React.FC<InventoryBrokenGoldCashBoxProps> = ({
  setSteps,
  goldBrokenAndCash,
  goldBrokenAndCashData,
  setGoldBrokenAndCashData,
}) => {
  const { formatReyal, formatGram } = numberContext();
  const { userData } = useContext(authCtx);

  const totalsBrokenGold: Totals[] = [
    {
      name: t("Total gold fraction 18"),
      key: 1,
      value: goldBrokenAndCash?.["18"],
    },
    {
      name: t("Total gold fraction 21"),
      key: 2,
      value: goldBrokenAndCash?.["21"],
    },
    {
      name: t("Total gold fraction 22"),
      key: 3,
      value: goldBrokenAndCash?.["22"],
    },
    {
      name: t("Total gold fraction 24"),
      key: 4,
      value: goldBrokenAndCash?.["24"],
    },
  ];

  const totalsCash: Totals[] = [
    {
      name: t("Cash Box"),
      key: 1,
      value: goldBrokenAndCash?.["1301"],
    },
  ];

  const initialValues = {
    brokenGold_18: goldBrokenAndCashData?.brokenGold_18 || "",
    brokenGold_21: goldBrokenAndCashData?.brokenGold_21 || "",
    brokenGold_22: goldBrokenAndCashData?.brokenGold_22 || "",
    brokenGold_24: goldBrokenAndCashData?.brokenGold_24 || "",
    cash_Box: goldBrokenAndCashData?.cash_Box || "",
  };

  const InputField = ({
    id,
    label,
    differenceValue,
    placeholder,
    unit,
  }: any) => (
    <div>
      <BaseInputField
        id={id}
        name={id}
        type="number"
        label={label}
        placeholder={placeholder}
        required
      />
      <p className="bg-[#DB80281A] text-mainOrange py-2 px-5 rounded-xl w-fit mt-4">
        <span className="font-semibold">{t("The Difference")}:</span>{" "}
        {differenceValue} {unit}
      </p>
    </div>
  );

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
        <p className="font-semibold">
          {t("Inventory of new gold, diamonds and miscellaneous")}
        </p>
      </div>

      <div>
        <h2 className="font-semibold mt-6">
          {t("Balance of Broken Gold Boxes")}
        </h2>
        <ul className="grid grid-cols-4 gap-6 mb-5">
          {totalsBrokenGold?.map(({ name, key, value }) => (
            <BoxesDataBase variant="secondary" key={key}>
              <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
                {name}
              </p>
              <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                {formatGram(Number(value))} {t("gram")}
              </p>
            </BoxesDataBase>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mt-6">{t("Cash Box Balance")}</h2>
        <ul className="grid grid-cols-4 gap-6 mb-5">
          {totalsCash.map(({ name, key, value }) => (
            <BoxesDataBase variant="secondary" key={key}>
              <p className="bg-mainGreen px-2 py-4 flex items-center justify-center rounded-t-xl">
                {name}
              </p>
              <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                {formatGram(Number(value))} {t("reyal")}
              </p>
            </BoxesDataBase>
          ))}
        </ul>
      </div>

      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(value) => console.log("🚀 ~ value:", value)}
        >
          {({ values }) => {
            console.log("🚀 ~ values:", values);
            return (
              <Form>
                <div className="bg-[#295E5608] p-8 rounded-2xl">
                  <h2 className="font-semibold text-lg mb-8">
                    {t("Please enter the following values:")}
                  </h2>
                  <div className="grid grid-cols-4 gap-8">
                    <InputField
                      id="brokenGold_18"
                      label={t("Weight of Broken Gold 18")}
                      differenceValue={formatGram(
                        goldBrokenAndCash?.["18"] -
                          Number(values?.brokenGold_18)
                      )}
                      placeholder={t("Weight of Broken Gold 18")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="brokenGold_21"
                      label={t("Weight of Broken Gold 21")}
                      differenceValue={formatGram(
                        goldBrokenAndCash?.["21"] -
                          Number(values?.brokenGold_21)
                      )}
                      placeholder={t("Weight of Broken Gold 21")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="brokenGold_22"
                      label={t("Weight of Broken Gold 22")}
                      differenceValue={formatGram(
                        goldBrokenAndCash?.["22"] -
                          Number(values?.brokenGold_22)
                      )}
                      placeholder={t("Weight of Broken Gold 22")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="brokenGold_24"
                      label={t("Weight of Broken Gold 24")}
                      differenceValue={formatGram(
                        goldBrokenAndCash?.["24"] -
                          Number(values?.brokenGold_24)
                      )}
                      placeholder={t("Weight of Broken Gold 24")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="cash_Box"
                      label={t("Cash Box")}
                      differenceValue={formatReyal(
                        goldBrokenAndCash?.["1301"] - Number(values?.cash_Box)
                      )}
                      placeholder={t("Cash Box")}
                      unit={t("reyal")}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-5 gap-x-4">
                  <Button
                    bordered
                    action={() => {
                      setSteps(1);
                    }}
                  >
                    {t("back")}
                  </Button>
                  <Button
                    action={() => {
                      const validateField = (fieldValue: any) => {
                        if (fieldValue === "") {
                          notify("info", `${t("This field is required")}`);
                          return false;
                        }
                        if (fieldValue < 0) {
                          notify(
                            "info",
                            `${t("Value must be greater than or equal to 0")}`
                          );
                          return false;
                        }
                        return true;
                      };

                      const fieldsToValidate = [
                        { value: values.brokenGold_18, name: "brokenGold_18" },
                        { value: values.brokenGold_21, name: "brokenGold_21" },
                        { value: values.brokenGold_22, name: "brokenGold_22" },
                        { value: values.brokenGold_24, name: "brokenGold_24" },
                        { value: values.cash_Box, name: "cash_Box" },
                      ];

                      for (const field of fieldsToValidate) {
                        if (!validateField(field.value, field.name)) {
                          return;
                        }
                      }

                      setGoldBrokenAndCashData({
                        brokenGold_18: values.brokenGold_18,
                        brokenGold_21: values.brokenGold_21,
                        brokenGold_22: values.brokenGold_22,
                        brokenGold_24: values.brokenGold_24,
                        cash_Box: values.cash_Box,
                      });
                      setSteps(3);
                    }}
                    type="button"
                  >
                    {t("next")}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default InventoryBrokenGoldCashBox;
