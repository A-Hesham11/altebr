import { useNavigate } from "react-router-dom"

type SellingHomeCardProps_TP = {
    className?:string
    icon:string
    title:string
    route:string
}
const SellingHomeCard = ({className,icon,title,route}:SellingHomeCardProps_TP) => {
    const navigate = useNavigate()
  return (
    <div className={`${className} bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer h-full`} onClick={()=>navigate(route)} >
        <img src={icon} alt="icon" className="w-[2.8rem]"/>
        <p className="text-mainGreen font-bold my-1">{title}</p>
    </div>
  )
}

export default SellingHomeCard