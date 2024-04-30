import { t } from "i18next";
import { Dispatch, SetStateAction, useContext, useMemo } from "react";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { useFormikContext } from "formik";
import { numberContext } from "../../../../../context/settings/number-formatter";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useFetch } from "../../../../../hooks";
import { BaseInputField } from "../../../../../components/molecules";
import SelectKarat from "../../../../../components/templates/reusableComponants/karats/select/SelectKarat";
import { Button } from "../../../../../components/atoms";
import { IoMdAdd } from "react-icons/io";
import { DeleteIcon, EditIcon } from "../../../../../components/atoms/icons";
import { notify } from "../../../../../utils/toast";

interface ReservePurchaseTable_TP {
  setBuyingItemsData: Dispatch<SetStateAction<any>>;
  buyingItemsData: [];
  goldPrice: number;
}

const ReservePurchaseTable: React.FC<ReservePurchaseTable_TP> = (props) => {
  const { setBuyingItemsData, buyingItemsData, goldPrice } = props;
  const { formatGram, formatReyal } = numberContext();
  const { values, setFieldValue } = useFormikContext();
  const { userData } = useContext(authCtx);

  // COLUMN FOR TABLES
  const reservePurchaseColumn = useMemo<any>(
    () => [
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
    data: buyingItemsData,
    columns: reservePurchaseColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteRow = (itemId: string | number) => {
    const newData = buyingItemsData?.filter((item: any) => {
      return item.item_id !== itemId;
    });

    setBuyingItemsData(newData);
  };

  const handleAddItemsToPurchase = () => {
    const {
      supplier_id,
      reserve_Purchase_data,
      supplier_value,
      supplier_name,
      notes,
      ...restValues
    } = values;

    Object.keys(restValues).forEach((key) => {
      setFieldValue(key, "");
    });
  };

  const { data: taxes } = useFetch({
    queryKey: ["tax"],
    endpoint: `/selling/api/v1/tax-include/${userData?.branch_id}`,
  });

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
                  const value = +goldPrice[option!.value] * +values!.weight;
                  let valueAddedTax;
                  if (option!.id === 3) {
                    valueAddedTax = +value * 0;
                  } else {
                    valueAddedTax = +value * +taxes[0]?.tax_rate * 0.01;
                  }

                  const totalValue = +value + +valueAddedTax;

                  setFieldValue("karat_name", option!.value);
                  setFieldValue(
                    "piece_per_gram",
                    goldPrice[option!.value].toFixed(2)
                  );
                  setFieldValue("value", value.toFixed(2));
                  setFieldValue("value_added_tax", valueAddedTax.toFixed(2));
                  setFieldValue("total_value", totalValue.toFixed(2));
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
                className="text-center"
                placeholder={`${t("value")}`}
                id="value"
                name="value"
                type="text"
                required
                onChange={(e) => {
                  // setFieldValue("value", +e.target.value);
                  let valueAddedTax;
                  if (values!.karat_id === 3) {
                    valueAddedTax = +e.target.value * 0;
                  } else {
                    valueAddedTax =
                      +e.target.value * +taxes[0]?.tax_rate * 0.01;
                  }
                  setFieldValue("value_added_tax", valueAddedTax);
                  setFieldValue("total_value", +e.target.value + valueAddedTax);
                }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("value added tax")}`}
                id="value_added_tax"
                name="value_added_tax"
                type="text"
                disabled
                className="bg-mainDisabled text-center"
                // value={+values.value_added_tax}
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
              <Button
                action={() => {
                  if (
                    (values.piece_per_gram &&
                      values.karat_name &&
                      values.weight) === ""
                  ) {
                    notify("info", `${t("the data is not complete")}`);
                    return;
                  }

                  setBuyingItemsData((prev: any) =>
                    [
                      ...prev,
                      {
                        ...values,
                        item_id: crypto.randomUUID(),
                      },
                    ].reverse()
                  );

                  handleAddItemsToPurchase();
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

export default ReservePurchaseTable;
