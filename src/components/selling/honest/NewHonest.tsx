/////////// IMPORTS
///
//import classes from './NewHonest.module.css'
///
/////////// Types
///

import { Formik } from "formik";
import { t } from "i18next";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { notify } from "../../../utils/toast";
import { Back } from "../../../utils/utils-components/Back";
import { HonestFinalScreen } from "./HonestFinalScreen";
import { NewHonestForm } from "./NewHonestForm";
import { Button } from "../../atoms";
import { Context } from "react-zoom-pan-pinch";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import { ClientData_TP } from "../SellingClientForm";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { formatDate } from "../../../utils/date";

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const NewHonest = () => {
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  ///
  /////////// STATES
  ///
  const [sanadData, setSanadData] = useState({});
  const [tableData, setTableData] = useState<any>([]);
  const [paymentData, setPaymentData] = useState([]);
  const [clientData, setClientData] = useState<string>({});
  const { userData } = useContext(authCtx);
  const { invoice_logo } = GlobalDataContext();
  const totalApproximateCost = tableData.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);
  const [stage, setStage] = useState(1);

  /////////// VARIABLES
  ///
  const InitialValues = {
    client_id: "",
    client_name: "",
    name: "",
    category_id: "",
    weight: "",
    karat_id: "",
    notes: "",
    media: [],
    category_value: "",
    karat_value: "",
    bond_date: new Date(),
    cost: 0,
    amount: "",
    remaining_amount: "",
  };

  const validationSchema = Yup.object({
    client_id: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
    category_id: !tableData.length
      ? Yup.string().trim().required("برجاء ملئ هذا الحقل")
      : Yup.string(),
    weight: !tableData.length
      ? Yup.string().trim().required("برجاء ملئ هذا الحقل")
      : Yup.string(),
    karat_id: !tableData.length
      ? Yup.string().trim().required("برجاء ملئ هذا الحقل")
      : Yup.string(),
    bond_date: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
    amount: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
    remaining_amount: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
  });

  const { data: bondsData } = useFetch<ClientData_TP>({
    endpoint: `branchSafety/api/v1/bonds/${userData?.branch_id}?per_page=10000`,
    queryKey: [`bondsData`],
  });

  const bondNumber = bondsData?.length + 1;

  const invoiceHeaderBasicData = {
    first_title: "honest bond date",
    first_value: formatDate(clientData?.bond_date),
    second_title: "client name",
    second_value: clientData?.client_name,
    third_title: "mobile number",
    third_value: clientData?.phone,
    bond_title: "honest bond number",
    invoice_number: bondNumber,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "honest bond",
    bond_date: formatDate(clientData?.bond_date),
    client_id: clientData?.client_id,
  };

  ///
  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  ///
  return (
    <div className="p-8 ms:p-16">
      <div className="flex justify-between items-center ">
        <h2 className="font-bold pt-2 ms-4">{t("create new honest")}</h2>
        <div className="animate_from_left">
          <Back />
        </div>
      </div>
      <Formik
        onSubmit={(values) => {
          const { weight, category_id, cost, karat_id } = values;
          if (weight || category_id || cost || karat_id) {
            notify("info", `${t("add tabel item first")}`);
            return;
          }
          if (!tableData.length) {
          } else {
            const card = paymentData.reduce((acc, curr) => {
              const maxDiscountOrNOt =
                curr.amount >= curr.max_discount_limit
                  ? curr.add_commission_ratio === "yes"
                    ? Number(curr.amount) +
                      Number(curr?.max_discount_limit_value)
                    : Number(curr.amount)
                  : curr.add_commission_ratio === "yes"
                  ? Number(curr.amount) + Number(curr.commission_riyals)
                  : Number(curr.amount);

              acc[curr.frontkey] =
                curr.add_commission_ratio === "yes"
                  ? +maxDiscountOrNOt + Number(curr.commission_tax)
                  : +maxDiscountOrNOt;

              return acc;
            }, {});

            const paymentCommission = paymentData.reduce((acc, curr) => {
              const commissionReyals = Number(curr.commission_riyals);
              const commissionVat =
                Number(curr.commission_riyals) * (userData?.tax_rate / 100);

              acc[curr.frontkey] = {
                commission: commissionReyals,
                vat: commissionVat,
              };
              return acc;
            }, {});
            setStage(2);
            setSanadData({
              ...values,
              tableData,
              card,
              paymentCommission,
              totalApproximateCost,
              invoiceHeaderBasicData,
            });
          }
        }}
        initialValues={InitialValues}
        validationSchema={validationSchema}
      >
        <>
          {stage === 1 && (
            <NewHonestForm
              tableData={tableData}
              setTableData={setTableData}
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              setClientData={setClientData}
            />
          )}
          {stage === 2 && (
            <HonestFinalScreen
              sanadData={sanadData}
              setStage={setStage}
              paymentData={paymentData}
            />
          )}
        </>
      </Formik>
    </div>
  );
};
