import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/atoms'
import { t } from "i18next"
import { IoMdAdd } from 'react-icons/io'
import { BiShowAlt } from 'react-icons/bi'

type GoldDashboardProps_TP = {
    title: string
    image: string
    icon: any
    textBondNumber: string
    bondNumber: number
    viewHandler?: () => void
    addHandler?: () => void
}

const GoldDashboard = ({title, image, icon, textBondNumber, bondNumber, viewHandler, addHandler } : GoldDashboardProps_TP) => {
    const navigate = useNavigate();

  return (
    <div className='text-center bg-white dashbord-shadow rounded-md w-[250px] h-[234px]'>
        <div className='relative w-[250px] h-[91px]'>
            <img src={image} alt='card img' className='rounded-t-md w-full h-full blur-[1.5px] ' />
            <div className='absolute bg-[#295E5633] opacity-[60%] w-full h-full top-0 '></div>
            <span className='bg-mainGreen inline-block p-2 rounded-full absolute left-2/4 -bottom-4 -translate-x-2/4 dashbordIcon-shadow'>{icon}</span>
        </div>
        <div className='pt-7 rounded-b-md h-[143px] card-text transition-all'>
            <h2 className='font-normal text-lg text-mainGreen'>{title}</h2>
            <p className='my-2 text-sm font-normal text-mainGreen'>
                {textBondNumber} 
                <span className='!font-semibold mr-1'>{bondNumber}</span>
            </p>
            <div className='flex items-center justify-around my-3'>
                <Button onClick={viewHandler} className="w-[100px] h-[30px] !p-0">
                    <div className="flex justify-center items-center w-100 h-100 gap-1">
                        <BiShowAlt className='fill-white w-4 h-4'/>
                        <span className='font-normal text-sm '>{t("view")}</span>
                    </div> 
                </Button>
                <Button onClick={addHandler} className="w-[100px] h-[30px] !p-0">
                    <div className="flex justify-center items-center w-100 h-100 gap-1">
                        <IoMdAdd className="fill-white w-4 h-4"  />
                        <span className='font-normal text-sm '>{t("add")}</span>
                    </div> 
                </Button>
            </div>
        </div>
    </div>
  )
}

export default GoldDashboard

{/* <div className='text-center bg-white dashbord-shadow rounded-md w-[250px] h-[234px]'>
<div className='relative h-[91px] w-[250px]'>
    <img src={image} alt='card img' className='relative rounded-t-md object-cover'/>
    <span className='bg-mainGreen inline-block p-2 rounded-full absolute left-2/4 -bottom-4 -translate-x-2/4'>{icon}</span>
</div>
<div className='pt-7 rounded-b-md h-[143px] hover:bg-mainGreen'>
    <h2 className='font-normal text-lg text-mainGreen'>{title}</h2>
    <p className='my-2 text-sm font-normal text-mainGreen'>
        {textBondNumber} 
        <span className='!font-semibold mr-1'>{bondNumber}</span>
    </p>
    <div className='flex items-center justify-around my-3'>
        <Button onClick={viewHandler} className="w-[100px] h-[30px] !p-0">
            <div className="flex justify-center items-center w-100 h-100 gap-1">
                <BiShowAlt className='fill-white w-4 h-4'/>
                <span className='font-normal text-sm '>{t("view")}</span>
            </div> 
        </Button>
        <Button onClick={addHandler} className="w-[100px] h-[30px] !p-0">
            <div className="flex justify-center items-center w-100 h-100 gap-1">
                <IoMdAdd className="fill-white w-4 h-4"  />
                <span className='font-normal text-sm '>{t("add")}</span>
            </div> 
        </Button>
    </div>
</div>
</div> */}