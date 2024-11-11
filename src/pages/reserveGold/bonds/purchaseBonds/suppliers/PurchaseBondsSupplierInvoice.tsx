import { t } from "i18next";
import { useMemo, useRef } from "react";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { useIsRTL } from "../../../../../hooks";
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

const PurchaseBondsSupplierInvoice = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.invoice_date,
    supplier_id: item?.supplier_id,
    supplier_name: item?.supplier_name,
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
          <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
            <div className="mx-5 bill-shadow rounded-md p-6">
              <FinalPreviewBillData
                clientData={clientData}
                invoiceNumber={item?.id}
              />
            </div>

            <div className="mx-5">
              <div className="mb-6 overflow-x-auto lg:overflow-x-visible w-full">
                <table className="mt-8 w-full table-shadow">
                  <thead className="bg-mainGreen text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="py-4 px-2 text-center"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-4 text-sm font-medium text-mainGreen bg-[#E5ECEB] border border-[#7B7B7B4D]"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <tr key={row.id} className="text-center item">
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <td
                                className="px-2 py-2 text-mainGreen bg-white gap-x-2 items-center border border-[#7B7B7B4D]"
                                key={cell.id}
                                colSpan={1}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    <tr className="text-center">
                      {Object.keys(resultSellingBondTable[0]).map(
                        (key, index) => {
                          return (
                            <td
                              key={key}
                              className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                              colSpan={index === 0 ? 1 : 1}
                            >
                              {resultSellingBondTable[0][key]}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  </tbody>
                  <tfoot className="text-center">
                    <tr className="text-center border-[1px] border-[#7B7B7B4D]">
                      <td
                        className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                        colSpan={9}
                      >
                        <span className="font-semibold">{t("total")}</span>:{" "}
                        <span className="font-medium">
                          {totalFinalCostIntoArabic}
                        </span>
                        <span className="font-semibold"> {t("reyal")}</span>{" "}
                        <span className="font-semibold">
                          {t("Only nothing else")}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
    </>
  );
};

export default PurchaseBondsSupplierInvoice;
