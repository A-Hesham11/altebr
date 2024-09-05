import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { numberContext } from "../../../context/settings/number-formatter";
import { useContext } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  paymentData?: any;
  costDataAsProps?: any;
  isCodedIdentitiesPrint?: boolean;
  finalArabicTotals?: any;
}

const InvoiceBondsReactTable = <T extends object>({
  data,
  columns,
  paymentData,
  costDataAsProps,
  finalArabicTotals,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: data?.length,
      },
    },
  });

  const { formatGram, formatReyal } = numberContext();

  const totalWeight = data?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalFinalCost = finalArabicTotals?.value;
  const totalFinalWeight24 = finalArabicTotals?.weight;

  const locationPath = location.pathname;

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  const totalFinalWeightIntoArabicGram = convertNumToArWord(
    Math.round(totalFinalWeight24)
  );

  const resultTable = [
    {
      number: t("totals"),
      weight:
        costDataAsProps && formatReyal(Number(costDataAsProps?.totalWeights)),
      wage: costDataAsProps && formatReyal(Number(costDataAsProps?.totalWage)),
      cost:
        costDataAsProps && formatReyal(Number(costDataAsProps?.totalValues)),
      pieces:
        costDataAsProps && formatReyal(Number(costDataAsProps?.totalItems)),
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
                      colSpan={index === 0 ? 2 : 1}
                    >
                      {resultTable[0][key]}
                    </td>
                  );
                })}
              </tr>
            </tbody>
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
                  colSpan={3}
                >
                  {totalFinalCostIntoArabic}{" "}
                  <span className="font-bold">{t("reyal")}</span>{" "}
                  <span className="font-bold">{t("only nothing else")}</span>
                </td>
                <td
                  className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                  colSpan={3}
                >
                  {totalFinalWeight24 > 0 ? (
                    <>
                      {totalFinalWeightIntoArabicGram}{" "}
                      <span className="font-bold">{t("gram")}</span>{" "}
                      <span className="font-bold">
                        {t("only nothing else")}
                      </span>
                    </>
                  ) : (
                    "----"
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default InvoiceBondsReactTable;
