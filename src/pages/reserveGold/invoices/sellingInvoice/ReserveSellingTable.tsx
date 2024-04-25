import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Selling_TP } from "../../../selling/PaymentSellingPage";
import { t } from "i18next";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useFormikContext } from "formik";
import SelectCategory from "../../../../components/templates/reusableComponants/categories/select/SelectCategory";
import { BaseInputField } from "../../../../components/molecules";
import SelectKarat from "../../../../components/templates/reusableComponants/karats/select/SelectKarat";
import { Button } from "../../../../components/atoms";
import { DeleteIcon, EditIcon } from "../../../../components/atoms/icons";
import { IoMdAdd } from "react-icons/io";

interface ReserveSellingTable_TP {
  setSellingItemsData: Dispatch<SetStateAction<any>>;
  sellingItemsData: [];
  goldPrice: number;
}

const ReserveSellingTable: React.FC<ReserveSellingTable_TP> = (props) => {
  const { setSellingItemsData, sellingItemsData, goldPrice } = props;
  const { formatGram, formatReyal } = numberContext();
  const { values, setFieldValue } = useFormikContext();

  // COLUMN FOR TABLES
  const reserveSellingColumn = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info: any) =>
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
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info: any) => {
          return formatReyal(Number(info.getValue()).toFixed(2)) || "---";
        },
      },
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
      },
    ],
    []
  );

  // TABLE FUNCTIONALITY TO DELETE AND ADD
  const table = useReactTable({
    data: sellingItemsData,
    columns: reserveSellingColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteRow = (itemId: string | number) => {
    const newData = sellingItemsData?.filter((item: any) => {
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
                  className={`py-4 px-2 text-sm font-medium text-white border`}
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
                    goldPrice[option!.value].toFixed(2)
                  );

                  // const totalValues =
                  //   +goldPrice[option.value].toFixed(2) * +values?.weight;
                  // const priceWithCommissionRate =
                  //   +totalValues - +totalValues * (+maxingUser?.max_buy * 0.01);
                  // const priceWithCommissionCash =
                  //   +totalValues - +maxingUser?.max_buy;
                  // const priceWithSellingPolicy =
                  //   maxingUser?.max_buy_type === "نسبة"
                  //     ? priceWithCommissionRate
                  //     : priceWithCommissionCash;

                  // setFieldValue("value", +priceWithSellingPolicy);

                  // const foundedTax = taxes?.find((item) => {
                  //   return (
                  //     (item.karat_name === "" &&
                  //       item.karat_name !== option?.value &&
                  //       item.category_id === null &&
                  //       item.category_id !== values?.category_id) ||
                  //     (item.karat_name !== "" &&
                  //       item.karat_name === option?.value &&
                  //       item.category_id !== null &&
                  //       item.category_id === values?.category_id) ||
                  //     (item.karat_name === "" &&
                  //       item.karat_name !== option?.value &&
                  //       item.category_id !== null &&
                  //       item.category_id === values?.category_id) ||
                  //     (item.karat_name !== "" &&
                  //       item.karat_name === option?.value &&
                  //       item.category_id === null &&
                  //       item.category_id !== values?.category_id)
                  //   );
                  // });

                  // setFieldValue(
                  //   "value_added_tax",
                  //   +priceWithSellingPolicy * +foundedTax?.tax_rate * 0.01
                  // );
                  // setFieldValue(
                  //   "total_value",
                  //   +priceWithSellingPolicy * +foundedTax?.tax_rate * 0.01 +
                  //     +priceWithSellingPolicy
                  // );
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
                required
                // onChange={(e) => {
                //   setFieldValue("value", +priceWithSellingPolicy);
                //   setFieldValue(
                //     "value_added_tax",
                //     +e.target.value * +defaultTax * 0.01
                //   );
                //   setFieldValue(
                //     "total_value",
                //     +e.target.value + e.target.value * +defaultTax * 0.01
                //   );
                // }}
              />
            </td>
            {/* WILL CHANGE AGAIN FIXING */}

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

            <td className="bg-lightGreen justify-center border border-[#C4C4C4] flex items-center">
              {/* {dataSource?.length == 1 &&
                dataSource[0]?.category_type === "multi" && (
                  <Button action={() => {}} className="bg-transparent px-2">
                    <EditIcon className="fill-mainGreen w-6 h-6" />
                  </Button>
                )} */}
              <Button
                action={() => {
                  // if (
                  //   (values.piece_per_gram &&
                  //     values.karat_name &&
                  //     values.weight &&
                  //     values.category_name) === ""
                  // ) {
                  //   notify("info", `${t("the data is not complete")}`);
                  //   return;
                  // }

                  // if (+values?.value > +priceWithSellingPolicy) {
                  //   notify("info", `${t("value greater than buying policy")}`);
                  //   return;
                  // }

                  setSellingItemsData((prev: any) =>
                    [
                      ...prev,
                      { ...values, item_id: crypto.randomUUID() },
                    ].reverse()
                  );

                  handleAddItemsToSelling();
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

export default ReserveSellingTable;
