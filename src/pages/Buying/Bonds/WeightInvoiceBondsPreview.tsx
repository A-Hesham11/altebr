import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";

const WeightInvoiceBondsPreview = ({ item }: { item?: {} }) => {
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "invoice_number",
        header: () => <span>{t("buying invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => {
          return <span>{t("there are no stones")}</span>;
        },
        accessorKey: "has_stones",
        header: () => <span>{t("stones")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "old_weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight after editing")}</span>,
      },
      // {
      //   cell: (info: any) => {
      //     return info.row.original.old_weight - info.row.original.weight;
      //   },
      //   accessorKey: "#",
      //   header: () => <span>{t("weight difference")}</span>,
      // },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue())) || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.renderValue() || "-",
        accessorKey: "hadr_ahgar",
        header: () => <span>{t("lose stones")}</span>,
      },
      {
        cell: (info: any) => info.renderValue() || "-",
        accessorKey: "added_ahgar",
        header: () => <span>{t("increase weight")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <div className="mt-16">
        <Table data={item?.items} columns={tableColumn}></Table>
      </div>
    </>
  );
};

export default WeightInvoiceBondsPreview;
