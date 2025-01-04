import { Link } from "react-router-dom";
import receiveitem from "../../../assets/receiveItems.svg";
import receiveMoney from "../../../assets/recieveMoney.svg";
import { t } from "i18next";
import SellingSubCard from "../../../components/selling/SellingSubCard";
import { Back } from "../../../utils/utils-components/Back";
import { useIsRTL } from "../../../hooks";

const Inventory = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveitem,
      title_ar: "معلومات القطعه",
      title_en: "item information",
      route: "/selling/item-information",
    },
    {
      icon: receiveitem,
      title_ar: "انشاء سند جرد",
      title_en: "Creating an inventory document",
      route: "/selling/inventory/view",
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
