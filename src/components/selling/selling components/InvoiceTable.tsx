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
  resultTable?: any;
  totalFinalCostIntoArabic?: string;
  isCodedIdentitiesPrint?: boolean;
}

const InvoiceTable = <T extends object>({
  data,
  columns,
  paymentData,
  costDataAsProps,
  resultTable,
  totalResult,
}: ReactTableProps<T>) => {
  console.log("🚀 ~ costDataAsProps:", costDataAsProps);
  console.log("🚀 ~ columns:", columns);

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
  const { userData } = useContext(authCtx);

  const taxRate = userData?.tax_rate / 100;
  const pathname = location.pathname;

  // const totalWeight = data?.reduce((acc, curr) => {
  //   acc += +curr.weight;
  //   return acc;
  // }, 0);

  // const totalWeightOfSelsal = data?.reduce((acc, item) => {
  //   return (
  //     acc + item?.selsal?.reduce((subAcc, curr) => subAcc + +curr.weight, 0)
  //   );
  // }, 0);

  const totalCost = data?.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalCommissionRatio = paymentData?.reduce((acc, card) => {
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_riyals;
    }
    return acc;
  }, 0);

  const totalCommissionTaxes = paymentData?.reduce((acc, card) => {
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_tax;
    }
    return acc;
  }, 0);

  const totalFinalCost =
    Number(totalCost) +
    Number(totalCommissionRatio) +
    Number(totalCost) * taxRate +
    Number(totalCommissionTaxes);

  const locationPath = location.pathname;

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(
      locationPath === "/selling/addInvoice/" ||
        locationPath === "/selling/viewInvoice/" ||
        locationPath === "/selling/payoff/sales-return" ||
        locationPath === "/selling/honesty/all-return-honest"
        ? costDataAsProps?.totalFinalCost
        : locationPath === "/bonds/supply-return" ||
          locationPath === "/selling/wasteReturn"
        ? costDataAsProps?.totalCost
        : totalFinalCost
    )
  );
  console.log("🚀 ~ totalFinalCostIntoArabic:", totalFinalCostIntoArabic);

  // const hasSelsal =
  //   locationPath === "/selling/payoff/sales-return" && totalWeightOfSelsal
  //     ? totalWeightOfSelsal
  //     : 0;

  // const resultTable = [
  //   {
  //     number: t("totals"),
  //     weight: formatGram(Number(totalWeight) + Number(hasSelsal)),
  //     cost: costDataAsProps
  //       ? formatReyal(Number(costDataAsProps?.totalCost))
  //       : formatReyal(Number(totalCost + totalCommissionRatio)),
  //     vat: costDataAsProps
  //       ? formatReyal(Number(costDataAsProps?.totalItemsTaxes))
  //       : formatReyal(Number(totalCost * taxRate + totalCommissionTaxes)),
  //     total: costDataAsProps
  //       ? formatReyal(Number(costDataAsProps?.totalFinalCost))
  //       : formatReyal(Number(totalFinalCost)),
  //   },
  // ];

  // const resultReturnTable = [
  //   {
  //     number: t("totals"),
  //     weight: formatGram(Number(totalWeight) + Number(hasSelsal)),
  //     cost: costDataAsProps
  //       ? formatReyal(Number(costDataAsProps?.totalCost))
  //       : formatReyal(Number(totalCost + totalCommissionRatio)),
  //   },
  // ];

  // const resultTotalTable =
  //   locationPath === "/bonds/supply-return" ? resultReturnTable : resultTable;

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
                      colSpan={
                        index === 0
                          ? columns?.length -
                            (Object.keys(resultTable[0])?.length - 1)
                          : 1
                      }
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
                  colSpan={
                    costDataAsProps?.isBranchWasted === true
                      ? columns?.length / 3
                      : columns?.length
                  }
                >
                  {costDataAsProps?.totalFinalCostIntoArabic ||
                    (totalFinalCostIntoArabic && (
                      <>
                        <span className="font-semibold">{t("total")}</span>:{" "}
                        {
                          <span className="font-medium">
                            {totalResult ? (
                              <span className="font-medium">
                                {convertNumToArWord(
                                  Math.round(totalResult?.totalSelling)
                                )}
                              </span>
                            ) : (
                              <span className="font-medium">
                                {costDataAsProps
                                  ? costDataAsProps?.totalFinalCostIntoArabic
                                  : totalFinalCostIntoArabic}
                              </span>
                            )}
                          </span>
                        }
                        <span className="font-semibold"> {t("gram")}</span>{" "}
                        <span className="font-semibold">
                          {t("Only nothing else")}
                        </span>
                      </>
                    ))}
                </td>
                {costDataAsProps?.isBranchWasted === true && (
                  <td
                    className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                    colSpan={columns?.length / 2}
                  >
                    <span className="font-semibold">
                      {" "}
                      {pathname === "/selling/branch-identity"
                        ? t("total cash")
                        : t("total wages")}
                    </span>
                    :{" "}
                    {totalResult ? (
                      <span className="font-medium">
                        {convertNumToArWord(
                          Math.round(totalResult?.totalWages)
                        )}
                      </span>
                    ) : (
                      <span className="font-medium">
                        {costDataAsProps
                          ? costDataAsProps?.totalFinalCostIntoArabic
                          : totalFinalCostIntoArabic}
                      </span>
                    )}
                  </td>
                )}

                {/* <td
                  colSpan={columns?.length / 2}
                  className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                >
                  <>
                    <span className="font-semibold">
                      {t("total items counts")}
                    </span>
                    :{" "}
                    <span className="font-semibold">
                      {" "}
                      {costDataAsProps.totalItemsCount}
                    </span>{" "}
                  </>
                </td> */}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default InvoiceTable;
