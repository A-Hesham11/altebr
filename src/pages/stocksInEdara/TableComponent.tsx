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
import { numberContext } from "../../context/settings/number-formatter";

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
  const { formatGram, formatReyal } = numberContext();

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

  // const totalsOfFirstDebit = data.reduce((acc: any, curr: any) => {
  //   if (Number(curr.first_period_debit) > 0) {
  //     return acc + Number(curr.first_period_debit);
  //   }

  //   return acc;
  // }, 0);

  // const totalsOfFirstCredit = data.reduce((acc: any, curr: any) => {
  //   if (Number(curr.first_period_credit) > 0) {
  //     return acc + Number(curr.first_period_credit);
  //   }

  //   return acc;
  // }, 0);

  const totalsOfMovementDebit = data.reduce((acc: any, curr: any) => {
    if (Number(curr.movement_debit) > 0) {
      return acc + Number(curr.movement_debit);
    }

    return acc;
  }, 0);

  const totalsOfMovementCredit = data.reduce((acc: any, curr: any) => {
    if (Number(curr.movement_credit) > 0) {
      return acc + Number(curr.movement_credit);
    }

    return acc;
  }, 0);

  const totalsOfBalanceDebit =
    Number(data[data?.length - 1]?.first_period_debit) +
    totalsOfMovementDebit -
    totalsOfMovementCredit;

  const totalsOfBalanceCredit =
    Number(data[data?.length - 1]?.first_period_credit) +
    totalsOfMovementCredit -
    totalsOfMovementDebit;

  let tableTotalResult = [
    {
      name: t("totals"),
      totalsOfFirstDebit:
        Number(data[0]?.first_period_debit) > 0
          ? formatReyal(data[0]?.first_period_debit)
          : "---",
      totalsOfFirstCredit:
        Number(data[0]?.first_period_credit) > 0
          ? `(${formatReyal(data[0]?.first_period_credit)})`
          : "---",
      totalsOfMovementDebit: formatReyal(totalsOfMovementDebit),
      totalsOfMovementCredit: `(${formatReyal(totalsOfMovementCredit)})`,
      totalsOfBalanceDebit:
        Number(data[data?.length - 1]?.balance_debtor) > 0
          ? formatReyal(data[data?.length - 1]?.balance_debtor)
          : "---",
      totalsOfBalanceCredit:
        Number(data[data?.length - 1]?.balance_credit) > 0
          ? `(${formatReyal(data[data?.length - 1]?.balance_credit)})`
          : "---",
    },
  ];

  return (
    <>
      <div
        className={`${
          footered ? "" : "GlobalTable"
        }  w-full flex flex-col gap-4 h-[20.1rem] overflow-y-scroll scrollbar-none`}
      >
        <table className="min-w-full text-center">
          <thead className="border-b bg-mainGreen sticky top-0">
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
          <tfoot className="sticky bottom-0">
            <tr className="border-b">
              {Object.keys(tableTotalResult[0]).map((key, index) => {
                return (
                  <td
                    className="!bg-mainGreen !text-white"
                    colSpan={index === 0 ? 4 : 1}
                  >
                    {tableTotalResult[0][key]}
                  </td>
                );
              })}
            </tr>
          </tfoot>
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
