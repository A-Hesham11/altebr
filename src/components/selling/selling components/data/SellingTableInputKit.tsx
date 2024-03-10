import React, { Fragment, useMemo } from "react";
import { BaseInputField } from "../../../molecules";
import { useFormikContext } from "formik";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Selling_TP } from "../../../../pages/Buying/BuyingPage";
import { Button } from "../../../atoms";
import { notify } from "../../../../utils/toast";
import { t } from "i18next";
import { numberContext } from "../../../../context/settings/number-formatter";

type SellingKit_TP = {
  dataSource?: any;
  selectedItemDetails?: any;
  setSelectedItemDetails?: any;
  kitDetails?: any;
  TaxRateOfBranch?: any;
  setOpenDetails?: any;
  setEditSellingTaklfa?: any;
  setEditSellingTaklfaAfterTax?: any;
};

const SellingTableInputKit = ({
  dataSource,
  selectedItemDetails,
  setSelectedItemDetails,
  kitDetails,
  TaxRateOfBranch,
  setOpenDetails,
  setEditSellingTaklfa,
  setEditSellingTaklfaAfterTax,
}: SellingKit_TP) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const { formatGram, formatReyal } = numberContext();

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => "#",
        accessorKey: "action",
        cell: (info: any) => {
          console.log("🚀 ~ info:", info.row.index);

          return (
            <div className="flex items-center justify-center gap-4">
              <input
                type="checkbox"
                className={`border-mainGreen text-mainGreen rounded bg-red-600' ${
                  info.row.original.status && "bg-neutral-400"
                }`}
                id={info.row.original.id}
                name="selectedItem"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItemDetails((prev) => [
                      ...prev,
                      { ...info.row.original, index: info.row.index },
                    ]);
                  } else {
                    setSelectedItemDetails((prev) =>
                      prev.filter((item) => item.index !== info.row.index)
                    );
                  }
                }}
                disabled={info.row.original.status}
              />
            </div>
          );
        },
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("cost")}</span>,
        accessorKey: "selling_price",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
    ],
    []
  );

  const tablePopup = useReactTable({
    data: kitDetails,
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filterStatusOfKit = values.weightitems.filter(
    (item) => item.status === 0
  );

  return (
    <Fragment>
      {dataSource &&
      dataSource[0]?.weightitems.find(
        (itemWeight) => itemWeight.weight == 0
      ) ? (
        <>
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 my-3 w-full">
            <div className="flex items-center justify-between py-4">
              {dataSource[0]?.weightitems?.map((item) => {
                return (
                  <BaseInputField
                    placeholder={item?.category_name}
                    id={item?.category_name}
                    name={item?.category_name}
                    type="text"
                    label={item?.category_name}
                    disabled={item.weight != 0}
                    className={`${item.weight != 0 && "bg-mainDisabled"}`}
                    onChange={(e) => {
                      setSelectedItemDetails((prev: any) => {
                        const index = prev?.findIndex(
                          (prevItem) =>
                            item?.category_id === prevItem?.category_id
                        );
                        const updatedState = [...prev];

                        if (e.target.value !== "") {
                          // Check if weight is not empty
                          if (index !== -1) {
                            updatedState[index] = {
                              category_id: item.category_id,
                              category_name: item.category_name,
                              weight: e.target.value,
                            };
                          } else {
                            updatedState.push({
                              category_id: item.category_id,
                              category_name: item.category_name,
                              weight: e.target.value,
                            });
                          }
                        } else {
                          // If weight is empty, remove the item if it exists in the array
                          if (index !== -1) {
                            updatedState.splice(index, 1);
                          }
                        }
                        return updatedState;
                      });

                      setFieldValue(`weightitems-${item.category_name}`, {
                        category_id: item.category_id,
                        category_name: item.category_name,
                        weight: e.target.value,
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <table className="mt-8 w-[815px] lg:w-full">
            <thead className="bg-mainGreen text-white text-center">
              {tablePopup.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="py-4 px-2 w-full">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-2 text-sm font-medium text-white border w-[11%]"
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
              {tablePopup.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="text-center">
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        className="px-2 py-2 bg-lightGreen bg-[#295E5608] gap-x-2 items-center border border-[#C4C4C4]"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      <div className="flex gap-4 justify-end items-center w-full">
        <Button
          type="submit"
          action={() => {
            const clacSelectedWeight = selectedItemDetails.reduce(
              (acc, item) => {
                acc += Number(item.weight);
                return acc;
              },
              0
            );

            const clacSelectedCost = selectedItemDetails.reduce((acc, item) => {
              acc += Number(item.selling_price);
              return acc;
            }, 0);

            const remainingWeight =
              Number(values?.sel_weight) - Number(clacSelectedWeight);

            const costItem =
              values.classification_id === 1
                ? (Number(values.karat_price) + Number(values.wage)) *
                  Number(clacSelectedWeight)
                : Number(clacSelectedCost);

            const priceWithCommissionRate =
              Number(costItem) * (Number(values?.min_selling) * 0.01) +
              Number(costItem);

            const priceWithCommissionCash =
              Number(costItem) + Number(values?.min_selling);

            const priceWithSellingPolicy =
              values?.min_selling_type === "نسبة"
                ? priceWithCommissionRate
                : priceWithCommissionCash;

            const taklfaAfterTax =
              priceWithSellingPolicy * TaxRateOfBranch + priceWithSellingPolicy;

            const checkedFromWeight = selectedItemDetails?.every(
              (item) => item.weight !== ""
            );

            const checkedFromPeiceisLength =
              selectedItemDetails?.length == dataSource[0]?.weightitems?.length;

            if (
              Number(clacSelectedWeight) >
              Number(dataSource[0]?.remaining_weight)
            ) {
              notify(
                "info",
                "The sum of weights is more than the remaining weight"
              );
            } else if (
              checkedFromWeight &&
              checkedFromPeiceisLength &&
              Number(clacSelectedWeight) < Number(values?.sel_weight)
            ) {
              notify(
                "info",
                "The sum of weights is less than the remaining weight"
              );
            } else if (
              filterStatusOfKit.length !== selectedItemDetails.length &&
              Number(values.weight) === Number(clacSelectedWeight)
            ) {
              notify("info", "The weight must be distributed among the pieces");
            } else if (
              filterStatusOfKit.length === 1 &&
              Number(values.weight) !== Number(selectedItemDetails[0]?.weight)
            ) {
              notify("info", "The full weight must be added");
            } else {
              setFieldValue("taklfa", priceWithSellingPolicy);

              setFieldValue("taklfa_after_tax", Number(taklfaAfterTax));

              setFieldValue("remaining_weight", remainingWeight);

              setFieldValue("cost", costItem);

              setFieldValue("weight", clacSelectedWeight);

              setOpenDetails(false);
            }

            setEditSellingTaklfa(Number(priceWithSellingPolicy));
            setEditSellingTaklfaAfterTax(Number(priceWithSellingPolicy));
          }}
        >
          {`${t("confirm")}`}
        </Button>
      </div>
    </Fragment>
  );
};

export default SellingTableInputKit;
