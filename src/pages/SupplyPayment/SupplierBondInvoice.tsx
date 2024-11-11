import React, { useContext, useMemo, useRef } from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { t } from "i18next";
import { Button } from "../../components/atoms";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useIsRTL } from "../../hooks";
import { Selling_TP } from "../selling/PaymentSellingPage";
import { useReactToPrint } from "react-to-print";
import PaymentInvoiceTable from "../Payment/PaymentInvoiceTable";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";

const SupplierBondInvoice = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.supplier_id,
    bond_date: item?.date,
    supplier_id: item?.supplier,
  };

  // const resultTable = [
  //   {
  //     number: t("totals"),
  //     weight: totalWeight,
  //     cost: totalCost,
  //   },
  // ];

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.value_reyal;
    return acc;
  }, 0);
  console.log("🚀 ~ totalFinalCost ~ totalFinalCost:", totalFinalCost);

  const totalGoldAmountGram = item?.items?.reduce((acc, curr) => {
    acc += +curr.value_gram;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalFinalCost,
    totalGoldAmountGram,
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("payment method")}</span>,
        accessorKey: "card_name",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("amount")}</span>,
        accessorKey: "value_reyal",
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("Gold value (in grams)")}</span>,
        accessorKey: "value_gram",
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: item?.items || [],
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
    }
    `,
  });

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

      <div className={`${isRTL ? "rtl" : "ltr"} m-4`} ref={invoiceRefs}>
        <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
          <div className="mx-5 bill-shadow rounded-md p-6">
            <FinalPreviewBillData
              clientData={clientData}
              invoiceNumber={item?.id}
              employee_name={item?.employee_name}
            />
          </div>

          <div className="mx-5">
            <PaymentInvoiceTable
              data={item?.items}
              columns={Cols || []}
              costDataAsProps={costDataAsProps}
            ></PaymentInvoiceTable>
          </div>

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

export default SupplierBondInvoice;
