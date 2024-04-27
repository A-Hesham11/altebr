import React from "react";
import { t } from "i18next";
import { BsDatabase } from "react-icons/bs";
import { useFetch } from "../../../../../hooks";

interface ReserveSellingHeader_TP {
  sellingInvoiceNumber: number;
}

/**
 *
 * @param sellingInvoiceNumber sellingInvoiceNumber - {sellingInvoiceNumber}
 * @returns jsx
 */
const ReserveSellingHeader: React.FC<ReserveSellingHeader_TP> = ({
  sellingInvoiceNumber,
}) => {
  // GOLD PRICE DATA FOR KILO OR GRAM API
  const { data: goldPriceData } = useFetch({
    queryKey: ["static-price"],
    endpoint: "/buyingUsedGold/api/v1/show-gold-price",
    onSuccess: (data: any) => {
      console.log(data);
    },
  });

  return (
    <div className="flex items-center gap-8 lg:gap-16">
      <div className="flex items-center gap-5">
        <h2>
          {t("bill number")} - {`${sellingInvoiceNumber}`}
        </h2>
      </div>
      <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
        <BsDatabase className="fill-white" />
        <p className=" border-l border-[#FFA34B] px-1">
          {`سعر ${goldPriceData?.gold_type} اليومي`}
        </p>
        <p className="px-1">{goldPriceData?.gold_price} ر.س</p>
      </div>
    </div>
  );
};

export default ReserveSellingHeader;
