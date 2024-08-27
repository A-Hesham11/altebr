import React from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { t } from "i18next";

interface HonestFinalScreenItems_TP {
  data: any;
  sanadData: any;
  columns: any;
  costDataAsProps: any;
}

const HonestFinalScreenItems: React.FC<HonestFinalScreenItems_TP> = ({
  sanadData,
  data,
  columns,
  costDataAsProps,
}) => {
  const { formatGram, formatReyal } = numberContext();

  // CUSTOM CONFIGURE FOR TABLE
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(costDataAsProps?.totalCost)
  );

  const totalFinalAmountIntoArabic = convertNumToArWord(
    Math.round(sanadData?.amount)
  );

  const totalFinalRemainingAmountIntoArabic = convertNumToArWord(
    Math.round(sanadData?.remaining_amount)
  );

  return (
    <>
      <div className="mx-6">
        <div className="mb-6 overflow-x-auto lg:overflow-x-visible w-full">
          <table className="mt-8 w-full table-shadow">
            <thead className="bg-mainGreen text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="py-4">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 text-sm font-medium text-mainGreen bg-[#E5ECEB] border-l last:border-none border-[#7B7B7B4D]"
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
                          className="py-2 text-mainGreen bg-white gap-x-2 items-center border border-[#7B7B7B4D]"
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
                      className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                      colSpan={index === 0 ? 3 : 2}
                    >
                      {resultTable[0][key]}
                    </td>
                  );
                })}
              </tr> */}
            </tbody>
            <tfoot className="text-center">
              <tr className="text-center border-[1px] border-[#7B7B7B4D]">
                <td
                  className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                  colSpan={2}
                >
                  <span className="font-bold">
                    {t("total of estimated cost")}
                  </span>
                  : {totalFinalCostIntoArabic}
                </td>
                <td
                  className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                  colSpan={2}
                >
                  <span className="font-bold">{t("total of amount paid")}</span>
                  : {totalFinalAmountIntoArabic}
                </td>
                <td
                  className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                  colSpan={2}
                >
                  <span className="font-bold">{t("deserved amount")}</span>:{" "}
                  {totalFinalRemainingAmountIntoArabic}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default HonestFinalScreenItems;
