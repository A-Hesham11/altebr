import React from 'react'
import { t } from "i18next"
import { BsDatabase } from 'react-icons/bs'


const BuyingHeader = ({invoiceNumber} : any) => {

  return (
    <div className='flex items-center gap-8 lg:gap-16'>
        <div className='flex items-center gap-5'>
            {/* <h2>{t("bill number")} - {`${invoiceNumber.length + 1}`}</h2> */}
            <h2>{t("bill number")} - {`${invoiceNumber.length + 1}`}</h2>
            <p className='bg-mainGreen text-white text-[9px] font-bold py-1 px-2 rounded-lg'>{t("purchase policy applies")}</p>
        </div>
        <div className='flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs'>
            <BsDatabase className='fill-white'/>
            <p className=' border-l border-[#FFA34B] px-1'>{t("daily gold price")}</p>
            <p className='px-1'>20.3 ر.س</p>
        </div>
    </div>
  )
}

export default BuyingHeader