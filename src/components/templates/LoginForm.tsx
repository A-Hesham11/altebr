// /////////// IMPORTS
// ///

// import { Form, Formik } from "formik"
// import { t } from "i18next"
// import { useContext, useState } from "react"
// import { AiOutlineLock } from "react-icons/ai"
// import { BiHide, BiShowAlt } from "react-icons/bi"
// import { CiMail } from 'react-icons/ci'
// import * as Yup from "yup"
// import logo from "../../assets/altebr_logo.png"
// import loginGif from '../../assets/homeGif.gif'
// import { authCtx } from "../../context/auth-and-perm/auth"
// import { Button } from "../atoms/buttons/Button"
// import { CheckBoxField } from "../molecules"
// import { BaseInputField } from "../molecules/formik-fields/BaseInputField"
// import { useIsRTL } from "../../hooks"
// import loginPattern from "../../assets/pattern.svg"
// import loginLogo from "../../assets/login-logo.svg"
// import sms from "../../assets/sms.svg"
// import lock from "../../assets/lock.svg"
// import eyeShow from "../../assets/eye-show.svg"
// import eyeHide from "../../assets/eye-hide.svg"

// ///
// /////////// Types
// ///
// type LoginFormProps_TP = {}
// ///
// /////////// HELPER VARIABLES & FUNCTIONS
// ///
// const loginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email address").trim().required(),
//   password: Yup.string().trim().required(),
// })
// ///
// export const LoginForm = () => {
//   const [PassToggle, setPassToggle] = useState(false);
//   /////////// VARIABLES
//   ///
//   const isRTL = useIsRTL();

//   ///
//   /////////// CUSTOM HOOKS
//   ///
//   const { logInHandler, isLoggedIn, isLoggingIn } = useContext(authCtx);
//   ///
//   /////////// STATES
//   ///
//   ///
//   /////////// SIDE EFFECTS
//   ///

//   /////////// FUNCTIONS | EVENTS | IF CASES
//   ///

//   ///
//   return (
//     <div className="flex relative flex-col items-center justify-center h-screen gap-3">
//       <div className="myVideo-container">
//         <div className="myVideo-container__overlay"></div>
//         {/* <video autoPlay loop muted className="myVideo" src={videoHome} /> */}
//         {/* <img src={loginGif} alt="" className="myVideo" /> */}
//         <img src={loginPattern} alt="" className="myVideo" />
//       </div>
//       <div className="content">
//         {/* <img
//           src={logo}
//           className="m-auto h-20 w-20 object-contain"
//           alt="logo"
//         /> */}
//         <img
//           src={loginLogo}
//           className="m-auto h-28 w-28 object-contain"
//           alt="logo"
//         />

//         <div className="text-center text-white mt-14 my-5">
//           <h1 className="font-bold leading-normal text-xl my-1">{t("the login")}</h1>
//           <p className="text-base font-light">{t("Please fill out the following information!")}</p>
//         </div>
//         <Formik                                                                                                                             
//           initialValues={{
//             email: "emp@emp.com",
//             password: "alexon123456@$!acdfdsas",
//           }}
//           validationSchema={loginSchema}
//           onSubmit={(values) => {
//             logInHandler(values)
//           }}
//         >
//           <Form>
//             <div className="flex flex-col gap-4">
//               <div className="relative">
//                 <label htmlFor="email" className="text-white text-sm font-bold">{t("email")}</label>
//                 <div className="relative">
//                   <img src={sms} alt="sms" className={`${isRTL ? "right-2" : "left-2"} absolute top-[53%] transform -translate-y-2/4 z-50 w-6 h-7`} />
//                   <BaseInputField
//                     labelProps={{ className: "mb-1 font-normal" }}
//                     id="email"
//                     name="email"
//                     type="text"
//                     placeholder="email"
//                     className={`${isRTL ? "pr-10" : "pl-10"}  mt-[6px] h-[52px] w-full`}
//                     // icon={<CiMail className="text-[#7D7D7D] w-5 h-5 absolute top-[50%] translate-y-2/4 right-2"/>}
//                     // icon={<img src="/src/assets/sms.svg.svg" alt="" className="sms" />}
//                   />
//                 </div>
//               </div>
//               <div className="relative">
//                 <label htmlFor="password" className="text-white text-sm font-bold">{t("password")}</label>
//                 <div className="relative">
//                   <img src={lock} alt="sms" className={`${isRTL ? "right-2" : "left-2"} absolute top-2/4 transform -translate-y-2/4 z-50 w-6 h-7`} />
//                   {PassToggle 
//                     ? (<img src={eyeShow} alt="hide" className={`${isRTL ? "left-3" : "right-3"} absolute top-[54%] transform -translate-y-2/4 z-50 w-6 h-7 cursor-pointer`} onClick={() => setPassToggle(!PassToggle)}/>) 
//                     : (<img src={eyeHide} alt="hide" className={`${isRTL ? "left-3" : "right-3"} absolute top-[54%] transform -translate-y-2/4 z-50 w-6 h-7 cursor-pointer`} onClick={() => setPassToggle(!PassToggle)}/>)
//                   }
//                   <BaseInputField
//                     labelProps={{ className: "mt-6 mb-1 font-normal" }}
//                     className={`${isRTL ? "pr-10" : "pl-10"}  mt-[6px] h-[52px] w-full`}
//                     id="password"
//                     name="password"
//                     type={PassToggle ? "text" : "password"}
//                     placeholder="Password"
//                     // icon={
//                     //   <>
//                     //     <AiOutlineLock className="w-5 h-5 absolute top-[50%] right-2"/>
//                     //       {PassToggle 
//                     //         ? (<BiShowAlt className="w-5 h-5 cursor-pointer absolute top-[50%] left-2" onClick={() => setPassToggle(!PassToggle)}/>) 
//                     //         : (<BiHide className="w-5 h-5 cursor-pointer absolute top-[50%] left-2" onClick={() => setPassToggle(!PassToggle)}/>)
//                     //       }
//                     //   </>
//                     // }
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-between items-center mb-2">
//                 <p className=" text-white text-sm font-bold">{`${t("did you forget your password ?")}`}</p>
//                 <span className="flex items-center ">
//                   <CheckBoxField name="remember" id="remember"/>
//                   <label htmlFor="remember" className="!text-white text-sm font-bold" >{`${t("remember me")}`}</label>
//                 </span>
//               </div>

//               <Button
//                 className="mt-3 w-full font-bold text-base bg-mainOrange h-[52px] grid place-content-center"
//                 type="submit"
//                 variant="primary"
//                 loading={isLoggingIn}
//               >
//                  {t("the login")}
//               </Button>
//             </div>
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   )
// }


/////////// IMPORTS
///

import { Form, Formik } from "formik"
import { t } from "i18next"
import { useContext, useState } from "react"
import { AiOutlineLock } from "react-icons/ai"
import { BiHide, BiShowAlt } from "react-icons/bi"
import { CiMail } from 'react-icons/ci'
import * as Yup from "yup"
import logo from "../../assets/altebr_logo.png"
import loginGif from '../../assets/homeGif.gif'
import { authCtx } from "../../context/auth-and-perm/auth"
import { Button } from "../atoms/buttons/Button"
import { CheckBoxField } from "../molecules"
import { BaseInputField } from "../molecules/formik-fields/BaseInputField"

///
/////////// Types
///
type LoginFormProps_TP = {}
///
/////////// HELPER VARIABLES & FUNCTIONS
///
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").trim().required(),
  password: Yup.string().trim().required(),
})
///
export const LoginForm = () => {
  const [PassToggle, setPassToggle] = useState(false);
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { logInHandler, isLoggedIn, isLoggingIn } = useContext(authCtx);
  ///
  /////////// STATES
  ///
  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <div className="flex relative flex-col items-center justify-center h-screen gap-3">
      <div className="myVideo-container">
        <div className="myVideo-container__overlay"></div>
        {/* <video autoPlay loop muted className="myVideo" src={videoHome} /> */}
        <img src={loginGif} alt="" className="myVideo" />
      </div>
      <div className="content">
        <img
          src={logo}
          className="m-auto h-20 w-20 object-contain"
          alt="logo"
        />

        <h1 className="text-secondaryBlack font-bold leading-normal text-sm text-center mb-4 mt-3">
          Tenant login
        </h1>
        <Formik                                                                                                                             
          initialValues={{
            email: "emp@emp.com",
            password: "alexon123456@$!acdfdsas",
          }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            logInHandler(values)
          }}
        >
          <Form>
            <BaseInputField
              labelProps={{ className: "mb-1 font-normal" }}
              id="email"
              label={`${t("email")}`}
              name="email"
              type="text"
              placeholder="email"
              className="pr-8"
              icon={<CiMail className="text-[#7D7D7D] w-5 h-5 absolute top-[60%] right-2"/>}
            />
            <BaseInputField
              labelProps={{ className: "mt-6 mb-1 font-normal" }}
              className="pr-8 "
              id="password"
              label={`${t("password")}`}
              name="password"
              type={PassToggle ? "text" : "password"}
              placeholder="Password"
              icon={
                <>
                  <AiOutlineLock className="w-5 h-5 absolute top-[60%] right-2"/>
                    {PassToggle 
                      ? (<BiShowAlt className="w-5 h-5 cursor-pointer absolute top-[60%] left-2" onClick={() => setPassToggle(!PassToggle)}/>) 
                      : (<BiHide className="w-5 h-5 cursor-pointer absolute top-[60%] left-2" onClick={() => setPassToggle(!PassToggle)}/>)
                    }
                </>
              }
            />
            <div className="flex justify-between items-center mt-4 mb-2">
              <span className="flex items-center ">
                <CheckBoxField name="remember" id="remember"/>
                <label htmlFor="remember" className="!text-black text-xs" >{`${t("remember me")}`}</label>
              </span>
              <p className="text-xs text-black font-normal">{`${t("did you forget your password ?")}`}</p>
            </div>
            <Button
              className="mt-3 w-full font-bold text-sm"
              type="submit"
              variant="primary"
              loading={isLoggingIn}
            >
              تسجيل الدخول
            </Button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}
