import { Link } from "react-router-dom";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { useIsRTL } from "../../hooks";
import { Back } from "../../utils/utils-components/Back";
import { FaCubes } from "react-icons/fa";
import { t } from "i18next";

const Reports = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "كشف الحسابات",
      title_en: "stocks",
      route: "/selling/reports/stocks",
      underCardInfo: (
        <Link
          to="/tax-reports"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("tax reports")}</p>
        </Link>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "قيود",
      title_en: "bonds",
      route: "/selling/reports/bonds",
    },
    {
      icon: receiveitem,
      title_ar: "الشجرة المحاسبية",
      title_en: "accounting tree",
      route: "/selling/reports/accounting-tree",
    },
  ];
  return (
    <div className="flex md:gap-16 gap-4 management h-screen justify-center items-center relative">
      <div className="p-8 absolute top-0 left-5">
        <Back />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-5">
        {data.map((item) => (
          <div key={crypto.randomUUID()}>
            <SellingSubCard
              icon={item.icon}
              title={isRTL ? item.title_ar : item.title_en}
              route={item.route}
              key={crypto.randomUUID()}
              underCardInfo={item.underCardInfo}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
