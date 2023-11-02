import { t } from "i18next";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useIsRTL } from "../../hooks";
import { Button } from "../atoms";
import logo from "../../assets/altebr_logo.png";
import { useNavigate } from "react-router-dom";

const NavBar = ({ isInSelling = false }: { isInSelling?: boolean }) => {
  const { logOutHandler, isLoggingOut, userData } = useContext(authCtx);
  const navigate = useNavigate();

  const isRTL = useIsRTL();

  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const toggleLang = () => {
    i18n.changeLanguage(isRTL ? "en" : "ar");
  };

  return (
    <div className="w-100 flex h-16 items-center justify-between px-4">
      <div className="w-100 flex items-center gap-12 py-6 px-4">
        {isInSelling && (
          <img
            onClick={() => navigate("/")}
            src={logo}
            className="ms-3 h-14 w-18 object-contain cursor-pointer"
            alt="logo"
          />
        )}
        {/* <Can access={["api.v1.categories.store"]}>
          <form className="flex items-center rounded-md border-2 border-slate-200 p-1 ">
            <input
              type="search"
              placeholder="بحث"
              className=" placeholder-slate-400 border-transparent p-0"
            />
            <BiSearchAlt className="fill-slate-400" />
          </form>
        </Can> */}
      </div>
      <div className="me-2 flex  items-center gap-4">
        {/* <IoSettingsOutline className="icon fill-mainBlack cursor-pointer" /> */}
        {/* <div className=" relative">
         <IoNotificationsOutline className="icon fill-mainBlack" />
         <span className=" absolute -top-2 left-3 rounded-full  bg-mainRed p-[2px] text-xs text-white">
           10
         </span>
       </div> */}
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            className="animate_from_top  animation_delay-3 bg-mainGreen hover:bg-emerald-900 transition-all duration-200 text-base w-8 h-8 py-[1px] px-[4px] rounded-md font-normal"
            action={() => toggleLang()}
          >
            {isRTL ? "Ar" : "En"}
          </Button>
          <div className="flex items-center justify-center gap-2 bg-flatWhite rounded w-28 py-1">
            <h6 className="m-0">{userData?.name}</h6>
            {userData?.image ? (
              <img
                src={userData?.image}
                alt="User Image"
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <img
                src="/src/assets/blank-person-image.png"
                className="w-7 h-7 rounded-full"
                alt="undefined User Image"
              />
            )}
          </div>
          <h6 className="m-0 text-mainGreen">
            <span className="font-bold text-black">{t("branch")}</span>:
            {userData?.branch_name}
          </h6>
          {/* <IoIosArrowDown className="h-4 w-4 fill-mainBlack" /> */}
          <Button
            action={logOutHandler}
            loading={isLoggingOut}
            className="text-sm w-32 px-0 hover:bg-emerald-900 transition-all duration-200 "
          >
            {t("log out")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
