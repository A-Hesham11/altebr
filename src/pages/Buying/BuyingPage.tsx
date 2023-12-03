import { ClientData_TP } from "../../components/selling/SellingClientForm";
import * as Yup from "yup";
import { useIsRTL } from "../../hooks";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { Back } from "../../utils/utils-components/Back";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import { Link } from "react-router-dom";
import { FaCubes } from "react-icons/fa";
import { t } from "i18next";

export type Selling_TP = {
  item_id: string;
  hwya: string;
  classification_id: string;
  category_id: string;
  remaining_id: string;
  weight: string;
  cost: string;
  karat_id: string;
  selling_price: string;
  wage_total: string;
  wage: string;
  taklfa: string;

  bond_date: string;
  client_id: string;
  client_name: string;
  client_value: string;
};

export type ClientData_TP = {
  bond_date: string;
  client_id: string;
  client_name: string;
  client_value: string;
};

const BuyingPage = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "فاتورة الشراء",
      title_en: "purchase invoice",
      route: "/buying/purchaseInvoice/",
      underCardInfo: (
        <Link
          to="/buying/invoice-restrictions"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("invoice restrictions")}</p>
        </Link>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "تعديل الوزن",
      title_en: "weight adjustment",
      route: "/buying/weightAdjustment/",
    },
  ];

  return (
    <>
      <div className="flex md:gap-16 gap-4 management h-screen justify-center items-center relative">
        <div className="p-8 absolute top-0 left-5">
          <Back />
        </div>
        {data.map((item) => (
          <SellingSubCard
            icon={item.icon}
            title={isRTL ? item.title_ar : item.title_en}
            route={item.route}
            underCardInfo={item.underCardInfo}
            key={crypto.randomUUID()}
          />
        ))}
      </div>
    </>
  );
};

export default BuyingPage;
