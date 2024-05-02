import React, { useMemo } from "react";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../../../components/templates/reusableComponants/tantable/Table";
import ReserveSellingSupplierEntry from "../../../invoices/sellingInvoice/supplier/ReserveSellingSupplierEntry";

const PurchaseBondsSupplierPreview = ({ item }: { item?: {} }) => {
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) == 0
            ? "-"
            : formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "cost",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) == 0
            ? "-"
            : formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "tax",
        header: () => <span>{t("VAT")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) == 0
            ? formatReyal(Number(info.row.original.cost_after_tax).toFixed(2))
            : formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "cost_after_tax",
        header: () => <span>{t("total value")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <h2 className="text-xl mb-5 mt-16 font-bold">{t("pieces details")}</h2>

      <div className="">
        <Table data={item?.items} columns={tableColumn}></Table>
      </div>

      <div>
        <ReserveSellingSupplierEntry item={item} />
      </div>
    </>
  );
};

export default PurchaseBondsSupplierPreview;
