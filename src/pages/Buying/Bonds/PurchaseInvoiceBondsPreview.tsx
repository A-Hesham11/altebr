import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";

const PurchaseInvoiceBondsPreview = ({ item }: { item?: {} }) => {
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => {
            if (info.getValue() == 1) {
                return <span>{t("there are stones")}</span>;
            } else {
                return <span>{t("there are no stones")}</span>;
            }
        },
        accessorKey: "has_stones",
        header: () => <span>{t("stones")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        // accessorKey: "old_weight",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.renderValue(),
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue())),
        accessorKey: "gram_price",
        header: () => <span>{t("piece per gram")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "value",
        header: () => <span>{t("value")}</span>,
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

export default PurchaseInvoiceBondsPreview;