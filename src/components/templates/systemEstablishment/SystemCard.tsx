// /////////// IMPORTS
// import { BiShowAlt } from "react-icons/bi";
// import { IoMdAdd } from "react-icons/io";
// import { Button } from "../../atoms";
// import { t } from "i18next";
// import { useLocation } from "react-router-dom";
// ///
// //import classes from './SystemCard.module.css'
// ///
// /////////// Types

// ///
// type SystemCardProps_TP = {
//   addHandler: () => void;
//   viewHandler?: () => void;
//   addLabel?: string;
//   viewLabel?: string;
//   title: string;
//   forStyle?: boolean;
//   viewCountReyal?: number;
//   viewCountGram?: number;
// };
// /////////// HELPER VARIABLES & FUNCTIONS
// ///

// ///
// export const SystemCard = ({
//   addHandler,
//   viewHandler,
//   addLabel,
//   viewLabel,
//   title,
//   forStyle,
//   viewCountReyal,
//   viewCountGram,
// }: SystemCardProps_TP) => {
//   /////////// VARIABLES
//   ///
//   ///
//   /////////// CUSTOM HOOKS
//   ///

//   const location = useLocation()
//   const path = location.pathname
//   ///
//   /////////// STATES
//   ///

//   ///
//   /////////// SIDE EFFECTS
//   ///

//   ///
//   /////////// IF CASES
//   ///

//   ///
//   /////////// FUNCTIONS & EVENTS
//   ///

//   ///
//   return (
//     <div className="col-span-1 w-full rounded-md p-3 shadow-xl ">
//       <div className="grid grid-rows-view gap-4">
//         <div
//           className={`flex w-full items-center justify-center gap-2  rounded-lg  py-2 px-4 text-white ${
//             forStyle ? "flex-col bg-mainGreen" : "bg-mainOrange"
//           }`}
//         >
//           <div className="flex w-full items-center justify-center">
//             <h3>{title}</h3>
//           </div>
//         </div>
//         {addLabel && addHandler && (
//           <Button
//             bordered={true}
//             action={addHandler}
//             className="border-[0.7px] px-2 "
//           >
//             <div className="flex justify-center items-center">
//               <IoMdAdd
//                 className="fill-lightBlack"
//                 fill="lightBlack"
//                 size={22}
//               />
//               <p className="text-sm ms-1">{addLabel}</p>
//             </div>
//           </Button>
//         )}

//         {(path === "/view-bonds") && (
//           <div className="text-center border-[0.8px] p-2 border-mainGreen text-mainGreen rounded-md font-bold">
//             <p className="font-bold ms-1 mb-4">{t("Branch current")}</p>
//             <div className="flex justify-between items-center px-4 ">
//                 <p>{viewCountReyal ? viewCountReyal : `0 ${t("ryal")}` }</p>
//                 <p>{viewCountGram ? viewCountGram : `0 ${t("gram")}`}</p>
//             </div>
//           </div>
//         )}

//         {viewLabel && (
//           <Button
//             bordered={true}
//             className={`
//               px-2
//               border-[0.7px]
//               forStyle
//                 ? "!bg-green !bg-opacity-20	 !text-mainGreen"
//                 : "!bg-mainOrange !bg-opacity-20"
//             `}
//             action={viewHandler}
//           >
//             <div className="flex justify-center items-center">
//               <BiShowAlt size={22} />
//               <p className="text-sm ms-1">{viewLabel}</p>
//             </div>
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// ######################################################################

// /////////// IMPORTS
// import { BiShowAlt } from "react-icons/bi";
// import { IoMdAdd } from "react-icons/io";
// import { Button } from "../../atoms";
// import { t } from "i18next";
// import { useLocation } from "react-router-dom";
// ///
// //import classes from './SystemCard.module.css'
// ///
// /////////// Types

// ///
// type SystemCardProps_TP = {
//   addHandler: () => void;
//   viewHandler?: () => void;
//   addLabel?: string;
//   viewLabel?: string;
//   title: string;
//   forStyle?: boolean;
//   viewCountReyal?: number;
//   viewCountGram?: number;
//   permission: any;
// };
// /////////// HELPER VARIABLES & FUNCTIONS
// ///

// ///
// export const SystemCard = ({
//   addHandler,
//   viewHandler,
//   addLabel,
//   viewLabel,
//   title,
//   forStyle,
//   viewCountReyal,
//   viewCountGram,
//   permission,
// }: SystemCardProps_TP) => {
//   /////////// VARIABLES
//   ///
//   ///
//   /////////// CUSTOM HOOKS
//   ///

//   // Show All Items
//   const index = permission?.filter((item) => 
//     item.routes.includes("index")
//   );

//   const store = permission?.filter((item) => 
//     item.routes.includes("store")
//   );

//   const location = useLocation();
//   const path = location.pathname;
//   ///
//   /////////// STATES
//   ///

//   ///
//   /////////// SIDE EFFECTS
//   ///

//   ///
//   /////////// IF CASES
//   ///

//   ///
//   /////////// FUNCTIONS & EVENTS
//   ///

//   ///
//   return (
//     <div className="col-span-1 w-full rounded-md ">
//       <div className="">
//         <div
//           className={`flex w-full items-center justify-between gap-2 rounded-lg  py-6 px-4 text-white ${
//             forStyle ? "flex-col bg-mainGreen" : "bg-mainOrange"
//           }`}
//         >
//           <div className="flex w-full items-center justify-between">
//             <h3 className="">{title}</h3>
//             <div className="flex items-center gap-1">
//               {addLabel && store?.length !== 0 && addHandler && (
//                 <Button
//                   bordered={true}
//                   action={addHandler}
//                   className="border-0 p-1 bg-transparent"
//                 >
//                   <div className="flex justify-center items-center">
//                     <IoMdAdd
//                       className="fill-white"
//                       fill="lightBlack"
//                       size={25}
//                     />
//                   </div>
//                 </Button>
//               )}

//               {viewLabel && index?.length !== 0 && (
//                 <Button
//                   bordered={true}
//                   className={`
//                     border-0 
//                      p-1
//                     bg-transparent
//                     forStyle
//                       ? "!bg-green !bg-opacity-20	!text-mainGreen"
//                       : "!bg-mainOrange !bg-opacity-20"
//                   `}
//                   action={viewHandler}
//                 >
//                   <div className="flex justify-center items-center">
//                     <BiShowAlt className="fill-white" size={25} />
//                   </div>
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {path === "/view-bonds" && (
//           <div className="text-center border-[0.8px] p-2 border-mainGreen text-mainGreen rounded-md font-bold">
//             <p className="font-bold ms-1 mb-4">{t("Branch current")}</p>
//             <div className="flex justify-between items-center px-4 ">
//               <p>{viewCountReyal ? viewCountReyal : `0 ${t("ryal")}`}</p>
//               <p>{viewCountGram ? viewCountGram : `0 ${t("gram")}`}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// ######################################################################


/////////// IMPORTS
import { BiShowAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { Button } from "../../atoms";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
///
//import classes from './SystemCard.module.css'
///
/////////// Types

///
type SystemCardProps_TP = {
  addHandler: () => void;
  viewHandler?: () => void;
  addLabel?: string;
  viewLabel?: string;
  title: string;
  forStyle?: boolean;
  viewCountReyal?: number;
  viewCountGram?: number;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SystemCard = ({
  addHandler,
  viewHandler,
  addLabel,
  viewLabel,
  title,
  forStyle,
  viewCountReyal,
  viewCountGram,
}: SystemCardProps_TP) => {
  /////////// VARIABLES
  ///
  ///
  /////////// CUSTOM HOOKS
  ///

  const location = useLocation();
  const path = location.pathname;
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <div className="col-span-1 w-full rounded-md ">
      <div className="">
        <div
          className={`flex w-full items-center justify-between gap-2 rounded-lg  py-6 px-4 text-white ${
            forStyle ? "flex-col bg-mainGreen" : "bg-mainOrange"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <h3 className="">{title}</h3>
            <div className="flex items-center gap-1">
              {addLabel && addHandler && (
                <Button
                  bordered={true}
                  action={addHandler}
                  className="border-0 p-1 bg-transparent"
                >
                  <div className="flex justify-center items-center">
                    <IoMdAdd
                      className="fill-white"
                      fill="lightBlack"
                      size={25}
                    />
                  </div>
                </Button>
              )}

              {viewLabel && (
                <Button
                  bordered={true}
                  className={`
                    border-0 
                     p-1
                    bg-transparent
                    forStyle
                      ? "!bg-green !bg-opacity-20	!text-mainGreen"
                      : "!bg-mainOrange !bg-opacity-20"
                  `}
                  action={viewHandler}
                >
                  <div className="flex justify-center items-center">
                    <BiShowAlt className="fill-white" size={25} />
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>

        {path === "/view-bonds" && (
          <div className="text-center border-[0.8px] p-2 border-mainGreen text-mainGreen rounded-md font-bold">
            <p className="font-bold ms-1 mb-4">{t("Branch current")}</p>
            <div className="flex justify-between items-center px-4 ">
              <p>{viewCountReyal ? viewCountReyal : `0 ${t("ryal")}`}</p>
              <p>{viewCountGram ? viewCountGram : `0 ${t("gram")}`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
