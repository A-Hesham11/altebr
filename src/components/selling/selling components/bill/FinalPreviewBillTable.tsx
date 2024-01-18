import React, { useMemo, useState } from 'react'
import { Selling_TP } from '../data/SellingTableData';
import { useFetch } from '../../../../hooks';
import { t } from "i18next";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { numberContext } from '../../../../context/settings/number-formatter';
import { Button } from '../../../atoms';
import { Loading } from '../../../organisms/Loading';

type Paginate_Selling_TP = {
  current_page: number;
  pages: number;
  data: Selling_TP[];
};

const FinalPreviewBillTable = ({
  paymentData
}) => {

  const [page, setPage] = useState<number>(1);
  const { formatGram, formatReyal } = numberContext();


  // const { data, isSuccess, refetch, isRefetching, isLoading, isFetching } =
  // useFetch<Paginate_Selling_TP>({
  //   endpoint: `twredDiamond/api/v1/diamondBonds?page=${page}`,
  //   queryKey: ["finalBill-table"],
  //   pagination: true,
  //   onSuccess(data) {
  //     setDataSource(data.data);
  //   },
  // });

  const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "id",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("mineral weight")}</span>,
        accessorKey: "classification",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stones weight")} </span>,
        accessorKey: "supplier_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("total white")} </span>,
        accessorKey: "supplier_id",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "total_diamond_value",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("statement")} </span>,
        accessorKey: "bond_date",
        cell: (info) => info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("price per gram")} </span>,
        accessorKey: "item_count",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "VAT",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info) => info.getValue() || "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: paymentData,
    columns: sellingCols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const resultTable = [
    {
      number: 2,
      price: "فقط ثلاثمائة و أربعة و عشرون ريال سعودي",
      priceGram: "الاجمالي",
      value: "310 ر.س",
      vat: "140 ر.س",
      total: "423 ر.س"
  }
]



  return (
    <div>
       {/* {(isLoading || isRefetching) && <Loading mainTitle={t("items")} />} */}
            {
                !!paymentData.length && (
                  <table className="mt-8 mb-2 w-full overflow-x-scroll table-shadow">
                    <thead className="bg-mainGreen text-white">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="py-4 px-2">
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

                          {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="text-center">
                              {row.getVisibleCells().map((cell, i) => (
                                <td
                                  className="px-2 py-2 text-mainGreen bg-white gap-x-2 items-center border border-[#7B7B7B4D]"
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


                      <tr className='text-center'>
                        {Object.keys(resultTable[0]).map((key, index) => {
                          return (
                            <td className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-l last:border-none border-[#7B7B7B4D]"
                                colSpan={index === 1 ? 5 : 1}
                            >
                                {resultTable[0][key]}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
            )}
    </div>
  )
}

export default FinalPreviewBillTable