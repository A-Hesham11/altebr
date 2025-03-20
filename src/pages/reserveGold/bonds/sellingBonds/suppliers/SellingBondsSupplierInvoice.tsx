import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../../../hooks";
import {
  ClientData_TP,
  Selling_TP,
} from "../../../../selling/PaymentSellingPage";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReactToPrint } from "react-to-print";
import { Button } from "../../../../../components/atoms";
import FinalPreviewBillData from "../../../../../components/selling/selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../../../../../components/selling/selling components/InvoiceTable";
import FinalPreviewBillPayment from "../../../../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { convertNumToArWord } from "../../../../../utils/number to arabic words/convertNumToArWord";
import InvoiceFooter from "../../../../../components/Invoice/InvoiceFooter";
import InvoiceTableData from "../../../../../components/selling/selling components/InvoiceTableData";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import InvoiceBasicHeader from "../../../../../components/Invoice/InvoiceBasicHeader";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingBondsSupplierInvoice = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo } = GlobalDataContext();

  const { data } = useFetch<any>({
    endpoint: `/supplier/api/v1/supplier/${item?.supplier_id}`,
    queryKey: [`clients`],
  });

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: item?.invoice_date,
    second_title: "supplier name",
    second_value: item?.supplier_name,
    third_title: "mobile number",
    third_value: data?.phone,
    bond_date: item?.invoice_date,
    bond_title: "bill no",
    invoice_number: Number(item?.invoice_number) - 1,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "cost_after_tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const totalWeigth = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items?.reduce((acc, curr) => {
    acc += +curr.tax;
    return acc;
  }, 0);

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost_after_tax;
    return acc;
  }, 0);

  const table = useReactTable({
    data: item?.items,
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

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
    finalArabicData: [
      {
        title: t("total"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        weight: formatGram(Number(totalWeigth)),
        cost: formatReyal(Number(totalCost)),
        vat: formatReyal(Number(totalItemsTaxes)),
        total: formatReyal(Number(totalFinalCost)),
      },
    ],
  };

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
    <>
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
          </div>

          <div>
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default SellingBondsSupplierInvoice;
