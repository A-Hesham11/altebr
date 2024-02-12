/////////// IMPORTS
///
//import classes from './NewHonest.module.css'
///
/////////// Types
///

import { Formik } from "formik";
import { t } from "i18next";
import { useState } from "react";
import * as Yup from "yup";
import { notify } from "../../../utils/toast";
import { Back } from "../../../utils/utils-components/Back";
import { HonestFinalScreen } from "./HonestFinalScreen";
import { NewHonestForm } from "./NewHonestForm";

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
  const [sanaData, setSanadData] = useState({});
  const [tableData, setTableData] = useState<any>([]);
  const [paymentData, setPaymentData] = useState([]);
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
            notify("info", t("add tabel item first"));
            return;
          }
          if (!tableData.length) {
          } else {
            // const card = paymentData.reduce((acc, curr) => {
            //   const addDiscountPercentage =
            //     curr.add_commission_ratio === "yes"
            //       ? Number(curr.discount_percentage / 100)
            //       : 0;
            //   const addTaxToResult =
            //     curr.add_commission_ratio === "yes"
            //       ? Number(curr.commission_riyals) * 0.15
            //       : 0;
            //   acc[curr.frontkey] =
            //     Number(curr.amount) * addDiscountPercentage +
            //     +curr.amount +
            //     addTaxToResult;
            //   return acc;
            // }, {});
            const card = paymentData.reduce((acc, curr) => {
              const maxDiscountOrNOt =
                curr.amount >= curr.max_discount_limit
                  ? Number(curr.amount) + Number(curr?.max_discount_limit_value)
                  : Number(curr.amount) + Number(curr.commission_riyals);

              acc[curr.frontkey] =
                +maxDiscountOrNOt + Number(curr.commission_tax);

              return acc;
            }, {});
            setStage(2);
            setSanadData({ ...values, tableData, card, totalApproximateCost });
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
            />
          )}
          {stage === 2 && (
            <HonestFinalScreen sanadData={sanaData} setStage={setStage} />
          )}
        </>
      </Formik>
    </div>
  );
};
