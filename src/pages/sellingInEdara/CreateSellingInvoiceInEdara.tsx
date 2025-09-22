import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Selling_TP } from "@/pages/selling/PaymentSellingPage";
import { ClientData_TP } from "@/components/selling/SellingClientForm";
import { Payment_TP } from "../Payment/PaymentProccessingToManagement";
import { GlobalDataContext } from "@/context/settings/GlobalData";
import { authCtx } from "@/context/auth-and-perm/auth";
import * as Yup from "yup";
import { useFetch } from "@/hooks";
import { formatDate } from "@/utils/date";
import SellingFirstPageInEdara from "./SellingFirstPageInEdara";
import SellingSecondpageInEdara from "./SellingSecondpageInEdara";
import SellingInvoiceDataInEdara from "./SellingInvoiceDataInEdara";

export type Selling_Invoice_TP = {
  item_id: string;
  hwya: string;
  min_selling: string;
  min_selling_type: string;
  classification_id: string;
  category_id: string;
  category_selling_type: string;
  classification_name: string;
  category_name: string;
  weight: string;
  has_selsal: number;
  remaining_weight: string;
  sel_weight: string;
  karat_id: string;
  karat_name: string;
  mineral_id: string;
  karatmineral_id: string;
  karatmineral_name: string;
  gold_price: any;
  karat_price: string;
  selling_price: string;
  tax_rate: string;
  cost: string;
  wage: string;
  taklfa: string;
  wage_total: string;
  category_type: string;
  weightitems: any;
  max_selling_price: string;
  stones_weight: string;
  client_id: string;
  client_value: string;
  bond_date: Date;
};

const CreateSellingInvoiceInEdara = () => {
  const [dataSource, setDataSource] = useState<Selling_Invoice_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<any>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [sellingItemsOfWeigth, setSellingItemsOfWeight] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [isOpenZakat, setIsOpenZakat] = useState(false);
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext<any>(authCtx);
  const navigate = useNavigate();

  const initialValues: Selling_Invoice_TP = {
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
    karat_price: "",
    selling_price: "",
    tax_rate: "",
    cost: "",
    wage: "",
    taklfa: "",
    wage_total: "",
    category_type: "",
    weightitems: [],
    max_selling_price: "",
    stones_weight: "",

    client_id: "",
    client_value: "",
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

  const { data } = useFetch<any>({
    endpoint: `/sellingEdaraa/api/v1/invoices`,
    queryKey: [`edara-invoices-data`],
    onSuccess(data) {
      setInvoiceNumber(data?.total);
    },
    pagination: true,
  });

  const { data: clientInfo } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/${clientData?.client_id}`,
    queryKey: [`edara_clients_info`, clientData?.client_id],
    enabled: !!clientData?.client_id,
  });

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

  useEffect(() => {
    if (userData?.is_zakat == 0) {
      setIsOpenZakat(true);
    }
  }, [!!userData?.is_zakat]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      <>
        {stage === 1 && (
          <SellingFirstPageInEdara
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
          <SellingSecondpageInEdara
            setStage={setStage}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            sellingItemsData={sellingItemsData}
          />
        )}
        {stage === 3 && (
          <SellingInvoiceDataInEdara
            sellingItemsData={sellingItemsData}
            paymentData={paymentData}
            invoiceHeaderData={invoiceHeaderBasicData}
            setStage={setStage}
            selectedItemDetails={selectedItemDetails}
            sellingItemsOfWeigth={sellingItemsOfWeigth}
          />
        )}

        <Modal isOpen={isOpenZakat} onClose={() => {}} maxWidth="2xl">
          <div>
            <div className="px-6 py-5">
              <h3
                id="modal-title"
                className="text-lg font-semibold leading-6 text-mainRed text-center"
              >
                {t("Integration with Zakat and Income is not enabled.")}
              </h3>

              <p className="mt-6 mb-2 text-center text-gray-900 text-lg font-semibold">
                {t("Do you want to continue?")}
              </p>
            </div>

            <div className="px-6 pb-6 flex justify-center gap-3">
              <Button type="button" action={() => setIsOpenZakat(false)}>
                {t("Continue")}
              </Button>
              <Button
                type="button"
                bordered
                action={() => {
                  navigate(-1);
                  setIsOpenZakat(false);
                }}
              >
                {t("back")}
              </Button>
            </div>
          </div>
        </Modal>
      </>
    </Formik>
  );
};

export default CreateSellingInvoiceInEdara;
