import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, TableState } from "@tanstack/react-table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "../../../atoms";
import { ReactNode, useRef } from "react";
import { t } from "i18next";
import { useIsRTL } from "../../../../hooks";
interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  showNavigation?: boolean;
  showGlobalFilter?: boolean;
  filterFn?: FilterFn<T>;
  footered?: boolean;
  children?: ReactNode;
  rowBackground?: string;
  className?: string;
  Totals?: any;
}

export const Table = <T extends object>({
  data,
  columns,
  showNavigation,
  footered = false,
  children,
  rowBackground,
  className,
  Totals,
}: ReactTableProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: data?.length > 10 ? 100000 : 10,
      },
    },
  });

  const isRTL = useIsRTL();

  return (
    <>
      <div
        ref={tableContainerRef}
        className={`${footered ? "" : "GlobalTable"} w-full flex flex-col`}
      >
        {/* Table Header */}
        <table className="min-w-full text-center border-b ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`${
                      className
                        ? className
                        : "bg-mainGreen text-white font-medium"
                    } px-6 py-4 text-sm`}
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
                        : `${
                            rowBackground ? rowBackground : "!bg-lightGreen"
                          } !text-gray-900`
                    }`}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {Totals && (
            <tfoot className="text-center ">
              <tr className="text-center ">
                {Totals?.map((item) => (
                  <td
                    key={item.id}
                    className="!bg-mainGreen font-medium !text-white border-x px-2 py-2  gap-x-2 items-center "
                  >
                    {item.value}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>

        {/* Navigation */}
        {showNavigation ? (
          <div className="mt-3 flex items-center justify-end gap-5 p-2 no-print">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className="text-mainGreen">
                {table.getState().pagination.pageIndex + 1}
              </span>
              {t("from")}
              <span className="text-mainGreen">{table.getPageCount()} </span>
            </div>
            <div className="flex items-center gap-2">
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
