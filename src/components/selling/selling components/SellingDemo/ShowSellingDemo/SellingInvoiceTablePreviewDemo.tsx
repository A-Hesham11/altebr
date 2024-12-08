import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import cashImg from "../../../../../assets/cash.png";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { useIsRTL } from "../../../../../hooks";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import { ColumnDef } from "@tanstack/react-table";
import { Selling_TP } from "../../../../../pages/selling/PaymentSellingPage";
import { convertNumToArWord } from "../../../../../utils/number to arabic words/convertNumToArWord";
import { Button } from "../../../../atoms";
import InvoiceHeader from "../../../../Invoice/InvoiceHeader";
import InvoiceTable from "../../InvoiceTable";
import FinalPreviewBillPayment from "../../bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../../../Invoice/InvoiceFooter";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingInvoiceTablePreviewDemo = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ SellingInvoiceTablePreview ~ item:", item);
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo, gold_price } = GlobalDataContext();
  const PriceGoldGram = {
    "18": gold_price?.price_gram_18k,
    "21": gold_price?.price_gram_21k,
    "22": gold_price?.price_gram_22k,
    "24": gold_price?.price_gram_24k,
  };

  // const clientData = {
  //   client_id: item?.client_id,
  //   client_value: item?.client_name,
  //   bond_date: item?.invoice_date,
  //   supplier_id: item?.supplier_id,
  // };

  const invoiceHeaderData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.invoice_date,
    supplier_id: item?.supplier_id,
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
        header: () => <span>{t("category")}</span>,
        accessorKey: "classification_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
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
        accessorKey: "price_gram",
        cell: (info: any) => info.getValue() || "---",
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
      {
        header: () => <span>{`${t("total weight")}`} </span>,
        accessorKey: "total_Weight",
        cell: (info) => {
          const stoneWeigthByGram =
            Number(info.row.original?.stones_weight) / 5;
          const weight = Number(info.row.original.weight) * 0.05;
          const result = stoneWeigthByGram > weight;
          const valueOfWeight =
            Number(result ? info.row.original?.stones_weight : 0) +
            Number(info.row.original?.weight);

          return valueOfWeight || "---";
        },
      },
      {
        header: () => <span>{t("price before tax")} </span>,
        accessorKey: "taklfa",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "taklfa_after_tax",
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
    acc += +curr.taklfa;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items?.reduce((acc, curr) => {
    acc += +curr.vat;
    return acc;
  }, 0);

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax;
    return acc;
  }, 0);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost: totalFinalCost,
    totalCost,
    totalFinalCostIntoArabic,
  };

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      stonesWeight:
        totalStonesWeight != 0 ? formatGram(Number(totalStonesWeight)) : "---",
      totalWeight:
        formatGram(Number(totalStonesWeight) + Number(totalWeight)) || "---",
      cost: formatReyal(Number(costDataAsProps?.totalCost)),
      vat: formatReyal(Number(costDataAsProps?.totalItemsTaxes)),
      total: formatReyal(Number(costDataAsProps?.totalFinalCost)),
    },
  ];

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
              {/* <FinalPreviewBillData
                clientData={clientData}
                invoiceNumber={item?.invoice_number}
              /> */}

              <InvoiceHeader invoiceHeaderData={invoiceHeaderData} />
            </div>

            <div className="">
              <InvoiceTable
                data={item?.items}
                columns={Cols}
                costDataAsProps={costDataAsProps}
                resultTable={resultTable}
              ></InvoiceTable>
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

export default SellingInvoiceTablePreviewDemo;
