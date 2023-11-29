import { t } from "i18next";
import React, { useMemo, useState } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { Form } from "formik";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";

const TableOfWeightAdjustmentPreview = ({
  item,
  setInputWeight,
  inputWeight,
}) => {
  console.log(
    "🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:4 ~ TableOfWeightAdjustmentPreview ~ item:",
    item
  );

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
        header: () => <span>{t("weight before edit")}</span>,
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
      // QueryClient.refetchQueries(["thwel-api"]);
    },
    onError: (error) => {
      notify("error", error.response.data.msg);
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
