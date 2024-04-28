// import React from 'react'

// const SupplierPayment = () => {
//   return (
//     <div>SupplierPayment</div>
//   )
// }

// export default SupplierPayment

import { t } from "i18next";
import { notify } from "../../utils/toast";
import PaymentBoxes from "../../components/selling/selling components/data/paymentBoxs";
import PaymentProcessing, {
  Payment_TP,
} from "../../components/selling/selling components/data/PaymentProcessing";
import { Button } from "../../components/atoms";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { numberContext } from "../../context/settings/number-formatter";
import { useNavigate } from "react-router-dom";
import PaymentProccessingToManagement from "../Payment/PaymentProccessingToManagement";
import SupplierPaymentProccessing from "./SupplierPaymentProccessing";
import { Select } from "../../components/molecules";
import { SelectOption_TP } from "../../types";
import { Supplier_TP } from "../../components/templates/systemEstablishment/supplier/supplier-types";
import { Form, Formik } from "formik";

const SupplierPayment = () => {
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [stage, setStage] = useState<number>(1);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [cardId, setCardId] = useState("");
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const { formatGram, formatReyal } = numberContext();
  const [supplierId, setSupplierId] = useState(0);
  console.log("🚀 ~ SupplierPayment ~ supplierId:", supplierId);

  const { data, refetch: supplierGetCount } = useFetch({
    endpoint: `/sadadSupplier/api/v1/get-count/${supplierId}`,
    queryKey: ["dataOfPaymentToSupplier"],
    onSuccess(data) {
      return data.data;
    },
  });

  const { data: invoiceDataNumber } = useFetch({
    endpoint: `/sdad/api/v1/sdadbonds/${userData?.branch_id}?per_page=10000`,
    queryKey: ["payment-sdadbonds"],
    onSuccess(data) {
      return data.data;
    },
  });

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    failureReason: suppliersErrorReason,
    refetch: refetchSupplier,
  } = useFetch<SelectOption_TP[], Supplier_TP[]>({
    endpoint: "/supplier/api/v1/suppliers?per_page=10000",
    queryKey: ["suppliers"],
    onSuccess(data) {},
    select: (suppliers) =>
      suppliers.map((supplier) => {
        return {
          //@ts-ignore
          id: supplier.id,
          value: supplier.name,
          label: supplier.name,
          name: supplier.name,
        };
      }),
  });

  useEffect(() => {
    supplierGetCount();
  }, [supplierId]);

  const { mutate: mutatePaymentsData, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      navigate(`/selling/viewPayment`);
    },
  });

  const handleSeccessedData = () => {
    const postPaymentData: any = [];
    const postPaymentAllData: any = [];

    Object.keys(paymentData).forEach((key) => {
      const keyValueObject = {
        id: paymentData[key]?.id,
        front_key:
          paymentData[key]?.frontKeyAccept || paymentData[key]?.frontKeySadad,
        value: paymentData[key]?.amount || paymentData[key]?.weight,
      };
      postPaymentData.push(keyValueObject);

      const keyAllValueObject = {
        card_id: paymentData[key]?.id,
        front_key:
          paymentData[key]?.frontKeyAccept || paymentData[key]?.frontKeySadad,
        value_reyal: paymentData[key]?.amount,
        value_gram: paymentData[key]?.weight,
        card_name: paymentData[key]?.card,
      };
      postPaymentAllData.push(keyAllValueObject);
    });

    const card = paymentData.reduce((acc, curr) => {
      if (
        curr.frontKeySadad != 18 &&
        curr.frontKeySadad != 21 &&
        curr.frontKeySadad != 22 &&
        curr.frontKeySadad != 24
      ) {
        acc[curr.frontKeySadad] = Number(curr.amount) || Number(curr.weight);
      }
      return acc;
    }, {});

    const totalPayment = paymentData?.reduce((acc, curr) => {
      acc += Number(curr.amount);
      return acc;
    }, 0);

    if (paymentData.length === 0) {
      notify("info", "fill fields first");
      return;
    }

    mutatePaymentsData({
      endpointName: "/sdad/api/v1/store",
      values: {
        payment: postPaymentData,
        items_payment: postPaymentAllData,
        branch_id: userData?.branch_id,
        card: card,
        total_payment: totalPayment,
        invoice_number: invoiceDataNumber.length + 1,
        payment_date: new Date()?.toISOString().slice(0, 10),
        employee_id: userData?.id,
      },
      method: "post",
    });

    console.log({
      branch_id: userData?.branch_id,
      items_payment: postPaymentAllData,
      invoice_number: invoiceDataNumber.length + 1,
      payment_date: new Date()?.toISOString().slice(0, 10),
      employee_id: userData?.id,
      payment: postPaymentData,
      card: card,
      total_payment: totalPayment,
    });
  };

  const paymentDataToManagement = [
    {
      name: t("Management current account (GRAM)"),
      key: 1,
      unit: t("gram"),
      value: data && data[0]?.account_edara_gram,
    },
    {
      name: t("Management current account (SAR)"),
      key: 2,
      unit: t("ر.س"),
      value: data && data[0]?.account_edara_reyal,
    },
  ];

  return (
    <div className="relative p-10">
      <h2 className="mb-8 text-base font-bold">{t("supplier payment")}</h2>
      <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
        <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
          <h2 className="mb-8 text-base font-bold">
            {t("Payment data from the supplier to management")}
          </h2>
          <Formik initialValues={{ supplier_id: null }} onSubmit={() => {}}>
            <Form className="mb-8 w-1/3">
              <Select
                id="supplier_id"
                label={`${t("supplier name")}`}
                name="supplier_id"
                placeholder={`${t("supplier name")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={suppliers}
                fieldKey="id"
                loading={suppliersLoading}
                isDisabled={!suppliersLoading && !!suppliersErrorReason}
                onChange={(option: any) => {
                  setSupplierId(option?.id);
                }}
              />
            </Form>
          </Formik>

          <ul className="flex justify-around py-1 w-full mb-2">
            {paymentDataToManagement.map(({ name, key, unit, value }) => (
              <li className="flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md bg-transparent w-4/12">
                <p className="bg-mainOrange  p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                  {name}
                </p>
                <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                  {formatGram(Number(value))} {t(unit)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
          <h2 className="mb-4 text-base font-bold">
            {t("Choose your payment method")}
          </h2>
          <div>
            <SupplierPaymentProccessing
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              sellingItemsData={sellingItemsData}
              selectedCardId={selectedCardId}
              setSelectedCardId={setSelectedCardId}
              setCardId={setCardId}
              cardId={cardId}
              setSelectedCardName={setSelectedCardName}
              selectedCardName={selectedCardName}
            />
          </div>
        </div>

        <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
          <h2 className="mb-8 text-base font-bold">{t("Total payment")}</h2>
          <div className="border-mainGray">
            <PaymentBoxes
              paymentData={paymentData}
              sellingItemsData={sellingItemsData}
              selectedCardId={selectedCardId}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-14">
        <Button
          type="submit"
          action={() => {
            setStage(1);
          }}
          bordered
        >
          {t("back")}
        </Button>
        <Button action={handleSeccessedData} loading={isLoading}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default SupplierPayment;
