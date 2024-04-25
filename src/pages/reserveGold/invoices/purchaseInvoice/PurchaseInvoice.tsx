import { Form, Formik } from "formik";
import { useState } from "react";
import PurchaseInvoiceFirstPage from "./PurchaseInvoiceFirstPage";
import PurchaseInvoiceSecondPage from "./PurchaseInvoiceSecondPage";

const PurchaseInvoice = () => {
  const [stage, setStage] = useState<number>(1);

  const initialValues = {
    test: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => {
        return (
          <Form>
            <>
              {stage === 1 && <PurchaseInvoiceFirstPage setStage={setStage} />}
              {stage === 2 && <PurchaseInvoiceSecondPage setStage={setStage} />}
            </>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PurchaseInvoice;
