import { t } from "i18next";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { Form, Formik, useFormikContext } from "formik";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
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
  console.log(
    "🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:29 ~ inputWeight:",
    inputWeight
  );
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();

  // FORMULA FOR EDITED TOTAL WEIGHT
  const totalEditedWeight = item.reduce(
    (acc: number, cur: any) => acc + Number(cur.weight),
    0
  );

  const [inputValue, setInputValue] = useState(totalEditedWeight);
  const weightDifference = +inputValue - +totalEditedWeight;
  const weightDifferencePerWeight = (+weightDifference / item.length).toFixed(
    2
  );

  // const [inputValue2, setInputValue2] = useState();

  // let finalValue = item.map((item: any) => {
  //   if (+weightDifference > 0) {
  //     return (
  //       +item.weight +
  //       (+item.weight / +totalEditedWeight) * Math.abs(+weightDifference)
  //     );
  //   } else {
  //     return (
  //       +item.weight -
  //       (+item.weight / +totalEditedWeight) * Math.abs(+weightDifference)
  //     );
  //   }
  // });

  const finalValue = useMemo(() => {
    return item.map((item: any) => {
      if (+weightDifference > 0) {
        return (
          +item.weight +
          (+item.weight / +totalEditedWeight) * Math.abs(+weightDifference)
        );
      } else {
        return (
          +item.weight -
          (+item.weight / +totalEditedWeight) * Math.abs(+weightDifference)
        );
      }
    });
  }, [weightDifference, totalEditedWeight, item]);

  console.log(
    "🚀 ~ file: TableOfWeightAdjustmentPreview.tsx:60 ~ finalValue ~ finalValue:",
    finalValue
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
          return (
            <>
              <input
                type="number"
                className="w-24 rounded-md h-10 text-center placeholder:text-mainBlack"
                min="1"
                name="weight_input"
                placeholder={+finalValue[info.row.index]?.toFixed(2)}
                // value={+test[info.row.index].toFixed(2)}
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
              />
            </>
          );
        },
        accessorKey: "edit_weight",
        header: () => <span>{t("edit weight")}</span>,
      },
    ],
    [finalValue]
    // []
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
            placeholder={totalEditedWeight}
            onChange={(e) => {
              setInputValue(e.target.value);
              // if (+weightDifferencePerWeight !== 0) {
              //   setInputValue2(
              //     (e.target.value - totalEditedWeight) / item.length
              //   );
              // }
            }}
            className={`${
              inputValue == 0
                ? "bg-red-100 text-center"
                : "rounded-md h-10 text-center"
            }`}
          />
        </div>
        <Button
          type="submit"
          // action={() => {
          //   if (
          //     inputValue == 0 ||
          //     inputWeight.some((el) => el?.value == "" || el?.value == 0)
          //   ) {
          //     notify("error", t("enter value greater than zero"));
          //     return;
          //   }

          //   console.log({
          //     invoice: {
          //       branch_id: userData?.branch_id,
          //       invoice_date: formatDate(new Date()),
          //       count: item?.length,
          //       employee_id: item[0]?.employee_id,
          //       invoice_number: listEditedInvoice?.length,
          //     },
          //     items: item.map((el, i) => {
          //       if (inputValue !== totalEditedWeight) {
          //         return {
          //           id: el.id,
          //           // weight: Number(inputWeight[i].value),
          //           weight: +finalValue[i].toFixed(2),
          //         };
          //       } else {
          //         return {
          //           id: el.id,
          //           // weight: Number(inputWeight[i].value),
          //           weight: Number(inputWeight[i]?.value) || 0,
          //         };
          //       }
          //     }),
          //   });

          // PostNewValue({
          //     invoice: {
          //       branch_id: userData?.branch_id,
          //       invoice_date: formatDate(new Date()),
          //       count: item?.length,
          //       employee_id: item[0]?.employee_id,
          //       invoice_number: listEditedInvoice?.length,
          //     },
          //     items: item.map((el, i) => {
          //       if (inputValue !== totalEditedWeight) {
          //         return {
          //           id: el.id,
          //           // weight: Number(inputWeight[i].value),
          //           weight: +finalValue[i].toFixed(2),
          //         };
          //       } else {
          //         return {
          //           id: el.id,
          //           // weight: Number(inputWeight[i].value),
          //           weight: Number(inputWeight[i]?.value) || 0,
          //         };
          //       }
          //     }),
          //   });

          //   setWeightModal(false);
          //   setOperationTypeSelect([]);
          //   setInputWeight([]);
          //   navigate("/buying/weightAdjustmentBonds/");
          // }}

          action={async () => {
            try {
              if (
                inputValue == 0 ||
                inputWeight.some((el) => el?.value == "" || el?.value == 0)
              ) {
                notify("error", t("enter value greater than zero"));
                return;
              }

              const postData = {
                invoice: {
                  branch_id: userData?.branch_id,
                  invoice_date: formatDate(new Date()),
                  count: item?.length,
                  employee_id: item[0]?.employee_id,
                  invoice_number: listEditedInvoice?.length + 1,
                },
                items: item.map((el, i) => {
                  if (inputValue !== totalEditedWeight) {
                    return {
                      id: el.id,
                      weight: +finalValue[i].toFixed(2),
                    };
                  } else {
                    return {
                      id: el.id,
                      weight: Number(inputWeight[i]?.value) || 0,
                    };
                  }
                }),
              };

              await PostNewValue(postData);

              setWeightModal(false);
              setOperationTypeSelect([]);
              setInputWeight([]);
              navigate("/buying/weightAdjustmentBonds/");
            } catch (error) {
              notify("error", error);
            }
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
