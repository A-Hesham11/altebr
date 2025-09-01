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
import InvoiceBasicHeader from "../../Invoice/InvoiceBasicHeader";

const RejectedItemsInvoice = ({ item }: any) => {
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const location = useLocation();
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext(authCtx);

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
        accessorKey: "karatmineral_name",
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
          item?.selling_price
            ? formatReyal(Number(item?.selling_price))
            : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("selling price")}</span>,
      },
    ],
    []
  );

  const totalWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalWeightKarat18 = item?.items
    ?.filter((curr) => curr.karat == 18)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeightKarat21 = item?.items
    ?.filter((curr) => curr.karat == 21)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeightKarat22 = item?.items
    ?.filter((curr) => curr.karat == 22)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeightKarat24 = item?.items
    ?.filter((curr) => curr.karat == 24)
    ?.reduce((acc, curr) => acc + +curr.weight, 0);

  const totalWeight18To24 = (totalWeightKarat18 * 18) / 24;
  const totalWeight21To24 = (totalWeightKarat21 * 21) / 24;
  const totalWeight22To24 = (totalWeightKarat22 * 22) / 24;

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

  const totalSellingPrice = item.items?.reduce((acc, curr) => {
    acc += +curr.selling_price;
    return acc;
  }, 0);

  const totalDiamondStonesValue = item?.items?.reduce((acc, curr) => {
    acc += +curr.selling_price;
    return acc;
  }, 0);

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      wage: "---",
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
      totalPrice: formatReyal(Number(totalSellingPrice)),
    },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalWages) + Number(totalSellingPrice))
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
        title: t("total value"),
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

  const totalWeightByKarat = item?.items.reduce((acc, { karat, weight }) => {
    const parsedWeight = parseFloat(weight) || 0;
    acc[karat] = (acc[karat] || 0) + parsedWeight;
    return acc;
  }, {});

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
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

  const invoiceHeaderBasicData = {
    first_title: "branch number",
    first_value: item?.invoice_number || item?.bond_number || item?.id,
    second_title: "bond date",
    second_value: clientData?.bond_date,
    bond_date: item?.invoice_number || item?.bond_number || item?.id,
    bond_title: "bond number",
    invoice_number: userData?.branch?.id,
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
          data={item?.items}
          columns={item?.boxes2?.length !== 0 ? ColsWasted : Cols}
          costDataAsProps={costDataAsProps}
        ></InvoiceTableData>

        {/* <ul className="flex items-center justify-between w-full">
          {totalKaratWeight?.map((item) => (
            <li className="rounded-xl overflow-hidden text-center">
              <h2 className="bg-mainGreen text-white px-16 py-1.5">
                {item.title}
              </h2>
              <p className="bg-[#F3F3F3] py-1.5">{item.weight}</p>
            </li>
          ))}
        </ul> */}

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

        <div className="print-footer my-5">
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

export default RejectedItemsInvoice;
