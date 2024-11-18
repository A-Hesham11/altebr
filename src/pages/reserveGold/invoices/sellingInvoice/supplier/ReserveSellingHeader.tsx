import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { BsDatabase } from "react-icons/bs";
import { useFetch } from "../../../../../hooks";
import { useFormikContext } from "formik";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { SelectOption_TP } from "../../../../../types";
import { Employee_TP } from "../../../../employees/employees-types";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";

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
  const { gold_price } = GlobalDataContext();

  const { data: supplierAccount, refetch } = useFetch({
    endpoint: values!.supplier_id
      ? `/reserveGold/api/v1/supplier_accounts/${values!.supplier_id}`
      : `/reserveGold/api/v1/supplier_accounts/1`,
    queryKey: ["supplier-accounts-data"],
  });

  useEffect(() => {
    refetch();
  }, [values!.supplier_id]);

  return (
    <div className="flex items-center gap-8 lg:gap-10">
      <div className="flex items-center gap-5">
        <h2>
          {t("bill number")} - {`${sellingInvoiceNumber}`}
        </h2>
      </div>
      <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white font-base text-xs">
        <BsDatabase className="fill-white" />
        <p className=" border-l border-[#FFA34B] px-1">
          {t("daily gold price")}
        </p>
        <p className="px-1">
          {gold_price?.price_gram_24k} {gold_price?.currency}
        </p>
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

export default ReserveSellingHeader;
