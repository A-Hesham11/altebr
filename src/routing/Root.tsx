import { t } from "i18next";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Outlet } from "react-router-dom";
import Footer from "../components/organisms/Footer";
import { Loading } from "../components/organisms/Loading";
import NavBar from "../components/organisms/NavBar";
import { SideBar } from "../components/organisms/SideBar";
import { authCtx } from "../context/auth-and-perm/auth";

export const Root = () => {
  const { isLoggedIn, isLoadingUpdatedUserData, userData } =
    useContext(authCtx);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn]);

  if (isLoggedIn && !isLoadingUpdatedUserData && userData?.branch_id == "1") {
    return (
      <div className="grid h-screen grid-cols-view grid-rows-view bg-flatWhite">
        <nav className="col-start-0 col-end-3 row-start-1 row-end-2 bg-white">
          <NavBar />
        </nav>

        <SideBar />

        <main
          className={
            location.pathname === "/system/accounts"
              ? "col-start-2 col-end-3 row-start-2 row-end-3 overflow-y-auto pt-10  mb-10"
              : "col-start-2 col-end-3 row-start-2 row-end-3 overflow-y-auto p-10  mb-10"
          }
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    );
  } else if (
    isLoggedIn &&
    !isLoadingUpdatedUserData &&
    userData?.branch_id != "1"
  ) {
    return (
      <div className="grid h-screen grid-cols-view grid-rows-view bg-flatWhite">
        <nav
          className={`col-start-0 col-end-3 row-start-1 row-end-2 bg-white ${
            location.pathname === "/" && "hidden"
          }`}
        >
          <NavBar isInSelling />
        </nav>
        <main className="col-start-2 col-end-3 row-start-2 row-end-3 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  } else {
    return <Loading mainTitle={t("loading")} />;
  }
};

// import { t } from "i18next";
// import { useContext, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router";
// import { Outlet } from "react-router-dom";
// import Footer from "../components/organisms/Footer";
// import { Loading } from "../components/organisms/Loading";
// import NavBar from "../components/organisms/NavBar";
// import { SideBar } from "../components/organisms/SideBar";
// import { authCtx } from "../context/auth-and-perm/auth";
// import Wizard from "../pages/wizard/Wizard";

// export const Root = () => {
//   const { isLoggedIn, isLoadingUpdatedUserData, userData } =
//     useContext(authCtx);
//   console.log("🚀 ~ Root ~ userData:", userData);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/login", { replace: true });
//     }
//   }, [isLoggedIn]);

//   if (userData?.branch_id == "1" && userData?.is_wizard == 0) {
//     return (
//       <>
//         <nav className="col-start-0 col-end-3 row-start-1 row-end-2 bg-white">
//           <NavBar />
//         </nav>
//         <Wizard />
//       </>
//     );
//   } else if (
//     isLoggedIn &&
//     !isLoadingUpdatedUserData &&
//     userData?.branch_id == "1"
//   ) {
//     return (
//       <div className="grid h-screen grid-cols-view grid-rows-view bg-flatWhite">
//         <nav className="col-start-0 col-end-3 row-start-1 row-end-2 bg-white">
//           <NavBar />
//         </nav>

//         <SideBar />

//         <main
//           className={
//             location.pathname === "/system/accounts"
//               ? "col-start-2 col-end-3 row-start-2 row-end-3 overflow-y-auto pt-10  mb-10"
//               : "col-start-2 col-end-3 row-start-2 row-end-3 overflow-y-auto p-10  mb-10"
//           }
//         >
//           <Outlet />
//         </main>

//         <Footer />
//       </div>
//     );
//   } else if (
//     isLoggedIn &&
//     !isLoadingUpdatedUserData &&
//     userData?.branch_id != "1"
//   ) {
//     return (
//       <div className="grid h-screen grid-cols-view grid-rows-view bg-flatWhite">
//         <nav
//           className={`col-start-0 col-end-3 row-start-1 row-end-2 bg-white ${
//             location.pathname === "/" && "hidden"
//           }`}
//         >
//           <NavBar isInSelling />
//         </nav>
//         <main className="col-start-2 col-end-3 row-start-2 row-end-3 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     );
//   } else {
//     return <Loading mainTitle={t("loading")} />;
//   }
// };
