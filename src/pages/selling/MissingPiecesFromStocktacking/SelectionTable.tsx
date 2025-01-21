import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, {
  HTMLProps,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useIsRTL } from "../../../hooks";
import { t } from "i18next";

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  // useEffect(() => {
  //   if (typeof indeterminate === "boolean") {
  //     ref.current.indeterminate = !rest.checked && indeterminate;
  //   }
  // }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

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
  initialState?: number;
  setRowSelection: React.Dispatch<SetStateAction<{}>>;
  rowSelection: {};
  getRowId: (row: T) => string;
}

function SelectionTable({
  data,
  columns,
  showNavigation,
  setRowSelection,
  rowSelection,
  footered = false,
  children,
  rowBackground,
  className,
  getRowId,
}: ReactTableProps<any>) {
  const isRTL = useIsRTL();

  const selectionColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              // indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      ...columns,
    ],
    [columns]
  );

  const table = useReactTable({
    data,
    columns: selectionColumns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    debugTable: true,
    getRowId,
  });

  return (
    <>
      <div className={`${footered ? "" : "GlobalTable"} w-full flex flex-col`}>
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
        </table>

        {/* Navigation */}
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
}

export default SelectionTable;
