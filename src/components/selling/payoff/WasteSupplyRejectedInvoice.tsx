import { t } from "i18next";
import React, { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../hooks";
import { ClientData_TP } from "../SellingClientForm";
import { useReactToPrint } from "react-to-print";
import { Button } from "../../atoms";
import PaymentFinalPreviewBillData from "../../../pages/Payment/PaymentFinalPreviewBillData";
import InvoiceTable from "../selling components/InvoiceTable";
import FinalPreviewBillPayment from "../selling components/bill/FinalPreviewBillPayment";
import { numberContext } from "../../../context/settings/number-formatter";
import InvoiceFooter from "../../Invoice/InvoiceFooter";

const WasteSupplyRejectedInvoice = ({ item, gold_price, invoice_logo }: any) => {
  console.log("🚀 ~ RejectedItemsInvoice ~ item:", item);
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ RejectedItemsInvoice ~ userData:", userData);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.date,
    supplier_id: item?.supplier_id,
  };

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("identification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("gold karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue()
            ? formatReyal(
                Number(info.row.original.weight * info.row.original.wage)
              )
            : "",
        accessorKey: "wage_total",
        header: () => <span>{t("total wages")}</span>,
      },
      // {
      //   cell: (info: any) =>
      //     item?.api_gold_price
      //       ? formatReyal(Number(item?.api_gold_price))
      //       : "---",
      //   accessorKey: "api_gold_price",
      //   header: () => <span>{t("selling price")}</span>,
      // },
    ],
    []
  );

  const totalWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalWage = item?.items?.reduce((acc, curr) => {
    acc += +curr.wage;
    return acc;
  }, 0);

  const totalWages = item?.items?.reduce((acc, curr) => {
    acc += +curr.wage_total;
    return acc;
  }, 0);

  //   const totalStonesWeight = item?.items?.reduce((acc, curr) => {
  //     acc += +curr.stones_weight;
  //     return acc;
  //   }, 0);

  const resultTable = [
    {
      number: t("totals"),
      weight: totalWeight,
      wage: totalWage,
      totalWages: totalWages,
      // totalPrice: item?.api_gold_price,
    },
  ];

  const costDataAsProps = {
    // totalFinalCost,
    // totalGoldAmountGram,
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
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
      }
    `,
  });

  const returnInvoiceToEdara = {
    bondNumber: 10,
    invoiceName: isRTL ? "سند مردود" : "rerurn bond",
  };

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
      <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
        <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-5 bill-shadow rounded-md p-6">
            <PaymentFinalPreviewBillData
              clientData={clientData}
              invoiceNumber={item?.invoice_number || item?.id}
              invoiceData={returnInvoiceToEdara}
            />
          </div>

          <InvoiceTable
            data={item?.items}
            columns={Cols}
            costDataAsProps={costDataAsProps}
            resultTable={resultTable}
          ></InvoiceTable>

          <div className="mx-5 bill-shadow rounded-md p-6 my-9 ">
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
    </div>
  );
};

export default WasteSupplyRejectedInvoice;
