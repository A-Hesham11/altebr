import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { ClientData_TP, Selling_TP } from "../selling/PaymentSellingPage";
import { Payment_TP } from "../Payment/PaymentProccessingToManagement";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch } from "../../hooks";
import * as Yup from "yup";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import { formatDate } from "../../utils/date";
import SalesReturnFirstPageDemo from "./SalesReturnFirstPageDemo";
import SalesReturnSecondPage from "../salesReturn/SalesReturnSecondPage";
import SalesReturnInvoiceData from "../salesReturn/SalesReturnInvoiceData";

const SalesReturnPageDemo = () => {
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [sellingItemsOfWeigth, setSellingItemsOfWeight] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext(authCtx);

  const invoiceHeaderData = {
    client_id: clientData?.client_id,
    client_value: clientData?.client_value,
    bond_date: formatDate(clientData?.bond_date),
    invoice_number: invoiceNumber,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
    bond_title: "sales return",
  };

  const initialValues: Selling_TP = {
    invoice_id: "",
    item_id: "",
    hwya: "",
    min_selling: "",
    min_selling_type: "",
    classification_id: "",
    category_id: "",
    category_selling_type: "",
    classification_name: "",
    category_name: "",
    weight: "",
    has_selsal: 0,
    remaining_weight: "",
    sel_weight: "",
    karat_id: "",
    karat_name: "",
    mineral_id: "",
    karatmineral_id: "",
    karatmineral_name: "",
    gold_price: [],
    selsal: [],
    kitItem: [],
    karat_price: "",
    selling_price: "",
    tax_rate: "",
    cost: "",
    cost_value: "",
    wage: "",
    taklfa: "",
    taklfa_after_tax: "",
    vat: "",
    total: "",
    wage_total: "",
    category_type: "",
    weightitems: [],
    commission_oneItem: "",
    commissionTax_oneItem: "",
    client_id: "",
    client_value: "",
    bond_date: new Date(),
  };

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/sellingReturn/api/v1/getAllReturnInvoice/${userData?.branch_id}`,
    queryKey: [`return_invoices_data_${userData?.branch_id}`],
    onSuccess(data) {
      setInvoiceNumber(data?.data?.length);
    },
    pagination: true,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({})}
      onSubmit={(values) => {}}
    >
      <>
        {stage === 1 && (
          <SalesReturnFirstPageDemo
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
          <SalesReturnSecondPage
            setStage={setStage}
            stage={stage}
            returnDemo
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            sellingItemsData={sellingItemsData}
          />
        )}
        {stage === 3 && (
          <SalesReturnInvoiceData
            invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            clientData={clientData}
            setStage={setStage}
            returnDemo
            selectedItemDetails={selectedItemDetails}
            sellingItemsOfWeigth={sellingItemsOfWeigth}
            invoiceHeaderData={invoiceHeaderData}
          />
        )}
      </>
    </Formik>
  );
};

export default SalesReturnPageDemo;
