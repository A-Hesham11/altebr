import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  paymentData?: any;
  costDataAsProps?: any;
  resultTable?: any;
  totalFinalCostIntoArabic?: string;
  isCodedIdentitiesPrint?: boolean;
  totalResult?: any;
}

const InvoiceTableData = <T extends object>({
  data,
  columns,
  costDataAsProps,
  resultTable,
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

  return (
    <div className="mx-5">
      <div className="mb-6 overflow-x-auto lg:overflow-x-visible w-full">
        <table className="mt-8 w-full table-shadow">
          {/* Table Header */}
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

          {/* Table Body */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-center">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-2 text-mainGreen bg-white border border-[#7B7B7B4D]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {/* Result Row */}
            {costDataAsProps?.resultTable?.length > 0 && (
              <tr className="text-center">
                {Object.keys(costDataAsProps?.resultTable[0]).map(
                  (key, index) => (
                    <td
                      key={key}
                      className="bg-[#F3F3F3] px-2 py-2 text-mainGreen border border-[#7B7B7B4D]"
                      colSpan={
                        index === 0
                          ? columns.length -
                            (Object.keys(costDataAsProps?.resultTable[0])
                              .length -
                              1)
                          : 1
                      }
                    >
                      {costDataAsProps?.resultTable[0][key]}
                    </td>
                  )
                )}
              </tr>
            )}
          </tbody>

          {/* Table Footer */}
          {costDataAsProps?.finalArabicData && (
            <tfoot>
              <tr className="text-center border border-[#7B7B7B4D]">
                {costDataAsProps.finalArabicData.map(
                  (item: any, index: number) => (
                    <td
                      key={index}
                      className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen border border-[#7B7B7B4D]"
                      colSpan={Math.ceil(
                        columns.length / costDataAsProps.finalArabicData.length
                      )}
                    >
                      {item.title && (
                        <span className="font-semibold">{item.title} :</span>
                      )}
                      <span className="font-medium">
                        {item.totalFinalCostIntoArabic}
                      </span>{" "}
                      {item.totalFinalCostIntoArabic && (
                        <>
                          <span className="font-semibold">{item.type}</span>{" "}
                          {/* <span className="font-semibold">
                            {t("and")} {item.decimalPart} {t("halalas")}
                          </span>{" "} */}
                          <span className="font-semibold">
                            {t("Only nothing else")}
                          </span>
                        </>
                      )}
                    </td>
                  )
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default InvoiceTableData;
