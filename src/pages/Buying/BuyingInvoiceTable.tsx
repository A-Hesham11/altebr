import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import { numberContext } from "../../context/settings/number-formatter";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  paymentData: any;
  costDataAsProps?: any;
}

const BuyingInvoiceTable = <T extends object>({
  data,
  columns,
  paymentData,
  costDataAsProps,
  setOdwyaTypeValue,
  odwyaTypeValue,
}: ReactTableProps<T>) => {
  const { formatGram, formatReyal } = numberContext();

  // CUSTOM CONFIGURE FOR TABLE
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // FORMULA TO CALC TOTAL COST, VALUE ADDED TAX, TOTAL VALUE
  const totalWeight = data.reduce((acc: number, curr: any) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = data.reduce((acc: number, curr: any) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const valueAddedTax = data.reduce((acc: number, curr: any) => {
    acc += +curr.value_added_tax;
    return acc;
  }, 0);
  const totalValue = data.reduce((acc: number, curr: any) => {
    acc += +curr.total_value;
    return acc;
  }, 0);

  let totalFinalCostIntoArabic;

  if (odwyaTypeValue === "supplier") {
    totalFinalCostIntoArabic = convertNumToArWord(
      Math.round(costDataAsProps?.totalValueAfterTax)
    );
  } else {
    totalFinalCostIntoArabic = convertNumToArWord(
      Math.round(costDataAsProps?.totalCost)
    );
  }

  const totalItemsTax =
    +costDataAsProps?.totalItemsTaxes?.toFixed(2) +
    costDataAsProps?.totalCommissionTaxes;

  const totalItemsCost =
    costDataAsProps?.totalCommissionRatio + costDataAsProps?.totalCost;

  let resultTable;

  if (odwyaTypeValue === "supplier") {
    resultTable = [
      {
        number: t("totals"),
        cost: formatReyal(totalCost),
        value_added_tax: formatReyal(valueAddedTax),
        total_value: formatReyal(totalValue.toFixed(2)),
      },
    ];
  } else {
    resultTable = [
      {
        number: t("totals"),
        cost: formatReyal(totalCost),
      },
    ];
  }

  return (
    <>
      <div className="mx-6">
        <div className="mb-6 overflow-x-scroll lg:overflow-x-visible w-full">
          <table className="mt-8 w-[872px] lg:w-full table-shadow">
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
                      className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                      colSpan={index === 0 ? 5 : 1}
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
                  colSpan={9}
                >
                  <span className="font-semibold">{t("total")}</span>:{" "}
                  <span className="font-medium">
                    {totalFinalCostIntoArabic}
                  </span>
                  <span className="font-semibold"> {t("reyal")}</span>{" "}
                  <span className="font-semibold">
                    {t("Only nothing else")}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default BuyingInvoiceTable;
