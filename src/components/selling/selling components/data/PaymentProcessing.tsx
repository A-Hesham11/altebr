import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { notify } from "../../../../utils/toast";
import { Button } from "../../../atoms";
import { BaseInputField } from "../../../molecules";
import RadioGroup from "../../../molecules/RadioGroup";
import PaymentCard from "./PaymentCard";
import PaymentProccessingTable from "./PaymentProccessingTable";
import { numberContext } from "../../../../context/settings/number-formatter";
import { authCtx } from "../../../../context/auth-and-perm/auth";

export type Payment_TP = {
  id: string;
  amount: string;
  commission_riyals: string;
  discount_percentage: string;
  card?: any;
  setCard?: any;
  setSelectedCardId?: any;
  card_id: string;
  cost_after_tax: string;
  cardFrontKey?: string;
  setCardFronKey: React.Dispatch<React.SetStateAction<Payment_TP>>;
  setCardFrontKeySadad: React.Dispatch<React.SetStateAction<Payment_TP>>;
};

type CardSelection_TP = {
  selectedCardType: string;
  selectedCardImage: string;
};

const validationSchema = () =>
  Yup.object({
    id: Yup.string(),
    amount: Yup.number().required(`${t("required")}`),
    commission_riyals: Yup.string(),
    discount_percentage: Yup.string(),
  });

const PaymentProcessing = ({
  paymentData,
  setPaymentData,
  sellingItemsData,
  totalApproximateCost,
  costRemainingHonest,
}: Payment_TP) => {
  console.log("🚀 ~ totalApproximateCost:", totalApproximateCost);
  console.log("🚀 ~ sellingItemsData:", sellingItemsData);
  console.log("🚀 ~ costRemainingHonest:", costRemainingHonest);
  console.log("🚀 ~ paymentData:", paymentData);
  const [card, setCard] = useState<string | undefined>("");
  const [cardImage, setCardImage] = useState<string | undefined>("");
  const [selectedCardId, setSelectedCardId] = useState(null);
  console.log("🚀 ~ selectedCardId:", selectedCardId);
  const [editData, setEditData] = useState<Payment_TP>();
  console.log("🚀 ~ editData:", editData);
  const [cardFrontKey, setCardFronKey] = useState<string>("");
  const [cardDiscountPercentage, setCardDiscountPercentage] = useState<any>({});
  const { userData } = useContext(authCtx);
  const [selectedCardData, setSelectedCardData] = useState(null);
  console.log("🚀 ~ selectCardedData:", selectedCardData);
  console.log("🚀 ~ userData:", userData);
  console.log("🚀 ~ cardDiscountPercentage:", cardDiscountPercentage);

  const taxRate = userData?.tax_rate / 100;
  console.log("🚀 ~ taxRate:", taxRate);

  const [frontKeyAccept, setCardFrontKeyAccept] = useState<string>("");
  const [frontKeySadad, setCardFrontKeySadad] = useState<string>("");
  const [sellingFrontKey, setSellingFrontKey] = useState<string>("");
  const [exchangeFrontKey, setExchangeFrontKey] = useState<string>("");
  const { formatGram, formatReyal, digits_count } = numberContext();
  // const { formatReyal, digits_count } = numberContext();

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
    discount_percentage: editData?.discount_percentage || "",
    commission_riyals: editData?.commission_riyals || "",
    cost_after_tax: editData?.cost_after_tax || "",
    add_commission_ratio: "no",
  };

  const totalPriceInvoice = sellingItemsData?.reduce(
    (total, item) => +total + +item.taklfa_after_tax,
    0
  );

  const editDataAmount = editData ? editData?.amount : 0;

  const amountRemaining = paymentData?.reduce(
    (total, item) => total + item.cost_after_tax,
    0
  );

  const costRemaining = +totalPriceInvoice
    ? Number(editDataAmount) +
      (Number(totalPriceInvoice) - Number(amountRemaining))
    : costRemainingHonest
    ? Number(costRemainingHonest)
    : Number(totalApproximateCost) - +amountRemaining || 0;

  console.log("🚀 ~ costRemaining:", costRemaining);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={() => validationSchema()}
        onSubmit={(values, { setFieldValue, resetForm, submitForm }) => {
          console.log("🚀 ~ values:", values);
          const commissionValue =
            cardDiscountPercentage?.max_discount_limit &&
            +values?.amount >= +cardDiscountPercentage?.max_discount_limit
              ? values?.amount
                ? +cardDiscountPercentage?.max_discount_limit_value
                : 0
              : +values.cost_after_tax * (+values.discount_percentage / 100);

          const commissionRiyals = +commissionValue;
          const commissionTax = +commissionRiyals * taxRate;
          if (selectedCardId) {
            if (editData) {
              const updatedPaymentData = paymentData.map((item) =>
                item.id === editData.id
                  ? {
                      ...values,
                      id: editData?.id,
                      payment_id: editData?.payment_id,
                      card: editData?.card,
                      card_id: editData?.card_id,
                      commission_riyals: commissionRiyals,
                      cardImage: cardImage,
                      commission_tax: commissionTax,
                      max_discount_limit_value:
                        editData?.max_discount_limit_value,
                      max_discount_limit: editData?.max_discount_limit,
                      frontkey: editData?.cardFrontKey,
                      frontKeyAccept: editData?.frontKeyAccept,
                      frontKeySadad: editData?.frontKeySadad,
                      sellingFrontKey: editData?.sellingFrontKey,
                      exchangeFrontKey: editData?.exchangeFrontKey,
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
                  id: crypto.randomUUID(),
                  card: card,
                  card_id: selectedCardId,
                  paymentCardId: !!selectedCardData?.[0].iban
                    ? null
                    : selectedCardData?.[0]?.card_id,
                  paymentBankId: !!selectedCardData?.[0].iban
                    ? selectedCardData?.[0]?.bank_id
                    : null,
                  bank_account_id: !!selectedCardData?.[0].iban
                    ? selectedCardData?.[0]?.id
                    : selectedCardData?.[0]?.bank_account_id,
                  // commission_riyals:
                  //   values.add_commission_ratio === "yes"
                  //     ? commissionRiyals
                  //     : 0,
                  payment_id: selectedCardData?.[0].id,
                  commission_riyals: commissionRiyals,
                  max_discount_limit_value:
                    cardDiscountPercentage?.max_discount_limit_value,
                  max_discount_limit:
                    cardDiscountPercentage?.max_discount_limit,
                  cardImage: cardImage,
                  frontkey: cardFrontKey,
                  frontKeyAccept: frontKeyAccept,
                  frontKeySadad: frontKeySadad,
                  sellingFrontKey: sellingFrontKey,
                  exchangeFrontKey: exchangeFrontKey,
                  // commission_tax:
                  //   values.add_commission_ratio === "yes" ? commissionTax : 0,
                  commission_tax: commissionTax,
                };
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
          const oldCost_after_tax = values.add_commission_ratio;
          resetForm();
          setFieldValue("add_commission_ratio", oldCost_after_tax);
          setCard("");
        }}
      >
        {({ values, setFieldValue, resetForm }) => {
          console.log("🚀 ~ PaymentProcessing ~ values:", values);

          const commissionValue =
            cardDiscountPercentage?.max_discount_limit &&
            Number(values?.amount) >=
              Number(cardDiscountPercentage?.max_discount_limit)
              ? values?.amount
                ? Number(cardDiscountPercentage?.max_discount_limit_value)
                : 0
              : Number(values.cost_after_tax) *
                (Number(values.discount_percentage) / 100);

          const commissionRiyals = Number(commissionValue);
          console.log("🚀 ~ commissionRiyals:", commissionRiyals);
          const commissionTax = Number(commissionRiyals) * Number(taxRate);
          console.log("🚀 ~ commissionTax:", commissionTax);
          const cost_after_commission =
            Number(values.cost_after_tax) +
            Number(commissionRiyals) +
            Number(commissionTax);
          console.log("🚀 ~ cost_after_commission:", cost_after_commission);

          return (
            <Form>
              <div>
                <PaymentCard
                  onSelectCard={handleCardSelection}
                  selectedCardId={selectedCardId}
                  setSelectedCardId={setSelectedCardId}
                  setCardFronKey={setCardFronKey}
                  setCardFrontKeyAccept={setCardFrontKeyAccept}
                  setCardFrontKeySadad={setCardFrontKeySadad}
                  setSellingFrontKey={setSellingFrontKey}
                  setExchangeFrontKey={setExchangeFrontKey}
                  setCardDiscountPercentage={setCardDiscountPercentage}
                  setSelectedCardData={setSelectedCardData}
                />
              </div>
              <div
                className={` my-6 grid grid-cols-2 lg:grid-cols-4 gap-6  ${
                  +values.amount >
                  Number(Number(costRemaining).toFixed(digits_count.reyal))
                    ? "items-center"
                    : "items-end"
                }`}
              >
                <div className="relative">
                  <p className="absolute left-0 top-1 text-sm font-bold text-mainGreen">
                    <span>{t("remaining cost")} : </span>{" "}
                    {Number(costRemaining).toFixed(digits_count.reyal)}
                  </p>
                  <BaseInputField
                    id="amount"
                    name="amount"
                    type="text"
                    label={`${t("amount")}`}
                    placeholder={`${t("amount")}`}
                    onChange={(e) => {
                      setFieldValue("cost_after_tax", +e.target.value);
                    }}
                    className={` ${
                      +values.amount >
                        Number(
                          Number(costRemaining).toFixed(digits_count.reyal)
                        ) && "bg-red-100"
                    }`}
                  />
                  <div>
                    {+values.amount >
                      Number(
                        Number(costRemaining).toFixed(digits_count.reyal)
                      ) && (
                      <p className="text-mainRed">
                        <span>{t("price must be less than or equal to")}</span>
                        <span>
                          {" "}
                          {Number(costRemaining).toFixed(digits_count.reyal)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {cardDiscountPercentage ? (
                  <>
                    {values.add_commission_ratio === "yes" && (
                      <>
                        <BaseInputField
                          id="commission_riyals"
                          type="text"
                          name="commission_riyals"
                          label={`${t("commission riyals")}`}
                          placeholder={`${t("commission riyals")}`}
                          value={commissionRiyals}
                          disabled
                          className="bg-mainDisabled"
                        />
                        <BaseInputField
                          id="commission_tax"
                          type="text"
                          name="commission_tax"
                          label={`${t("commission tax")}`}
                          placeholder={`${t("commission tax")}`}
                          disabled
                          value={commissionTax}
                          className="bg-mainDisabled"
                        />
                        <BaseInputField
                          id="cost_after_commission"
                          type="text"
                          name="cost_after_commission"
                          value={formatReyal(Number(cost_after_commission))}
                          label={`${t("cost after commission")}`}
                          placeholder={`${t("cost after commission")}`}
                          disabled
                          className="bg-mainDisabled"
                        />
                      </>
                    )}
                    <RadioGroup
                      name="add_commission_ratio"
                      onChange={(e) => {
                        setFieldValue("add_commission_ratio", e);
                      }}
                    >
                      <div className="flex gap-x-2">
                        <label>{t("add commission ratio")}</label>
                        <RadioGroup.RadioButton
                          value="yes"
                          label={`${t("yes")}`}
                          id="yes"
                        />
                        <RadioGroup.RadioButton
                          value="no"
                          label={`${t("no")}`}
                          id="no"
                        />
                      </div>
                    </RadioGroup>
                  </>
                ) : (
                  ""
                )}
                <Button
                  type="submit"
                  className="animate_from_left animation_delay-11 hover:bg-orange-500 transition-all duration-300 bg-mainOrange h-10"
                  disabled={
                    +values.amount >
                    Number(Number(costRemaining).toFixed(digits_count.reyal))
                  }
                >
                  {t("confirm")}
                </Button>
              </div>
              <PaymentProccessingTable
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

export default PaymentProcessing;
