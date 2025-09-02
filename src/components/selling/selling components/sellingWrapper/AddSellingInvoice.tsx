import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import SellingFirstPage from "../../../../pages/selling/SellingFirstPage";
import SellingSecondpage from "../SellingSecondpage";
import SellingInvoiceData from "../../../../pages/selling/SellingInvoiceData";
import { Selling_TP } from "../data/SellingTableData";
import { ClientData_TP } from "../../SellingClientForm";
import { Payment_TP } from "../data/PaymentProcessing";
import * as Yup from "yup";
import { useFetch } from "../../../../hooks";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { Zatca } from "../../../../pages/selling/Zatca";
import { formatDate } from "../../../../utils/date";
import { GlobalDataContext } from "../../../../context/settings/GlobalData";
import { Modal } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const AddSellingInvoice = () => {
  const [dataSource, setDataSource] = useState<Selling_TP[]>();
  const [stage, setStage] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData_TP>();
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [sellingItemsOfWeigth, setSellingItemsOfWeight] = useState([]);
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);
  const [isOpenZakat, setIsOpenZakat] = useState(false);
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();
  console.log("🚀 ~ AddSellingInvoice ~ userData:", userData);

  const initialValues: Selling_TP = {
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

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/invoices_per_branch/${userData?.branch_id}`,
    queryKey: [`invoices_data_${userData?.branch_id}`],
    onSuccess(data) {
      setInvoiceNumber(data?.total);
    },
    pagination: true,
  });

  const { data: clientInfo } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/${clientData?.client_id}`,
    queryKey: [`clients_info`, clientData?.client_id],
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
          <SellingFirstPage
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
          <SellingInvoiceData
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

export default AddSellingInvoice;
