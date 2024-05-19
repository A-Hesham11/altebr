// src/TableComponent.js

import React, { useEffect, useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { ReactNode } from "react";
import { t } from "i18next";
import { Button } from "../../components/atoms";
import { useIsRTL } from "../../hooks";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  showNavigation?: boolean;
  showGlobalFilter?: boolean;
  filterFn?: FilterFn<T>;
  footered?: boolean;
  children?: ReactNode;
}

export const TableComponent = <T extends object>({
  data,
  columns,
  showNavigation,
  footered = false,
  children,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: data.length } },
  });

  const isRTL = useIsRTL();

  useEffect(() => {
    table.setPageSize(data.length);
  }, [data.length, table]);

  return (
    <>
      <div
        className={`${
          footered ? "" : "GlobalTable"
        }  w-full flex flex-col gap-4`}
      >
        <table className="min-w-full text-center">
          <thead className="border-b bg-mainGreen">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-sm font-medium text-white"
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
                    className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                      footered && i === table.getRowModel().rows.length - 1
                        ? "!bg-mainGreen !text-white"
                        : "!bg-lightGreen !text-gray-900"
                    } `}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {showNavigation ? (
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className="text-mainGreen">
                {table.getState().pagination.pageIndex + 1}
              </span>
              {t("from")}
              <span className="text-mainGreen">{table.getPageCount()} </span>
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className="rounded bg-mainGreen p-[.18rem]"
                action={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {isRTL ? (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                )}
              </Button>
              <Button
                className="rounded bg-mainGreen p-[.18rem]"
                action={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {isRTL ? (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                )}
              </Button>
            </div>
          </div>
        ) : null}
        {children && children}
      </div>
    </>
  );
};
