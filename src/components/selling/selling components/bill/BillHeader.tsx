import React, { useContext } from "react";
import { t } from "i18next";
import { BsDatabase } from "react-icons/bs";
import { authCtx } from "../../../../context/auth-and-perm/auth";

const BillHeader = ({ invoiceNumber, locationPath }: any) => {
  const { userData } = useContext(authCtx);

  return (
    <div className="flex items-center gap-8 lg:gap-16">
      <div className="flex items-center gap-5">
        <h2>
          {t("bill number")} - {`${invoiceNumber + 1}`}
        </h2>
        {!locationPath && (
          <p className="bg-mainGreen text-white text-[9px] font-bold py-1 px-2 rounded-lg">
            {userData?.include_tax === "1"
              ? t("price includes tax")
              : t("The price does not include tax")}
          </p>
        )}
      </div>
      <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
        <BsDatabase className="fill-white" />
        <p className=" border-l border-[#FFA34B] px-1">
          {t("daily gold price")}
        </p>
        <p className="px-1">20.3 ر.س</p>
      </div>
    </div>
  );
};

export default BillHeader;
