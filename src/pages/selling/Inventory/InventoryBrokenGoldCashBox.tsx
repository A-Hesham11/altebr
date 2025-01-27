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
  goldBrokenCashBanks: any;
  goldBrokenCashBanksFinalData?: any;
  setGoldBrokenCashBanksFinalData: (value: any) => void;
}

const InventoryBrokenGoldCashBox: React.FC<InventoryBrokenGoldCashBoxProps> = ({
  setSteps,
  goldBrokenCashBanks,
  goldBrokenCashBanksFinalData,
  setGoldBrokenCashBanksFinalData,
}) => {
  console.log("🚀 ~ goldBrokenCashBanks:", goldBrokenCashBanks);
  const { formatReyal, formatGram } = numberContext();
  const { userData } = useContext(authCtx);

  const keyReplacements = {
    "18": { key: "gold_18", name: t("Weight of Broken Gold 18") },
    "21": { key: "gold_21", name: t("Weight of Broken Gold 21") },
    "22": { key: "gold_22", name: t("Weight of Broken Gold 22") },
    "24": { key: "gold_24", name: t("Weight of Broken Gold 24") },
    "1301": { key: "cash", name: t("Cash Box") },
  };

  const allData = Object.entries(goldBrokenCashBanks).map(([key, value]) => {
    const numericKey = String(key).replace(/[^0-9]/g, "");
    const finalKey = keyReplacements[numericKey]?.key || numericKey;
    const finalName = keyReplacements[numericKey]?.name || key;
    return {
      key: finalKey,
      name: finalName,
      value,
    };
  });

  const filteredCashBanks = Object.entries(goldBrokenCashBanks)
    .filter(([key]) => ![18, 21, 22, 24].includes(Number(key)))
    .map(([key, value]) => ({ key, value }));

  console.log(filteredCashBanks);

  const totalsBrokenGold: Totals[] = [
    {
      name: t("Total gold fraction 18"),
      key: 1,
      value: goldBrokenCashBanks?.["18"],
    },
    {
      name: t("Total gold fraction 21"),
      key: 2,
      value: goldBrokenCashBanks?.["21"],
    },
    {
      name: t("Total gold fraction 22"),
      key: 3,
      value: goldBrokenCashBanks?.["22"],
    },
    {
      name: t("Total gold fraction 24"),
      key: 4,
      value: goldBrokenCashBanks?.["24"],
    },
  ];

  const totalsCashAndBanks: any = filteredCashBanks?.map((item) => ({
    name: item?.key == "1301" ? t("Cash Box") : item.key,
    key: item.key,
    value: item.value,
  }));

  const initialValues = allData.reduce((acc, item) => {
    acc[item.key] = "";

    return acc;
  }, {});

  console.log("🚀 ~ initialValues ~ initialValues:", initialValues);

  // console.log("🚀 ~ initialValuess ~ initialValuess:", initialValuess);

  // const initialValues = {
  //   brokenGold_18: goldBrokenCashBanksData?.brokenGold_18 || "",
  //   brokenGold_21: goldBrokenCashBanksData?.brokenGold_21 || "",
  //   brokenGold_22: goldBrokenCashBanksData?.brokenGold_22 || "",
  //   brokenGold_24: goldBrokenCashBanksData?.brokenGold_24 || "",
  //   cash_Box: goldBrokenCashBanksData?.cash_Box || "",
  // };

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
        <h2 className="font-semibold mt-6">{t("Cash and Bank Balance")}</h2>
        <ul className="grid grid-cols-4 gap-6 mb-5">
          {totalsCashAndBanks.map(({ name, key, value }) => (
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
                    {/* <InputField
                      id="brokenGold_18"
                      label={t("Weight of Broken Gold 18")}
                      differenceValue={formatGram(
                        goldBrokenCashBanks?.["18"] -
                          Number(values?.brokenGold_18)
                      )}
                      placeholder={t("Weight of Broken Gold 18")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="brokenGold_21"
                      label={t("Weight of Broken Gold 21")}
                      differenceValue={formatGram(
                        goldBrokenCashBanks?.["21"] -
                          Number(values?.brokenGold_21)
                      )}
                      placeholder={t("Weight of Broken Gold 21")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="brokenGold_22"
                      label={t("Weight of Broken Gold 22")}
                      differenceValue={formatGram(
                        goldBrokenCashBanks?.["22"] -
                          Number(values?.brokenGold_22)
                      )}
                      placeholder={t("Weight of Broken Gold 22")}
                      unit={t("gram")}
                    />
                    <InputField
                      id="brokenGold_24"
                      label={t("Weight of Broken Gold 24")}
                      differenceValue={formatGram(
                        goldBrokenCashBanks?.["24"] -
                          Number(values?.brokenGold_24)
                      )}
                      placeholder={t("Weight of Broken Gold 24")}
                      unit={t("gram")}
                    /> */}

                    {/* <InputField 
                      id="cash_Box"
                      label={t("Cash Box")}
                      differenceValue={formatReyal(
                        goldBrokenCashBanks?.["1301"] - Number(values?.cash_Box)
                      )}
                      placeholder={t("Cash Box")}
                      unit={t("reyal")}
                    /> */}
                    {allData?.map((item) => (
                      <InputField
                        id={item.key}
                        label={item.name}
                        placeholder={item.name}
                        differenceValue={formatReyal(
                          Number(item?.value) - Number(values?.[item.key])
                        )}
                        unit={t("reyal")}
                      />
                    ))}
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
                        console.log(
                          "🚀 ~ validateField ~ fieldValue:",
                          fieldValue
                        );
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

                      for (const field of allData) {
                        if (!validateField(values?.[field.key], field.key)) {
                          return;
                        }
                      }

                      const finalData = allData?.map((item) => item);
                      console.log("🚀 ~ finalData:", finalData)
 
                      setGoldBrokenCashBanksFinalData(values);
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
