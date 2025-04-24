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
import { Selling_TP } from "../Buying/BuyingPage";
import { numberContext } from "../../context/settings/number-formatter";
import { Button, Spinner } from "../../components/atoms";
import { BaseInputField } from "../../components/molecules";
import SelectClassification from "../../components/templates/reusableComponants/classifications/select/SelectClassification";
import SelectCategory from "../../components/templates/reusableComponants/categories/select/SelectCategory";
import SelectKarat from "../../components/templates/reusableComponants/karats/select/SelectKarat";
import { DeleteIcon } from "../../components/atoms/icons";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";

type SellingTableInputData_TP = {
  sellingItemsData: any;
  setDataSource: any;
  setSellingItemsData: any;
};

export const SalesReturnTableInputDataDemo = ({
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
  setClientData,
}: SellingTableInputData_TP) => {
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);

  const { values, setFieldValue } = useFormikContext<any>();

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

  const { data, isLoading, isFetching, isRefetching } = useFetch({
    endpoint: `/returnSale/api/v1/getInvocieItems/${userData?.branch_id}?invoice_id=${values.invoice_id}`,
    queryKey: [
      `return_invoices_data_demo_${userData?.branch_id}`,
      values.invoice_id,
    ],
    enabled: !!values.invoice_id,
    onSuccess(data) {
      setClientData({
        client_id: data?.data[0]?.client_id,
        client_name: data?.data[0]?.client_name,
        client_value: data?.data[0]?.client_name,
      });

      setFieldValue("client_name", data?.data[0]?.client_name);
      setFieldValue("client_id", data?.data[0]?.client_id);
      setFieldValue("client_value", data?.data[0]?.client_name);
      // setInvoiceNumber(data?.data?.length);
      setSellingItemsData(data?.data);
    },
    pagination: true,
  });

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

  const handleDeleteRow = (itemId: any) => {
    sellingItemsData?.findIndex((item: any) => {
      return item.id == itemId;
    });

    const newData = sellingItemsData?.filter((item: any) => {
      return item.id !== itemId;
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
      <p className="font-semibold text-center text-lg text-mainGreen">
        {(isRefetching || isLoading || isFetching) && (
          <div className="flex items-center justify-center gap-3">
            {t("loading data")}
            <Spinner />
          </div>
        )}
      </p>
      {sellingItemsData?.length > 0 ? (
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
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="text-center">
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      className="px-2 py-2 bg-lightGreen bg-[#295E5608] gap-x-2 items-center border border-[#C4C4C4]"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="bg-lightGreen p-0 border border-[#C4C4C4]">
                    <div className="flex items-center ">
                      <Button
                        action={() => {
                          handleDeleteRow(row?.original?.id);
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
      ) : (
        <div className="flex items-center justify-center gap-3">
          <p className="font-semibold text-center text-lg text-mainGreen">
            {t("Search by invoice number to get the data")}
          </p>
        </div>
      )}
    </Form>
  );
};
