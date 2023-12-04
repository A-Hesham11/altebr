import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../../context/settings/number-formatter";

const SellingInvoiceTablePreview = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ file: SellingInvoiceTablePreview.tsx:7 ~ SellingInvoiceTablePreview ~ item:", item)
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("id code")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue())) || "---",
        accessorKey: "cost",
        header: () => <span>{t("cost")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue())) || "---",
        accessorKey: "vat",
        header: () => <span>{t("VAT")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue()).toFixed(2)) || "---",
        accessorKey: "total",
        header: () => <span>{t("total")}</span>,
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

export default SellingInvoiceTablePreview;
