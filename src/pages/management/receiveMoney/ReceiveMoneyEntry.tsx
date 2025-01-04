import { t } from "i18next";
import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { numberContext } from "../../../context/settings/number-formatter";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";

const ReceiveMoneyEntry = ({ item }: { item?: {} }) => {
  const { formatReyal, formatGram } = numberContext();

  const cols2 = useMemo<any>(
    () => [
      {
        header: `${t("description")}`,
        cell: (info) => info.renderValue() || "-",
        accessorKey: "bian",
      },
      {
        header: `${t("reyal (debtor)")}`,
        cell: (info) =>
          info.renderValue() !== 0
            ? formatReyal(Number(info.renderValue()))
            : "---",
        accessorKey: "debtor_SRA",
      },
      {
        header: `${t("reyal (creditor)")}`,
        cell: (info) =>
          info.renderValue() !== 0
            ? formatReyal(Number(info.renderValue()))
            : "---",
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
        <div className="mt-6">
          <h2 className="text-xl mb-5 font-bold">{t("accounting entry")}</h2>
          <Table data={restrictions} footered columns={cols2} />
        </div>
      </div>
    </>
  );
};

export default ReceiveMoneyEntry;
