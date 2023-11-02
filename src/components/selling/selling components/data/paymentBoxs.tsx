import React, { useState } from 'react'
import { BoxesData } from '../../../molecules/card/BoxesData'
import { t } from "i18next"
import { BondTotals } from '../../../supply/BondTotals'
import { useFetch } from '../../../../hooks'
import { SellingBoxData } from './SellingBoxData'
import { numberContext } from '../../../../context/settings/number-formatter'


const PaymentBoxes = ({sellingItemsData, paymentData} : any) => {

  const { formatGram, formatReyal } = numberContext();

  const priceInvoice = sellingItemsData.reduce((total, item) => +total + +item.taklfa, 0)

  const totalPriceInvoice = sellingItemsData.reduce((total, item) => +total + +item.taklfa_after_tax, 0)

  const amountRemaining = paymentData.reduce((total, item) => total + item.cost_after_tax ,0)

  const boxsData = [
    {
      id: 1,
      account: `${t("total bill after tax")}` ,
      value: formatReyal(Number((+totalPriceInvoice).toFixed(2))) ,
      unit: "ر.س",
    },
    {
      id: 2,
      account: `${t("total tax")}` ,
      value: formatReyal(Number((totalPriceInvoice - priceInvoice).toFixed(2))) ,
      unit: "ر.س",
    },
    {
      id: 3,
      account: `${t("remainder of payment")}`, 
      value: formatReyal(Number((totalPriceInvoice - amountRemaining).toFixed(2))),
      unit: "ر.س",
    },
  ]

  return (
    <div>
        <ul className="grid grid-cols-3 gap-32 py-1">
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