

import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../../context/settings/number-formatter";
import TableEntry from "../../../templates/reusableComponants/tantable/TableEntry";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingRestrictionsPreview = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("id code")}</span>,
      },
      {
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
        cell: (info: any) => {
          return info.row.original.sel_weight === 0
            ? info.getValue()
            : `${info.getValue()} مع سلسال`;
        },
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original.karat_name !== null
            ? info.getValue()
            : info.row.original.karatmineral_id,
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            Number(info.getValue() + Number(info.row.original.sel_weight)) ||
            "---"
          );
        },
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
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) || "---",
        accessorKey: "total",
        header: () => <span>{t("total")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <div className="mt-16">
        <div>
          <p className="mb-4 font-semibold text-lg">{t("pieces details")}</p>
          <Table data={item?.items} columns={tableColumn}></Table>
        </div>
        <div>
          <TableEntry item={item} />
        </div>
      </div>
    </>
  );
};

export default SellingRestrictionsPreview;