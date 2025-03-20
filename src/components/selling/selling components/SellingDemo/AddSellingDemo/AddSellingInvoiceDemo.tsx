import { Formik } from "formik";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { useFetch } from "../../../../../hooks";
import { ClientData_TP } from "../../../SellingClientForm";
import { formatDate } from "../../../../../utils/date";
import SellingFirstPage from "../../../../../pages/selling/SellingFirstPage";
import SellingSecondpage from "../../SellingSecondpage";
import SellingInvoiceData from "../../../../../pages/selling/SellingInvoiceData";
import SellingFirstPageDemo from "./SellingFirstPageDemo";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { Payment_TP } from "../../data/PaymentProcessing";
import { Selling_TP } from "../../../../../pages/selling/PaymentSellingPage";
import SellingInvoiceDataDemo from "./SellingInvoiceDataDemo";

const AddSellingInvoiceDemo = () => {
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  console.log("🚀 ~ AddSellingInvoice ~ dataSource:", dataSource);
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  console.log("🚀 ~ AddSellingInvoice ~ clientData:", clientData);
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [sellingItemsOfWeigth, setSellingItemsOfWeight] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ AddSellingInvoice ~ userData:", userData);

  const initialValues: Selling_TP = {
    classification_id: "",
    category_id: "",
    weight: "",
    total_weight: "",
    stones_weight: "",
    karat_name: "",
    price_gram: "",
    vat: "",
    taklfa: "",
    taklfa_after_tax: "",
    client_id: 2,
    client_value: "غير معرف",
    bond_date: new Date(),
  };

  const validationSchema = () =>
    Yup.object({
      hwya: Yup.string(),
      classification_id: Yup.string(),
      category_id: Yup.string(),
      remaining_id: Yup.string(),
      weight: Yup.string(),
      sel_weight: Yup.string(),
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
    endpoint: `/invoiceSales/api/v1/invoices_per_branch/${userData?.branch_id}`,
    queryKey: [`invoices_data_demo_${userData?.branch_id}`],
    onSuccess(data) {
      setInvoiceNumber(data?.total);
    },
    pagination: true,
  });

  const { data: clientInfo } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/2`,
    queryKey: ["client_infio"],
  });
  console.log("🚀 ~ AddSellingInvoiceDemo ~ clientInfo:", clientInfo);

  // const invoiceHeaderData = {
  //   client_id: clientData?.client_id,
  //   client_value: clientData?.client_value,
  //   bond_date: formatDate(clientData?.bond_date),
  //   invoice_number: invoiceNumber,
  //   invoice_logo: invoice_logo?.InvoiceCompanyLogo,
  //   invoice_text: "simplified tax invoice",
  // };

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: formatDate(clientData?.bond_date),
    second_title: "client name",
    second_value: clientData?.client_value,
    third_title: "mobile number",
    third_value: clientInfo?.phone,
    bond_title: "bill no",
    invoice_number: invoiceNumber,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
    bond_date: formatDate(clientData?.bond_date),
    client_id: clientData?.client_id,
  };
  console.log(
    "🚀 ~ AddSellingInvoiceDemo ~ invoiceHeaderBasicData:",
    invoiceHeaderBasicData
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      <>
        {stage === 1 && (
          <SellingFirstPageDemo
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
            sellingItemsOfWeigth={sellingItemsOfWeigth}
            setSellingItemsOfWeight={setSellingItemsOfWeight}
          />
        )}
        {stage === 2 && (
          <SellingSecondpage
            setStage={setStage}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            sellingItemsData={sellingItemsData}
          />
        )}
        {stage === 3 && (
          <SellingInvoiceDataDemo
            // invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            // clientData={clientData}
            invoiceHeaderData={invoiceHeaderBasicData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
            sellingItemsOfWeigth={sellingItemsOfWeigth}
          />
        )}
      </>
    </Formik>
  );
};

export default AddSellingInvoiceDemo;
