import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { numberContext } from "../../../context/settings/number-formatter";
import { useIsRTL } from "../../../hooks";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { Selling_TP } from "../../selling/PaymentSellingPage";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { Button } from "../../../components/atoms";
import InvoiceHeader from "../../../components/Invoice/InvoiceHeader";
import InvoiceTableData from "../../../components/selling/selling components/InvoiceTableData";
import FinalPreviewBillPayment from "../../../components/selling/selling components/bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import { authCtx } from "../../../context/auth-and-perm/auth";
import cashImg from "../../../assets/cash.png";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingInvoiceRecycledGoldPreview = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo, gold_price } = GlobalDataContext();
  const { userData } = useContext(authCtx);

  const invoiceHeaderData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.invoice_date,
    supplier_id: item?.supplier_id,
    supplier_name: item?.supplier_name,
    invoice_number: Number(item?.id) - 1,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
  };

  const paymentData = item?.invoicepayments?.map((item) => ({
    add_commission_ratio: "no",
    cardImage: item.image === "cash" ? cashImg : item.image,
    cost_after_tax: item.amount,
  }));

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("Price per gram")} </span>,
        accessorKey: "Price_gram",
        cell: (info: any) => {
          const taxRate =
            info.row.original.karat_name === "24"
              ? 1
              : userData?.tax_rate / 100 + 1;
          const totalCostFromRow =
            Number(info.row.original.taklfa_after_tax) / Number(taxRate);

          return formatReyal(
            Number(totalCostFromRow) / Number(info.row.original.weight)
          );
        },
      },
      {
        header: () => <span>{t("notes")} </span>,
        accessorKey: "notes",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("price before tax")} </span>,
        accessorKey: "total",
        cell: (info) =>
          info.getValue()
            ? formatGram(
                Number(info.getValue()) - Number(info.row.original.vat)
              )
            : "---",
      },
      {
        header: () => <span>{t("vat")} </span>,
        accessorKey: "vat",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const totalWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalFinalCost = item?.items.reduce((acc, curr) => {
    acc += +curr.total;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items.reduce((acc, curr) => {
    acc += +curr.vat;
    return acc;
  }, 0);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalFinalCost))
  );
  const costDataAsProps = {
    totalFinalCost,
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
        weight: formatGram(Number(totalWeight)),
        cost: formatReyal(Number(totalFinalCost) - Number(totalItemsTaxes)),
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
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
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
          <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
            <div className="mx-5 bill-shadow rounded-md p-6">
              <InvoiceHeader invoiceHeaderData={invoiceHeaderData} />
            </div>

            <div className="">
              <InvoiceTableData
                data={item?.items}
                columns={Cols}
                costDataAsProps={costDataAsProps}
              ></InvoiceTableData>
            </div>

            <div className="mx-5 bill-shadow rounded-md p-6 my-9 ">
              <FinalPreviewBillPayment
                responseSellingData={item}
                paymentData={paymentData}
              />
            </div>

            <div>
              <InvoiceFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellingInvoiceRecycledGoldPreview;
