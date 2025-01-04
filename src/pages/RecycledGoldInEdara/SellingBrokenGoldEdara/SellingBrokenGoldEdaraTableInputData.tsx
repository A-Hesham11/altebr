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
import { useContext, useMemo } from "react";
import { IoMdAdd } from "react-icons/io";
import { numberContext } from "../../../context/settings/number-formatter";
import { Selling_TP } from "../../selling/PaymentSellingPage";
import { BaseInputField } from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { notify } from "../../../utils/toast";
import { DeleteIcon, EditIcon } from "../../../components/atoms/icons";
import SelectKarat from "../../../components/templates/reusableComponants/karats/select/SelectKarat";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { authCtx } from "../../../context/auth-and-perm/auth";

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

export const SellingBrokenGoldEdaraTableInputData = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
}: SellingTableInputData_TP) => {
  console.log("🚀 ~ sellingItemsData:", sellingItemsData);
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const { values, setFieldValue } = useFormikContext<any>();
  console.log("🚀 ~ values:", values);
  const taxRate = values.karat_name === "24" ? 0 : userData?.tax_rate / 100;
  console.log("🚀 ~ taxRate:", taxRate);

  const { gold_price } = GlobalDataContext();
  console.log("🚀 ~ gold_price:", gold_price);

  const goldPriceFromKarat = {
    18: gold_price?.price_gram_18k,
    21: gold_price?.price_gram_21k,
    22: gold_price?.price_gram_22k,
    24: gold_price?.price_gram_24k,
  };

  const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
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
      {
        header: () => <span>{t("notes")} </span>,
        accessorKey: "notes",
        cell: (info) => info.getValue() || "---",
      },
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
    const {
      client_id,
      bond_date,
      client_value,
      client_name,
      supplier_id,
      supplier_name,
      ...restValues
    } = values;
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
                  className={`py-4 px-2 text-sm font-medium text-white border ${
                    header?.id === "notes" ? "w-[40%]" : "w-[12%]"
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
          <tr className="border-b text-center table-shadow last:shadow-0">
            <td className="">
              <BaseInputField
                placeholder={`${t("weight")}`}
                id="weight"
                name="weight"
                type="text"
                required
                className={`text-center`}
                onChange={(e) => {
                  const cost =
                    Number(e.target.value) *
                    Number(goldPriceFromKarat?.[values.karat_name]);

                  if (values.karat_name) {
                    setFieldValue("taklfa", cost?.toFixed(3));
                    setFieldValue(
                      "taklfa_after_tax",
                      (cost * taxRate + cost)?.toFixed(3)
                    );
                  }
                }}
              />
            </td>
            <td className="border-l-2 border-l-flatWhite">
              <SelectKarat
                field="id"
                name={"karat_name"}
                noMb={true}
                placement="top"
                onChange={(option) => {
                  // const taxRateFromKarat =
                  //   option!.value === "24" ? 1 : userData?.tax_rate / 100 + 1;
                  const tax = option!.value === "24" ? 0 : taxRate;
                  setFieldValue("karat_name", option!.value);
                  setFieldValue("karat_id", option!.id);
                  setFieldValue("tax_rate", tax);
                  const cost =
                    Number(values.weight) *
                    Number(goldPriceFromKarat?.[option!.value]);

                  setFieldValue(
                    "price_gram",
                    goldPriceFromKarat?.[option!.value]
                  );
                  setFieldValue("taklfa", cost?.toFixed(3));
                  setFieldValue(
                    "taklfa_after_tax",
                    (cost * tax + cost)?.toFixed(3)
                  );
                }}
                value={{
                  id: values.karat_id,
                  value: values.karat_id,
                  label: values.karat_name || t("karat value"),
                }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("Price per gram")}`}
                id="price_gram"
                name="price_gram"
                type="text"
                className={`text-center`}
                onChange={(e) => {
                  const cost = Number(values.weight) * Number(e.target.value);

                  if (values.karat_name && values.weight) {
                    setFieldValue("taklfa", cost?.toFixed(3));
                    setFieldValue(
                      "taklfa_after_tax",
                      (cost * taxRate + cost)?.toFixed(3)
                    );
                  }
                }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("notes")}`}
                id="notes"
                name="notes"
                type="text"
                className={`text-center`}
              />
            </td>
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
                    "price_gram",
                    Number(e.target.value) / Number(values.weight)
                  );
                  setFieldValue(
                    "taklfa_after_tax",
                    (
                      Number(e.target.value) * taxRate +
                      Number(e.target.value)
                    )?.toFixed(3)
                  );
                }}
                // disabled
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("selling price after tax")}`}
                id="taklfa_after_tax"
                name="taklfa_after_tax"
                type="text"
                required
                className={`text-center bg-mainDisabled`}
                disabled
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
                        item_id: crypto.randomUUID(),
                        vat: +values.taklfa_after_tax - +values.taklfa,
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
