import { Formik } from "formik";
import { t } from "i18next";
import RadioGroup from "../../../../components/molecules/RadioGroup";
import DirectClientBonds from "./directClient/DirectClientBonds";
import SellingBondsSupplier from "./suppliers/SellingBondsSupplier";
import RetailBonds from "./fragmentedClient/RetailBonds";
import WholesaleBonds from "./wholesaleClient/WholesaleBonds";
import BranchesBonds from "./branches/BranchesBonds";

const ReverseSellingBonds = () => {
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
                {t("gold reservation selling bonds")}
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
              <DirectClientBonds />
            ) : values.operationType === "2" ? (
              <SellingBondsSupplier />
            ) : values.operationType === "3" ? (
              <RetailBonds />
            ) : values.operationType === "4" ? (
              <WholesaleBonds />
            ) : (
              <BranchesBonds />
            )}
          </>
        );
      }}
    </Formik>
  );
};

export default ReverseSellingBonds;
