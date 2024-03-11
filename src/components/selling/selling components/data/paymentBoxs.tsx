import React, { useContext, useState } from 'react'
import { BoxesData } from '../../../molecules/card/BoxesData'
import { t } from "i18next"
import { BondTotals } from '../../../supply/BondTotals'
import { useFetch } from '../../../../hooks'
import { SellingBoxData } from './SellingBoxData'
import { numberContext } from '../../../../context/settings/number-formatter'
import { authCtx } from '../../../../context/auth-and-perm/auth'


const PaymentBoxes = ({sellingItemsData, paymentData, selectedCardId} : any) => {

  const { formatGram, formatReyal } = numberContext();

  const priceInvoice = sellingItemsData.reduce((total, item) => +total + +item.taklfa, 0);

  const totalPriceInvoice = sellingItemsData.reduce((total, item) => +total + +item.taklfa_after_tax, 0);

  const amountRemaining = paymentData.reduce((total, item) => Number(total) + Number(item.cost_after_tax) ,0);

  const totalPaymentByBank = paymentData.filter((item) => item.id < 10000).reduce((total, item) => +total + +item.amount, 0);

  const totalPaymentByCash = paymentData.filter((item) => item.id === 10005)[0]?.amount || 0; 

  const totalPaymentByKarat18 = paymentData.filter((item) => item.id === 10001)[0]?.weight || 0; 
  const totalPaymentByKarat21 = paymentData.filter((item) => item.id === 10002)[0]?.weight || 0; 
  const totalPaymentByKarat22 = paymentData.filter((item) => item.id === 10003)[0]?.weight || 0; 
  const totalPaymentByKarat24 = paymentData.filter((item) => item.id === 10004)[0]?.weight || 0; 

  const totalpaymentByGram = Number(totalPaymentByKarat18) + Number(totalPaymentByKarat21) + Number(totalPaymentByKarat22) + Number(totalPaymentByKarat24)
  const paymentByGram = (Number(totalPaymentByKarat18) * 18 / 24) + (Number(totalPaymentByKarat21) * 21 / 24 ) + (Number(totalPaymentByKarat22) * 22 / 24 ) + (Number(totalPaymentByKarat24) * 24 / 24 )
  
  const karatDifference = totalpaymentByGram - paymentByGram

  const boxsSellingData = [
    {
      id: 1,
      account: `${t("total bill after tax")}` ,
      value: formatReyal(Number(totalPriceInvoice)) ,
      unit: "ر.س",
    },
    {
      id: 2,
      account: `${t("total tax")}` ,
      value: formatReyal(Number(totalPriceInvoice - priceInvoice)) ,
      unit: "ر.س",
    },
    {
      id: 3,
      account: `${t("remainder of payment")}`, 
      value: formatReyal(Number(totalPriceInvoice - amountRemaining || 0)),
      unit: "ر.س",
    },
  ]

  const boxsPaymnetData = [ 
      {
        id: 1,
        account: `${t("Total gold fraction converted to 24")}` ,
        value: formatReyal(Number((+paymentByGram).toFixed(2))) ,
        unit: "ر.س",
      },
      {
        id: 2,
        account: `${t("Caliber difference")}` ,
        value: formatReyal(Number((+karatDifference).toFixed(2))) ,
        unit: "ر.س",
      },
      {
        id: 3,
        account: `${t("cash")}` ,
        value: formatReyal(Number((+totalPaymentByCash).toFixed(2))) ,
        unit: "ر.س",
      },
      {
        id: 4,
        account: `${t("bank")}`, 
        value: formatReyal(Number(totalPaymentByBank.toFixed(2))),
        unit: "ر.س",
      },
  ]

  const locationPath = location.pathname

  const boxsData = locationPath === "/selling/reimbursement" ? boxsPaymnetData : boxsSellingData

  return (
    <div>
        <ul className="grid grid-cols-4 gap-8 py-1">
            {boxsData?.map((data: any) => (
              <>
                <SellingBoxData data={data} />
              </>
            ))}
        </ul>
    </div>
  )
}

export default PaymentBoxes