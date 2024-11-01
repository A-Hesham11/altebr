import React, { useState } from "react";
import { t } from "i18next";
import { BsDatabase } from "react-icons/bs";
import { useFetch } from "../../../hooks";
import { SelectOption_TP } from "../../../types";
import { Employee_TP } from "../../../pages/employees/employees-types";

/**
 * 
 * @param invoiceNumber invoiceNumber - {invoiceNumber}
 * @returns jsx
 */
const BuyingHeader = ({ invoiceNumber }: any) => {
  const [goldPriceToday, setGoldPriceToday] = useState("");

  // // GOLD PRICE DATA FOR KILO OR GRAM API
  // const {
  //   data: goldPriceData,
  // } = useFetch({
  //   queryKey: ["static-price"],
  //   endpoint: "/buyingUsedGold/api/v1/show-gold-price",
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  // });

  const { data: GoldPrice } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "/attachment/api/v1/goldPrice",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data["price_gram_24k"]);
    },
  });

  return (
    <div className="flex items-center gap-8 lg:gap-16">
      <div className="flex items-center gap-5">
        <h2>
          {t("bill number")} - {`${invoiceNumber.length + 1}`}
        </h2>
        <p className="bg-mainGreen text-white text-[9px] font-bold py-1 px-2 rounded-lg">
          {t("purchase policy applies")}
        </p>
      </div>
      <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
        <BsDatabase className="fill-white" />
        <p className=" border-l border-[#FFA34B] px-1">
          {t("daily gold price")}
        </p>
        <p className="px-1">{goldPriceToday} {GoldPrice?.currency}</p>
      </div>
    </div>
  );
};

export default BuyingHeader;
