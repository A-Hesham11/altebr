import { t } from "i18next";
import { useMemo, useRef } from "react";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../../../hooks";
import { Selling_TP } from "../../../../selling/PaymentSellingPage";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReactToPrint } from "react-to-print";
import { Button } from "../../../../../components/atoms";
import FinalPreviewBillData from "../../../../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "../../../../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { convertNumToArWord } from "../../../../../utils/number to arabic words/convertNumToArWord";
import InvoiceFooter from "../../../../../components/Invoice/InvoiceFooter";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import InvoiceTableData from "../../../../../components/selling/selling components/InvoiceTableData";
import InvoiceBasicHeader from "../../../../../components/Invoice/InvoiceBasicHeader";

const PurchaseBondsSupplierInvoice = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo } = GlobalDataContext();

  const { data } = useFetch<any>({
    endpoint: `/supplier/api/v1/supplier/${item?.supplier_id}`,
    queryKey: [`clients`],
  });

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: item?.invoice_date,
    second_title: "supplier name",
    second_value: item?.supplier_name,
    third_title: "mobile number",
    third_value: data?.phone,
    bond_date: item?.invoice_date,
    bond_title: "bill no",
    invoice_number: Number(item?.invoice_number),
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "cost_after_tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const totalWeigth = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items?.reduce((acc, curr) => {
    acc += +curr.tax;
    return acc;
  }, 0);

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost_after_tax;
    return acc;
  }, 0);

  const table = useReactTable({
    data: item?.items,
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: item?.items?.length,
      },
    },
  });

  const resultSellingBondTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeigth)),
      cost: formatReyal(Number(totalCost)),
      vat: formatReyal(Number(totalItemsTaxes)),
      total: formatReyal(Number(totalFinalCost)),
    },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

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
        weight: formatGram(Number(totalWeigth)),
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

        <div className={`${isRTL ? "rtl" : "ltr"} m-4`} ref={invoiceRefs}>
          <div className="print-header">
            <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
          </div>

          <div className="print-content">
            <InvoiceTableData
              data={item?.items}
              columns={Cols || []}
              costDataAsProps={costDataAsProps}
            ></InvoiceTableData>
          </div>

          <div className="print-footer">
            <FinalPreviewBillPayment
              responseSellingData={item}
              notQRCode={true}
            />
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseBondsSupplierInvoice;
