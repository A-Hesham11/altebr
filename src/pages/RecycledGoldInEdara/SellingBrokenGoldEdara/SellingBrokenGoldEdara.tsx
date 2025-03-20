import { Formik } from "formik";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { ClientData_TP, Selling_TP } from "../../selling/PaymentSellingPage";
import { Payment_TP } from "../../Payment/PaymentProccessingToManagement";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import SellingBrokenGoldEdaraFirstPage from "./SellingBrokenGoldEdaraFirstPage";
import SellingBrokenGoldInvoiceData from "../../../components/selling/selling components/SellingDemo/AddSellingDemo/SellingBrokenGoldInvoiceData";
import { formatDate } from "../../../utils/date";
import SellingSecondpage from "../../../components/selling/selling components/SellingSecondpage";

const SellingBrokenGoldEdara = () => {
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  console.log("🚀 ~ AddSellingInvoice ~ dataSource:", dataSource);
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  console.log("🚀 ~ AddSellingInvoice ~ clientData:", clientData);
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [sellingItemsOfWeigth, setSellingItemsOfWeight] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  console.log("🚀 ~ SellingBrokenGoldEdara ~ invoiceNumber:", invoiceNumber);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const { invoice_logo } = GlobalDataContext();

  const initialValues: Selling_TP = {
    item_id: "",
    weight: "",
    karat_id: "",
    karat_name: "",
    price_gram: "",
    tax_rate: "",
    notes: "",
    vat: "",
    taklfa: "",
    taklfa_after_tax: "",
    client_id: "",
    supplier_id: "",
    supplier_name: "",
    client_value: "",
    bond_date: new Date(),
  };

  const validationSchema = () =>
    Yup.object({
      weight: Yup.string(),
      karat_id: Yup.string(),
      cost: Yup.string(),
      selling_price: Yup.string(),
      taklfa: Yup.string(),

      dateField: Yup.date().required("Date is required"),
      // client_id: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
      // client_value: Yup.string(),
    });

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/oldGold/api/v1/invoices`,
    queryKey: [`invoices_data_old`],
    onSuccess(data) {
      setInvoiceNumber(data?.total);
    },
    pagination: true,
  });
  console.log("🚀 ~ SellingBrokenGoldEdara ~ data:", data);

  const invoiceHeaderData = {
    client_id: clientData?.client_id,
    client_value: clientData?.client_value,
    supplier_id: clientData?.supplier_id,
    supplier_name: clientData?.supplier_name,
    bond_date: formatDate(clientData?.bond_date),
    invoice_number: invoiceNumber,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
  };

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: formatDate(clientData?.bond_date),
    second_title: clientData?.client_value ? "client name" : "supplier name",
    second_value: clientData?.client_value
      ? clientData?.client_value
      : clientData?.supplier_name,
    bond_date: formatDate(clientData?.bond_date),
    bond_title: "bill no",
    invoice_number: invoiceNumber,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
    client_id: clientData?.client_id,
    supplier_id: clientData?.supplier_id,
  };
  console.log(
    "🚀 ~ SellingBrokenGoldEdara ~ invoiceHeaderBasicData:",
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
          <SellingBrokenGoldEdaraFirstPage
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
          <SellingBrokenGoldInvoiceData
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
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

export default SellingBrokenGoldEdara;
