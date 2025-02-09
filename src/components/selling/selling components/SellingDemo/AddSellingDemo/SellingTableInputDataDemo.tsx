import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Form, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Selling_TP } from "../../../../../pages/selling/PaymentSellingPage";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../../hooks";
import { KaratValues_TP } from "../../../../../types";
import { BaseInputField } from "../../../../molecules";
import SelectCategory from "../../../../templates/reusableComponants/categories/select/SelectCategory";
import { Button } from "../../../../atoms";
import { notify } from "../../../../../utils/toast";
import { DeleteIcon, EditIcon } from "../../../../atoms/icons";
import { HiViewGridAdd } from "react-icons/hi";
import SelectClassification from "../../../../templates/reusableComponants/classifications/select/SelectClassification";
import SelectKarat from "../../../../templates/reusableComponants/karats/select/SelectKarat";

type SellingTableInputData_TP = {
  dataSource: any;
  sellingItemsData: Selling_TP;
  setDataSource: any;
  setSellingItemsData: any;
  setClientData: any;
  rowsData: Selling_TP;
  selectedItemDetails: any;
  setSelectedItemDetails: any;
  sellingItemsOfWeigth: any;
  setSellingItemsOfWeight: any;
};

export const SellingTableInputDataDemo = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
  selectedItemDetails,
  setSelectedItemDetails,
  sellingItemsOfWeigth,
  setSellingItemsOfWeight,
}: SellingTableInputData_TP) => {
  const { formatGram, formatReyal } = numberContext();

  const { values, setFieldValue } = useFormikContext<any>();
  console.log("🚀 ~ values:", values);
  const taxRate = values.karat_name === "24" ? 1 : 1.15;

  const { data: karatValues } = useFetch<KaratValues_TP[]>({
    endpoint: "classification/api/v1/allkarats",
    queryKey: ["karats_select"],
  });

  const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("category")}</span>,
        accessorKey: "classification_id",
        cell: (info) =>
          info.getValue() === 1
            ? t("gold")
            : info.getValue() === 2
            ? t("diamond")
            : info.getValue() === 3
            ? t("accessories")
            : "---",
      },
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("stones weight")} </span>,
        accessorKey: "stones_weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("Price per gram")} </span>,
        accessorKey: "price_gram",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      //   {
      //     header: () => <span>{t("cost")} </span>,
      //     accessorKey: "cost",
      //     cell: (info) =>
      //       info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      //   },
      {
        header: () => <span>{t("selling price")} </span>,
        accessorKey: "taklfa",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("selling price after tax")} </span>,
        accessorKey: "taklfa_after_tax",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: sellingItemsData,
    columns: sellingCols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const handleDeleteRow = (itemId) => {
    sellingItemsData?.findIndex((item) => {
      return item.item_id == itemId;
    });

    const newData = sellingItemsData?.filter((item) => {
      return item.item_id !== itemId;
    });

    setSellingItemsData(newData);
  };

  const handleAddItemsToSelling = () => {
    const { client_id, bond_date, client_value, client_name, ...restValues } =
      values;
    Object.keys(restValues).forEach((key) => {
      setFieldValue(key, "");
    });
    setFieldValue("taklfa_after_tax", "");
  };

  return (
    <Form>
      <table className="mt-8 min-w-[815px] lg:w-full">
        <thead className="bg-mainGreen text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="py-4 px-2 w-full">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-4 px-2 text-sm font-medium text-white border w-[12%]"
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
          <tr className="border-b text-center table-shadow last:shadow-0">
            <td>
              <SelectClassification field="id" name="classification_id" />
            </td>
            <td className="border-l-2 border-l-flatWhite">
              <SelectCategory
                name="category_name"
                noMb={true}
                placement="top"
                all={true}
                value={{
                  value: values?.category_id,
                  label: values?.category_name || t("classification"),
                  id: values?.category_id,
                }}
                onChange={(option) => {
                  setFieldValue("category_name", option!.value);
                  setFieldValue("category_id", option!.id);
                }}
                showItems={true}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("weight")}`}
                id="weight"
                name="weight"
                type="text"
                required
                className={`text-center`}
                onChange={(e) => {
                  setFieldValue(
                    "price_gram",
                    (Number(values.taklfa) / Number(e.target.value))?.toFixed(3)
                  );
                }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("stones weight")}`}
                id="stones_weight"
                name="stones_weight"
                type="text"
                className={`text-center`}
              />
            </td>

            <td>
              <SelectKarat
                field="id"
                name="karat_name"
                noMb={true}
                placement="top"
                onChange={(option) => {
                  console.log("🚀 ~ option:", option);
                  setFieldValue("karat_name", option!.value);
                }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("Price per gram")}`}
                id="price_gram"
                name="price_gram"
                type="text"
                value={formatReyal(Number(values.price_gram))}
                className={`text-center bg-mainDisabled`}
                disabled
              />
            </td>
            {/* <td>
              <BaseInputField
                placeholder={`${t("cost")}`}
                id="cost"
                name="cost"
                type="text"
                className={`text-center`}
              />
            </td> */}
            <td>
              <BaseInputField
                placeholder={`${t("selling price")}`}
                id="taklfa"
                name="taklfa"
                type="text"
                required
                className={`text-center`}
                onChange={(e) => {
                  setFieldValue(
                    "taklfa_after_tax",
                    (Number(e.target.value) * taxRate)?.toFixed(3)
                  );
                  setFieldValue(
                    "price_gram",
                    (Number(e.target.value) / Number(values.weight))?.toFixed(3)
                  );
                }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("selling price after tax")}`}
                id="taklfa_after_tax"
                name="taklfa_after_tax"
                type="text"
                required
                className={`text-center`}
                onChange={(e) => {
                  setFieldValue(
                    "taklfa",
                    (Number(e.target.value) / taxRate)?.toFixed(3)
                  );
                  setFieldValue(
                    "price_gram",
                    (
                      Number(e.target.value) /
                      taxRate /
                      Number(values.weight)
                    )?.toFixed(3)
                  );
                }}
              />
            </td>
            <td className="bg-lightGreen border border-[#C4C4C4] flex items-center">
              <Button
                action={() => {
                  if (
                    values.classification_id === "" ||
                    values.category_name === "" ||
                    values.weight === "" ||
                    values.karat_name === "" ||
                    values.taklfa_after_tax === ""
                  ) {
                    notify("info", `${t("add piece first")}`);
                    return;
                  }

                  if (values.weight == 0) {
                    notify("info", `${t("The lot is sold out")}`);
                    return;
                  }

                  setSellingItemsData((prev) =>
                    [
                      ...prev,
                      {
                        ...values,
                      },
                    ].reverse()
                  );

                  handleAddItemsToSelling();
                  setDataSource([]);
                }}
                className="bg-transparent px-2 m-auto"
              >
                <IoMdAdd className="fill-mainGreen w-6 h-6" />
              </Button>
            </td>
          </tr>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="text-center">
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    className="px-2 py-2 bg-lightGreen bg-[#295E5608] gap-x-2 items-center border border-[#C4C4C4]"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="bg-lightGreen p-0 border border-[#C4C4C4]">
                  <div className="flex items-center ">
                    <Button
                      action={() => {
                        const {
                          client_id,
                          bond_date,
                          client_value,
                          ...restValues
                        } = values;
                        Object.keys(restValues).map((key) => {
                          setFieldValue(key, row?.original[key]);
                        });
                        handleDeleteRow(row?.original?.item_id);
                      }}
                      className="bg-transparent px-2"
                    >
                      <EditIcon
                        size={16}
                        className="fill-mainGreen w-6 h-6 mb-[2px]"
                      />
                    </Button>
                    <Button
                      action={() => {
                        handleDeleteRow(row?.original?.item_id);
                      }}
                      className="bg-transparent px-2 "
                    >
                      <DeleteIcon className="fill-[#C75C5C] w-6 h-6" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Form>
  );
};
