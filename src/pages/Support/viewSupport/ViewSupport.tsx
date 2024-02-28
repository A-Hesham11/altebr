import { t } from "i18next";
import { MdKeyboardArrowLeft } from "react-icons/md";

const ViewSupport = () => {
  return (
    <div>
      <div className="w-full flex justify-between mb-8">
        <div className="flex items-center gap-x-1">
          <p className="font-bold">{t("helper center")}</p>
          <MdKeyboardArrowLeft />
          <p className="font-bold text-[#7D7D7D]">{t("view")}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold">{t("view levels")}</h3>

        <div></div>
      </div>
    </div>
  );
};

export default ViewSupport;
