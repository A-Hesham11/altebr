import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { ClientData_TP, Selling_TP } from "../selling/PaymentSellingPage";
import { Payment_TP } from "../Payment/PaymentProccessingToManagement";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useMutate } from "../../hooks";
import * as Yup from "yup";
import SupplyPayoffFirstPage from "./SupplyPayoffFirstPage";
import { notify } from "../../utils/toast";
import { mutateData } from "../../utils/mutateData";
import SupplyPayoffSecondPage from "./SupplyPayoffSecondPage";

const SupplyPayoff = () => {
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [sellingItemsOfWeigth, setSellingItemsOfWeight] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [supplierId, setSupplierId] = useState(0);
  const [mardodItemsId, setMardodItemsId] = useState([]);
  const { userData } = useContext(authCtx);

  const initialValues: Selling_TP = {
    invoice_id: "",
    item_id: "",
    id: "",
    hwya: "",
    classification_id: "",
    classification_name: "",
    category: "",
    category_id: "",
    category_selling_type: "",
    weight: "",
    check_input_weight: 0,
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
    category_items: [],
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
    api_gold_price: 0,
    weightitems: [],
    bond_date: new Date(),
    supplier_id: "",
    supplier_name: "",
    cost_item:[],
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
    endpoint: `/supplyReturn/api/v1/getAllReturnInvoice/${userData?.branch_id}`,
    queryKey: [`supply_payoff_invoices_${userData?.branch_id}`],
    onSuccess(data) {
      setInvoiceNumber(data);
    },
    pagination: true,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      <>
        {stage === 1 && (
          <SupplyPayoffFirstPage
            supplierId={supplierId}
            setSupplierId={setSupplierId}
            mardodItemsId={mardodItemsId}
            setMardodItemsId={setMardodItemsId}
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
          <SupplyPayoffSecondPage
            supplierId={supplierId}
            mardodItemsId={mardodItemsId}
            invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            clientData={clientData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
            sellingItemsOfWeigth={sellingItemsOfWeigth}
          />
        )}
        {/*
        {stage === 3 && (
          <SalesReturnInvoiceData
            invoiceNumber={invoiceNumber}
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            clientData={clientData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
            sellingItemsOfWeigth={sellingItemsOfWeigth}
          />
        )} */}
      </>
    </Formik>
  );
};

export default SupplyPayoff;
