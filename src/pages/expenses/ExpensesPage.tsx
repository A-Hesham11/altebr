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
  const [majorExpensesOption, setMajorExpensesOption] = useState<any>("");
  const [taxAdded, setTaxAdded] = useState<boolean>(false);
  const [taxZero, setTaxZero] = useState<boolean>(false);
  const [taxExempt, setTaxExempt] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [showTax, setShowTax] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number>(null);
  const [selectedCardFrontKey, setSelectedCardFrontKey] = useState("");
  const [cardDiscountPercentage, setCardDiscountPercentage] = useState(0);
  const [editData, setEditData] = useState<Payment_TP>();
  console.log("🚀 ~ ExpensesPage ~ editData:", editData);
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
    add_description: "",
    expense_price_after_tax: "",
    sub_expense: "",
    amount: "",
  };

  const validationSchema = () => Yup.object({});

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
      // validationSchema={validationSchema}
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
            majorExpensesOption={majorExpensesOption}
            setMajorExpensesOption={setMajorExpensesOption}
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
          />
        )}
      </>
    </Formik>
  );
};

export default ExpensesPage;
