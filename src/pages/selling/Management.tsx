import receiveMoney from "../../assets/recieveMoney.svg";
import receiveitem from "../../assets/receiveItems.svg";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { useIsRTL } from "../../hooks";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { FaCubes } from "react-icons/fa";
import { Back } from "../../utils/utils-components/Back";
const Management = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "استلام نقدية",
      title_en: "receive money",
      route: "/selling/management/receive-money",
      underCardInfo: (
        <Link
          to="/selling/recentBonds"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("recent bonds")}</p>
        </Link>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "استلام القطع",
      title_en: "receive items",
      // route: "/selling/management/receive-items",
      route: "/",
      underCardInfo: (
        <Link
          to="/selling/sortPieces"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("sort pieces")}</p>
        </Link>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "تعديل وزن القطع",
      title_en: "edit items weight",
      route: "/selling/management/edit-items-weight",
      underCardInfo: (
        <Link
          to="/selling/branch-identity"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("branch identity management")}</p>
        </Link>
      ),
    },
  ];
  return (
    <div className="bg-mainGreen h-screen min_selling-height">
      <div className="flex animate_from_right justify-end px-8 pt-4">
        <Back />
      </div>
      <div className="flex flex-col gap-16 management h-screen min_selling-height justify-center    items-center pb-28">
        <p className="text-4xl font-bold text-white">{t("management")}</p>
        <div className="flex lg:gap-16 gap-6 management justify-center items-center">
          {data.map((item) => (
            <SellingSubCard
              data={data}
              icon={item.icon}
              title={isRTL ? item.title_ar : item.title_en}
              route={item.route}
              key={crypto.randomUUID()}
              underCardInfo={item.underCardInfo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Management;
