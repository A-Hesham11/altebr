import SellingSubCard from "../../components/selling/SellingSubCard";
import { useIsRTL } from "../../hooks";
import { Back } from "../../utils/utils-components/Back";
import receiveitem from "../../assets/receiveItems.svg";
import receiveMoney from "../../assets/recieveMoney.svg";
export const NeighborsPage = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveMoney,
      title_ar: "اعارة",
      title_en: "loaning",
      route: "/selling/neighbors/loaning",
    },
    {
      icon: receiveitem,
      title_ar: "استرداد",
      title_en: "recover",
      route: "/selling/neighbors/recover",
    },
    {
      icon: receiveitem,
      title_ar: "بيانات الجيران",
      title_en: "neighbors data",
      route: "/selling/neighbors/neighbors-data",
    },
    {
      icon: receiveitem,
      title_ar: "تسديد",
      title_en: "payment",
      route: "/selling/neighbors/payment",
    },
  ];
  return (
    <>
      <div className="flex justify-center items-center management h-screen relative">
        <div className="p-8 absolute top-0 left-5">
          <Back />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-5">
          {data.map((item) => (
            <div className="w-1/3" key={crypto.randomUUID()}>
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
    </>
  );
};
