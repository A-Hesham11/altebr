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
import InvoiceFooter from "../../Invoice/InvoiceFooter";
import { numberContext } from "../../../context/settings/number-formatter";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import InvoiceHeader from "../../Invoice/InvoiceHeader";
import InvoiceTableData from "../selling components/InvoiceTableData";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { useLocation } from "react-router-dom";

const RejectedItemsInvoice = ({ item }: any) => {
  console.log("🚀 ~ RejectedItemsInvoice ~ item:", item);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const location = useLocation();
  const { invoice_logo } = GlobalDataContext();

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.date,
    supplier_id: item?.supplier_id,
  };

  const Cols = useMemo<any>(
    () => [
      {
        header: () => <span>{t("identification")}</span>,
        accessorKey: "hwya",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("category")}</span>,
        accessorKey: "classification",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("karat")}</span>,
        accessorKey: "karat",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("mineral")}</span>,
        accessorKey: "mineral",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("mineral karat")}</span>,
        accessorKey: "karatmineral_id",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("wage")}</span>,
        accessorKey: "wage",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("total wages")}</span>,
        accessorKey: "wage_total",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("diamond value")}</span>,
        accessorKey: "diamond_value",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("diamond weight")}</span>,
        accessorKey: "diamond_weight",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("stones weight")}</span>,
        accessorKey: "stones_weight",
        cell: (info: any) => info.getValue(),
      },
    ],
    []
  );

  const ColsWasted = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("identification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat",
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
      {
        cell: (info: any) =>
          item?.api_gold_price
            ? formatReyal(Number(item?.api_gold_price))
            : "---",
        accessorKey: "api_gold_price",
        header: () => <span>{t("selling price")}</span>,
      },
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

  const totalDiamondValue = item?.items?.reduce((acc, curr) => {
    acc += +curr.diamond_value;
    return acc;
  }, 0);

  const totalDiamondWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.diamond_weight;
    return acc;
  }, 0);

  const totalStonesWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.stones_weight;
    return acc;
  }, 0);

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      wage: formatReyal(Number(totalWage)),
      totalWages: formatReyal(Number(totalWages)),
      diamondValue: formatReyal(Number(totalDiamondValue)),
      diamondWeight: formatGram(Number(totalDiamondWeight)),
      stonesWeight: formatGram(Number(totalStonesWeight)),
    },
  ];

  const resultTableWasted = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      wage: formatReyal(Number(totalWage)),
      totalWages: formatReyal(Number(totalWages)),
      totalPrice: formatReyal(
        Number(item?.api_gold_price * item?.items?.length)
      ),
    },
  ];

  // const costDataAsProps = {
  //   // totalFinalCost,
  //   // totalGoldAmountGram,
  //   isBranchWasted: item?.boxes2?.length !== 0 ? true : false,
  //   recipientSignature: true,
  // };
  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalWages))
  );

  const costDataAsProps = {
    finalArabicData: [
      {
        title: t("total wages"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
    ],
    resultTable: item?.boxes2?.length !== 0 ? resultTableWasted : resultTable,
  };

  const totalWeightByKarat = item?.items.reduce((acc, { karat, weight }) => {
    const parsedWeight = parseFloat(weight) || 0;
    acc[karat] = (acc[karat] || 0) + parsedWeight;
    return acc;
  }, {});
  console.log(
    "🚀 ~ totalWeightByKarat ~ totalWeightByKarat:",
    totalWeightByKarat
  );

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

          {/* <InvoiceTable
            data={item?.items}
            columns={item?.boxes2?.length !== 0 ? ColsWasted : Cols}
            costDataAsProps={costDataAsProps}
            resultTable={
              item?.boxes2?.length !== 0 ? resultTableWasted : resultTable
            }
          ></InvoiceTable> */}

          <InvoiceTableData
            data={item?.items}
            columns={item?.boxes2?.length !== 0 ? ColsWasted : Cols}
            costDataAsProps={costDataAsProps}
          ></InvoiceTableData>

          {location.pathname === "/selling/payoff/supply-payoff" && (
            <div className="grid grid-cols-2 gap-4 mx-5">
              {["18", "21", "22", "24"]
                .filter((karat) => totalWeightByKarat?.[karat])
                .map((karat) => (
                  <div key={karat}>
                    <p className="font-bold">
                      {t(`total ${karat} gold box`)} :{" "}
                      <span className="text-mainGreen">
                        {totalWeightByKarat[karat]} {t("gram")}
                      </span>
                    </p>
                  </div>
                ))}
            </div>
          )}

          <div className="mx-5 bill-shadow rounded-md p-6 my-9 ">
            <FinalPreviewBillPayment
              responseSellingData={item}
              notQRCode={true}
              costDataAsProps={costDataAsProps}
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

export default RejectedItemsInvoice;
