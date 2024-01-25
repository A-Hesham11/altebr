import { GiReceiveMoney } from "react-icons/gi";
import { useIsRTL } from "../../hooks";
import receiveitem from "../../assets/receiveItems.svg";
import { Back } from "../../utils/utils-components/Back";
import SellingSubCard from "../../components/selling/SellingSubCard";

const ContinuityPage = () => {
  const isRTL = useIsRTL();
  const data = [
    {
      icon: receiveitem,
      title_ar: "الحضور والانصراف",
      title_en: "Attendance and Departure",
      route: "/selling/continuity/AttendanceDeparture",
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

export default ContinuityPage;