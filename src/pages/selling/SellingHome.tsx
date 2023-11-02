import { useContext } from "react";
import { BiLogOut } from "react-icons/bi";
import { authCtx } from "../../context/auth-and-perm/auth";
import { t } from "i18next";
import { sellingCards } from "../../utils/selling";
import SellingHomeCard from "../../components/selling/sellingHomeCard";
import { useIsRTL } from "../../hooks";
import logo from "../../assets/altebr_logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { Button } from "../../components/atoms";
import { useNavigate } from "react-router-dom";
const SellingHome = () => {
  const { logOutHandler, userData } = useContext(authCtx);

  const isRTL = useIsRTL();
  const navigate = useNavigate();

  return (
  <div className="selling h-screen pb-8 px-16">
    <div className="flex justify-between pb-5 items-end">
      <div className="bg-slate-100 pb-4 px-4 rounded-b-xl">
        <img src={logo} alt="logo" className="w-[50px] mt-5"/>
      </div>
      <h2 className="text-center font-bold md:text-xl text-white">{t('welcome')} 
        <span className="text-mainOrange"> {t("branch")} {userData?.branch_name}</span>
      </h2>
      <div className="flex justify-end items-center gap-2 ">
        <span className="text-white">{t('welcome')}{userData?.name}</span>
        <BiLogOut className="bg-slate-200 rounded p-1 text-slate-500 cursor-pointer" size={30} onClick={logOutHandler} />
      </div>
  </div>


      <div className="flex gap-12 lg:gap-16 h-[80%] justify-between py-7">
        <div className="flex flex-col gap-8 w-40">
          {sellingCards.slice(0, 2).map((card) => (
            <SellingHomeCard
              icon={card.icon}
              title={isRTL ? card.title_ar : card.title_en}
              route={card.route}
              className=""
              key={crypto.randomUUID()}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-y-8 gap-x-6 w-3/4 lg:gap-x-8">
          {sellingCards.slice(2).map((card) => (
            <SellingHomeCard
              icon={card.icon}
              title={isRTL ? card.title_ar : card.title_en}
              route={card.route}
              className=""
              key={crypto.randomUUID()}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-start items-center gap-2 cursor-pointer">
        <Button
          className="bg-transparent flex items-center gap-3 p-0"
          action={() => {
            navigate("/selling/branchSetting");
          }}
        >
          <IoSettingsOutline
            className="bg-slate-200 rounded p-1 text-slate-500 cursor-pointer"
            size={30}
          />
          <span className="text-white">{t("settings")}</span>
        </Button>
      </div>
    </div>
  );
};

export default SellingHome;
