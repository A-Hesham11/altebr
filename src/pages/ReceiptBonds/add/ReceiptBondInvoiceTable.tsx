import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import { useMemo } from "react";
import { Selling_TP } from "../../selling/PaymentSellingPage";

const ReceiptBondInvoiceTable = ({ data }: any) => {
  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("amount paid")}</span>,
        accessorKey: "amountPaid",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("tax")} </span>,
        accessorKey: "tax",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("total")}</span>,
        accessorKey: "total",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="mx-5">
        <div className="mb-6 overflow-x-auto lg:overflow-x-visible w-full">
          <table className="mt-8 w-full table-shadow">
            <thead className="bg-mainGreen text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="py-4 px-2 text-center">
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
                  <tr key={row.id} className="text-center">
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
              {/* <tr className="text-center">
                {Object.keys(resultTable[0]).map((key, index) => {
                  return (
                    <td
                      key={key}
                      className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                      colSpan={
                        index === 0
                          ? columns?.length -
                            (Object.keys(resultTable[0])?.length - 1)
                          : 1
                      }
                    >
                      {resultTable[0][key]}
                    </td>
                  );
                })}
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReceiptBondInvoiceTable;
