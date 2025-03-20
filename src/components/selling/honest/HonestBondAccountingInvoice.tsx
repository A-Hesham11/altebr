import React, { useMemo, useRef } from "react";
import InvoiceBasicHeader from "../../Invoice/InvoiceBasicHeader";
import InvoiceTableData from "../selling components/InvoiceTableData";
import FinalPreviewBillPayment from "../selling components/bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../Invoice/InvoiceFooter";
import { Button } from "../../atoms";
import { t } from "i18next";
import { useFetch, useIsRTL } from "../../../hooks";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { useReactToPrint } from "react-to-print";
import { numberContext } from "../../../context/settings/number-formatter";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";

const HonestBondAccountingInvoice = ({ selectedItem }: any) => {
  const { invoice_logo } = GlobalDataContext();
  const contentRef = useRef();
  const { formatGram, formatReyal } = numberContext();
  const isRTL = useIsRTL();

  const { data: clientInfo } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/${selectedItem?.client_id_2}`,
    queryKey: [`clients_info`, selectedItem?.client_id_2],
    enabled: !!selectedItem?.client_id_2,
  });

  const invoiceHeaderBasicData = {
    first_title: "honest bond date",
    first_value: selectedItem?.bond_date,
    second_title: "client name",
    second_value: selectedItem?.client_id,
    third_title: "mobile number",
    third_value: clientInfo?.phone,
    bond_title: "honest bond number",
    invoice_number: selectedItem?.id,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "honest bond",
    bond_date: selectedItem?.bond_date,
    client_id: selectedItem?.client_id_2,
  };

  const totalCost = selectedItem?.items?.reduce((acc: number, curr: any) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalAmount = selectedItem?.boxes?.find(
    (el) => el.account === "الأمانات"
  );

  const sanadData = {
    amount: totalAmount?.value,
    totalCost: totalCost,
    remaining_amount: totalCost - totalAmount?.value,
  };

  const totalFinalCostIntoArabic = convertNumToArWord(Math.round(totalCost));

  const totalFinalAmountIntoArabic = convertNumToArWord(
    Math.round(sanadData?.amount)
  );

  const totalFinalRemainingAmountIntoArabic = convertNumToArWord(
    Math.round(sanadData?.remaining_amount)
  );

  const costDataAsProps = {
    totalCost,
    finalArabicData: [
      {
        title: t("total of estimated cost"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("total of amount paid"),
        totalFinalCostIntoArabic: totalFinalAmountIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("deserved amount"),
        totalFinalCostIntoArabic: totalFinalRemainingAmountIntoArabic,
        type: t("reyal"),
      },
    ],
  };

  const invoiceCols = useMemo<any>(
    () => [
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "category_id",
        header: () => (
          <span className="flex justify-center">{t("classification")}</span>
        ),
      },
      {
        cell: (info) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => (
          <span className="flex justify-center">{t("weight")}</span>
        ),
      },
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "karat_id",
        header: () => <span className="flex justify-center">{t("karat")}</span>,
      },
      {
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "cost",
        header: () => (
          <span className="flex justify-center">{t("approximate cost")}</span>
        ),
      },
      {
        cell: (info) => info.getValue() || t("not found"),
        accessorKey: "description",
        header: () => (
          <span className="truncate w-44 flex justify-center">
            {t("notes")}
          </span>
        ),
      },
    ],
    []
  );

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: A5 landscape;;
        margin: 15px !important;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          zoom: 0.5;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
        .container_print {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
        }
      }
    `,
  });
  return (
    <div className="">
      <div className="flex items-center justify-end gap-x-4 mb-6 mt-16">
        <div className="">
          <Button bordered action={handlePrint}>
            {t("print")}
          </Button>
        </div>
      </div>
      <div
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
        ref={contentRef}
      >
        <div className="print-header">
          <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
        </div>

        <div className="print-content">
          <InvoiceTableData
            data={selectedItem?.items || []}
            columns={invoiceCols}
            costDataAsProps={costDataAsProps}
          />
        </div>

        <div className="print-footer">
          <FinalPreviewBillPayment
            responseSellingData={selectedItem?.items}
            notQRCode={true}
          />
          <InvoiceFooter />
        </div>
      </div>
    </div>
  );
};

export default HonestBondAccountingInvoice;
