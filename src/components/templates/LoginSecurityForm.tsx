// import { Form, Formik } from "formik";
// import { t } from "i18next";
// import { useState } from "react";
// import * as Yup from "yup";
// import { Button } from "../atoms/buttons/Button";
// import { CheckBoxField } from "../molecules";
// import { BaseInputField } from "../molecules/formik-fields/BaseInputField";
// import { useIsRTL } from "../../hooks";
// import loginPattern from "../../assets/pattern.svg";
// import sms from "../../assets/sms.svg";
// import lock from "../../assets/lock.svg";
// import eyeShow from "../../assets/eye-show.svg";
// import eyeHide from "../../assets/eye-hide.svg";
// import { useNavigate } from "react-router-dom";

// /////////// HELPER VARIABLES & FUNCTIONS
// ///
// const loginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email address").trim().required(),
//   password: Yup.string().trim().required(),
// });
// ///

// export const LoginSecurityForm = () => {
//   const [PassToggle, setPassToggle] = useState(false);
//   const navigate = useNavigate();

//   const isRTL = useIsRTL();

//   return (
//     <div className="flex relative flex-col items-center justify-center h-screen gap-3">
//       <div className="myVideo-container">
//         {/* <div className="myVideo-container__overlay"></div> */}

//         {/* <img src={loginPattern} alt="" className="myVideo" /> */}
//       </div>
//       <div className="content !h-[88%] xl:!h-[55%] !p-0">
//         <div className="text-center text-white mt-8 my-5">
//           <h1 className="font-bold leading-normal text-xl my-1">
//             {t("the login")}
//           </h1>
//           <p className="text-base font-light">
//             {t("Please fill out the following information!")}
//           </p>
//         </div>
//         <Formik
//           initialValues={{
//             email: "",
//             password: "",
//           }}
//           validationSchema={loginSchema}
//           onSubmit={(values, { setFieldError }) => {
//             const email = values.email.trim();
//             const password = values.password.trim();

//             const allowedEmail = "Administrator@erp.net";
//             const allowedPassword = "X9$Erp!2026Admin";

//             if (email === allowedEmail && password === allowedPassword) {
//               localStorage.setItem("security_ok", "1");
//               navigate("/login", { replace: true });
//               return;
//             }

//             setFieldError("email", "Not allowed");
//             setFieldError("password", "Not allowed");
//           }}
//         >
//           <Form>
//             <div className="flex flex-col gap-4">
//               <div className="relative">
//                 <label htmlFor="email" className="text-white text-sm font-bold">
//                   {t("email")}
//                 </label>
//                 <div className="relative">
//                   <img
//                     src={sms}
//                     alt="sms"
//                     className={`${
//                       isRTL ? "right-2" : "left-2"
//                     } absolute top-[53%] transform -translate-y-2/4 z-50 w-6 h-7`}
//                   />
//                   <BaseInputField
//                     labelProps={{ className: "mb-1 font-normal" }}
//                     id="email"
//                     name="email"
//                     type="text"
//                     placeholder="email"
//                     className={`${
//                       isRTL ? "pr-10" : "pl-10"
//                     }  mt-[6px] h-[52px] w-full`}
//                   />
//                 </div>
//               </div>
//               <div className="relative">
//                 <label
//                   htmlFor="password"
//                   className="text-white text-sm font-bold"
//                 >
//                   {t("password")}
//                 </label>
//                 <div className="relative">
//                   <img
//                     src={lock}
//                     alt="sms"
//                     className={`${
//                       isRTL ? "right-2" : "left-2"
//                     } absolute top-2/4 transform -translate-y-2/4 z-50 w-6 h-7`}
//                   />
//                   {PassToggle ? (
//                     <img
//                       src={eyeShow}
//                       alt="hide"
//                       className={`${
//                         isRTL ? "left-3" : "right-3"
//                       } absolute top-[54%] transform -translate-y-2/4 z-50 w-6 h-7 cursor-pointer`}
//                       onClick={() => setPassToggle(!PassToggle)}
//                     />
//                   ) : (
//                     <img
//                       src={eyeHide}
//                       alt="hide"
//                       className={`${
//                         isRTL ? "left-3" : "right-3"
//                       } absolute top-[54%] transform -translate-y-2/4 z-50 w-6 h-7 cursor-pointer`}
//                       onClick={() => setPassToggle(!PassToggle)}
//                     />
//                   )}
//                   <BaseInputField
//                     labelProps={{ className: "mt-6 mb-1 font-normal" }}
//                     className={`${
//                       isRTL ? "pr-10" : "pl-10"
//                     }  mt-[6px] h-[52px] w-full`}
//                     id="password"
//                     name="password"
//                     type={PassToggle ? "text" : "password"}
//                     placeholder="Password"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-between items-center mb-2">
//                 <p className=" text-white text-sm font-bold">{`${t(
//                   "did you forget your password ?",
//                 )}`}</p>
//                 <span className="flex items-center ">
//                   <CheckBoxField name="remember" id="remember" />
//                   <label
//                     htmlFor="remember"
//                     className="!text-white text-sm font-bold"
//                   >{`${t("remember me")}`}</label>
//                 </span>
//               </div>

//               <Button
//                 className="mt-3 w-full font-bold text-base bg-mainOrange h-[52px] grid place-content-center"
//                 type="submit"
//                 variant="primary"
//               >
//                 {t("the login")}
//               </Button>
//             </div>
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   );
// };

import { Form, Formik } from "formik";
import { t } from "i18next";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { Button } from "../atoms/buttons/Button";
import { CheckBoxField } from "../molecules";
import { BaseInputField } from "../molecules/formik-fields/BaseInputField";
import { useIsRTL } from "../../hooks";

import loginPattern from "../../assets/pattern.svg";
import sms from "../../assets/sms.svg";
import lock from "../../assets/lock.svg";
import eyeShow from "../../assets/eye-show.svg";
import eyeHide from "../../assets/eye-hide.svg";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").trim().required(),
  password: Yup.string().trim().required(),
});

export const LoginSecurityForm = () => {
  const [PassToggle, setPassToggle] = useState(false);
  const navigate = useNavigate();
  const isRTL = useIsRTL();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img
          src={loginPattern}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0b1220]/95 to-[#0b1220]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4">
        <div className="w-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:py-10 sm:px-6">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold">{t("the login")}</h2>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values, { setFieldError }) => {
                const email = values.email.trim();
                const password = values.password.trim();

                const allowedEmail = "Administrator@erp.net";
                const allowedPassword = "X9$Erp!2026Admin";

                if (email === allowedEmail && password === allowedPassword) {
                  localStorage.setItem("security_ok", "1");
                  navigate("/login", { replace: true });
                  return;
                }

                setFieldError("email", "Not allowed");
                setFieldError("password", "Not allowed");
              }}
            >
              <Form className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-white"
                  >
                    {t("Email")}
                  </label>

                  <div className="relative mt-2">
                    <BaseInputField
                      id="email"
                      name="email"
                      type="text"
                      placeholder={`${t("Email")}`}
                      className={`h-12 w-full rounded-xl bg-black/20 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 `}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-white"
                  >
                    {t("Password")}
                  </label>

                  <div className="relative mt-2 mb-4">
                    <div
                      className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer opacity-80 z-50 ${
                        isRTL ? "left-3" : "right-3"
                      }`}
                    >
                      {PassToggle ? (
                        <Eye
                          className="text-mainOrange cursor-pointer"
                          onClick={() => setPassToggle((v) => !v)}
                        />
                      ) : (
                        <EyeOff
                          className="text-mainOrange cursor-pointer"
                          onClick={() => setPassToggle((v) => !v)}
                        />
                      )}
                    </div>

                    <BaseInputField
                      id="password"
                      name="password"
                      type={PassToggle ? "text" : "password"}
                      placeholder={`${t("Password")}`}
                      className={`h-12 w-full rounded-xl bg-black/20 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 `}
                    />
                  </div>
                </div>

                <Button
                  className="h-12 w-full rounded-xl bg-mainOrange text-base font-bold"
                  type="submit"
                  variant="primary"
                >
                  {t("Continue")}
                </Button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
