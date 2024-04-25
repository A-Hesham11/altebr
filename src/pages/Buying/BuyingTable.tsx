import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Form, Formik, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { numberContext } from "../../context/settings/number-formatter";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Selling_TP } from "./BuyingPage";
import { Button, Spinner } from "../../components/atoms";
import { BaseInputField, Select } from "../../components/molecules";
import SelectCategory from "../../components/templates/reusableComponants/categories/select/SelectCategory";
import SelectClassification from "../../components/templates/reusableComponants/classifications/select/SelectClassification";
import SelectKarat from "../../components/templates/reusableComponants/karats/select/SelectKarat";
import { notify } from "../../utils/toast";
import { DeleteIcon, EditIcon } from "../../components/atoms/icons";
import { useFetch } from "../../hooks";

type SellingTableInputData_TP = {
  dataSource: Selling_TP;
  sellingItemsData: Selling_TP;
  setDataSource: any;
  setSellingItemsData: any;
  setClientData: any;
  rowsData: Selling_TP;
  goldPrice: any;
};

export const BuyingTable = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
  goldPrice,
  odwyaTypeValue,
  defaultTax,
}: SellingTableInputData_TP) => {
  const { formatGram, formatReyal } = numberContext();
  const { values, setFieldValue } = useFormikContext();
  const { userData } = useContext(authCtx);
  const [data, setData] = useState("");

  // CASH VALUE API
  const { data: maxingUser } = useFetch({
    endpoint: `/employee/api/max-buy-user`,
    queryKey: ["maxingUser"],
  });

  const { data: taxes, isLoading: loadingTaxs } = useFetch({
    endpoint: `/selling/api/v1/tax-include/${userData?.branch_id}?per_page=10000`,
    queryKey: ["taxes"],
    select: (taxes: any) =>
      taxes.map((tax: any) => ({
        id: tax.id,
        tax_rate: tax.tax_rate,
        include_tax: tax.include_tax,
        karat_name: tax.karat_name,
        category_id: tax.category_id,
        category_name: tax.category_name,
      })),
    onError: (err) => console.log(err),
  });

  // FORMULA
  const totalValues = (+values.piece_per_gram * +values?.weight).toFixed(2);
  const priceWithCommissionRate =
    +totalValues - +totalValues * (+maxingUser?.max_buy * 0.01);

  const priceWithCommissionCash = +totalValues - +maxingUser?.max_buy;

  const priceWithSellingPolicy =
    maxingUser?.max_buy_type === "نسبة"
      ? +priceWithCommissionRate
      : +priceWithCommissionCash;

  // STONES OPTION SELECT
  const stonesOption = [
    {
      id: 0,
      name: "لا يوجد",
      label: "لا يوجد",
      value: "لا يوجد",
    },
    {
      id: 1,
      name: "يوجد",
      label: "يوجد",
      value: "يوجد",
    },
  ];

  // COLUMN FOR TABLES
  const buyingColumns = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stones")}</span>,
        accessorKey: "stones_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("piece per gram")} </span>,
        accessorKey: "piece_per_gram",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) => {
          return formatReyal(Number(info.getValue()).toFixed(2)) || "---";
        },
      },
    ],
    [odwyaTypeValue]
  );

  if (odwyaTypeValue === "supplier")
    buyingColumns.push(
      {
        header: () => <span>{t("value added tax")} </span>,
        accessorKey: "value_added_tax",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      }
    );

  // TABLE FUNCTIONALITY TO DELETE AND ADD
  const table = useReactTable({
    data: sellingItemsData,
    columns: buyingColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteRow = (itemId: string | number) => {
    sellingItemsData?.findIndex((item: any) => {
      return item.item_id == itemId;
    });

    const newData = sellingItemsData?.filter((item: any) => {
      return item.item_id !== itemId;
    });

    setSellingItemsData(newData);
  };

  const handleAddItemsToBuying = () => {
    const { client_id, bond_date, client_value, client_name, ...restValues } =
      values;

    Object.keys(restValues).forEach((key) => {
      setFieldValue(key, "");
    });
  };

  return (
    <>
      <table className="mt-8 ">
        <thead className="bg-mainGreen text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="py-4 px-2">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`py-4 px-2 text-sm font-medium text-white border ${
                    odwyaTypeValue === "supplier" ? "w-[12.6]" : "w-[16.6%]"
                  }`}
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
          <tr className="text-center table-shadow last:shadow-0">
            <td className="border-l-2 border-l-flatWhite w-36">
              <SelectCategory
                name="category_id"
                noMb={true}
                placement="top"
                all={true}
                showItems={true}
                value={{
                  value: values?.category_id,
                  label: values?.category_name || t("classification"),
                  id: values?.category_id,
                }}
                onChange={(option) => {
                  setFieldValue("category_name", option!.value);
                }}
              />
            </td>
            <td className="w-36">
              <Select
                placeholder={`${t("stones")}`}
                id="stones_id"
                className="text-center text-black"
                name="stones_id"
                options={stonesOption}
                onChange={(option) => {
                  setFieldValue("stones_name", option!.value);
                  setFieldValue("stones_id", option!.id);
                }}
                value={{
                  id: values.stones_id,
                  value: values.stones_id,
                  label: values.stones_name || t("stones"),
                }}
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
              />
            </td>
            <td className="border-l-2 border-l-flatWhite w-36">
              <SelectKarat
                field="id"
                name="karat_id"
                noMb={true}
                placement="top"
                onChange={(option) => {
                  setFieldValue("karat_name", option!.value);
                  setFieldValue(
                    "piece_per_gram",
                    goldPrice[option.value].toFixed(2)
                  );

                  const totalValues =
                    +goldPrice[option.value].toFixed(2) * +values?.weight;
                  const priceWithCommissionRate =
                    +totalValues - +totalValues * (+maxingUser?.max_buy * 0.01);
                  const priceWithCommissionCash =
                    +totalValues - +maxingUser?.max_buy;
                  const priceWithSellingPolicy =
                    maxingUser?.max_buy_type === "نسبة"
                      ? priceWithCommissionRate
                      : priceWithCommissionCash;

                  setFieldValue("value", +priceWithSellingPolicy);

                  const foundedTax = taxes?.find((item) => {
                    return (
                      (item.karat_name === "" &&
                        item.karat_name !== option?.value &&
                        item.category_id === null &&
                        item.category_id !== values?.category_id) ||
                      (item.karat_name !== "" &&
                        item.karat_name === option?.value &&
                        item.category_id !== null &&
                        item.category_id === values?.category_id) ||
                      (item.karat_name === "" &&
                        item.karat_name !== option?.value &&
                        item.category_id !== null &&
                        item.category_id === values?.category_id) ||
                      (item.karat_name !== "" &&
                        item.karat_name === option?.value &&
                        item.category_id === null &&
                        item.category_id !== values?.category_id)
                    );
                  });

                  setFieldValue(
                    "value_added_tax",
                    +priceWithSellingPolicy * +foundedTax?.tax_rate * 0.01
                  );
                  setFieldValue(
                    "total_value",
                    +priceWithSellingPolicy * +foundedTax?.tax_rate * 0.01 +
                      +priceWithSellingPolicy
                  );
                }}
                value={{
                  id: values.karat_id,
                  value: values.karat_id,
                  label: values.karat_name || t("karat value"),
                }}
              />
            </td>
            <td className="text-center">
              <BaseInputField
                placeholder={`${t("piece per gram")}`}
                id="piece_per_gram"
                name="piece_per_gram"
                type="text"
                className="bg-mainDisabled text-center"
                disabled
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("value")}`}
                id="value"
                name="value"
                type="text"
                className={
                  values?.value && +values?.value > +priceWithSellingPolicy
                    ? "bg-red-100 text-center"
                    : "text-center"
                }
                required
                onChange={(e) => {
                  setFieldValue("value", +priceWithSellingPolicy);
                  setFieldValue(
                    "value_added_tax",
                    +e.target.value * +defaultTax * 0.01
                  );
                  setFieldValue(
                    "total_value",
                    +e.target.value + e.target.value * +defaultTax * 0.01
                  );
                }}
              />
            </td>
            {/* WILL CHANGE AGAIN FIXING */}
            {odwyaTypeValue === "supplier" && (
              <>
                <td>
                  <BaseInputField
                    placeholder={`${t("value added tax")}`}
                    id="value_added_tax"
                    name="value_added_tax"
                    type="text"
                    disabled
                    className="bg-mainDisabled text-center"
                    // value={+values.value * +userData?.tax_rate * 0.01}
                    required
                  />
                </td>
                <td>
                  <BaseInputField
                    placeholder={`${t("total value")}`}
                    id="total_value"
                    name="total_value"
                    type="text"
                    disabled
                    className="bg-mainDisabled text-center"
                  />
                </td>
              </>
            )}

            <td className="bg-lightGreen justify-center border border-[#C4C4C4] flex items-center">
              {dataSource?.length == 1 &&
                dataSource[0]?.category_type === "multi" && (
                  <Button action={() => {}} className="bg-transparent px-2">
                    <EditIcon className="fill-mainGreen w-6 h-6" />
                  </Button>
                )}
              <Button
                action={() => {
                  if (
                    (values.piece_per_gram &&
                      values.stones_name &&
                      values.karat_name &&
                      values.weight &&
                      values.category_name) === ""
                  ) {
                    notify("info", `${t("the data is not complete")}`);
                    return;
                  }

                  if (+values?.value > +priceWithSellingPolicy) {
                    notify("info", `${t("value greater than buying policy")}`);
                    return;
                  }

                  setSellingItemsData((prev) =>
                    [
                      ...prev,
                      { ...values, item_id: crypto.randomUUID() },
                    ].reverse()
                  );

                  handleAddItemsToBuying();
                  setDataSource([]);
                }}
                className="bg-transparent px-2"
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
    </>
  );
};
