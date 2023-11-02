import React, { useMemo, useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { t } from 'i18next';
import { Selling_TP } from '../selling components/data/SellingTableData';


const AllStonesDetails = ({ showData }) => {

      const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
        () => [
          {
            header: () => <span>{t("stone type")}</span>,
            accessorKey: "stone_id",
            cell: (info) => info.getValue() || "---",
          },
          {
            header: () => <span>{t("stone color")} </span>,
            accessorKey: "color_id",
            cell: (info) => info.getValue()  || "---",
          },
          {
            header: () => <span>{t("stone shape")}</span>,
            accessorKey: "shape_id",
            cell: (info) => info.getValue()  || "---",
          },
    
          {
            header: () => <span>{t("stone purity")}</span>,
            accessorKey: "purity_id",
            cell: (info) => info.getValue()  || "---",
          },
    
         
          {
            header: () => <span>{t("stone weight")} </span>,
            accessorKey: "weight",
            cell: (info) => info.getValue()  || "---",
          },
          {
            header: () => <span>{t("number of stones")} </span>,
            accessorKey: "count",
            cell: (info) => info.getValue() || "---",
          },
          {
            header: () => <span>{t("stone nature")} </span>,
            accessorKey: "nature_id",
            cell: (info) => info.getValue()  || "---",
          },
    
          {
            header: () => <span>{t("stone certificate number")} </span>,
            accessorKey: "certificate_number",
            cell: (info) => info.getValue()  || "---",
          },
          
          {
            header: () => <span>{t("stone certificate source")} </span>,
            accessorKey: "certificate_source",
            cell: (info) => info.getValue()  || "---",
          },
          {
            header: () => <span>{t("stone certificate link")}</span>,
            accessorKey: "certificate_url",
            cell: (info) => info.getValue()  || "---",
          },
        ],
        []
      );
    
      const table = useReactTable({
        data: showData,
        columns: sellingCols,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      });

  return (
    <div className='overflow-x-scroll lg:overflow-x-visible p-6 text-center'>
        <p className='text-base font-bold bg-mainGreen p-2 rounded-lg text-white w-fit m-auto'>{t("stone details")}</p>
        <table className="mt-8 w-full lg:w-full">
            <thead className="bg-[#E5ECEB] text-mainGreen text-center">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="py-4 px-2">
                {headerGroup.headers.map((header) => (
                    <th
                    key={header.id}
                    className="px-2 py-4 text-sm font-medium text-mainGreen border border-[#C4C4C4]"
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
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="text-center">
                    {row.getVisibleCells().map((cell, i) =>  (
                        <td
                          className="px-2 py-2 bg-white gap-x-2 items-center border border-[#C4C4C4]"
                          key={cell.id}
                          >
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </td>
                    ))}
                    </tr>
                ))}
            </tbody>
            <tfoot className="h-[40px]">
              <tr>
                {table.getRowModel().rows.map((row) => {
                    return (
                      <td colSpan={10} className="text-start bg-white px-4  border border-[#C4C4C4]" key={row.id}>
                          <span className="text-l font-bold">{t("stone specification")}</span>
                          <span>{row.original.details } : </span>
                      </td>
                    )
                }).slice(0, 1)}
              </tr>
          </tfoot>
        </table>
    </div>
  )
}

export default AllStonesDetails