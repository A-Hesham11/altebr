import { useContext, useMemo, useRef } from "react";
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
import { authCtx } from "../../context/auth-and-perm/auth";
import InvoiceBasicHeader from "../../components/Invoice/InvoiceBasicHeader";
import InvoiceTableData from "../../components/selling/selling components/InvoiceTableData";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";
import { useLocation } from "react-router-dom";

const RejectedItemsInvoicePrint = ({ item, printModalData }: any) => {
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext(authCtx);
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

  const totalsOfWeight = item?.reduce((acc, curr) => {
    acc += (+curr.karat_name / 24) * +curr.weight;

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
      totalWages: formatReyal(Number(totalWagesWasted)),

      totalPrice: totalSellingPrice,
    },
  ];

  // const costDataAsProps = {
  //   // totalFinalCost,
  //   // totalGoldAmountGram,
  //   isBranchWasted: item?.boxes2?.length !== 0 ? true : false,
  //   recipientSignature: true,
  //   totalItemsCount: printModalData?.itemsCount,
  // };

  const totalWeightKarat18 = item
    ?.filter((curr) => curr.karat_name == 18)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeightKarat21 = item
    ?.filter((curr) => curr.karat_name == 21)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeightKarat22 = item
    ?.filter((curr) => curr.karat_name == 22)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeightKarat24 = item
    ?.filter((curr) => curr.karat_name == 24)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeight18To24 = (totalWeightKarat18 * 18) / 24;
  const totalWeight21To24 = (totalWeightKarat21 * 21) / 24;
  const totalWeight22To24 = (totalWeightKarat22 * 22) / 24;

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalWages))
  );

  const totalFinalWeightIntoArabic = convertNumToArWord(
    Math.round(
      Number(
        totalWeight18To24 +
          totalWeight21To24 +
          totalWeight22To24 +
          totalWeightKarat24
      )
    )
  );

  const totalKaratWeight = [
    { title: "karat 18", weight: totalWeightKarat18 },
    { title: "karat 21", weight: totalWeightKarat21 },
    { title: "karat 22", weight: totalWeightKarat22 },
    { title: "karat 24", weight: totalWeightKarat24 },
  ];

  const costDataAsProps = {
    finalArabicData: [
      {
        title: t("total cash"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("total weight converted to 24"),
        totalFinalCostIntoArabic: totalFinalWeightIntoArabic,
        type: t("gram"),
      },
    ],
    resultTable: item?.boxes2?.length !== 0 ? resultTableWasted : resultTable,
    totalKaratWeight: totalKaratWeight,
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

  const invoiceHeaderBasicData = {
    first_title: "branch number",
    first_value: item?.invoice_number || item?.bond_number || item?.id,
    second_title: "bond date",
    second_value: clientData?.bond_date,
    bond_date: item?.invoice_number || item?.bond_number || item?.id,
    bond_title: "bond number",
    invoice_number: userData?.branch_id,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "supply bond",
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
      <div
        ref={contentRef}
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
      >
        <div
          className={`print-header ${
            invoice_logo?.is_include_header_footer === "1"
              ? "opacity-1"
              : "opacity-0 h-12 print:h-80"
          }`}
        >
          <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
        </div>

        <InvoiceTableData
          data={item}
          columns={item?.boxes2?.length !== 0 ? ColsWasted : Cols}
          costDataAsProps={costDataAsProps}
        ></InvoiceTableData>

        <div className="print-footer my-6">
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
  );
};

export default RejectedItemsInvoicePrint;
