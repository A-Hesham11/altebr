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

const BuyingInvoice = () => {
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);

  const { userData } = useContext(authCtx);

  const initialValues: Selling_TP = {
    client_id: "",
    bond_date: new Date(),
    category_name: "",
    category_id: "",
    weight: "",
    karat_name: "",
    karat_id: "",
    stones_id: "",
    stones_name: "",
    piece_per_gram: "",
    value: "",
    total_value: "", 
    value_added_tax: ""
  };

  const validationSchema = () =>
    Yup.object({
      hwya: Yup.string(),
      classification_id: Yup.string(),
      category_id: Yup.string(),
      remaining_id: Yup.string(),
      weight: Yup.string(),
      karat_id: Yup.string(),
      cost: Yup.string(),
      selling_price: Yup.string(),
      taklfa: Yup.string(),
      wage_total: Yup.string(),
      wage: Yup.string(),

      dateField: Yup.date().required("Date is required"),
      client_id: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
      client_value: Yup.string(),
    });

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/invoices_per_branch/${userData?.branch_id}?per_page=10000`,
    queryKey: ["invoices_data"],
    onSuccess(data) {
      setInvoiceNumber(data);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={(values) => {console.log(values)}}
    >
      <>
        {stage === 1 && (
          <BuyingFirstPage
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
          />
        )}
        {stage === 2 && (
          <BuyingInvoiceData
            invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            clientData={clientData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
          />
        )}
      </>
    </Formik>
  );
};

export default BuyingInvoice;
