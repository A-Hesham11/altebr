import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { ClientData_TP, Selling_TP } from "../selling/PaymentSellingPage";
import { Button } from "../../components/atoms";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { Loading } from "../../components/organisms/Loading";
import SupplyPayoffInvoiceTable from "./SupplyPayoffInvoiceTable";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";
import InvoiceTableData from "../../components/selling/selling components/InvoiceTableData";
import InvoiceBasicHeader from "../../components/Invoice/InvoiceBasicHeader";
import { convertGoldWeightTo24K } from "../../utils/convertGoldWeightTo24";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SupplyReturnInvoice = ({
  item,
  invoiceHeaderBasicData,
}: {
  item?: {};
  invoiceHeaderBasicData?: {};
}) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "hwya",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "classification_id",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("category")} </span>,
        accessorKey: "category",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_id",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("fare")}</span>,
        accessorKey: "wage",
        cell: (info) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const totalwages = item?.items?.reduce((acc, card) => {
    acc += +card.wage;
    return acc;
  }, 0);

  const totalWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items?.reduce((acc, curr) => {
    acc += +curr.vat;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost: totalCost,
    totalCost,
    totalWeight,
    resultTable: [
      {
        number: t("totals"),
        weight: formatGram(Number(totalWeight)),
        vat: formatReyal(Number(totalItemsTaxes)),
        cost: formatReyal(Number(totalCost)),
      },
    ],
    finalArabicData: [
      {
        title: t("total"),
        totalFinalCostIntoArabic: totalCost,
        type: t("reyal"),
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
              columns={Cols}
              costDataAsProps={costDataAsProps}
            />
          </div>

          <div className="print-footer">
            <FinalPreviewBillPayment responseSellingData={item} />
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplyReturnInvoice;
