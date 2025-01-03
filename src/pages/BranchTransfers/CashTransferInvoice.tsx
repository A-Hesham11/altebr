import { t } from "i18next";
import React, { useContext, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { numberContext } from "../../context/settings/number-formatter";
import { Button } from "../../components/atoms";
import PaymentFinalPreviewBillData from "../Payment/PaymentFinalPreviewBillData";
import InvoiceTableData from "../../components/selling/selling components/InvoiceTableData";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";

const CashTransferInvoice = ({ item, gold_price, invoice_logo }: any) => {
  console.log("🚀 ~ CashTransferInvoice ~ item:", item);
  const { userData } = useContext(authCtx);
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

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(item.amount))
  );

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
            <div className="flex justify-between">
              <div className="flex flex-col gap-1 mt-6">
                <p className="text-xs font-bold">
                  {t("bond number")} :{" "}
                  <span className="font-medium">{item?.id}</span>{" "}
                </p>
                <p className="text-xs font-bold">
                  {t("bond date")} :{" "}
                  <span className="font-medium">{item?.bond_date}</span>{" "}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <img
                  src={invoice_logo?.InvoiceCompanyLogo}
                  alt="bill"
                  className="h-28 w-3/4 object-contain"
                />
                <p>{t("Cash Transfer Bond")}</p>
              </div>
              <div className="flex flex-col gap-1 mt-6">
                <p className="text-xs font-medium">
                  <span className="font-bold">{t("branch name")}: </span>
                  {item?.branch_name}
                </p>
                <p className="text-xs font-medium">
                  <span className="font-bold">{t("Type conversion")}: </span>
                  {item?.transfer_type === "cash" ? t("monetary") : t("Bank")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F3F3F3] mx-5 rounded-md p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2>
                {t("transfer cash")} : <span>{item.amount} </span>
                <span className="font-semibold">{t("reyal")}</span>{" "}
              </h2>

              <h2>
                {t("total of amount")} :{" "}
                <span>{totalFinalCostIntoArabic} </span>
                <span className="font-semibold">{t("reyal")}</span>{" "}
                <span className="font-semibold">{t("Only nothing else")}</span>
              </h2>
            </div>

            <h2>
              {t("notes")} : <span>{item.notes}</span>
            </h2>
          </div>

          <div className="mx-5 bill-shadow rounded-md px-6 py-10 my-9 flex items-center justify-between">
            <div className="text-center">
              <span className="">{t("employee name")}</span>
              <p className="mt-3">{userData?.name}</p>
            </div>
            <div className="text-center">
              <span className="">{t("recipient's signature")}</span>
              <p className="mt-3">------------------------------</p>
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

export default CashTransferInvoice;
