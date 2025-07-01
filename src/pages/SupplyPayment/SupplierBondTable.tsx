import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../context/settings/number-formatter";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const SupplierBondTable = ({ item }: { item?: {} }) => {
  const { formatReyal, formatGram } = numberContext();

  const totalValueReyal = item?.items.reduce((acc, item) => {
    acc += +item.value_reyal;
    return acc;
  }, 0);

  const totalValueGram = item?.items.reduce((acc, item) => {
    acc += +item.value_gram;
    return acc;
  }, 0);

  const totalStockDifference = item?.items.reduce((acc, item) => {
    acc += +item.stock_difference;
    return acc;
  }, 0);

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "card_name",
        header: () => <span>{t("payment method")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
        accessorKey: "value_reyal",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "value_gram",
        header: () => <span>{t("Gold value (in grams)")}</span>,
      },
      {
        cell: (info: any) => Number(info.getValue()) || "---",
        accessorKey: "stock_difference",
        header: () => <span>{t("stock difference")}</span>,
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
  });

  // FOR TABLE ACCOUNTING ENTRY
  let restrictions = item.boxes?.map(
    ({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_gram:
        computational_movement === "debtor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      debtor_SRA:
        computational_movement === "debtor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
      creditor_gram:
        computational_movement === "creditor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      creditor_SRA:
        computational_movement === "creditor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
    })
  );

  // group by account
  const restrictionsWithoutTotals = restrictions?.reduce((prev, curr) => {
    const index = prev.findIndex((item) => item.bian === curr.bian);
    if (index === -1) {
      prev.push(curr);
    } else {
      prev[index].debtor_gram += curr.debtor_gram;
      prev[index].debtor_SRA += curr.debtor_SRA;
      prev[index].creditor_gram += curr.creditor_gram;
      prev[index].creditor_SRA += curr.creditor_SRA;
    }
    return prev;
  }, [] as typeof restrictions);

  restrictions = restrictionsWithoutTotals;

  let restrictionsTotals;
  if (restrictions && !!restrictions.length) {
    restrictionsTotals = restrictions?.reduce((prev, curr) => ({
      bian: `${t("totals")}`,
      debtor_gram: prev.debtor_gram + curr.debtor_gram,
      debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
      creditor_gram: prev.creditor_gram + curr.creditor_gram,
      creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
    }));
  }

  if (restrictionsTotals) restrictions?.push(restrictionsTotals!);

  return (
    <>
      <div className="mt-8">
        <div className="my-8">
          <h2 className="text-xl mb-5 font-bold">{t("accounting entry")}</h2>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="text-center ">
              <tr className="text-center border-[1px] border-[#7B7B7B4D]">
                <td className="bg-mainGreen px-2 py-2 font-medium text-white gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {t("total")}
                </td>
                <td className="bg-mainGreen px-2 py-2 font-medium text-white gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {formatReyal(+totalValueReyal)} <span>{t("reyal")}</span>
                </td>
                <td className="bg-mainGreen px-2 py-2 font-medium text-white gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {formatGram(+totalValueGram)} <span>{t("gram")}</span>
                </td>
                <td className="bg-mainGreen px-2 py-2 font-medium text-white gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {totalStockDifference}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <h2 className="text-xl mb-5 font-bold">{t("accounting entry")}</h2>
          <div className={`w-full flex flex-col gap-4`}>
            <table className="min-w-full text-center">
              <thead className="border-b bg-mainGreen">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-white">
                    {t("description")}
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-white">
                    {t("gram (debtor)")}
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-white">
                    {t("reyal (debtor)")}
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-white">
                    {t("gram (creditor)")}
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-white">
                    {t("reyal (creditor)")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {restrictions?.map((restriction, i) => {
                  return (
                    <>
                      <tr key={i} className="border-b">
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                            i == item.boxes.length - 1
                              ? "!bg-mainGreen !text-white"
                              : "!bg-lightGreen !text-gray-900"
                          } `}
                        >
                          {restriction.bian}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                            i == item.boxes.length - 1
                              ? "!bg-mainGreen !text-white"
                              : "!bg-lightGreen !text-gray-900"
                          } `}
                        >
                          {formatGram(restriction.debtor_gram)}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                            i == item.boxes.length - 1
                              ? "!bg-mainGreen !text-white"
                              : "!bg-lightGreen !text-gray-900"
                          } `}
                        >
                          {formatReyal(restriction.debtor_SRA)}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                            i == item.boxes.length - 1
                              ? "!bg-mainGreen !text-white"
                              : "!bg-lightGreen !text-gray-900"
                          } `}
                        >
                          {formatGram(restriction.creditor_gram)}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                            i == item.boxes.length - 1
                              ? "!bg-mainGreen !text-white"
                              : "!bg-lightGreen !text-gray-900"
                          } `}
                        >
                          {formatReyal(restriction.creditor_SRA)}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierBondTable;
