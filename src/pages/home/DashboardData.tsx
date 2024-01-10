/////////// IMPORTS
///
//import classes from './Home.module.css'
import { BiCodeBlock } from "react-icons/bi";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import GoldDashboard from "./GoldDashboard";
import { GiBigDiamondRing, GiGems } from "react-icons/gi";
import { ReactNode, useState } from "react";
import { useFetch } from "../../hooks";
import DiamondDashboard from "./DiamondDashboard";
import AccessoriesDashboard from "./AccessoriesDashboard";
import { AiOutlineGold } from "react-icons/ai";
import { IoDiamondOutline } from "react-icons/io5";
import { Loading } from "../../components/organisms/Loading";
import goldBond from "../../assets/gold-bond.png";
import goldCoding from "../../assets/gold-coding.png";
import diamondBond from "../../assets/diamond-bond.png";
import diamondCoding from "../../assets/diamond-coding.png";
import accessoryBond from "../../assets/accessory-bond.png";
import accessoryCoding from "../../assets/accessory-coding.png";

type Card_TP = {
  id: string;
  title: string;
  image: string;
  icon: ReactNode;
  textBondNumber: string;
  bondNumber: any;
  showLink?: string;
  addLink?: string;
  viewHandler?: () => void;
  addHandler?: () => void;
};

type GoldSanad_TP = {
  id: string;
  total: any;
  data: any;
};

export const DashboardData = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  {
    /* Bond */
  }
  const [bondGoldTotal, setBondGoldTotal] = useState<GoldSanad_TP[]>();
  const [bondDiamondTotal, setBondDiamondTotal] = useState<GoldSanad_TP[]>();
  const [bondAccessoriesTotal, setBondAccessoriesTotal] =
    useState<GoldSanad_TP[]>();
  {
    /* Coding */
  }
  const [codingGoldTotal, setCodingGoldTotal] = useState<GoldSanad_TP[]>();
  const [codingDiamondTotal, setCodingDiamondTotal] =
    useState<GoldSanad_TP[]>();
  const [codingAccessoryTotal, setCodingAccessoryTotal] =
    useState<GoldSanad_TP[]>();

  {
    /* Gold bond */
  }
  const { data: codingGoldData, isLoading: codingGoldIsLoading } =
    useFetch<GoldSanad_TP>({
      endpoint: `tarqimGold/api/v1/open-bonds?page=${page}`,
      queryKey: ["goldCodingSanads"],
      pagination: true,
      onSuccess: (data) => {
        setBondGoldTotal(data.total);
      },
    });

  {
    /* Diamond Bond */
  }
  const { data: supplyDiamondData, isLoading: supplyDiamondIsLoading } =
    useFetch<GoldSanad_TP>({
      endpoint: `twredDiamond/api/v1/diamondBonds?page=${page}`,
      queryKey: ["diamond-bonds"],
      pagination: true,
      onSuccess: (data) => {
        setBondDiamondTotal(data.total);
      },
    });

  {
    /* Accessory Bond */
  }
  const { data: supplAccessoryData, isLoading: supplyAccessoryIsLoading } =
    useFetch<GoldSanad_TP>({
      endpoint: `/tarqimAccessory/api/v1/open-bonds?page=${page}`,
      queryKey: ["accessory-bonds"],
      pagination: true,
      onSuccess: (data) => {
        setBondAccessoriesTotal(data.total);
      },
    });

  {
    /* Coding */
  }

  const { data: codingData, isLoading: codingIsLoading } =
    useFetch<GoldSanad_TP>({
      endpoint: `tarqimAccessory/api/v1/counts?page=${page}`,
      queryKey: ["counts"],
      pagination: true,
      onSuccess: (data) => {
        setCodingGoldTotal(data.data.contBondGold);
        setCodingDiamondTotal(data.data.contBondDiamond);
        setCodingAccessoryTotal(data.data.contBondAccessory);
      },
    });

  {
    /* Glod Data of Bond And Coding */
  }
  const goldCards: Card_TP[] = [
    {
      id: crypto.randomUUID(),
      image: goldBond,
      icon: <GiGems className="text-white w-6 h-6" />,
      title: t("supply"),
      textBondNumber: t("number bonds"),
      bondNumber: bondGoldTotal,
      viewHandler: () => navigate("/gold-bonds"),
      addHandler: () => navigate("/bonds/gold"),
    },
    {
      id: crypto.randomUUID(),
      image: goldCoding,
      icon: <BiCodeBlock className="text-white w-6 h-6" />,
      title: t("coding"),
      textBondNumber: t("number bonds"),
      bondNumber: codingGoldTotal,
      viewHandler: () => navigate("/coding"),
      addHandler: () => navigate("/coding/gold"),
    },
  ];

  {
    /* Diamond Data of Bond And Coding */
  }
  const diamondCards: Card_TP[] = [
    {
      id: crypto.randomUUID(),
      image: diamondBond,
      icon: <GiGems className="text-white w-6 h-6" />,
      title: t("supply"),
      textBondNumber: t("number bonds"),
      bondNumber: bondDiamondTotal,
      viewHandler: () => navigate("/diamond-bonds"),
      addHandler: () => navigate("/bonds/diamond"),
    },
    {
      id: crypto.randomUUID(),
      image: diamondCoding,
      icon: <BiCodeBlock className="text-white w-6 h-6" />,
      title: t("coding"),
      textBondNumber: t("number bonds"),
      bondNumber: codingDiamondTotal,
      viewHandler: () => navigate("/coding"),
      addHandler: () => navigate("/coding/diamond"),
    },
  ];

  {
    /* Accessory Data of Bond And Coding */
  }
  const accessoriesCards: Card_TP[] = [
    {
      id: crypto.randomUUID(),
      image: accessoryBond,
      icon: <GiGems className="text-white w-6 h-6" />,
      title: t("supply"),
      textBondNumber: t("number bonds"),
      bondNumber: bondAccessoriesTotal,
      viewHandler: () => navigate("/accessory-bonds"),
      addHandler: () => navigate("/bonds/accessories"),
    },
    {
      id: crypto.randomUUID(),
      image: accessoryCoding,
      icon: <BiCodeBlock className="text-white w-6 h-6" />,
      title: t("coding"),
      textBondNumber: t("number bonds"),
      bondNumber: codingAccessoryTotal,
      viewHandler: () => navigate("/coding"),
      addHandler: () => navigate("/coding/accessories"),
    },
  ];

  return (
    <>
      <div>
        {codingGoldIsLoading &&
          supplyDiamondIsLoading &&
          supplyAccessoryIsLoading 
            ? (
              <Loading mainTitle="تحميل السند" />
            )
            : (
              <>
              <div>
                <div className="flex items-center gap-2 bg-mainGreen text-white p-2">
                  <AiOutlineGold className="w-6 h-6" />
                  <h2>{t("gold")}</h2>
                </div>
                <div className="flex items-center gap-10 my-3">
                  {goldCards.map(
                    ({
                      id,
                      title,
                      image,
                      icon,
                      textBondNumber,
                      bondNumber,
                      viewHandler,
                      addHandler,
                    }) => {
                      return (
                        <GoldDashboard
                          key={id}
                          image={image}
                          title={title}
                          icon={icon}
                          textBondNumber={textBondNumber}
                          bondNumber={bondNumber}
                          viewHandler={viewHandler}
                          addHandler={addHandler}
                        />
                      );
                    }
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 bg-mainGreen text-white p-2">
                  <IoDiamondOutline className="w-6 h-6" />
                  <h2>{t("diamond")}</h2>
                </div>
                <div className="flex items-center gap-10 my-3">
                  {diamondCards.map(
                    ({
                      id,
                      title,
                      image,
                      icon,
                      textBondNumber,
                      bondNumber,
                      viewHandler,
                      addHandler,
                    }) => {
                      return (
                        <DiamondDashboard
                          key={id}
                          image={image}
                          title={title}
                          icon={icon}
                          textBondNumber={textBondNumber}
                          bondNumber={bondNumber}
                          viewHandler={viewHandler}
                          addHandler={addHandler}
                        />
                      );
                    }
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 bg-mainGreen text-white p-2">
                  <GiBigDiamondRing className="w-6 h-6" />
                  <h2>{t("accessories")}</h2>
                </div>
                <div className="flex items-center gap-10 my-3">
                  {accessoriesCards.map(
                    ({
                      id,
                      title,
                      image,
                      icon,
                      textBondNumber,
                      bondNumber,
                      viewHandler,
                      addHandler,
                    }) => {
                      return (
                        <AccessoriesDashboard
                          key={id}
                          image={image}
                          title={title}
                          icon={icon}
                          textBondNumber={textBondNumber}
                          bondNumber={bondNumber}
                          viewHandler={viewHandler}
                          addHandler={addHandler}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </>
            )
        }
      </div>
    </>
  );
};

// /////////// IMPORTS
// ///
// //import classes from './Home.module.css'
// import { Form, Formik } from "formik";
// import { Helmet } from "react-helmet-async";
// import * as Yup from "yup";
// import { Button } from "../../components/atoms/buttons/Button";
// import { BiCodeBlock, BiSearchAlt } from "react-icons/bi";
// import { DateInputField } from "../../components/molecules";
// import { t } from "i18next";
// import { BoxesDataBase } from "../../components/atoms/card/BoxesDataBase";
// import { useNavigate } from "react-router-dom";
// import GoldDashboard from "./GoldDashboard";
// import { GiBigDiamondRing, GiGems } from "react-icons/gi";
// import { ReactNode, useState } from "react";
// import { useFetch } from "../../hooks";
// import DiamondDashboard from "./DiamondDashboard";
// import AccessoriesDashboard from "./AccessoriesDashboard";
// import { AiOutlineGold } from "react-icons/ai";
// import { IoDiamondOutline } from "react-icons/io5";
// import { Loading } from "../../components/organisms/Loading";

// type Card_TP = {
//   id: string;
//   title: string;
//   image: string;
//   icon: ReactNode;
//   textBondNumber: string;
//   bondNumber: any;
//   showLink?: string;
//   addLink?: string;
//   viewHandler?: () => void;
//   addHandler?: () => void;
// };

// type GoldSanad_TP = {
//   id: string;
//   total: any;
//   data: any;
// };

// export const DashboardData = () => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState<number>(1);
//   {
//     /* Bond */
//   }
//   const [bondGoldTotal, setBondGoldTotal] = useState<GoldSanad_TP[]>();
//   const [bondDiamondTotal, setBondDiamondTotal] = useState<GoldSanad_TP[]>();
//   const [bondAccessoriesTotal, setBondAccessoriesTotal] =
//     useState<GoldSanad_TP[]>();
//   {
//     /* Coding */
//   }
//   const [codingGoldTotal, setCodingGoldTotal] = useState<GoldSanad_TP[]>();
//   const [codingDiamondTotal, setCodingDiamondTotal] =
//     useState<GoldSanad_TP[]>();
//   const [codingAccessoryTotal, setCodingAccessoryTotal] =
//     useState<GoldSanad_TP[]>();

//   {
//     /* Gold bond */
//   }
//   const { data: codingGoldData, isLoading: codingGoldIsLoading } =
//     useFetch<GoldSanad_TP>({
//       endpoint: `tarqimGold/api/v1/open-bonds?page=${page}`,
//       queryKey: ["goldCodingSanads"],
//       pagination: true,
//       onSuccess: (data) => {
//         setBondGoldTotal(data.total);
//       },
//     });

//   {
//     /* Diamond Bond */
//   }
//   const { data: supplyDiamondData, isLoading: supplyDiamondIsLoading } =
//     useFetch<GoldSanad_TP>({
//       endpoint: `twredDiamond/api/v1/diamondBonds?page=${page}`,
//       queryKey: ["diamond-bonds"],
//       pagination: true,
//       onSuccess: (data) => {
//         setBondDiamondTotal(data.total);
//       },
//     });

//   {
//     /* Accessory Bond */
//   }
//   const { data: supplAccessoryData, isLoading: supplyAccessoryIsLoading } =
//     useFetch<GoldSanad_TP>({
//       endpoint: `/tarqimAccessory/api/v1/open-bonds?page=${page}`,
//       queryKey: ["accessory-bonds"],
//       pagination: true,
//       onSuccess: (data) => {
//         setBondAccessoriesTotal(data.total);
//       },
//     });

//   {
//     /* Coding */
//   }

//   const { data: codingData, isLoading: codingIsLoading } =
//     useFetch<GoldSanad_TP>({
//       endpoint: `tarqimAccessory/api/v1/counts?page=${page}`,
//       queryKey: ["counts"],
//       pagination: true,
//       onSuccess: (data) => {
//         setCodingGoldTotal(data.data.contBondGold);
//         setCodingDiamondTotal(data.data.contBondDiamond);
//         setCodingAccessoryTotal(data.data.contBondAccessory);
//       },
//     });

//   {
//     /* Glod Data of Bond And Coding */
//   }
//   const goldCards: Card_TP[] = [
//     {
//       id: crypto.randomUUID(),
//       image: "/assets/gold-bond.png",
//       icon: <GiGems className="text-white w-6 h-6" />,
//       title: t("supply"),
//       textBondNumber: t("number bonds"),
//       bondNumber: bondGoldTotal,

//       viewHandler: () => navigate("/gold-bonds"),
//       addHandler: () => navigate("/bonds/gold"),
//     },
//     {
//       id: crypto.randomUUID(),
//       image: "/assets/gold-coding.png",
//       icon: <BiCodeBlock className="text-white w-6 h-6" />,
//       title: t("coding"),
//       textBondNumber: t("number bonds"),
//       bondNumber: codingGoldTotal,
//       viewHandler: () => navigate("/coding"),
//       addHandler: () => navigate("/coding/gold"),
//     },
//   ];

//   {
//     /* Diamond Data of Bond And Coding */
//   }
//   const diamondCards: Card_TP[] = [
//     {
//       id: crypto.randomUUID(),
//       image: "/assets/diamond-bond.png",
//       icon: <GiGems className="text-white w-6 h-6" />,
//       title: t("supply"),
//       textBondNumber: t("number bonds"),
//       bondNumber: bondDiamondTotal,
//       viewHandler: () => navigate("/diamond-bonds"),
//       addHandler: () => navigate("/bonds/diamond"),
//     },
//     {
//       id: crypto.randomUUID(),
//       image: "/assets/diamond-coding.png",
//       icon: <BiCodeBlock className="text-white w-6 h-6" />,
//       title: t("coding"),
//       textBondNumber: t("number bonds"),
//       bondNumber: codingDiamondTotal,
//       viewHandler: () => navigate("/coding"),
//       addHandler: () => navigate("/coding/diamond"),
//     },
//   ];

//   {
//     /* Accessory Data of Bond And Coding */
//   }
//   const accessoriesCards: Card_TP[] = [
//     {
//       id: crypto.randomUUID(),
//       image: "/assets/accessory-bond.png",
//       icon: <GiGems className="text-white w-6 h-6" />,
//       title: t("supply"),
//       textBondNumber: t("number bonds"),
//       bondNumber: bondAccessoriesTotal,
//       viewHandler: () => navigate("/accessory-bonds"),
//       addHandler: () => navigate("/bonds/accessories"),
//     },
//     {
//       id: crypto.randomUUID(),
//       image: "/assets/accessory-coding.png",
//       icon: <BiCodeBlock className="text-white w-6 h-6" />,
//       title: t("coding"),
//       textBondNumber: t("number bonds"),
//       bondNumber: codingAccessoryTotal,
//       viewHandler: () => navigate("/coding"),
//       addHandler: () => navigate("/coding/accessories"),
//     },
//   ];

//   return (
//     <>
//       <div>
//         {codingGoldIsLoading &&
//           supplyDiamondIsLoading &&
//           supplyAccessoryIsLoading
//             ? (<Loading mainTitle="تحميل السند" />)
//             : (
//               <>
//                 <div>
//                   <div className="flex items-center gap-2 bg-mainGreen text-white p-2">
//                     <AiOutlineGold className="w-6 h-6" />
//                     <h2>{t("gold")}</h2>
//                   </div>
//                   <div className="flex items-center gap-10 my-3">
//                     {goldCards.map(
//                       ({
//                         id,
//                         title,
//                         image,
//                         icon,
//                         textBondNumber,
//                         bondNumber,
//                         viewHandler,
//                         addHandler,
//                       }) => {
//                         return (
//                           <GoldDashboard
//                             key={id}
//                             image={image}
//                             title={title}
//                             icon={icon}
//                             textBondNumber={textBondNumber}
//                             bondNumber={bondNumber}
//                             viewHandler={viewHandler}
//                             addHandler={addHandler}
//                           />
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2 bg-mainGreen text-white p-2">
//                     <IoDiamondOutline className="w-6 h-6" />
//                     <h2>{t("diamond")}</h2>
//                   </div>
//                   <div className="flex items-center gap-10 my-3">
//                     {diamondCards.map(
//                       ({
//                         id,
//                         title,
//                         image,
//                         icon,
//                         textBondNumber,
//                         bondNumber,
//                         viewHandler,
//                         addHandler,
//                       }) => {
//                         return (
//                           <DiamondDashboard
//                             key={id}
//                             image={image}
//                             title={title}
//                             icon={icon}
//                             textBondNumber={textBondNumber}
//                             bondNumber={bondNumber}
//                             viewHandler={viewHandler}
//                             addHandler={addHandler}
//                           />
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2 bg-mainGreen text-white p-2">
//                     <GiBigDiamondRing className="w-6 h-6" />
//                     <h2>{t("accessories")}</h2>
//                   </div>
//                   <div className="flex items-center gap-10 my-3">
//                     {accessoriesCards.map(
//                       ({
//                         id,
//                         title,
//                         image,
//                         icon,
//                         textBondNumber,
//                         bondNumber,
//                         viewHandler,
//                         addHandler,
//                       }) => {
//                         return (
//                           <AccessoriesDashboard
//                             key={id}
//                             image={image}
//                             title={title}
//                             icon={icon}
//                             textBondNumber={textBondNumber}
//                             bondNumber={bondNumber}
//                             viewHandler={viewHandler}
//                             addHandler={addHandler}
//                           />
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>
//               </>
//             )
//         }
//       </div>
//
//     </>
//   );
// };
