import React, { useContext, useState } from 'react'
import { t } from "i18next"
import { SellingBoxData } from './SellingBoxData'
import { authCtx } from '../../../../context/auth-and-perm/auth'
import { Selling_TP } from '../../../../pages/selling/PaymentSellingPage'
import { numberContext } from '../../../../context/settings/number-formatter'



const SellingBoxes = ({sellingItemsData} : any) => {

  const { userData } = useContext(authCtx)

  const { formatGram, formatReyal } = numberContext();
  
  const priceInvoice = sellingItemsData.reduce((total, item) => +total + +item.taklfa , 0);

  const totalPriceInvoice = sellingItemsData.reduce((total, item) => +total + +item.taklfa_after_tax , 0);


  const weightTotal = sellingItemsData.reduce((total, item) => total + +item.weight , 0);

  

  const boxsData = [
    {
      id: 1,
      account: `${t("bill value")}` ,
      value: formatReyal(Number(+priceInvoice)) || 0,
      unit: "ر.س",
    },
    {
      id: 2,
      account: `${t("VAT")}` ,
      value: formatReyal(Number((+totalPriceInvoice - +priceInvoice).toFixed(2))) || 0,
      unit: "ر.س",
    },
    {
      id: 3,
      account: `${t("total value")}`, 
      value: formatReyal(Number((+totalPriceInvoice).toFixed(2))) || 0,
      unit: "ر.س",
    },
    {
      id: 4,
      account: `${t("number")}`, 
      value: sellingItemsData.length || 0,
      unit: `${t("piece")}`,
    },
    {
      id: 5,
      account: `${t("gross weight")}`, 
      value: weightTotal || 0,
      unit: `${t("gram")}`,
    },
    {
      id: 6,
      account: `${t("net")}`, 
      value: 0,
      unit: `${t("gram")}`,
    },
  ]

  return (
    <div>
        <ul className="grid lg:grid-cols-6 grid-cols-3 gap-5 ">
            {boxsData?.map((data: any) => (
              <>
                <SellingBoxData data={data} />
              </>
            ))}
        </ul>
        
    </div>
  )
}

export default SellingBoxes