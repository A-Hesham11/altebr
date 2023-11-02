import React from 'react'
import { Button } from '../../../atoms'
import { IoMdAdd } from 'react-icons/io'
import { t } from "i18next"
import { FaRegSave } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'

const BillButtons = () => {
  return (
    <div className='flex flex-col justify-between h-[100%]'>
        <div>
            <Button className='border border-mainGreen bg-flatWhite text-mainGreen flex items-center gap-2 px-5 py-[5px]'>
                <IoMdAdd className="fill-mainGreen w-4 h-4" />
                <p className='text-sm font-bold'>{t("new")}</p>
            </Button>
        </div>
        <div>
            <Button className='flex items-center gap-2 px-5 py-[5px]' >
                <FaRegSave className="fill-white w-4 h-4"/>
                <p className='text-sm font-bold'>{t("save")}</p>
            </Button>
        </div>
        <div>
            <Button className='bg-mainRed flex items-center gap-2 px-5 py-[5px]'>
                <RiDeleteBin6Line className="fill-white w-4 h-4"/>
                <p className='text-sm font-bold'>{t("delete")}</p>
            </Button>
        </div>
    </div>
  )
}

export default BillButtons