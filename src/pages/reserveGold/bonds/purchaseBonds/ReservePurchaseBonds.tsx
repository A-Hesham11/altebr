import { Formik } from "formik";
import { t } from "i18next";
import RadioGroup from "../../../../components/molecules/RadioGroup";
import PurchaseDirectClientBonds from "./directClient/PurchaseDirectClientBonds";
import PurchaseBondsSupplier from "./suppliers/PurchaseBondsSupplier";
import PurchaseRetailBonds from "./fragmentedClient/PurchaseRetailBonds";
import PurchaseWholesaleBonds from "./wholesaleClient/PurchaseWholesaleBonds";
import PurchaseBranchesBonds from "./branches/PurchaseBranchesBonds";

const ReservePurchaseBonds = () => {
  const initialValues = {
    operationType: "2",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => console.log(values)}
    >
      {({ values }) => {
        return (
          <>
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold">
                {t("gold reservation purchase bonds")}
              </h2>

              <div className="flex items-center gap-4">
                <span className="font-bold">{t("client type")}</span>

                <RadioGroup name="operationType">
                  <div className="flex gap-x-2">
                    <RadioGroup.RadioButton
                      value="1"
                      label={`${t("direct client")}`}
                      id="direct_client"
                      disabled
                    />
                    <RadioGroup.RadioButton
                      value="2"
                      label={`${t("supplier")}`}
                      id="supplier"
                    />
                    <RadioGroup.RadioButton
                      value="3"
                      label={`${t("retail")}`}
                      id="retail"
                      disabled
                    />
                    <RadioGroup.RadioButton
                      value="4"
                      label={`${t("wholesale")}`}
                      id="wholesale"
                      disabled
                    />
                    <RadioGroup.RadioButton
                      value="5"
                      label={`${t("branches")}`}
                      id="branches"
                      disabled
                    />
                  </div>
                </RadioGroup>
              </div>
            </div>

            {values.operationType === "1" ? (
              <PurchaseDirectClientBonds />
            ) : values.operationType === "2" ? (
              <PurchaseBondsSupplier />
            ) : values.operationType === "3" ? (
              <PurchaseRetailBonds />
            ) : values.operationType === "4" ? (
              <PurchaseWholesaleBonds />
            ) : (
              <PurchaseBranchesBonds />
            )}
          </>
        );
      }}
    </Formik>
  );
};

export default ReservePurchaseBonds;
