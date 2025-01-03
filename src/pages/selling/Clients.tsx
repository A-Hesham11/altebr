import { t } from "i18next";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
import SellingSubCard from "../../components/selling/SellingSubCard";
import { useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useContext } from "react";

const Clients = () => {
  const { userData } = useContext(authCtx);
  const isDisabled = userData?.is_sellingInvoice === 1;

  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "حجز قطعة",
      title_en: "reserve piece",
      route: "/selling/reservePiece",
      isDisabled: isDisabled,
    },
    {
      icon: receiveitem,
      title_ar: "بيانات العملاء",
      title_en: "clients data",
      route: "/selling/customersData",
    },
  ];
  return (
    <>
      <div className="bg-mainGreen h-screen">
        <div className="flex flex-col gap-16 management h-screen justify-center items-center pb-28">
          <p className="text-4xl font-bold text-white">{t("clients")}</p>
          <div className="flex lg:gap-16 gap-6 management justify-center items-center">
            {data.map((item) => (
              <SellingSubCard
                data={data}
                icon={item.icon}
                title={isRTL ? item.title_ar : item.title_en}
                route={item.route}
                key={crypto.randomUUID()}
                isDisabled={item.isDisabled}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clients;
