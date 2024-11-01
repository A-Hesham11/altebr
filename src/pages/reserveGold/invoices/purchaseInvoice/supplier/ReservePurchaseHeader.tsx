import React, { useEffect, useState } from "react";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { useFetch } from "../../../../../hooks";
import { useFormikContext } from "formik";
import { BsDatabase } from "react-icons/bs";
import { t } from "i18next";
import { SelectOption_TP } from "../../../../../types";
import { Employee_TP } from "../../../../employees/employees-types";

interface ReservePurchaseHeader_TP {
  buyingInvoiceNumber: number;
}

/**
 *
 * @param buyingInvoiceNumber buyingInvoiceNumber - {buyingInvoiceNumber}
 * @returns jsx
 */
const ReservePurchaseHeader: React.FC<ReservePurchaseHeader_TP> = ({
  buyingInvoiceNumber,
}) => {
  const { values } = useFormikContext();
  const { formatGram, formatReyal } = numberContext();
  const [goldPriceToday, setGoldPriceToday] = useState("");

  // // GOLD PRICE DATA FOR KILO OR GRAM API
  // const { data: goldPriceData } = useFetch({
  //   queryKey: ["static-price"],
  //   endpoint: "/buyingUsedGold/api/v1/show-gold-price",
  //   onSuccess: (data: any) => {
  //     console.log(data);
  //   },
  // });

  const { data: supplierAccount, refetch } = useFetch({
    endpoint: values!.supplier_id
      ? `/reserveGold/api/v1/supplier_accounts/${values!.supplier_id}`
      : `/reserveGold/api/v1/supplier_accounts/1`,
    queryKey: ["supplier-accounts-data"],
  });

  useEffect(() => {
    refetch();
  }, [values!.supplier_id]);

  const { data: GoldPrice } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "/attachment/api/v1/goldPrice",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data["price_gram_24k"]);
    },
  });

  return (
    <div className="flex items-center gap-8 lg:gap-10">
      <div className="flex items-center gap-5">
        <h2>
          {t("bill number")} - {`${buyingInvoiceNumber}`}
        </h2>
      </div>
      <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
        <BsDatabase className="fill-white" />
        <p className=" border-l border-[#FFA34B] px-1">
          {t("daily gold price")}
        </p>
        <p className="px-1">{goldPriceToday} {GoldPrice?.currency}</p>
      </div>

      {values!.supplier_id && (
        <>
          <div className="flex items-center self-end bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
            <BsDatabase className="fill-white" />
            <p className=" border-l border-[#FFA34B] px-1">
              {t("supplier account gram")}
            </p>
            <p className="px-1">
              {formatGram(supplierAccount?.gram)} {t("gram")}
            </p>
          </div>
          <div className="flex items-center self-end bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
            <BsDatabase className="fill-white" />
            <p className=" border-l border-[#FFA34B] px-1">
              {t("supplier account cash")}
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

export default ReservePurchaseHeader;
