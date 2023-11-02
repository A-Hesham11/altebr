import { Link } from "react-router-dom";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { useIsRTL } from "../../hooks";
import { Back } from "../../utils/utils-components/Back";
import { FaCubes } from "react-icons/fa";
import { t } from "i18next";
import { useContext } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";

const Honest = () => {
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "أمانة جديدة",
      title_en: "new honest ",
      route: "/selling/honesty/new-honest",
      underCardInfo: (
        <Link
          to="/selling/honesty/all-honest"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">
            {t("create honest bond restrictions")}
          </p>
        </Link>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "استعادة الأمانة",
      title_en: "return honest",
      route: "/selling/honesty/return-honest",
      underCardInfo: (
        <div className="flex flex-col relative top-12 gap-y-2">
          <Link
            to={`/selling/honesty/all-return-honest`}
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">
              {t("retrieve honest bond restrictions")}
            </p>
          </Link>

          <Link
            to={`/selling/honesty/all-retrieval-restrictions`}
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("deposit return bonds")}</p>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="min_selling-height h-screen flex flex-col md:gap-16 gap-4 management justify-center items-center relative">
        <div className="animate_from_right p-8 absolute top-0 left-5">
          <Back />
        </div>
        <div className="text-4xl font-bold text-white mb-6">{t("honest")}</div>
        <div className="flex gap-20">
          {data.map((item) => (
            <SellingSubCard
              icon={item.icon}
              title={isRTL ? item.title_ar : item.title_en}
              route={item.route}
              key={crypto.randomUUID()}
              underCardInfo={item.underCardInfo}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Honest;
