import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import React, { useMemo } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { Loading } from "../../organisms/Loading";

const SalesReportsTable = ({
  dataSource,
  isLoading,
  isRefetching,
  isFetching,
}: any) => {
  const { formatReyal, formatGram } = numberContext();
  const columnsHeader = useMemo<any>(
    () => [
      {
        accessorKey: "#",
        header: () => <span>{t("")}</span>,
        colSpan: 1,
      },
      {
        accessorKey: "total_Sales",
        header: () => <span>{t("Total Sales and Tax")}</span>,
        colSpan: 2,
      },
      {
        accessorKey: "detailed",
        header: () => <span>{t("Detailed")}</span>,
        colSpan: 2,
      },
      {
        accessorKey: "gold",
        header: () => <span>{t("Gold")}</span>,
        colSpan: 4,
      },
      {
        accessorKey: "non_Gold",
        header: () => <span>{t("Non-Gold")}</span>,
        colSpan: 2,
      },
    ],
    []
  );

  const columns = useMemo<any>(
    () => [
      {
        header: () => <span>{t("bill number")}</span>,
        accessorKey: "bill_number",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("Cash")}</span>,
        accessorKey: "cash",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("The Bank")}</span>,
        accessorKey: "bank",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("Sales Only")}</span>,
        accessorKey: "sales_only",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("VAT")}</span>,
        accessorKey: "vat",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("18")}</span>,
        accessorKey: "gold_18",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("21")}</span>,
        accessorKey: "gold_21",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("22")}</span>,
        accessorKey: "gold_22",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("24")}</span>,
        accessorKey: "gold_24",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("Diamond")}</span>,
        accessorKey: "diamond",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("accessory")}</span>,
        accessorKey: "accessory",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
    ],
    []
  );

  const tableHeader = useReactTable({
    data: [],
    columns: columnsHeader,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const table = useReactTable({
    data: dataSource ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1000000,
      },
    },
  });

  const totalCash = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.cash);
  }, 0);
  const totalBank = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.bank);
  }, 0);
  const totalSalesOnly = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.sales_only);
  }, 0);
  const totalVat = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.vat);
  }, 0);
  const totalGold18 = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.gold_18);
  }, 0);
  const totalGold21 = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.gold_21);
  }, 0);
  const totalGold22 = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.gold_22);
  }, 0);
  const totalGold24 = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.gold_24);
  }, 0);
  const totalDiamond = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.diamond);
  }, 0);
  const totalAccessory = dataSource?.reduce((acc, curr) => {
    return Number(acc) + Number(curr.accessory);
  }, 0);

  const Totals = [
    { id: crypto.randomUUID(), total: formatReyal(totalCash) },
    { id: crypto.randomUUID(), total: formatReyal(totalBank) },
    { id: crypto.randomUUID(), total: formatReyal(totalSalesOnly) },
    { id: crypto.randomUUID(), total: formatReyal(totalVat) },
    { id: crypto.randomUUID(), total: formatGram(totalGold18) },
    { id: crypto.randomUUID(), total: formatGram(totalGold21) },
    { id: crypto.randomUUID(), total: formatGram(totalGold22) },
    { id: crypto.randomUUID(), total: formatGram(totalGold24) },
    { id: crypto.randomUUID(), total: formatReyal(totalDiamond) },
    { id: crypto.randomUUID(), total: formatReyal(totalAccessory) },
  ];

  const totalGold18convert24 = Number(totalGold18) * Number(18 / 24);
  const totalGold21convert24 = Number(totalGold21) * Number(21 / 24);
  const totalGold22convert24 = Number(totalGold22) * Number(22 / 24);

  const totalGoldConverter24 =
    totalGold18convert24 +
    totalGold21convert24 +
    totalGold22convert24 +
    totalGold24;

  const finalTotals = [
    { id: crypto.randomUUID(), total: "", colSpan: 1 },
    {
      id: crypto.randomUUID(),
      total: formatReyal(Number(totalCash) + Number(totalBank)),
      colSpan: 2,
    },
    {
      id: crypto.randomUUID(),
      total: t("24 Karat Converter"),
      colSpan: 2,
      className: "text-end",
    },
    {
      id: crypto.randomUUID(),
      total: formatGram(totalGoldConverter24),
      colSpan: 4,
    },
    { id: crypto.randomUUID(), total: "", colSpan: 2 },
  ];

  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading statement of accounts")}`} />;

  return (
    <div className="rounded-2xl overflow-hidden">
      <table className="min-w-full text-center border-b ">
        <thead>
          {tableHeader.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`!bg-mainGreen text-white font-semibold px-6 py-4 text-sm`}
                  colSpan={header.column.columnDef.colSpan || 1}
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
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`!bg-[#295E5633] text-mainGreen font-semibold px-6 py-4 text-sm border-x`}
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
            <tr
              key={row.id}
              className={`border-b cursor-pointer bg-[#e9edec] `}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className={`whitespace-nowrap px-3 py-3 text-sm font-light !text-gray-900 w-fit`}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot className="text-center">
          <tr className="text-center ">
            {finalTotals?.map((item) => (
              <td
                key={item.id}
                className={`!bg-mainGreen text-white font-bold ${
                  !!item.total && "border-x"
                } px-2 py-2  gap-x-2 items-center ${item.className}`}
                colSpan={item.colSpan}
              >
                {item.total}
              </td>
            ))}
          </tr>
        </tfoot>
        <tfoot className="text-center ">
          <tr className="text-center ">
            <td
              className="!bg-[#295E5633] font-bold text-mainGreen border-x px-2 py-2  gap-x-2 items-center "
              colSpan={1}
            >
              {t("Totals")}
            </td>
            {Totals?.map((item) => (
              <td
                key={item.id}
                className="!bg-[#295E5633] font-bold text-mainGreen border-x px-2 py-2  gap-x-2 items-center "
              >
                {item.total}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalesReportsTable;
