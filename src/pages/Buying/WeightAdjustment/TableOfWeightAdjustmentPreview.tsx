import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { Form } from "formik";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useReactTable } from "@tanstack/react-table";

const TableOfWeightAdjustmentPreview = ({
  item,
  setInputWeight,
  inputWeight,
  setWeightModal,
}) => {
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:18 ~ item:", item)
  const queryClient = useQueryClient();

const totalEditedWeight = item.reduce(
  (acc, cur) => acc + Number(cur.weight),
  0
  )
  const [inputValue, setInputValue] = useState(totalEditedWeight);
  const weightDifference = Math.abs(totalEditedWeight - inputValue);
  const weightDifferencePerWeight = weightDifference / item.length;
  const [inputValue2, setInputValue2] = useState();
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:29 ~ inputValue2:", inputValue2)
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:28 ~ weightDifferencePerWeight:", weightDifferencePerWeight)
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:27 ~ weightDifference:", weightDifference)


  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:27 ~ inputValue:", inputValue)

console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:25 ~ totalEditedWeight:", totalEditedWeight)
useEffect(() => {
  setInputValue2(weightDifferencePerWeight)
}, [inputValue])
  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => {
          // setRowWage(info.row.original.wage);
          console.log(
            "🚀 ~ file: TableOfTransformBranch.tsx:87 ~ info.row.original:",
            info.row.original
          );
          return (
            <>
              <input
                type="number"
                className="w-20 rounded-md h-10 text-center"
                min="1" 
                max={info.row.original.weight}
                name="weight_input"
                id="weight_input"
                value={inputValue2}
                onBlur={(e) => {
                  setInputWeight((prev) => {
                    // Check if the object with the same id exists in the array
                    const existingItemIndex = prev.findIndex(
                      (item) => item.id === info.row.original.id
                    );

                    if (existingItemIndex !== -1) {
                      // If the object exists, update its value
                      return prev.map((item, index) =>
                        index === existingItemIndex
                          ? { ...item, value: e.target.value }
                          : item
                      );
                    } else {
                      // If the object doesn't exist, add a new one
                      return [
                        ...prev,
                        { value: e.target.value, id: info.row.original.id },
                      ];
                    }
                  });
                }}
                onChange={(e) => setInputValue2(+e.target.value) }
              />
            </>
          );
        },
        accessorKey: "edit_weight",
        header: () => <span>{t("edit weight")}</span>,
      },
    ],
    []
  );

  const { mutate, isLoading: editItemsLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["edit_items-api"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["wegiht_table"]);
    },
    onError: (error) => {
      notify("error", error.response.data.errors.msg);
    },
  });

  function PostNewValue(value: any) {
    mutate({
      endpointName: "/buyingUsedGold/api/v1/edit_items_weight",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  return (
    <div>
      {/* TABLE */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="mb-4 text-center w-max border border-slate-300 py-2 px-3 rounded-md mx-auto bg-gray-200">
          {t("specified invoice")}
        </h2>
        <Table data={item} columns={tableColumn}></Table>
        
        <div className="flex items-center gap-4 mt-4">
          <h2>{t("total edited weight")}</h2>
          <input type="number" value={inputValue} 
          onChange={(e) => {
            setInputValue(e.target.value)
            } } className="rounded-md h-10 text-center"/>
        </div>
        <Button
          type="submit"
          action={() => {
            console.log({
              items: item.map((el, i) => {
                return {
                  id: el.id,
                  weight: Number(inputWeight[i].value),
                };
              }),
            });

            PostNewValue({
              items: item.map((el, i) => {
                return {
                  id: el.id,
                  weight: Number(inputWeight[i].value),
                };
              }),
            });

            setWeightModal(false);
          }}
          className="bg-mainGreen text-white self-end"
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
};

export default TableOfWeightAdjustmentPreview;
