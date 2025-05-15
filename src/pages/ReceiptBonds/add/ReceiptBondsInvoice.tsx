import React, { useContext } from "react";
import { useIsRTL } from "../../../hooks";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFormikContext } from "formik";
import { authCtx } from "../../../context/auth-and-perm/auth";
import ReceiptBondInvoiceHeader from "./ReceiptBondInvoiceHeader";
import ReceiptBondInvoiceTable from "./ReceiptBondInvoiceTable";
import { t } from "i18next";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { formatDate } from "../../../utils/date";
import { GlobalDataContext } from "../../../context/settings/GlobalData";

const ReceiptBondsInvoice = ({ item }: { item?: any }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const isRTL = useIsRTL();
  const { formatReyal } = numberContext();
  const { userData } = useContext<any>(authCtx);
  const { invoice_logo } = GlobalDataContext();

  const data = [
    {
      amountPaid: formatReyal(item?.amount),
      tax: formatReyal(item?.tax),
      total: formatReyal(item?.total),
    },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(item?.total);

  return (
    <div className="p-12">
      <div
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
        ref={contentRef}
      >
        <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
          <div className="mx-5 bill-shadow rounded-md p-6">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1 mt-6">
                <p className="text-xs font-bold">
                  {t("bond number")} :{" "}
                  <span className="font-medium">
                    {/* FIXME: THIS WILL FETCH HERE THE VIEW API AND GET THE INVOICE NUMBER FROM IT */}
                    {Number(1)}
                  </span>{" "}
                </p>
                <p className="text-xs font-bold">
                  {t("bill date")} :{" "}
                  <span className="font-medium">{item?.bond_date}</span>{" "}
                </p>
                <p className="text-xs font-bold">
                  {t("branch name")} :{" "}
                  <span className="font-medium">{userData?.branch_name}</span>{" "}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <img
                  src={invoice_logo}
                  alt="bill"
                  className="h-28 w-3/4 object-contain"
                />
                <p className="text-base font-medium">{t("receipt bond")}</p>
              </div>
            </div>
          </div>

          <div className="">
            <ReceiptBondInvoiceTable data={data} />
          </div>

          <div className="mx-5 bill-shadow rounded-md p-6 space-y-20 text-lg my-9 ">
            <div className="space-y-7">
              <p className="flex items-center gap-4">
                <span>{t("received from the honorable")}</span>{" "}
                <span className="border-b flex-1 border-dashed border-[#C7C7C7]">
                  {item.beneficiary}
                </span>
              </p>
              <p className="flex items-center gap-4">
                <span>{t("amount and value")}</span>
                <span className="border-b flex-1 border-dashed border-[#C7C7C7]">
                  {totalFinalCostIntoArabic}
                </span>
                <span>{t("only")}</span>
              </p>
              <p className="flex items-center gap-4">
                <span>{t("this is about")}</span>
                <span className="border-b flex-1 border-dashed border-[#C7C7C7]">
                  {item.note}
                </span>
              </p>
              <p className="flex items-center gap-4">
                <span>{t("invoice number")}</span>
                <span className="border-b w-64 border-dashed border-[#C7C7C7]">
                  {item.bond_number}
                </span>
              </p>
            </div>

            <div className="flex items-center px-44 justify-between">
              <p className="flex flex-col gap-4 justify-center">
                <span className="text-center">
                  {t("signature of bond organizer")}
                </span>
                <span className="text-center">{userData?.name}</span>
              </p>
              <div className="flex flex-col gap-4">
                <span className="text-center">{t("branch manager")}</span>
                <p className="flex">
                  <span className="mx-4">{t("name")}</span>
                  <span className="flex-1">
                    -----------------------------------------------
                  </span>
                </p>
                <p className="flex">
                  <span className="mx-4">{t("signature")}</span>
                  <span className="flex-1">
                    -----------------------------------------------
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptBondsInvoice;
