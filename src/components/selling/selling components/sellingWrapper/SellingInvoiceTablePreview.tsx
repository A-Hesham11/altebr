import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../../context/settings/number-formatter";
import { ColumnDef } from "@tanstack/react-table";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingInvoiceTablePreview = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ SellingInvoiceTablePreview ~ item:", item);
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
        cell: (info: any) =>
          info.row.original.karat_name !== null
            ? info.getValue()
            : info.row.original.karatmineral_id,
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
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) || "---",
        accessorKey: "total",
        header: () => <span>{t("total")}</span>,
      },
    ],
    []
  );

  const cols2 = useMemo<ColumnDef<Entry_TP>[]>(
    () => [
      {
        header: `${t("description")}`,
        cell: (info) => info.renderValue() || "-",
        accessorKey: "bian",
      },
      {
        header: `${t("gram (debtor)")}`,
        cell: (info) => formatGram(Number(info.renderValue())) || "-",
        accessorKey: "debtor_gram",
      },
      {
        header: `${t("reyal (debtor)")}`,
        cell: (info) => formatReyal(Number(info.renderValue())) || "-",
        accessorKey: "debtor_SRA",
      },
      {
        header: `${t("gram (creditor)")}`,
        cell: (info) => formatGram(Number(info.renderValue())) || "-",
        accessorKey: "creditor_gram",
      },
      {
        header: `${t("reyal (creditor)")}`,
        cell: (info) => formatReyal(Number(info.renderValue())) || "-",
        accessorKey: "creditor_SRA",
      },
    ],
    []
  );

  // FOR TABLE ACCOUNTING ENTRY
  let restrictions = item.boxes?.map(
    ({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_gram:
        computational_movement === "debtor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      debtor_SRA:
        computational_movement === "debtor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
      creditor_gram:
        computational_movement === "creditor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      creditor_SRA:
        computational_movement === "creditor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
    })
  );

  // group by account
  const restrictionsWithoutTotals = restrictions?.reduce((prev, curr) => {
    const index = prev.findIndex((item) => item.bian === curr.bian);
    if (index === -1) {
      prev.push(curr);
    } else {
      prev[index].debtor_gram += curr.debtor_gram;
      prev[index].debtor_SRA += curr.debtor_SRA;
      prev[index].creditor_gram += curr.creditor_gram;
      prev[index].creditor_SRA += curr.creditor_SRA;
    }
    return prev;
  }, [] as typeof restrictions);

  restrictions = restrictionsWithoutTotals;

  let restrictionsTotals;
  if (restrictions && !!restrictions.length) {
    restrictionsTotals = restrictions?.reduce((prev, curr) => ({
      bian: `${t("totals")}`,
      debtor_gram: prev.debtor_gram + curr.debtor_gram,
      debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
      creditor_gram: prev.creditor_gram + curr.creditor_gram,
      creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
    }));
  }

  if (restrictionsTotals) restrictions?.push(restrictionsTotals!);

  return (
    <>
      <div className="mt-16">
        <div>
          <p className="mb-4 font-semibold text-lg">{t("pieces details")}</p>
          <Table data={item?.items} columns={tableColumn}></Table>
        </div>
        <div className="mt-8">
          <h2 className="text-xl mb-5 font-bold">{t("accounting entry")}</h2>
          <Table data={restrictions} footered columns={cols2} />
        </div>
      </div>
    </>
  );
};

export default SellingInvoiceTablePreview;
