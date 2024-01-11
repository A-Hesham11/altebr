import { useIsRTL } from "../../hooks";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import { Link } from "react-router-dom";
import { FaCubes } from "react-icons/fa";
import { t } from "i18next";
import { Back } from "../../utils/utils-components/Back";
import SellingSubCard from "../../components/selling/SellingSubCard";

const Expenses = () => {
  const isRTL = useIsRTL();

  const data = [
    {
      icon: receiveMoney,
      title_ar: "فاتورة المصروف",
      title_en: "expenses invoice",
      route: "/expenses/expensesInvoice",
      underCardInfo: (
        <Link
          to="/expenses/expensesBonds/"
          className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
        >
          <FaCubes className="text-mainGreen" size={25} />
          <p className="text-mainGreen">{t("expenses bonds")}</p>
        </Link>
      ),
      // underCardInfo: (
      //   <Link
      //     to="/buying/invoice-restrictions"
      //     className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
      //   >
      //     <FaCubes className="text-mainGreen" size={25} />
      //     <p className="text-mainGreen">{t("invoice restrictions")}</p>
      //   </Link>
      // ),
    },
    //   {
    //     icon: receiveitem,
    //     title_ar: "تعديل الوزن",
    //     title_en: "weight adjustment",
    //     route: "/buying/weightAdjustment/",
    //     underCardInfo: (
    //       <Link
    //         to="/buying/weightAdjustmentBonds/"
    //         className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray"
    //       >
    //         <FaCubes className="text-mainGreen" size={25} />
    //         <p className="text-mainGreen">{t("wegith adjustment bonds")}</p>
    //       </Link>
    //     ),
    //   },
  ];

  return (
    <div className="flex md:gap-16 gap-4 management h-screen justify-center items-center relative">
      <div className="p-8 absolute top-0 left-5">
        <Back />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-5">
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
    </div>
  );
};

export default Expenses;
