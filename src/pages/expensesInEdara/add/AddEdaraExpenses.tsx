import React, { useContext, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import * as Yup from "yup";
import { useFetch } from "../../../hooks";
import { Formik } from "formik";
import ExpensesInvoiceSecond from "../../expenses/Invoice/ExpensesInvoiceSecond";
import ExpensesInvoice from "../../expenses/Invoice/ExpensesInvoice";

const AddEdaraExpenses = () => {
  const { userData } = useContext(authCtx);

  // STATE
  const [dataSource, setDataSource] = useState();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  console.log("🚀 ~ ExpensesPage ~ invoiceNumber:", invoiceNumber);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [odwyaTypeValue, setOdwyaTypeValue] = useState();

  const [files, setFiles] = useState([]);
  const [subExpensesOption, setSubExpensesOption] = useState<any>("");
  const [taxAdded, setTaxAdded] = useState<boolean>(null);
  const [taxZero, setTaxZero] = useState<boolean>(null);
  const [taxExempt, setTaxExempt] = useState<boolean>(null);
  const [paymentData, setPaymentData] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState<number>(null);
  const [taxType, setTaxType] = useState<any>(null);

  const initialValues = {
    include_tax: "",
    value_added: "",
    value_zero: "",
    value_exempt: "",
    tax_type: "",
    tax_number: "",
    expense_price: "",
    expense_date: new Date(),
    expense_type: "",
    expense_type_name: "",
    add_description: "",
    expense_price_after_tax: "",
    expense_price_tax: "",
    sub_expense: "",
    directed_to: "",
    media: [...files],
  };

  const validationSchema = Yup.object({
    expense_price: Yup.number()
      .required("Expense price is required")
      .min(0, "Expense price must be at least 0"),
    tax_type: Yup.string().required("Expense price is required"),
    expense_date: Yup.string().required("Expense date is required"),
    // add_description: Yup.string().required("Add description is required"),
    sub_expense: Yup.string().required("Sub expense is required"),
    media: Yup.array().min(1, "Media is required"),
  });

  const { data: expensesInvoice } = useFetch({
    endpoint: `/edaraaExpense/api/v1/edaraaExpense-invoices`,
    queryKey: ["get_expense_invoice"],
    onSuccess(data: any) {
      setInvoiceNumber(data);
    },
  });
  console.log("🚀 ~ ExpensesPage ~ expensesInvoice:", expensesInvoice);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
      // enableReinitialize={true}
    >
      <>
        {stage === 1 && (
          <ExpensesInvoice
            invoiceNumber={invoiceNumber}
            dataSource={dataSource}
            setDataSource={setDataSource}
            setStage={setStage}
            sellingItemsData={sellingItemsData}
            setSellingItemsData={setSellingItemsData}
            clientData={clientData}
            setClientData={setClientData}
            selectedItemDetails={selectedItemDetails}
            setSelectedItemDetails={setSelectedItemDetails}
            odwyaTypeValue={odwyaTypeValue}
            setOdwyaTypeValue={setOdwyaTypeValue}
            setTaxAdded={setTaxAdded}
            setTaxZero={setTaxZero}
            setTaxExempt={setTaxExempt}
            taxAdded={taxAdded}
            taxZero={taxZero}
            taxExempt={taxExempt}
            files={files}
            setFiles={setFiles}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            subExpensesOption={subExpensesOption}
            setSubExpensesOption={setSubExpensesOption}
            selectedCardId={selectedCardId}
            setSelectedCardId={setSelectedCardId}
            taxTypeType={taxType}
            setTaxType={setTaxType}
          />
        )}
        {stage === 2 && (
          <ExpensesInvoiceSecond
            invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            clientData={clientData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
            odwyaTypeValue={odwyaTypeValue}
            setOdwyaTypeValue={setOdwyaTypeValue}
            files={files}
            setFiles={setFiles}
            taxType={taxType}
            isInEdara
          />
        )}
      </>
    </Formik>
  );
};

export default AddEdaraExpenses;
