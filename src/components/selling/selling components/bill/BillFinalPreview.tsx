import React from 'react'
import { t } from "i18next"
import FinalPreviewBillData from './FinalPreviewBillData'
import FinalPreviewBillTable from './FinalPreviewBillTable'
import FinalPreviewBillPayment from './FinalPreviewBillPayment'
import { Payment_TP } from '../data/PaymentProcessing'

const BillFinalPreview = ({
  paymentData,
}: Payment_TP) => {
  return (
    <div >
      <div className='mx-6 bill-shadow rounded-md p-6'>
        <FinalPreviewBillData />
      </div>
      <div className='mx-6'>
        <FinalPreviewBillTable paymentData={paymentData} />
      </div>
      <div className='mx-6 bill-shadow rounded-md p-6 my-9'>
        <FinalPreviewBillPayment />
      </div>
      <div className='text-center'>
        <p className='my-4 py-1 border-y border-mainOrange'>{t("season's greetings")}</p>
        <div className='flex justify-between items-center px-6 py-2 bg-[#E5ECEB] bill-shadow'>
          <p>العنوان</p>
          <p>رقم المحل</p>
          <p>الهاتف</p>
          <p>الإميل</p>
        </div>
      </div>
    </div>
  )
}

export default BillFinalPreview