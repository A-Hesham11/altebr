import React, { useContext, useMemo, useRef } from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { t } from "i18next";
import { Button } from "../../components/atoms";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useIsRTL } from "../../hooks";
import { Selling_TP } from "../selling/PaymentSellingPage";
import { useReactToPrint } from "react-to-print";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";
import InvoiceTableData from "../../components/selling/selling components/InvoiceTableData";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import InvoiceBasicHeader from "../../components/Invoice/InvoiceBasicHeader";

const SupplierBondInvoice = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ SupplierBondInvoice ~ item:", item);
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo } = GlobalDataContext();

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.supplier_id,
    bond_date: item?.date,
    supplier_id: item?.supplier,
  };

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: item?.date,
    second_title: "supplier name",
    second_value: item?.supplier_name,
    bond_date: item?.date,
    bond_title: "bond number",
    invoice_number: Number(item?.id) - 1,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "Tax invoice for supplier payment",
  };

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.value_reyal;
    return acc;
  }, 0);

  const karatMap = {
    10001: 18,
    10002: 21,
    10003: 22,
    10004: 24,
  };

  const totalGoldKarat24 = item?.items.reduce((acc, curr) => {
    const karat = karatMap[curr.card_id];
    if (!karat) return acc;

    const valueGram = +curr.value_gram || 0;
    const convertedTo24 = valueGram * (karat / 24);

    return acc + convertedTo24;
  }, 0);

  // const totalGoldAmountGram = item?.items?.reduce((acc, curr) => {
  //   acc += +curr.value_gram;
  //   return acc;
  // }, 0);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  const totalFinalWeightIntoArabic = convertNumToArWord(
    Math.round(totalGoldKarat24)
  );

  const costDataAsProps = {
    totalFinalCost,
    finalArabicData: [
      {
        title: t("total"),
      },
      {
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
      {
        totalFinalCostIntoArabic: totalFinalWeightIntoArabic,
        type: t("gram"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        cost: totalFinalCost,
        weight: totalGoldKarat24,
      },
    ],
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("payment method")}</span>,
        accessorKey: "card_name",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("amount")}</span>,
        accessorKey: "value_reyal",
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("Gold value (in grams)")}</span>,
        accessorKey: "value_gram",
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: item?.items || [],
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: item?.items?.length,
      },
    },
  });

  const handlePrint = useReactToPrint({
    content: () => invoiceRefs.current,
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
    <div className="relative h-full py-16 px-8">
      <div className="flex justify-end mb-8 w-full">
        <Button
          className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
          action={handlePrint}
        >
          {t("print")}
        </Button>
      </div>

      <div
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
        ref={invoiceRefs}
      >
        <div className="print-header">
          <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
        </div>

        <div className="print-content">
          <InvoiceTableData
            data={item?.items}
            columns={Cols || []}
            costDataAsProps={costDataAsProps}
          ></InvoiceTableData>
        </div>

        <div className="print-footer">
          <FinalPreviewBillPayment
            responseSellingData={item}
            notQRCode={true}
          />
          <InvoiceFooter />
        </div>
      </div>
    </div>
  );
};

export default SupplierBondInvoice;
