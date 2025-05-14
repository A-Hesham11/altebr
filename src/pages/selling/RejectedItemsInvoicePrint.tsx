import { useMemo, useRef } from "react";
import { useIsRTL } from "../../hooks";
import { numberContext } from "../../context/settings/number-formatter";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import { t } from "i18next";
import { useReactToPrint } from "react-to-print";
import { Button } from "../../components/atoms";
import PaymentFinalPreviewBillData from "../Payment/PaymentFinalPreviewBillData";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";
import { useLocation } from "react-router-dom";

const RejectedItemsInvoicePrint = ({ item, printModalData }: any) => {
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { invoice_logo } = GlobalDataContext();
  const { pathname } = useLocation();

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.date || printModalData?.bond_date,
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
        accessorKey: "classification_name",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category_name",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("karat")}</span>,
        accessorKey: "karat_name",
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
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original?.classification_name === "دهب"
            ? info.getValue()
            : info.row.original?.karatmineral_name,
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
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
          info.getValue()
            ? formatReyal(Number(info.row.original.selling_price))
            : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("selling price")}</span>,
      },
    ],
    []
  );

  const totalWeight = item?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalWage = item?.reduce((acc, curr) => {
    acc += +curr.wage;
    return acc;
  }, 0);

  const totalWages = item?.reduce((acc, curr) => {
    acc += +curr.wage_total;
    return acc;
  }, 0);

  const totalWagesWasted = item?.reduce((acc, curr) => {
    acc += +curr.weight * +curr.wage;
    return acc;
  }, 0);

  const totalDiamondValue = item?.reduce((acc, curr) => {
    acc += +curr.diamond_value;
    return acc;
  }, 0);

  const totalDiamondWeight = item?.reduce((acc, curr) => {
    acc += +curr.diamond_weight;
    return acc;
  }, 0);

  const totalStonesWeight = item?.reduce((acc, curr) => {
    acc += +curr.stones_weight;
    return acc;
  }, 0);

  const totalSellingPrice = item?.reduce((acc, curr) => {
    acc += +curr.selling_price;
    return acc;
  }, 0);

  const filteredGolds = item?.filter(
    (item) => item?.classification_name === "دهب"
  );
  console.log("🚀 ~ RejectedItemsInvoicePrint ~ filteredGolds:", filteredGolds);

  const totalsOfWeight = item?.reduce((acc, curr) => {
    acc += (+curr.karat_name / 24) * +curr.weight;

    return acc;
  }, 0);
  console.log("🚀 ~ totalsOfWeight ~ totalsOfWeight:", totalsOfWeight);

  const resultTable = [
    {
      number: t("totals"),
      weight: totalWeight,
      wage: totalWage,
      totalWages: totalWages,
      diamondValue: totalDiamondValue,
      diamondWeight: totalDiamondWeight,
      stonesWeight: totalStonesWeight,
    },
  ];

  const resultTableWasted = [
    {
      number: t("totals"),
      weight: totalWeight,
      wage: "---",
      totalWages: formatReyal(totalWagesWasted),
      totalPrice: totalSellingPrice,
    },
  ];

  console.log(totalWages, totalSellingPrice, "🔥🔥🔥");

  const costDataAsProps = {
    // totalFinalCost,
    // totalGoldAmountGram,
    isBranchWasted: item?.boxes2?.length !== 0 ? true : false,
    recipientSignature: true,
    totalItemsCount: printModalData?.itemsCount,
  };

  const totalResult = {
    totalSelling: totalsOfWeight,
    totalWages:
      pathname === "/selling/branch-identity"
        ? totalWagesWasted + totalSellingPrice
        : totalWages + totalSellingPrice,
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
    bondNumber: printModalData?.bondNumber,
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
              invoiceNumber={
                item?.invoice_number || item?.id || printModalData.bondNumber
              }
              invoiceData={returnInvoiceToEdara}
            />
          </div>

          <InvoiceTable
            data={item}
            columns={item?.boxes2?.length !== 0 ? ColsWasted : Cols}
            costDataAsProps={costDataAsProps}
            totalResult={totalResult}
            resultTable={
              item?.boxes2?.length !== 0 ? resultTableWasted : resultTable
            }
          />

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

export default RejectedItemsInvoicePrint;
