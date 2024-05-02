import { t } from "i18next";
import React, { useState } from "react";
import RadioGroup from "../../../../components/molecules/RadioGroup";
import { Formik } from "formik";
import SellingInvoiceDirectClient from "./directClient/SellingInvoiceDirectClient";
import SellingInvoiceSupplier from "./supplier/PurchaseInvoiceSupplier";
import SellingInvoiceFragmentedClient from "./fragmentedClient/PurchaseInvoiceFragmentedClient";
import SellingInvoiceWholesaleClient from "./wholesaleClient/PurchaseInvoiceWholesaleClient";
import SellingInvoiceBranchesClient from "./branches/PurchaseInvoiceBranchesClient";
import PurchaseInvoiceDirectClient from "./directClient/PurchaseInvoiceDirectClient";
import PurchaseInvoiceSupplier from "./supplier/PurchaseInvoiceSupplier";
import PurchaseInvoiceFragmentedClient from "./fragmentedClient/PurchaseInvoiceFragmentedClient";
import PurchaseInvoiceWholesaleClient from "./wholesaleClient/PurchaseInvoiceWholesaleClient";
import PurchaseInvoiceBranchesClient from "./branches/PurchaseInvoiceBranchesClient";

const PurchaseBond = () => {
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
                  {t("gold reservation purchase bond")}
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
              <PurchaseInvoiceDirectClient stage={stage} setStage={setStage} />
            ) : values.operationType === "2" ? (
              <PurchaseInvoiceSupplier stage={stage} setStage={setStage} />
            ) : values.operationType === "3" ? (
              <PurchaseInvoiceFragmentedClient
                stage={stage}
                setStage={setStage}
              />
            ) : values.operationType === "4" ? (
              <PurchaseInvoiceWholesaleClient
                stage={stage}
                setStage={setStage}
              />
            ) : (
              <PurchaseInvoiceBranchesClient
                stage={stage}
                setStage={setStage}
              />
            )}
          </>
        );
      }}
    </Formik>
  );
};

export default PurchaseBond;
