import { useState } from "react";
import * as Yup from "yup";
import { useFetch } from "../../../hooks";
import { Formik } from "formik";
import AddReceiptBondsFirstStep from "./AddReceiptBondsFirstStep";

const AddReceiptBonds = () => {
  // STATE
  const [stage, setStage] = useState<number>(1);
  const [files, setFiles] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  console.log("🚀 ~ ExpensesPage ~ invoiceNumber:", invoiceNumber);

  const [dataSource, setDataSource] = useState();
  const [clientData, setClientData] = useState();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState<number>(null);
  const [isTax, setIsTax] = useState(false);

  const initialValues = {
    receipt_price: "",
    tax: "",
    invoice_number: invoiceNumber,
    client_name: "",
    beneficiary: "",
    receipt_date: new Date(),
    reason: "",
    net_amount: "",
    description: "",
  };

  const validationSchema = Yup.object({
    receipt_price: Yup.string().required("Receipt price is required"),
    invoice_number: Yup.string().required("Invoice number is required"),
    client_name: Yup.string().required("Client name is required"),
    beneficiary: Yup.string().required("Beneficiary is required"),
    receipt_date: Yup.date().required("Receipt date is required"),
  });

  const { data: expensesInvoice } = useFetch({
    endpoint: `/edaraaExpense/api/v1/edaraaExpense-invoices`,
    queryKey: ["get_expense_invoice"],
    onSuccess(data: any) {
      setInvoiceNumber(data);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      <>
        {stage === 1 && (
          <AddReceiptBondsFirstStep
            paymentData={paymentData}
            files={files}
            invoiceNumber={invoiceNumber}
            setStage={setStage}
            sellingItemsData={sellingItemsData}
            setSellingItemsData={setSellingItemsData}
            clientData={clientData}
            setClientData={setClientData}
            selectedItemDetails={selectedItemDetails}
            setSelectedItemDetails={setSelectedItemDetails}
            selectedCardId={selectedCardId}
            isTax={isTax}
            setIsTax={setIsTax}
            setSelectedCardId={setSelectedCardId}
          />
        )}
        {stage === 2 && <>test 2</>}
      </>
    </Formik>
  );
};

export default AddReceiptBonds;
