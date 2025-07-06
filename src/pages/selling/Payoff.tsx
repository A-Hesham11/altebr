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
import DisabledDemo from "../../components/atoms/UI/DisabledDemo";
const Payoff = () => {
  const isRTL = useIsRTL();
  const { userData } = useContext(authCtx);
  const isDisabled = userData?.is_sellingInvoice === 1;

  const data = [
    {
      icon: receiveMoney,
      title_ar: "مردود البيع",
      title_en: "selling payoff",
      route: isDisabled
        ? "/selling/payoff/sales-returnDemo"
        : "/selling/payoff/sales-return",
      underCardInfo: isDisabled ? (
        <div className="flex flex-col relative top-12 gap-y-2">
          {/* <DisabledDemo title="Sales return restrictions" /> */}
          <Link
            to={"/selling/return-entry-demo"}
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("Sales return invoices")}</p>
          </Link>
          <DisabledDemo title="Sales Return Reports" />
        </div>
      ) : (
        <div className="flex flex-col relative top-20 gap-y-2">
          <Link
            to="/selling/return-entry"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("Sales return invoices")}</p>
          </Link>
          <Link
            to="/selling/payoff/salesReturnReports"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("Sales Return Reports")}</p>
          </Link>
          <Link
            to="/selling/payoff/taxReturn"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("tax return")}</p>
          </Link>
        </div>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "مردود االشراء",
      title_en: "buying payoff",
      route: "/selling/payoff/",
      isDisabled: isDisabled,
    },
    {
      icon: receiveitem,
      title_ar: "مردود التوريد",
      title_en: "supplying payoff",
      route: "/selling/payoff/supply-payoff",
      isDisabled: isDisabled,
      underCardInfo: isDisabled ? (
        <DisabledDemo title="Supply yield restrictions" />
      ) : (
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
            isDisabled={item.isDisabled}
            underCardInfo={item.underCardInfo}
          />
        ))}
      </div>
    </>
  );
};

export default Payoff;
