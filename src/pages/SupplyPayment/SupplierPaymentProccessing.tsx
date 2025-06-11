// import { Form, Formik } from "formik";
// import { t } from "i18next";
// import React, { useContext, useEffect, useState } from "react";
// import * as Yup from "yup";
// import { notify } from "../../utils/toast";
// import PaymentCard from "../../components/selling/selling components/data/PaymentCard";
// import { Button } from "../../components/atoms";
// import { BaseInputField } from "../../components/molecules";
// import { numberContext } from "../../context/settings/number-formatter";
// import { useFetch } from "../../hooks";
// import { authCtx } from "../../context/auth-and-perm/auth";
// import SupplierPaymentProccessingTable from "./SupplierPaymentProccessingTable";

// export type Payment_TP = {
//   id: string;
//   amount: string;
//   weight: string;
//   commission_riyals: string;
//   discount_percentage: string;
//   card?: any;
//   setCard?: any;
//   setSelectedCardId?: any;
//   card_id: string;
//   cost_after_tax: string;
//   cardFrontKey?: string;
//   setCardFronKey: React.Dispatch<React.SetStateAction<Payment_TP>>;
//   paymentData?: any;
//   setPaymentData?: any;
//   sellingItemsData?: any;
//   selectedCardId?: any;
//   setCardId?: any;
//   cardId?: any;
//   setSelectedCardName?: any;
//   selectedCardName?: any;
//   stock_difference?: any;
// };

// const validationSchemaOfAmount = () =>
//   Yup.object({
//     id: Yup.string(),
//     amount: Yup.number().required(`${t("required")}`),
//   });

// const validationSchemaOfWeight = () =>
//   Yup.object({
//     id: Yup.string(),
//     weight: Yup.string().required(`${t("required")}`),
//   });

// const SupplierPaymentProccessing = ({
//   paymentData,
//   setPaymentData,
//   sellingItemsData,
//   selectedCardId,
//   setSelectedCardId,
//   setCardId,
//   cardId,
//   selectedCardName,
//   setSelectedCardName,
//   isCheckedCommission,
//   setIsCheckedCommission,
//   supplierId,
//   boxValues,
// }: Payment_TP) => {
//   console.log("🚀 ~ selectedCardId:", selectedCardId);
//   const [card, setCard] = useState<string | undefined>("");
//   const [cardImage, setCardImage] = useState<string | undefined>("");
//   const [editData, setEditData] = useState<Payment_TP>();
//   console.log("🚀 ~ editData:", editData);
//   const [cardFrontKey, setCardFronKey] = useState<string>("");
//   const [frontKeyAccept, setCardFrontKeyAccept] = useState<string>("");
//   const [frontKeySadad, setCardFrontKeySadad] = useState<string>("");
//   const [sellingFrontKey, setSellingFrontKey] = useState<string>("");
//   const [salesReturnFrontKey, setSalesReturnFrontKey] = useState<string>("");
//   const { formatReyal } = numberContext();
//   const [stockDifferenceMain, setStockDifferenceMain] = useState(0);

//   const locationPath = location.pathname;

//   const { userData } = useContext(authCtx);

//   const handleCardSelection = (
//     selectedCardType: string,
//     selectedCardImage: string
//   ) => {
//     setCard(selectedCardType);
//     setCardImage(selectedCardImage);
//   };

//   useEffect(() => {
//     setSelectedCardId(editData?.card_id);
//   }, [editData?.card_id]);

//   const cashId =
//     locationPath === "/supplier-payment" && cardFrontKey === "cash";
//   console.log("🚀 ~ cashId:", cashId);

//   const { data, isLoading, failureReason, refetch, isSuccess } = useFetch({
//     endpoint: `/sadadSupplier/api/v1/show/${cashId ? 10005 : cardId || 0}/${
//       userData?.branch_id
//     }/${cardFrontKey || 0}`,
//     queryKey: ["showValueOfCardsInEdara"],
//     onSuccess(data) {
//       return data.data;
//     },
//     enabled: !!cardId && !!userData?.branch_id && !!cardFrontKey,
//   });
//   console.log("🚀 ~ data:", data);

//   const initialValues = {
//     id: editData?.id || "",
//     card: editData?.card || "",
//     card_id: selectedCardId || "",
//     front_key: selectedCardId || "",
//     amount: editData?.amount || "",
//     weight: editData?.weight || "",
//     stock_difference: editData?.stock_difference || 0,
//   };

//   const totalPriceInvoice = sellingItemsData?.reduce(
//     (total, item) => Number(total) + Number(item.taklfa_after_tax),
//     0
//   );

//   const amountRemaining = paymentData?.reduce(
//     (total, item) =>
//       Number(total) + (Number(item.cost_after_tax) || Number(item.amount)),
//     0
//   );

//   const invoiceTotalOfSalesReturn = sellingItemsData.reduce(
//     (total, item) => Number(total) + Number(item.total),
//     0
//   );

//   const amountIsPaid =
//     isCheckedCommission === true
//       ? Number(invoiceTotalOfSalesReturn)
//       : Number(totalPriceInvoice);

//   const costRemaining =
//     locationPath === "/selling/payoff/sales-return"
//       ? amountIsPaid - Number(amountRemaining)
//       : Number(totalPriceInvoice) - Number(amountRemaining);
//   console.log("🚀 ~ costRemaining:", costRemaining);

//   //   const { data: stockDifference, refetch: stockDifferenceRefetch } = useFetch({
//   //     endpoint: `/sadadSupplier/api/v1/show/${cashId ? 10005 : cardId || 0}/${
//   //       userData?.branch_id
//   //     }/${cardFrontKey || 0}`,
//   //     queryKey: ["stock_difference_data"],
//   //     onSuccess(data) {
//   //       return data.data;
//   //     },
//   //     // enabled: !!cardId && !!userData?.branch_id && !!cardFrontKey,
//   //   });

//   //   useEffect(() => {
//   //     if (cardId !== null && cardFrontKey !== null) {
//   //       refetch();
//   //     }
//   //   }, [cardId, cardFrontKey]);

//   useEffect(() => {
//     refetch();
//   }, [data, selectedCardId]);

//   const weightOrAmount =
//     selectedCardId == 18 ||
//     selectedCardId == 21 ||
//     selectedCardId == 22 ||
//     selectedCardId == 24;

//   return (
//     <>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={() =>
//           weightOrAmount
//             ? validationSchemaOfWeight()
//             : validationSchemaOfAmount()
//         }
//         onSubmit={(values, { setFieldValue, resetForm, submitForm }) => {
//           if (selectedCardId) {
//             if (editData) {
//               const updatedPaymentData = paymentData.map((item) =>
//                 item.id === editData.id
//                   ? {
//                       ...values,
//                       id: editData.id,
//                       card: editData?.card,
//                       card_id: editData?.card_id,
//                     }
//                   : item
//               );
//               setPaymentData(updatedPaymentData);
//             } else {
//               const isItemExistInPaymentData = !!paymentData.find(
//                 (item) => (item.card_id == selectedCardId && item.stock_difference != stockDifferenceMain)
//               );
//               if (!isItemExistInPaymentData || !paymentData.length) {
//                 const newItem = {
//                   ...values,
//                   id: cardId,
//                   stock_difference_mian: stockDifferenceMain,
//                   card: card,
//                   card_id: selectedCardId,
//                   cardImage: cardImage,
//                   frontkey: cardFrontKey,
//                   frontKeyAccept: frontKeyAccept,
//                   frontKeySadad: frontKeySadad,
//                   sellingFrontKey: sellingFrontKey,
//                   salesReturnFrontKey: salesReturnFrontKey,
//                 };

//                 if (selectedCardId != "discount") {
//                   if (
//                     Number(data?.value) === 0 ||
//                     Number(values.amount > +data?.value) ||
//                     Number(values.weight > +data?.value)
//                   ) {
//                     notify(
//                       "info",
//                       `${t("value is greater than the value in box")}`
//                     );
//                     return;
//                   }
//                 }
//                 setPaymentData((prevData) => [newItem, ...prevData]);
//                 setSelectedCardId(null);
//                 setCardFronKey("");
//               } else {
//                 notify("info", `${t("the card has been added before")}`);
//               }
//             }
//           } else {
//             notify("info", `${t("you must choose card first")}`);
//           }
//           setEditData(undefined);
//           resetForm();
//           setCard("");
//           setStockDifferenceMain(0);
//         }}
//       >
//         {({ values, setFieldValue, resetForm }) => {
//           console.log("🚀 ~ values:", values);
//           useEffect(() => {
//             if (
//               cardId === 10001 ||
//               cardId === 10002 ||
//               cardId === 10003 ||
//               cardId === 10004
//             ) {
//               setFieldValue("amount", "");
//               setFieldValue("value", data?.value?.toFixed(2));
//             } else {
//               setFieldValue("weight", "");
//               setFieldValue("value", data?.value?.toFixed(2));
//               //   setFieldValue("stock_difference", +data?.equivalent);
//             }
//           }, [cardId]);

//           useEffect(() => {
//             setFieldValue("stock_difference", Number(data?.equivalent));
//             setStockDifferenceMain(data?.equivalent);
//           }, [selectedCardId, data]);
//           return (
//             <Form>
//               <div>
//                 <PaymentCard
//                   onSelectCard={handleCardSelection}
//                   selectedCardId={selectedCardId}
//                   setSelectedCardId={setSelectedCardId}
//                   setCardFronKey={setCardFronKey}
//                   setCardFrontKeyAccept={setCardFrontKeyAccept}
//                   setSellingFrontKey={setSellingFrontKey}
//                   setCardFrontKeySadad={setCardFrontKeySadad}
//                   setSalesReturnFrontKey={setSalesReturnFrontKey}
//                   setCardId={setCardId}
//                   setSelectedCardName={setSelectedCardName}
//                 />
//               </div>
//               <div
//                 className={` my-6 grid grid-cols-2 lg:grid-cols-4 gap-6  ${
//                   values.amount > +costRemaining ? "items-center" : "items-end"
//                 }`}
//               >
//                 {selectedCardId != "discount" && (
//                   <BaseInputField
//                     id="value"
//                     name="value"
//                     type="text"
//                     label={
//                       selectedCardName
//                         ? `${selectedCardName} `
//                         : t("Fund totals")
//                     }
//                     placeholder={
//                       selectedCardName ? selectedCardName : t("Fund totals")
//                     }
//                     value={formatReyal(Number(data?.value))}
//                     disabled
//                     className={`bg-mainDisabled text-mainGreen ${
//                       selectedCardName && "font-semibold"
//                     }`}
//                   />
//                 )}
//                 {weightOrAmount ? (
//                   <>
//                     <div className="relative">
//                       <BaseInputField
//                         id="weight"
//                         type="text"
//                         name="weight"
//                         label={`${t("Gold value (in grams)")}`}
//                         placeholder={`${t("Gold value (in grams)")}`}
//                       />
//                     </div>
//                     <div className="relative">
//                       <BaseInputField
//                         id="stock_difference"
//                         name="stock_difference"
//                         type="text"
//                         label={`${t("stock difference")}`}
//                         placeholder={`${t("stock difference")}`}
//                         disabled={!isSuccess}
//                         className={`${!isSuccess && "bg-mainDisabled"}`}
//                         onChange={(e) => {
//                           setFieldValue("stock_difference", e.target.value);
//                           setStockDifferenceMain(data?.equivalent);
//                         }}
//                       />
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="relative">
//                       <BaseInputField
//                         id="amount"
//                         name="amount"
//                         type="text"
//                         label={`${t("amount")}`}
//                         placeholder={`${t("amount")}`}
//                       />
//                     </div>
//                   </>
//                 )}
//                 <Button
//                   type="submit"
//                   className="animate_from_left animation_delay-11 hover:bg-orange-600 transition-all duration-300 bg-mainOrange h-10"
//                 >
//                   {t("Addition")}
//                 </Button>
//               </div>
//               <SupplierPaymentProccessingTable
//                 paymentData={paymentData}
//                 setEditData={setEditData}
//                 setPaymentData={setPaymentData}
//               />
//             </Form>
//           );
//         }}
//       </Formik>
//     </>
//   );
// };

// export default SupplierPaymentProccessing;

import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { notify } from "../../utils/toast";
import PaymentCard from "../../components/selling/selling components/data/PaymentCard";
import { Button } from "../../components/atoms";
import { BaseInputField } from "../../components/molecules";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import SupplierPaymentProccessingTable from "./SupplierPaymentProccessingTable";

export type Payment_TP = {
  id: string;
  amount: string;
  weight: string;
  commission_riyals: string;
  discount_percentage: string;
  card?: any;
  setCard?: any;
  setSelectedCardId?: any;
  card_id: string;
  cost_after_tax: string;
  cardFrontKey?: string;
  setCardFronKey: React.Dispatch<React.SetStateAction<Payment_TP>>;
  paymentData?: any;
  setPaymentData?: any;
  sellingItemsData?: any;
  selectedCardId?: any;
  setCardId?: any;
  cardId?: any;
  setSelectedCardName?: any;
  selectedCardName?: any;
  stock_difference?: any;
  isCheckedCommission?: any;
};

const validationSchemaOfAmount = () =>
  Yup.object({
    id: Yup.string(),
    amount: Yup.number().required(`${t("required")}`),
  });

const validationSchemaOfWeight = () =>
  Yup.object({
    id: Yup.string(),
    weight: Yup.string().required(`${t("required")}`),
  });

const SupplierPaymentProccessing = ({
  paymentData,
  setPaymentData,
  sellingItemsData,
  selectedCardId,
  setSelectedCardId,
  setCardId,
  cardId,
  selectedCardName,
  setSelectedCardName,
  isCheckedCommission,
  setIsCheckedCommission,
  supplierId,
  boxValues,
}: Payment_TP) => {
  const [card, setCard] = useState<string | undefined>("");
  const [cardImage, setCardImage] = useState<string | undefined>("");
  const [editData, setEditData] = useState<Payment_TP>();
  const [cardFrontKey, setCardFronKey] = useState<string>("");
  const [frontKeyAccept, setCardFrontKeyAccept] = useState<string>("");
  const [frontKeySadad, setCardFrontKeySadad] = useState<string>("");
  const [sellingFrontKey, setSellingFrontKey] = useState<string>("");
  const [salesReturnFrontKey, setSalesReturnFrontKey] = useState<string>("");
  const { formatReyal } = numberContext();
  const [stockDifferenceMain, setStockDifferenceMain] = useState(0);

  const locationPath = location.pathname;

  const { userData } = useContext(authCtx);

  const handleCardSelection = (
    selectedCardType: string,
    selectedCardImage: string
  ) => {
    setCard(selectedCardType);
    setCardImage(selectedCardImage);
  };

  useEffect(() => {
    setSelectedCardId(editData?.card_id);
  }, [editData?.card_id]);

  const cashId =
    locationPath === "/supplier-payment" && cardFrontKey === "cash";

  const { data, isLoading, failureReason, refetch, isSuccess } = useFetch({
    endpoint: `/sadadSupplier/api/v1/show/${(cashId ? 10005 : cardId) || 0}/${
      userData?.branch_id
    }/${cardFrontKey ? cardFrontKey : 0}`,
    queryKey: ["showValueOfCardsInEdara"],
    onSuccess(data) {
      return data.data;
    },
    enabled: !!cardId && !!userData?.branch_id && !!cardFrontKey,
  });

  const initialValues = {
    id: editData?.id || "",
    card: editData?.card || "",
    card_id: selectedCardId || "",
    front_key: selectedCardId || "",
    amount: editData?.amount || "",
    weight: editData?.weight || "",
    stock_difference: editData?.stock_difference || 0,
    supplier_vat_sadad: editData?.stock_difference || 0,
  };

  const totalPriceInvoice = sellingItemsData?.reduce(
    (total, item) => Number(total) + Number(item.taklfa_after_tax),
    0
  );

  const amountRemaining = paymentData?.reduce(
    (total, item) =>
      Number(total) + (Number(item.cost_after_tax) || Number(item.amount)),
    0
  );

  const invoiceTotalOfSalesReturn = sellingItemsData.reduce(
    (total, item) => Number(total) + Number(item.total),
    0
  );

  const amountIsPaid =
    isCheckedCommission === true
      ? Number(invoiceTotalOfSalesReturn)
      : Number(totalPriceInvoice);

  const costRemaining =
    locationPath === "/selling/payoff/sales-return"
      ? amountIsPaid - Number(amountRemaining)
      : Number(totalPriceInvoice) - Number(amountRemaining);

  useEffect(() => {
    refetch();
  }, [data, selectedCardId]);

  const weightOrAmount =
    selectedCardId == 18 ||
    selectedCardId == 21 ||
    selectedCardId == 22 ||
    selectedCardId == 24;

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={() =>
          weightOrAmount
            ? validationSchemaOfWeight()
            : validationSchemaOfAmount()
        }
        onSubmit={(values, { setFieldValue, resetForm, submitForm }) => {
          if (selectedCardId) {
            if (editData) {
              const updatedPaymentData = paymentData.map((item) =>
                item.id === editData.id
                  ? {
                      ...values,
                      id: editData.id,
                      card: editData?.card,
                      card_id: editData?.card_id,
                    }
                  : item
              );
              setPaymentData(updatedPaymentData);
            } else {
              const isItemExistInPaymentData = !!paymentData.find((item) =>
                values?.stock_difference
                  ? item.card_id == selectedCardId &&
                    item.stock_difference == values?.stock_difference
                  : item.card_id == selectedCardId
              );
              if (!isItemExistInPaymentData || !paymentData.length) {
                const newItem = {
                  ...values,
                  id: cardId,
                  stock_difference_mian: stockDifferenceMain,
                  card: card,
                  card_id: selectedCardId,
                  cardImage: cardImage,
                  frontkey: cardFrontKey,
                  frontKeyAccept: frontKeyAccept,
                  frontKeySadad: frontKeySadad,
                  sellingFrontKey: sellingFrontKey,
                  salesReturnFrontKey: salesReturnFrontKey,
                };

                if (selectedCardId != "total_tax_sadad_supplier") {
                  if (selectedCardId != "discount") {
                    if (
                      Number(data?.value) === 0 ||
                      Number(values.amount > +data?.value) ||
                      Number(values.weight > +data?.value)
                    ) {
                      notify(
                        "info",
                        `${t("value is greater than the value in box")}`
                      );
                      return;
                    }
                  }
                }
                setPaymentData((prevData) => [newItem, ...prevData]);
                setSelectedCardId(null);
                setCardFronKey("");
              } else {
                notify("info", `${t("the card has been added before")}`);
              }
            }
          } else {
            notify("info", `${t("you must choose card first")}`);
          }
          setEditData(undefined);
          resetForm();
          setCard("");
          setStockDifferenceMain(0);
        }}
      >
        {({ values, setFieldValue, handleSubmit: innerHandleSubmit }) => {
          useEffect(() => {
            if (
              cardId === 10001 ||
              cardId === 10002 ||
              cardId === 10003 ||
              cardId === 10004
            ) {
              setFieldValue("amount", "");
              setFieldValue("value", data?.value?.toFixed(2));
            } else {
              setFieldValue("weight", "");
              setFieldValue("value", data?.value?.toFixed(2));
            }
          }, [cardId]);

          useEffect(() => {
            setFieldValue("stock_difference", Number(data?.equivalent));
            setStockDifferenceMain(data?.equivalent);
          }, [selectedCardId, data]);
          return (
            <Form>
              <div>
                <PaymentCard
                  onSelectCard={handleCardSelection}
                  selectedCardId={selectedCardId}
                  setSelectedCardId={setSelectedCardId}
                  setCardFronKey={setCardFronKey}
                  setCardFrontKeyAccept={setCardFrontKeyAccept}
                  setSellingFrontKey={setSellingFrontKey}
                  setCardFrontKeySadad={setCardFrontKeySadad}
                  setSalesReturnFrontKey={setSalesReturnFrontKey}
                  setCardId={setCardId}
                  setSelectedCardName={setSelectedCardName}
                />
              </div>
              <div
                className={` my-6 grid grid-cols-2 lg:grid-cols-4 gap-6  ${
                  values.amount > +costRemaining ? "items-center" : "items-end"
                }`}
              >
                {selectedCardId != "discount" &&
                  selectedCardId != "total_tax_sadad_supplier" && (
                    <BaseInputField
                      id="value"
                      name="value"
                      type="text"
                      label={
                        selectedCardName
                          ? `${selectedCardName} `
                          : t("Fund totals")
                      }
                      placeholder={
                        selectedCardName ? selectedCardName : t("Fund totals")
                      }
                      value={data ? formatReyal(Number(data?.value)) : 0}
                      disabled
                      className={`bg-mainDisabled text-mainGreen ${
                        selectedCardName && "font-semibold"
                      }`}
                    />
                  )}
                {weightOrAmount ? (
                  <>
                    <div className="relative">
                      <BaseInputField
                        id="weight"
                        type="text"
                        name="weight"
                        label={`${t("Gold value (in grams)")}`}
                        placeholder={`${t("Gold value (in grams)")}`}
                      />
                    </div>
                    <div className="relative">
                      <BaseInputField
                        id="stock_difference"
                        name="stock_difference"
                        type="text"
                        label={`${t("stock difference")}`}
                        placeholder={`${t("stock difference")}`}
                        disabled={!isSuccess}
                        className={`${!isSuccess && "bg-mainDisabled"}`}
                        onChange={(e) => {
                          setFieldValue("stock_difference", e.target.value);
                          setStockDifferenceMain(data?.equivalent);
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <BaseInputField
                        id="amount"
                        name="amount"
                        type="text"
                        label={`${t("amount")}`}
                        placeholder={`${t("amount")}`}
                      />
                    </div>
                  </>
                )}
                <Button
                  type="button"
                  action={innerHandleSubmit}
                  className="animate_from_left animation_delay-11 hover:bg-orange-600 transition-all duration-300 bg-mainOrange h-10"
                >
                  {t("Addition")}
                </Button>
              </div>
              <SupplierPaymentProccessingTable
                paymentData={paymentData}
                setEditData={setEditData}
                setPaymentData={setPaymentData}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SupplierPaymentProccessing;
