import { useNavigate } from "react-router-dom";
import { useIsRTL } from "../../hooks";

type SellingSubCardProps_TP = {
  icon: string;
  title: string;
  route: string;
  underCardInfo?: React.ReactNode;
  data?: any;
  isDisabled?: any;
};
const SellingSubCard = ({
  icon,
  title,
  route,
  underCardInfo,
  data,
  isDisabled,
}: SellingSubCardProps_TP) => {
  console.log("🚀 ~ isDisabled:", isDisabled);
  const navigate = useNavigate();
  return (
    <div
      className={`${
        data?.length === 3 ? "lg:w-72 w-56" : "w-72"
      } relative flex flex-col h-44 rounded-xl text-center text-sm font-bold shadow-md bg-slate-200 ${
        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() => (isDisabled ? undefined : navigate(route))}
    >
      {isDisabled && (
        <div className="bg-[#00000040] rounded-xl absolute top-0 left-0 w-full h-full"></div>
      )}
      <div className="h-[70%] flex items-center justify-center">
        <img src={icon} alt="icon" className="w-[80px] mx-auto" />
      </div>
      <p className=" bg-mainOrange font-bold h-[30%] text-white rounded-b-xl py-4 text-center">
        {title}
      </p>
      <div
        className="absolute -bottom-20 w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {underCardInfo}
      </div>
    </div>
  );
};

export default SellingSubCard;
