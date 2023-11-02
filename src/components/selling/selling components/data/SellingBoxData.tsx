import React from 'react'

export const SellingBoxData = ({data}) => {
    
  return (
    <li className='flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md '>
        <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">{data.account}</p>
        <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">{data.value} <span>{data.unit}</span></p>
    </li>
  )
}


