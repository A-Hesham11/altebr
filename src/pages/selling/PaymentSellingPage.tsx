import { useIsRTL } from "../../hooks";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { Back } from "../../utils/utils-components/Back";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import { Link } from "react-router-dom";
import { FaCubes } from "react-icons/fa";
import { t } from "i18next";
import { useContext } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";

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

  bond_date: any;
  invoice_id: any;
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

const PaymentSellingPage = () => {
  const isRTL = useIsRTL();
  const { userData } = useContext(authCtx);
  const isDisabled = userData?.is_sellingInvoice === 1;

  const data = [
    {
      icon: receiveMoney,
      title_ar: "إنشاء فاتورة",
      title_en: "add selling",
      route: isDisabled ? "/selling/addInvoiceDemo" : "/selling/addInvoice/",
      underCardInfo: isDisabled ? (
        <div className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray cursor-not-allowed relative overflow-hidden">
          <div className="bg-[#00000040] absolute top-0 left-0 w-full h-full"></div>
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("invoice restrictions")}</p>
        </div>
      ) : (
        <Link
          to="/selling/invoice-restrictions"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("invoice restrictions")}</p>
        </Link>
      ),
    },
    {
      icon: receiveitem,
      title_ar: "عرض الفاتورة",
      title_en: "view selling",
      route: isDisabled ? "/selling/viewInvoice_Demo" : "/selling/viewInvoice",
      underCardInfo: isDisabled ? (
        <div className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray cursor-not-allowed relative overflow-hidden">
          <div className="bg-[#00000040] absolute top-0 left-0 w-full h-full"></div>
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("Sales Reports")}</p>
        </div>
      ) : (
        <div className="flex flex-col relative top-12 gap-y-2">
          <Link
            to="/selling/salesReports"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("Sales Reports")}</p>
          </Link>
          <Link
            to="/selling/taxReturn"
            className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
          >
            <FaCubes className="text-mainGreen" size={25} />
            <p className="text-mainGreen">{t("tax return")}</p>
          </Link>
        </div>
      ),
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

export default PaymentSellingPage;
