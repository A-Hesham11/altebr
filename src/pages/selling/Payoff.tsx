import { Link } from "react-router-dom";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { useIsRTL } from "../../hooks";
import { Back } from "../../utils/utils-components/Back";
import { FaCubes } from "react-icons/fa";
import { t } from "i18next";
const Payoff = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "مردود البيع",
      title_en: "selling payoff",
      route: "/selling/payoff/sales-return",
      underCardInfo: (
        <div className="flex flex-col relative top-12 gap-y-2">
          <Link
            to="/selling/return-entry"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("Sales return restrictions")}</p>
          </Link>
          <Link
            to="/selling/payoff/salesReturnReports"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("Sales Return Reports")}</p>
          </Link>
        </div>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "مردود االشراء",
      title_en: "buying payoff",
      route: "/selling/payoff/",
    },
    {
      icon: receiveitem,
      title_ar: "مردود التوريد",
      title_en: "supplying payoff",
      route: "/selling/payoff/supply-payoff",
      underCardInfo: (
        <Link
          to="/selling/supplyReturn"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("Supply yield restrictions")}</p>
        </Link>
      ),
    },
    // {
    //   icon: receiveitem,
    //   title_ar: "مردود التوريد (هدر)",
    //   title_en: "Supply return (waste)",
    //   route: "/selling/payoff/wasteReturn",
    //   underCardInfo: (
    //     <Link
    //       to="/selling/wasteReturn"
    //       className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
    //     >
    //       <FaCubes className="text-mainGreen" size={25} />
    //       <p className="text-mainGreen">{t("Supply yield constraints (waste)")}</p>
    //     </Link>
    //   ),
    // },
  ];
  return (
    <>
      <div className="flex md:gap-8 gap-4 management h-screen justify-center items-center relative">
        <div className="p-8 absolute top-0 left-5">
          <Back />
        </div>
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
    </>
  );
};

export default Payoff;
