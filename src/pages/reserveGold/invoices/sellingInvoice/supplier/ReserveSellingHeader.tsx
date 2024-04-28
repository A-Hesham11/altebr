import React, { useEffect } from "react";
import { t } from "i18next";
import { BsDatabase } from "react-icons/bs";
import { useFetch } from "../../../../../hooks";
import { useFormikContext } from "formik";
import { numberContext } from "../../../../../context/settings/number-formatter";

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
  const { values } = useFormikContext();
  const { formatGram, formatReyal } = numberContext();

  // GOLD PRICE DATA FOR KILO OR GRAM API
  const { data: goldPriceData } = useFetch({
    queryKey: ["static-price"],
    endpoint: "/buyingUsedGold/api/v1/show-gold-price",
    onSuccess: (data: any) => {
      console.log(data);
    },
  });

  const { data: supplierAccount, refetch } = useFetch({
    endpoint:
      values!.supplier_id &&
      `/reserveGold/api/v1/supplier_accounts/${values!.supplier_id}`,
    queryKey: ["supplier-accounts-data"],
  });

  useEffect(() => {
    refetch();
  }, [values!.supplier_id]);

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

      {values!.supplier_id && (
        <>
          <div className="flex items-center self-end bg-mainOrange p-2 rounded-lg text-white font-base text-xs w-[29%]">
            <BsDatabase className="fill-white" />
            <p className=" border-l border-[#FFA34B] px-1">
              {t("24 gold credit for supplier")}
            </p>
            <p className="px-1">
              {formatGram(supplierAccount?.gram)} {t("gram")}
            </p>
          </div>
          <div className="flex items-center self-end bg-mainOrange p-2 rounded-lg text-white font-base text-xs w-[27%]">
            <BsDatabase className="fill-white" />
            <p className=" border-l border-[#FFA34B] px-1">
              {t("supplier cash balance")}
            </p>
            <p className="px-1">
              {formatReyal(supplierAccount?.reyal)} {t("reyal")}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ReserveSellingHeader;
