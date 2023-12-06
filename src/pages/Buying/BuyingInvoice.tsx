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
  const { userData } = useContext(authCtx);

  // STATE
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);


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
    value_added_tax: "",
  };

  const validationSchema = () =>
    Yup.object({
      client_id: Yup.string().required("اسم العميل مطلوب"),
      bond_date: Yup.date().default(() => new Date()), // Assuming the default value is the current date
      category_name: Yup.string().required("الصنف مطلوب"),
      category_id: Yup.string().required("الصنف مطلوب"),
      weight: Yup.number().required("الوزن مطلوب"),
      karat_name: Yup.string().required("العيار مطلوب"),
      karat_id: Yup.string().required("العيار مطلوب"),
      stones_id: Yup.string().required("نوع الحجر مطلوب"),
      stones_name: Yup.string().required("نوع الحجر مطلوب"),
      piece_per_gram: Yup.number().required("سعر الجرام مطلوب"),
      value: Yup.number().required("القيمة مطلوبة"),
      total_value: Yup.number().required("القيمة الإجمالية مطلوبة"),
      value_added_tax: Yup.number().required("ضريبة القيمة المضافة مطلوبة"),
    });

  const { data: buyingInvoice } = useFetch<ClientData_TP>({
    endpoint: `/buyingUsedGold/api/v1/list-buying-invoice/${userData?.branch_id}?per_page=10000`,
    queryKey: ["get_buying_invoice"],
    onSuccess(data) {
      setInvoiceNumber(data);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
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
