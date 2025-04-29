// import { useNavigate } from "react-router-dom"

// type SellingHomeCardProps_TP = {
//     className?:string
//     icon:string
//     title:string
//     route:string
// }
// const SellingHomeCard = ({className,icon,title,route}:SellingHomeCardProps_TP) => {
//     const navigate = useNavigate()
//   return (
//     <div className={`${className} bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer h-full`} onClick={()=>navigate(route)} >
//         <img src={icon} alt="icon" className="w-[2.8rem]"/>
//         <p className="text-mainGreen font-bold my-1">{title}</p>
//     </div>
//   )
// }

// export default SellingHomeCard

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../context/auth-and-perm/auth";
import { notify } from "../../utils/toast";

type SellingHomeCardProps = {
  className?: string;
  icon: string;
  title: string;
  route: string;
  disabled?: boolean;
};

const SellingHomeCard = ({
  className = "",
  icon,
  title,
  route,
  disabled = false,
}: SellingHomeCardProps) => {
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);

  const isDisabled = userData?.is_sellingInvoice === 1;
  const isActiveZakat = userData?.isActive_Zakat === 0;

  const allowedRoutes = [
    "/selling",
    "/selling/payoff",
    // "/selling/buying",
    // "/selling/exchange",
    // "/selling/clients",
  ];

  const handleNavigation = () => {
    // if (isActiveZakat) {
    //   notify("info", "fhj");
    //   return;
    // }

    if (!isDisabled || allowedRoutes.includes(route)) {
      navigate(route);
    }
  };

  const isRestricted = isDisabled && !allowedRoutes.includes(route);

  return (
    <div
      className={`${className} bg-white rounded-xl flex flex-col items-center justify-center h-full relative overflow-hidden ${
        isRestricted ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={isRestricted ? undefined : handleNavigation}
    >
      {isRestricted && (
        <div className="absolute top-0 left-0 right-0 w-full h-full z-10 bg-[#00000040]" />
      )}
      <img src={icon} alt="icon" className="w-[2.8rem] relative !z-20" />
      <p className="text-mainGreen font-bold my-1 relative !z-20">{title}</p>
    </div>
  );
};

export default SellingHomeCard;
