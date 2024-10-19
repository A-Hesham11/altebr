import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";
import { t } from "i18next";

const PaymentInvoiceTable = ({
  data,
  columns,
  paymentData,
  costDataAsProps,
  isCodedIdentitiesPrint,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { formatGram, formatReyal } = numberContext();

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(costDataAsProps?.totalFinalCost)
  );

  const totalFinalCostIntoArabicGram = convertNumToArWord(
    Math.round(costDataAsProps?.totalGoldAmountGram)
  );

  const resultTable = [
    {
      number: t("totals"),
      cost:
        costDataAsProps && formatReyal(Number(costDataAsProps?.totalFinalCost)),
      costGram:
        costDataAsProps &&
        formatReyal(Number(costDataAsProps?.totalGoldAmountGram)),
    },
  ];

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

              <tr className="text-center">
                {Object.keys(resultTable[0]).map((key, index) => {
                  return (
                    <td
                      key={key}
                      className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                      colSpan={index === 0 ? 1 : 1}
                    >
                      {resultTable[0][key]}
                    </td>
                  );
                })}
              </tr>
            </tbody>
            {!isCodedIdentitiesPrint && (
              <tfoot className="text-center">
                <tr className="text-center border-[1px] border-[#7B7B7B4D]">
                  <td
                    className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                    colSpan={1}
                  >
                    <span className="font-bold">{t("total")}</span>:{" "}
                  </td>
                  <td
                    className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                    colSpan={1}
                  >
                    {totalFinalCostIntoArabic}{" "}
                    <span className="mx-2 font-bold">{t("reyal")}</span>
                  </td>
                  <td
                    className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                    colSpan={1}
                  >
                    {totalFinalCostIntoArabicGram}
                    <span className="mx-2 font-bold">{t("gram")}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default PaymentInvoiceTable;
