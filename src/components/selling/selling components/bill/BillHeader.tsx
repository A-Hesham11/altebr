import React, { useContext, useState } from "react";
import { t } from "i18next";
import { BsDatabase } from "react-icons/bs";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import { SelectOption_TP } from "../../../../types";
import { Employee_TP } from "../../../../pages/employees/employees-types";
import { GlobalDataContext } from "../../../../context/settings/GlobalData";
import PremiumImg from "../../../../assets/premium.svg";

const BillHeader = ({ invoiceNumber, locationPath }: any) => {
  const { userData } = useContext(authCtx);
  const { gold_price } = GlobalDataContext();
  const isDisabled = userData?.is_sellingInvoice === 1;

  // const { data: goldPriceData } = useFetch({
  //   queryKey: ["static-price"],
  //   endpoint: "/buyingUsedGold/api/v1/show-gold-price",
  // });

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
      {isDisabled ? (
        <div className="flex items-center gap-x-2 premiumGoldprice px-5 py-1.5 rounded-xl">
          <img src={PremiumImg} alt="premium" />
          <h2 className="text-white text-sm font-semibold">
            {t("daily gold price")}
          </h2>
        </div>
      ) : (
        <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
          <BsDatabase className="fill-white" />
          <p className=" border-l border-[#FFA34B] px-1">
            {t("daily gold price")}
          </p>
          <p className="px-1">
            {gold_price?.price_gram_24k} {gold_price?.currency}
          </p>
        </div>
      )}
    </div>
  );
};

export default BillHeader;
