// import React from 'react'

// const PaymentToManagement = () => {
//   return (
//     <div>PaymentToManagement</div>
//   )
// }

// export default PaymentToManagement


import { t } from "i18next";
import { notify } from "../../utils/toast";
import PaymentBoxes from "../../components/selling/selling components/data/paymentBoxs";
import PaymentProcessing, { Payment_TP } from "../../components/selling/selling components/data/PaymentProcessing";
import { Button } from "../../components/atoms";
import { useContext, useState } from "react";
import PaymentProccessingToManagement from "./PaymentProccessingToManagement";
import { BoxesData } from "../../components/molecules/card/BoxesData";
import { BoxesDataBase } from "../../components/atoms/card/BoxesDataBase";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";

type SellingSecondpage_TP = {
  paymentData: Payment_TP[]
  setPaymentData: any
  setStage: any
  sellingItemsData: any
}
const PaymentToManagement = () => {

    const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
    const [sellingItemsData, setSellingItemsData] = useState([]);
    const [stage, setStage] = useState<number>(1);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [selectedCardName, setSelectedCardName] = useState(null);
    const [cardId, setCardId] = useState("");
    const { userData } = useContext(authCtx)
    const navigate = useNavigate()

    const {
        data,
    } = useFetch ({
        endpoint: `/sdad/api/v1/get-count/${userData?.branch_id}`,
        queryKey: ["dataOfPaymentToManagement"],
        onSuccess(data) {
          return data.data
        },
    });

    const {
        data: invoiceDataNumber,
      } = useFetch({
        queryKey: ["payment-sdadbonds"],
        endpoint: `/sdad/api/v1/sdadbonds/${userData?.branch_id}?per_page=10000`,
        onSuccess(data) {
            return data.data
        },
      });

    const {mutate: mutatePaymentsData } = useMutate({
        mutationFn: mutateData,
        onSuccess: (data) => {
          navigate(`/selling/viewPayment`);
        },
    });

    const {mutate: mutateAllPaymentsData } = useMutate({
        mutationFn: mutateData,
        onSuccess: (data) => {
          navigate(`/selling/viewPayment`);
        },
    });
    
    const handleSeccessedData = () => {
  
        const postPaymentData: any = [];
        const postPaymentAllData: any = [];

        Object.keys(paymentData).forEach((key) => {
            const keyValueObject = {
                id: paymentData[key]?.id,
                value: paymentData[key]?.amount || paymentData[key]?.weight,
            };
            postPaymentData.push(keyValueObject);

            const keyAllValueObject = {
                card_id: paymentData[key]?.id,
                value_reyal: paymentData[key]?.amount,
                value_gram: paymentData[key]?.weight,
                card_name: paymentData[key]?.card,
            };
            postPaymentAllData.push(keyAllValueObject)
        })

        mutatePaymentsData({
            endpointName: "/sdad/api/v1/store",
            values: {
                payment: postPaymentData,
            },
            method: "post",
        });

        mutateAllPaymentsData({
            endpointName: "/sdad/api/v1/create",
            values: {
                invoice_number: invoiceDataNumber.length + 1,
                payment_date: new Date()?.toISOString().slice(0, 10),
                employee_id: userData?.id,
                branch_id: userData?.branch_id,
                payment: postPaymentAllData,
            },
            method: "post",
        });

        if (paymentData.length === 0) {
            notify('info','fill fields first')
            return;
        }

        notify('success')

        navigate("/selling/viewPayment")

    };

    const paymentDataToManagement = [
        {
            name: t("Management current account (GRAM)"),
            key: 1,
            unit: t("gram"),
            value: data && (data[0]?.account_edara_gram).toFixed(3),
        },
        {
            name: t("Management current account (SAR)"),
            key: 2,
            unit: t("ر.س"),
            value: data && (data[0]?.account_edara_reyal).toFixed(3),
        },
    ]

  return (
    <div className="relative p-10">
        <h2 className='mb-8 text-base font-bold'>{t("payment")}</h2>
      <div className='bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5'>

            <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
                <h2 className='mb-8 text-base font-bold'>{t("Payment data from the branch to the administration")}</h2>
                <ul className="flex justify-around py-1 w-full mb-2">
                    {paymentDataToManagement.map(({ name, key, unit, value }) => (
                        <li className="flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md bg-transparent w-4/12">
                            <p className="bg-mainOrange  p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">{name}</p>
                            <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                                {value} {t(unit)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
                <h2 className='mb-4 text-base font-bold'>{t("Choose your payment method")}</h2>
                <div>
                    <PaymentProccessingToManagement 
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
                <h2 className='mb-8 text-base font-bold'>{t("Total payment")}</h2>
                <div className='border-mainGray'>
                    <PaymentBoxes paymentData={paymentData} sellingItemsData={sellingItemsData} selectedCardId={selectedCardId}/>
                </div>
            </div>
      </div>
      <div className='flex gap-3 justify-end mt-14'>
          <Button
            type='submit'
            loading={false}
            action={() => {
              setStage(1)
            }}
            bordered
          >
            {t("back")}
          </Button>
          <Button action={handleSeccessedData}>{t("save")}</Button>
      </div>
  </div>
  )
}

export default PaymentToManagement;