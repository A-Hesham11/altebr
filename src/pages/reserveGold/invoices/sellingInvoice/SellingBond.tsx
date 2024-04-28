import { t } from "i18next";
import React, { useState } from "react";
import RadioGroup from "../../../../components/molecules/RadioGroup";
import { Formik } from "formik";
import SellingInvoiceDirectClient from "./directClient/SellingInvoiceDirectClient";
import SellingInvoiceSupplier from "./supplier/SellingInvoiceSupplier";
import SellingInvoiceFragmentedClient from "./fragmentedClient/SellingInvoiceFragmentedClient";
import SellingInvoiceWholesaleClient from "./wholesaleClient/SellingInvoiceWholesaleClient";
import SellingInvoiceBranchesClient from "./branches/SellingInvoiceBranchesClient";

const SellingBond = () => {
  const [stage, setStage] = useState<number>(1);

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
            {stage === 1 && (
              <div className="flex items-center justify-between px-12">
                <h2 className="text-xl font-bold">
                  {t("gold reservation selling bond")}
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
            )}

            {values.operationType === "1" ? (
              <SellingInvoiceDirectClient stage={stage} setStage={setStage} />
            ) : values.operationType === "2" ? (
              <SellingInvoiceSupplier stage={stage} setStage={setStage} />
            ) : values.operationType === "3" ? (
              <SellingInvoiceFragmentedClient
                stage={stage}
                setStage={setStage}
              />
            ) : values.operationType === "4" ? (
              <SellingInvoiceWholesaleClient
                stage={stage}
                setStage={setStage}
              />
            ) : (
              <SellingInvoiceBranchesClient stage={stage} setStage={setStage} />
            )}
          </>
        );
      }}
    </Formik>
  );
};

export default SellingBond;
