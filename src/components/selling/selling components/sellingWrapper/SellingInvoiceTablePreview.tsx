import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { Table } from "../../../templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../../context/settings/number-formatter";
import { ColumnDef } from "@tanstack/react-table";
import TableEntry from "../../../templates/reusableComponants/tantable/TableEntry";
import FinalPreviewBillData from "../bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "../bill/FinalPreviewBillPayment";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../../hooks";
import { ClientData_TP } from "../../SellingClientForm";
import InvoiceTable from "../InvoiceTable";
import { Selling_TP } from "../../../../pages/selling/PaymentSellingPage";
import { Button } from "../../../atoms";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { DownloadAsPDF } from "../../../../utils/DownloadAsPDF";
import { InvoiceDownloadAsPDF } from "../../../../utils/InvoiceDownloadAsPDF";
import Html2Pdf from "js-html2pdf";
import { convertNumToArWord } from "../../../../utils/number to arabic words/convertNumToArWord";
import InvoiceFooter from "../../../Invoice/InvoiceFooter";
import InvoiceHeader from "../../../Invoice/InvoiceHeader";
import { GlobalDataContext } from "../../../../context/settings/GlobalData";
import cashImg from "../../../../assets/cash.png";
import InvoiceTableData from "../InvoiceTableData";
import InvoiceBasicHeader from "../../../Invoice/InvoiceBasicHeader";
import { cn } from "tailwind-variants";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingInvoiceTablePreview = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo, gold_price } = GlobalDataContext();
  console.log("🚀 ~ SellingInvoiceTablePreview ~ invoice_logo:", invoice_logo);
  const PriceGoldGram = {
    "18": gold_price?.price_gram_18k,
    "21": gold_price?.price_gram_21k,
    "22": gold_price?.price_gram_22k,
    "24": gold_price?.price_gram_24k,
  };

  // const invoiceHeaderData = {
  //   client_id: item?.client_id,
  //   client_value: item?.client_name,
  //   bond_date: item?.invoice_date,
  //   supplier_id: item?.supplier_id,
  //   invoice_number: Number(item?.invoice_number) - 1,
  //   invoice_logo: invoice_logo?.InvoiceCompanyLogo,
  //   invoice_text: "simplified tax invoice",
  // };

  const { data } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/${item?.client_id}`,
    queryKey: [`clients`],
  });

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: item?.invoice_date,
    second_title: "client name",
    second_value: item?.client_name,
    third_title: "mobile number",
    third_value: data?.phone,
    bond_date: item?.invoice_date,
    bond_title: "bill no",
    invoice_number: Number(item?.invoice_number) - 1,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
  };

  const paymentData = item?.invoicepayments?.map((item) => ({
    add_commission_ratio: "no",
    cardImage: item.image === "cash" ? cashImg : item.image,
    cost_after_tax: item.amount,
  }));
  console.log("🚀 ~ paymentData ~ paymentData:", paymentData);

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "hwya",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("category")}</span>,
        accessorKey: "classification_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      // {
      //   header: () => <span>{t("stone weight")} </span>,
      //   accessorKey: "stones_weight",
      //   cell: (info) => {
      //     const stoneWeigthByGram = Number(info.getValue()) / 5;
      //     const weight = Number(info.row.original.weight) * 0.05;
      //     const result = stoneWeigthByGram > weight;
      //     return result ? info.getValue() : "---";
      //   },
      // },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) =>
          info.row.original.classification_id === 1
            ? info.getValue()
              ? formatReyal(Number(info.getValue()))
              : "---"
            : info.row.original.karatmineral_name
            ? formatGram(Number(info.row.original.karatmineral_name))
            : "---",
      },
      {
        header: () => <span>{t("Price per gram")} </span>,
        accessorKey: "Price_gram",
        cell: (info: any) =>
          formatReyal(
            Number(info.row.original.cost) / Number(info.row.original.weight)
          ),
      },
      {
        header: () => (
          <span>{`${t("precious metal weight")} (${t("In grams")})`}</span>
        ),
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => (
          <span>
            {`${t("The weight of the stones if it exceeds 5%")} (${t(
              "in karat"
            )})`}{" "}
          </span>
        ),
        accessorKey: "stones_weight",
        cell: (info) => {
          const stoneWeigthByGram = Number(info.getValue()) / 5;
          const weight = Number(info.row.original.weight) * 0.05;
          const result = stoneWeigthByGram > weight;
          return !!result ? info.getValue() : "---";
        },
      },
      // {
      //   header: () => <span>{`${t("total weight")}`} </span>,
      //   accessorKey: "total_Weight",
      //   cell: (info) => {
      //     const stoneWeigthByGram =
      //       Number(info.row.original?.stones_weight) / 5;
      //     const weight = Number(info.row.original.weight) * 0.05;
      //     const result = stoneWeigthByGram > weight;
      //     const valueOfWeight =
      //       Number(result ? info.row.original?.stones_weight : 0) +
      //       Number(info.row.original?.weight);
      //     return valueOfWeight || "---";
      //   },
      // },
      {
        header: () => <span>{t("18")}</span>,
        accessorKey: "gold_18",
        cell: (info: any) =>
          info.row.original.karat_name === "18"
            ? formatGram(Number(info.row.original.weight))
            : "---",
      },
      {
        header: () => <span>{t("21")}</span>,
        accessorKey: "gold_21",
        cell: (info: any) =>
          info.row.original.karat_name === "21"
            ? formatGram(Number(info.row.original.weight))
            : "---",
      },
      {
        header: () => <span>{t("22")}</span>,
        accessorKey: "gold_22",
        cell: (info: any) =>
          info.row.original.karat_name === "22"
            ? formatGram(Number(info.row.original.weight))
            : "---",
      },
      {
        header: () => <span>{t("24")}</span>,
        accessorKey: "gold_24",
        cell: (info: any) =>
          info.row.original.karat_name === "24"
            ? formatGram(Number(info.row.original.weight))
            : "---",
      },
      {
        header: () => <span>{t("price before tax")} </span>,
        accessorKey: "cost",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
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

  const totalStonesWeight = item?.items?.reduce((acc, curr) => {
    const stoneWeigthByGram = Number(curr.stones_weight) / 5;
    const weight = Number(curr.weight) * 0.05;
    const result = stoneWeigthByGram > weight;
    acc += result ? Number(curr.stones_weight) : 0;
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

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.total;
    return acc;
  }, 0);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  const totalGold18 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name === "18" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold21 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name === "21" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold22 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name === "22" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold24 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name === "24" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;

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
        weight: formatGram(Number(totalWeight)),
        stonesWeight:
          totalStonesWeight != 0
            ? formatGram(Number(totalStonesWeight))
            : "---",
        // totalWeight:
        //   formatGram(Number(totalStonesWeight) + Number(totalWeight)) || "---",
        totalGold18,
        totalGold21,
        totalGold22,
        totalGold24,
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
          {/* Header that will be repeated on every page */}
          <div
            className={`print-header ${
              invoice_logo?.is_include_header_footer === "1"
                ? "opacity-1"
                : "opacity-0 h-12"
            }`}
          >
            <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
          </div>

          {/* Main content including the table */}
          <div className="print-content">
            <InvoiceTableData
              data={item?.items}
              columns={Cols}
              costDataAsProps={costDataAsProps}
            />
          </div>

          {/* Footer that will be repeated on every page */}
          <div className="print-footer">
            <FinalPreviewBillPayment
              responseSellingData={item}
              paymentData={paymentData}
            />

            <InvoiceFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default SellingInvoiceTablePreview;
