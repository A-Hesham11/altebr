import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../context/settings/number-formatter";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

const PaymentToManagementTable = ({ item }: { item?: {} }) => {
  
  const { formatReyal, formatGram } = numberContext();

  const totalValueReyal = item?.items.reduce((acc, item) => {
    acc += +item.value_reyal;
    return acc;
  }, 0)

  const totalValueGram = item?.items.reduce((acc, item) => {
    acc += +item.value_gram;
    return acc;
  }, 0)

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "card_name",
        header: () => <span>{t("payment method")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "value_reyal",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "value_gram",
        header: () => <span>{t("Gold value (in grams)")}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: item?.items,
    columns: tableColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <div className="mt-16">
        <table className="min-w-full text-center">
          <thead className="border-b bg-mainGreen">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-sm font-medium text-white border-[1px] border-[#7B7B7B4D]"
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
            {table.getRowModel().rows.map((row, i) => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map((cell) => (
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-sm font-light !bg-lightGreen !text-gray-900 border-[1px] border-[#7B7B7B4D]`}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className='text-center'>
              <tr className='text-center border-[1px] border-[#7B7B7B4D]'>
                  <td className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                      {t('total')}
                  </td>
                  <td className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                    {formatReyal(+totalValueReyal)} <span>{t("reyal")}</span>
                  </td>
                  <td className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                    {formatGram(totalValueGram)} <span>{t("gram")}</span>
                  </td>
              </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default PaymentToManagementTable;