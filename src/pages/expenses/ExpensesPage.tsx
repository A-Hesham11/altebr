import { Formik } from "formik";
import { useContext, useState } from "react";
import { Selling_TP } from "../data/SellingTableData";
import { ClientData_TP } from "../../SellingClientForm";
import { Payment_TP } from "../data/PaymentProcessing";
import * as Yup from "yup";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import BuyingFirstPage from "./BuyingFirstPage";
import BuyingInvoiceData from "./BuyingInvoiceData";
import ExpensesInvoice from "./Invoice/ExpensesInvoice";
import ExpensesInvoiceSecond from "./Invoice/ExpensesInvoiceSecond";

const ExpensesPage = () => {
  const { userData } = useContext(authCtx);

  // STATE
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [odwyaTypeValue, setOdwyaTypeValue] = useState();

  const [files, setFiles] = useState([]);
  const [subExpensesOption, setSubExpensesOption] = useState<any>("");
  const [taxAdded, setTaxAdded] = useState<boolean>(null);
  const [taxZero, setTaxZero] = useState<boolean>(null);
  const [taxExempt, setTaxExempt] = useState<boolean>(null);
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [showTax, setShowTax] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number>(null);
  const [selectedCardFrontKey, setSelectedCardFrontKey] = useState("");
  const [cardDiscountPercentage, setCardDiscountPercentage] = useState(0);
  const [editData, setEditData] = useState<Payment_TP>();
  const [card, setCard] = useState<string | undefined>("");
  const [cardImage, setCardImage] = useState<string | undefined>("");
  const [cardItem, setCardItem] = useState<any>();

  const initialValues: Selling_TP = {
    include_tax: "",
    value_added: "",
    value_zero: "",
    value_exempt: "",
    expense_price: "",
    expense_date: "",
    expense_type: "",
    expense_type_name: "",
    add_description: "",
    expense_price_after_tax: "",
    expense_price_tax: "",
    sub_expense: "",
    media: [...files] ,
  };


  const validationSchema = Yup.object({
    // include_tax: Yup.string().required("Include tax is required"),
    // value_added: Yup.string().required("Value added is required"),
    // value_zero: Yup.string().required("Value zero is required"),
    // value_exempt: Yup.string().required("Value exempt is required"),
    expense_price: Yup.string().required("Expense price is required"),
    expense_date: Yup.string().required("Expense date is required"),
    // expense_type: Yup.string().required("Expense type is required"),
    // expense_type_name: Yup.string().required("Expense type name is required"),
    add_description: Yup.string().required("Add description is required"),
    // expense_price_after_tax: Yup.string().required("Expense price after tax is required"),
    // expense_price_tax: Yup.string().required("Expense price tax is required"),
    sub_expense: Yup.string().required("Sub expense is required"),
    media: Yup.array().min(1, "Media is required"),
  });

  const { data: expensesInvoice } = useFetch<ClientData_TP>({
    endpoint: `/expenses/api/v1/expense-invoices/${userData?.branch_id}`,
    queryKey: ["get_expense_invoice"],
    onSuccess(data) {
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
            showTax={showTax}
            setShowTax={setShowTax}
            taxExempt={taxExempt}
            taxZero={taxZero}
            taxAdded={taxAdded}
            files={files}
            setFiles={setFiles}
            paymentData={paymentData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setPaymentData={setPaymentData}
            subExpensesOption={subExpensesOption}
            setSubExpensesOption={setSubExpensesOption}
            selectedCardId={selectedCardId}
            setSelectedCardId={setSelectedCardId}
            selectedCardFrontKey={selectedCardFrontKey}
            setSelectedCardFrontKey={setSelectedCardFrontKey}
            cardDiscountPercentage={cardDiscountPercentage}
            setCardDiscountPercentage={setCardDiscountPercentage}
            card={card}
            setCard={setCard}
            cardImage={cardImage}
            setCardImage={setCardImage}
            cardItem={cardItem}
            setCardItem={setCardItem}
            editData={editData}
            setEditData={setEditData}
          />
        )}
        {stage === 2 && (
          <ExpensesInvoiceSecond
            invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            clientData={clientData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
            odwyaTypeValue={odwyaTypeValue}
            setOdwyaTypeValue={setOdwyaTypeValue}
            files={files}
          />
        )}
      </>
    </Formik>
  );
};

export default ExpensesPage;
