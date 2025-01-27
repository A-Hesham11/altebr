import React, { Fragment, useMemo } from "react";
import { Form, Formik, useFormikContext } from "formik";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { Selling_TP } from "../../../pages/selling/PaymentSellingPage";
import { BaseInputField } from "../../molecules";
import { Button } from "../../atoms";
import { notify } from "../../../utils/toast";
import { Table } from "../../templates/reusableComponants/tantable/Table";

const InventoryKitInBranch = ({
  selectedItem,
  kitItemsData,
  setKitItemsData,
  setIdentitiesCheckedItems,
  addItemToIdentity,
  currenGroupNumber,
  setOpenKitItems,
}: any) => {
  console.log("🚀 ~ kitItemsData:", kitItemsData)
  const { formatGram, formatReyal } = numberContext();

  const KitItemDetails = selectedItem?.weightitems;
 
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
                    setKitItemsData((prev) => [
                      ...prev,
                      { ...info.row.original, index: info.row.index },
                    ]);
                  } else {
                    setKitItemsData((prev) =>
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

  return (
    <Formik initialValues={{ category_name: "" }} onSubmit={() => {}}>
      {({ setFieldValue }) => {
        return (
          <Form>
            <div>
              {KitItemDetails?.find((item) => item.weight == 0) ? (
                <>
                  <div className="bg-flatWhite rounded-lg bill-shadow p-5 my-3 w-full">
                    <div className="grid grid-cols-3 gap-5 items-center justify-between py-4">
                      {KitItemDetails?.map((item) => {
                        return (
                          <BaseInputField
                            placeholder={item?.category_name}
                            id={item?.category_name}
                            name={item?.category_name}
                            type="text"
                            label={item?.category_name}
                            disabled={item.status == 1}
                            className={`${
                              item.status == 1 && "bg-mainDisabled"
                            }`}
                            value={item?.weight}
                            onChange={(e) => {
                              setKitItemsData((prev: any) => {
                                const index = prev?.findIndex(
                                  (prevItem) =>
                                    item?.category_id === prevItem?.category_id
                                );
                                const updatedState = [...prev];

                                if (e.target.value !== "") {
                                  // Check if weight is not empty
                                  if (index !== -1) {
                                    updatedState[index] = {
                                      status: item.status,
                                      weight: Number(e.target.value),
                                      category_id: item.category_id,
                                      selling_price: item.selling_price,
                                      category_name: item.category_name,
                                    };
                                  } else {
                                    updatedState.push({
                                      status: item.status,
                                      weight: Number(e.target.value),
                                      category_id: item.category_id,
                                      selling_price: item.selling_price,
                                      category_name: item.category_name,
                                    });
                                  }
                                } else {
                                  if (index !== -1) {
                                    updatedState.splice(index, 1);
                                  }
                                }

                                return updatedState;
                              });

                              setFieldValue(
                                `weightitems-${item.category_name}`,
                                {
                                  category_id: item.category_id,
                                  category_name: item.category_name,
                                  weight: e.target.value,
                                }
                              );
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Table data={KitItemDetails} columns={Cols} />
                </>
              )}
            </div>

            <div className="flex gap-4 justify-end items-center w-full mt-6">
              <Button
                action={() => {
                  addItemToIdentity(currenGroupNumber, selectedItem, false);
                  setOpenKitItems(false);
                }}
                className="bg-mainRed"
              >
                {t("Undefined")}
              </Button>
              <Button
                type="submit"
                action={() => {
                  const { weightitems, ...rest } = selectedItem;
                  const kitItemsSold = KitItemDetails?.filter(
                    (item) => item.status !== 0
                  );
                  const kitItemsRemaining = kitItemsData?.filter(
                    (item) => item.status === 0
                  );

                  const totalWeightOfItemsRemaining = kitItemsRemaining?.reduce(
                    (acc, item) => {
                      acc += Number(item.weight);
                      return acc;
                    },
                    0
                  );
                  const totalWeightOfItemsSold = kitItemsSold?.reduce(
                    (acc, item) => {
                      acc += Number(item.weight);
                      return acc;
                    },
                    0
                  );

                  const totalWeightOfItems =
                    Number(totalWeightOfItemsRemaining) +
                    Number(totalWeightOfItemsSold);

                  if (
                    Number(totalWeightOfItems) !== Number(selectedItem?.weight)
                  ) {
                    notify(
                      "info",
                      `${t(
                        "The weight of the pieces must match the weight of the set."
                      )}`
                    );
                    return;
                  }

                  addItemToIdentity(
                    currenGroupNumber,
                    {
                      ...selectedItem,
                      weightitems: kitItemsData,
                      weight: totalWeightOfItemsRemaining,
                    },
                    true
                  );
                  setKitItemsData([]);
                  setOpenKitItems(false);
                }}
              >
                {`${t("checked")}`}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default InventoryKitInBranch;
