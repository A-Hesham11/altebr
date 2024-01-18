import { t } from "i18next";
import React, { useMemo, useState } from "react";
import { useFetch } from "../../../hooks";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";

const TableOfSeperate = ({ operationTypeSelect }) => {

  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { formatReyal, formatGram } = numberContext();

  // FETCHING DATA FROM API
  const {
    data: transformBranch,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["selling-invoice"],
    endpoint: "selling/api/v1/invoices_per_branch/",
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya", // THIS WILL CHANGE
        header: () => <span>{t("taqm code")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() ? formatGram(Number(info.getValue())) : "---" ,
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            Number(formatReyal(info.row.original.weight)) *
            Number(formatReyal(info.row.original.wage))
          );
        },
        accessorKey: "wage_geram/ryal",
        header: () => <span>{t("wage geram/ryal")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "wage",
        header: () => <span>{t("total wage by gram")}</span>,
      },
      {
        cell: (info: any) => info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => {
          // return info.getValue()[0]?.diamondWeight || "-";
          const stonesDetails = info
            .getValue()
            .reduce((acc: number, curr: any) => {
              return acc + curr.diamondWeight;
            }, 0);

          return stonesDetails === 0 ? "-" : stonesDetails;
        },
        accessorKey: "stonesDetails",
        header: () => <span>{t("weight of diamond stone")}</span>,
      },
      {
        cell: (info: any) => {
          const stonesDetails = info
            .getValue()
            .reduce((acc: number, curr: any) => {
              return acc + curr.weight;
            }, 0);

            return stonesDetails === 0 ? "-" : stonesDetails;
        },
        accessorKey: "stonesDetails",
        header: () => <span>{t("stone weight")}</span>,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl ml-4 mb-2 font-bold text-slate-700">
        {t("selected pieces")}
      </h2>
      <Table data={operationTypeSelect || []} columns={tableColumn}>
        {operationTypeSelect.length === 0 && (
          <div className="text-xl text-center ml-4 mb-2 font-bold text-slate-700">
            {t("no combined pieces were selected for separation")}
          </div>
        )}
      </Table>
    </div>
  );
};

export default TableOfSeperate;
