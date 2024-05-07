import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { notify } from "../../utils/toast";
import PaymentCard from "../../components/selling/selling components/data/PaymentCard";
import PaymentProccessingTableToManagement from "./PaymentProccessingTableToManagement";
import { Button } from "../../components/atoms";
import { BaseInputField } from "../../components/molecules";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import PaymentProccessingTableToSalesReturn from "../salesReturn/PaymentProccessingTableToSalesReturn";

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

const PaymentProccessingToManagement = ({
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

  const initialValues = {
    id: editData?.id || "",
    card: editData?.card || "",
    card_id: selectedCardId || "",
    front_key: selectedCardId || "",
    amount: editData?.amount || "",
    weight: editData?.weight || "",
    add_commission_ratio: editData?.add_commission_ratio || "",
    commission_ratio: editData?.commission_ratio || "",
    commission_oneItem: editData?.commission_oneItem || "",
  };

  const totalPriceInvoice = sellingItemsData?.reduce(
    (total, item) => Number(total) + Number(item.taklfa_after_tax),
    0
  );

  const totalCommissionOfoneItem = sellingItemsData?.reduce(
    (total, item) => Number(total) + Number(item.commission_oneItem),
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

  // const costRemaining =
  //   (locationPath === "/selling/payoff/sales-return"
  //     ? Number(invoiceTotalOfSalesReturn) - Number(totalCommissionOfoneItem)
  //     : Number(totalPriceInvoice)) - Number(amountRemaining) - Number(totalCommissionTaxOfoneItem);
  // console.log("🚀 ~ costRemaining:", costRemaining);

  const costRemaining =
    locationPath === "/selling/payoff/sales-return"
      ? amountIsPaid - Number(amountRemaining)
      : Number(totalPriceInvoice) - Number(amountRemaining);
  console.log("🚀 ~ costRemaining:", costRemaining);

  const cashId =
    locationPath === "/selling/payoff/sales-return" && cardFrontKey === "cash";

  const { data, refetch } = useFetch({
    endpoint: `/sdad/api/v1/show/${cashId ? 10005 : cardId || 0}/${
      userData?.branch_id
    }/${cardFrontKey || 0}`,
    queryKey: ["showValueOfCards"],
    onSuccess(data) {
      return data.data;
    },
    enabled: !!cardId && !!userData?.branch_id && !!cardFrontKey,
  });
  console.log("🚀 ~ data:", data);

  useEffect(() => {
    if (cardId !== null && cardFrontKey !== null) {
      refetch();
    }
  }, [cardId, cardFrontKey]);

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
              const isItemExistInPaymentData = !!paymentData.find(
                (item) => item.card_id == selectedCardId
              );
              if (!isItemExistInPaymentData || !paymentData.length) {
                const newItem = {
                  ...values,
                  id: cardId,
                  card: card,
                  card_id: selectedCardId,
                  cardImage: cardImage,
                  frontkey: cardFrontKey,
                  frontKeyAccept: frontKeyAccept,
                  frontKeySadad:frontKeySadad,
                  sellingFrontKey: sellingFrontKey,
                  salesReturnFrontKey: salesReturnFrontKey,
                };

                if (
                  +data?.value === 0 ||
                  +values.amount > +data?.value ||
                  +values.weight > +data?.value
                ) {
                  notify(
                    "info",
                    `${t("value is greater than the value in box")}`
                  );
                  return;
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
        }}
      >
        {({ values, setFieldValue, resetForm }) => {
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
              {locationPath === "/selling/payoff/sales-return" && (
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    className="border-mainGreen text-mainGreen rounded"
                    id="checkbox"
                    name="add_commission_ratio"
                    onChange={() => {
                      setIsCheckedCommission(!isCheckedCommission);
                      setFieldValue(
                        "add_commission_ratio",
                        !isCheckedCommission
                      );
                      setFieldValue(
                        "commission_oneItem",
                        totalCommissionOfoneItem
                      );
                    }}
                  />
                  <label htmlFor="checkbox">{t("add commission ratio")}</label>
                  <p className="bg-mainGreen text-white text-3 font-bold py-[3px] px-5 rounded-lg ms-4">
                    {Number(totalCommissionOfoneItem)}
                  </p>
                </div>
              )}
              <div
                className={` my-6 grid grid-cols-2 lg:grid-cols-4 gap-6  ${
                  values.amount > +costRemaining ? "items-center" : "items-end"
                }`}
              >
                <BaseInputField
                  id="value"
                  name="value"
                  type="text"
                  label={
                    selectedCardName ? `${selectedCardName} ` : t("Fund totals")
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
                {selectedCardId == 18 ||
                selectedCardId == 21 ||
                selectedCardId == 22 ||
                selectedCardId == 24 ? (
                  <div className="relative">
                    <BaseInputField
                      id="weight"
                      type="text"
                      name="weight"
                      label={`${t("Gold value (in grams)")}`}
                      placeholder={`${t("Gold value (in grams)")}`}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    {locationPath === "/selling/payoff/sales-return" && (
                      <p className="absolute left-0 top-1 text-sm font-bold text-mainGreen">
                        <span>{t("remaining cost")} : </span>{" "}
 
                        {isCheckedCommission
                          ? formatReyal(Number(costRemaining))
                          : formatReyal(Number(costRemaining))}
                      </p>
                    )}
                    <BaseInputField
                      id="amount"
                      name="amount"
                      type="text"
                      label={`${t("amount")}`}
                      placeholder={`${t("amount")}`}
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="animate_from_left animation_delay-11 hover:bg-orange-600 transition-all duration-300 bg-mainOrange h-10"
                >
                  {t("Addition")}
                </Button>
              </div>
              {locationPath === "/selling/payoff/sales-return" ? (
                <PaymentProccessingTableToSalesReturn
                  paymentData={paymentData}
                  setEditData={setEditData}
                  setPaymentData={setPaymentData}
                />
              ) : (
                <PaymentProccessingTableToManagement
                  paymentData={paymentData}
                  setEditData={setEditData}
                  setPaymentData={setPaymentData}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default PaymentProccessingToManagement;
