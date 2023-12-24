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
        <div className="flex items-center justify-center gap-3">
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
            {userData?.branch?.name}
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



// import { t } from "i18next";
// import { useContext, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { authCtx } from "../../context/auth-and-perm/auth";
// import { useIsRTL } from "../../hooks";
// import { Button } from "../atoms";
// import logo from "../../assets/altebr_logo.png";
// import { useNavigate } from "react-router-dom";
// import logout from "../../assets/logout.svg";
// import person from "../../assets/blank-person-image.png";
// import language from "../../assets/language.svg";


// const NavBar = ({ isInSelling = false }: { isInSelling?: boolean }) => {
//   const { logOutHandler, isLoggingOut, userData } = useContext(authCtx);
//   console.log("🚀 ~ file: NavBar.tsx:117 ~ NavBar ~ userData:", userData)
//   const navigate = useNavigate();

//   const isRTL = useIsRTL();

//   const { i18n } = useTranslation();
//   useEffect(() => {
//     document.documentElement.dir = isRTL ? "rtl" : "ltr";
//     document.documentElement.lang = isRTL ? "ar" : "en";
//   }, [isRTL]);

//   const toggleLang = () => {
//     i18n.changeLanguage(isRTL ? "en" : "ar");
//   };

//   return (
//     <div className="w-100 flex h-16 items-center justify-between px-12">
//       <div className="w-100 flex items-center gap-12 py-6 px-4">
//         {isInSelling && (
//           <img
//             onClick={() => navigate("/")}
//             src={logo}
//             className="ms-3 h-14 w-18 object-contain cursor-pointer"
//             alt="logo"
//           />
//         )}
//       </div>
//       <div className="me-2 flex  items-center gap-4">
//         <div className="flex items-center justify-center gap-6">
//           <Button
//             type="button"
//             className="animate_from_top  animation_delay-3 bg-mainGreen hover:bg-emerald-900 transition-all duration-200 text-base w-14 h-7 py-[1px] px-[4px] rounded-md font-normal"
//             action={() => toggleLang()}
//           >
//             <div className="flex items-center justify-center gap-3">
//               <img src={language} alt="language"/>
//               <p className="text-xs font-bold">{isRTL ? "Ar" : "En"}</p>
//             </div>
//           </Button>
//           <div className="flex items-center gap-3">
//             <div className="w-[38px] h-[38px] border-2 border-[#969696] rounded-full flex items-center justify-center">
//               <img src={person} className="h-[22px] w-[22px]" alt="user"/>
//             </div>
//             <div>
//               <p className="text-[#414345] font-bold text-base">{userData?.name}</p>
//               <p className="text-[#707070] font-normal text-xs">{userData?.branch?.name || userData?.branch_name}</p>
//             </div>
//           </div>
//           <Button
//             action={logOutHandler}
//             // loading={isLoggingOut}
//             className="text-sm w-9 h-9 px-0 rounded duration-200 bg-[#295E5633]"
//           >
//           <img
//             src={logout}
//             className="m-auto h-[22px] w-[22px] object-contain cursor-pointer"
//             alt="logout"
//           />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavBar;
