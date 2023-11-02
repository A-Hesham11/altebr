import React from 'react'
import { SellingBoxData } from './SellingBoxData'
import { t } from "i18next"

const FinalPreviewBoxs = () => {

    const boxsData = [
        {
            id: 1,
            account: `${t("total bill")}` ,
            value: 3000,
            unit: "ر.س",
        },
        {
            id: 2,
            account: `${t("remainder of payment")}`, 
            value: 25000,
            unit: "ر.س",
        },
        {
            id: 3,
            account: `${t("total tax")}` ,
            value: 5625,
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

export default FinalPreviewBoxs