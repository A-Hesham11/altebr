import { t } from "i18next"
import BillCard from './bill/BillCard'
import SellingTableData from './data/SellingTableData'
import SellingBoxes from './data/SellingBoxes'
import { Button } from '../../atoms'
import { Back } from '../../../utils/utils-components/Back'
import { useNavigate } from 'react-router-dom'
import PaymentBoxes from "./data/paymentBoxs"
import PaymentCard from "./data/PaymentCard"
import PaymentProcessing, { Payment_TP } from "./data/PaymentProcessing"
import { SetStateAction, useState } from "react"
import { notify } from "../../../utils/toast"
import { useFetch } from "../../../hooks"
import { Cards_Props_TP } from "../../templates/bankCards/ViewBankCardsData"
import BillPaymentCard from "./bill/BillPaymentCard"

type SellingSecondpage_TP = {
  paymentData: Payment_TP[]
  setPaymentData: any
  setStage: any
  sellingItemsData: any
}
const SellingSecondpage = ({
  paymentData,
  setPaymentData,
  sellingItemsData,
  setStage
}: SellingSecondpage_TP) => {

   const handleSeccessedData = () => {
    if (paymentData.length === 0) {
      notify('info','fill fields first')
    } else {
      setStage(3)
      notify('success')

    }
};

  return (
    <div className="relative p-10">
      <h2 className='mb-4 text-base font-bold'>{t("payment")}</h2>
      <div className='bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5'>
          <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
              <div className='border-mainGray'>
                  <PaymentBoxes paymentData={paymentData} sellingItemsData={sellingItemsData}/>
              </div>
          </div>
          <h2 className='mb-4 text-base font-bold'>{t("choose type card")}</h2>
          <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">

          <div>
              <PaymentProcessing 
                paymentData={paymentData}
                setPaymentData={setPaymentData}
                sellingItemsData={sellingItemsData}
              />
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

export default SellingSecondpage