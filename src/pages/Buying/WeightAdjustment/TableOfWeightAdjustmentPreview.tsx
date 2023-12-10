import { t } from "i18next";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { Form, Formik, useFormikContext } from "formik";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useReactTable } from "@tanstack/react-table";
import { formatDate } from "../../../utils/date";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useNavigate } from "react-router-dom";

type TableOfWeightAdjustmentPreview_TP = {
  item: any;
  setInputWeight: any;
  inputWeight: any;
  setWeightModal: any;
  setOperationTypeSelect: any;
};

const TableOfWeightAdjustmentPreview = ({
  item,
  setInputWeight,
  inputWeight,
  setWeightModal,
  setOperationTypeSelect,
}: TableOfWeightAdjustmentPreview_TP) => {
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();

  // FORMULA FOR EDITED TOTAL WEIGHT
  const totalEditedWeight = item.reduce(
    (acc: number, cur: any) => acc + Number(cur.weight),
    0
  );

  const [inputValue, setInputValue] = useState(totalEditedWeight);
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:41 ~ inputValue:", inputValue)
  const weightDifference = +inputValue - +totalEditedWeight;
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:43 ~ weightDifference:", weightDifference)
  const weightDifferencePerWeight = (+weightDifference / item.length).toFixed(
    2
  );
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:47 ~ weightDifferencePerWeight:", weightDifferencePerWeight)

  const [inputValue2, setInputValue2] = useState();
  console.log("🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:50 ~ inputValue2:", inputValue2)
  const test = item.map(
    (item: any) => +item.weight + +weightDifferencePerWeight
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
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => {
          // setRowWage(info.row.original.wage);
          return (
            <input
              type="number"
              className="w-20 rounded-md h-10 text-center"
              min="1"
              name="weight_input"
              id="weight_input"
              onBlur={(e) => {
                setInputWeight((prev) => {
                  const existingItemIndex = prev.findIndex(
                    (item) => item.id === info.row.original.id
                  );

                  if (existingItemIndex !== -1) {
                    return prev.map((item, index) =>
                      index === existingItemIndex
                        ? { ...item, value: e.target.value }
                        : item
                    );
                  } else {
                    return [
                      ...prev,
                      { value: e.target.value, id: info.row.original.id },
                    ];
                  }
                });
              }}
              // onChange={(e) =>
              //   setInputValue2(
              //     Math.abs(totalEditedWeight - inputValue) / item.length
              //   )
              // }
            />
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

  // POSTING EDITED WEIGHT
  function PostNewValue(value: any) {
    mutate({
      endpointName: "/buyingUsedGold/api/v1/edit_items_weight",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  // GET THE EDITED INVOICES API
  const { data: listEditedInvoice } = useFetch({
    queryKey: ["list_edited_invoice"],
    endpoint: `/buyingUsedGold/api/v1/list_edited_invoices/${userData?.branch_id}?per_page=10000`,
  });

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
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (+weightDifferencePerWeight !== 0) {
                setInputValue2(
                  (e.target.value - totalEditedWeight) / item.length
                );
              }
            }}
            className="rounded-md h-10 text-center"
          />
        </div>
        <Button
          type="submit"
          action={() => {
            console.log({
              invoice: {
                branch_id: userData?.branch_id,
                invoice_date: formatDate(new Date()),
                count: item?.length,
                employee_id: item[0]?.employee_id,
                invoice_number: listEditedInvoice?.length,
              },
              items: item.map((el, i) => {
                if (inputValue !== totalEditedWeight) {
                  return {
                    id: el.id,
                    // weight: Number(inputWeight[i].value),
                    weight: test[i],
                  };
                } else {
                  return {
                    id: el.id,
                    // weight: Number(inputWeight[i].value),
                    weight: Number(inputWeight[i]?.value) || 0,
                  };
                }
              }),
            });

            PostNewValue({
              invoice: {
                branch_id: userData?.branch_id,
                invoice_date: formatDate(new Date()),
                count: item?.length,
                employee_id: item[0]?.employee_id,
                invoice_number: listEditedInvoice?.length,
              },
              items: item.map((el, i) => {
                if (inputValue !== totalEditedWeight) {
                  return {
                    id: el.id,
                    // weight: Number(inputWeight[i].value),
                    weight: test[i],
                  };
                } else {
                  return {
                    id: el.id,
                    // weight: Number(inputWeight[i].value),
                    weight: Number(inputWeight[i]?.value) || 0,
                  };
                }
              }),
            });

            setWeightModal(false);
            setOperationTypeSelect([]);
            setInputWeight([]);
            navigate("/buying/weightAdjustmentBonds/");
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
