import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

const InventoryEntry = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();

  const cols = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: `${t("description")}`,
        cell: (info) => info.renderValue() || "-",
        accessorKey: "bian",
      },
      {
        header: `${t("gram (debtor)")}`,
        cell: (info) =>
          info.renderValue() !== 0
            ? formatGram(Number(info.renderValue()))
            : "---",
        accessorKey: "debtor_gram",
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
        header: `${t("gram (creditor)")}`,
        cell: (info) =>
          info.renderValue() !== 0
            ? formatGram(Number(info.renderValue()))
            : "---",
        accessorKey: "creditor_gram",
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

  const processRestrictions = (data) =>
    data?.map(({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_gram:
        computational_movement === "debtor" &&
        (unit_id === "جرام" || unit_id === "gram")
          ? value
          : 0,
      debtor_SRA:
        computational_movement === "debtor" &&
        (unit_id === "ريال" || unit_id === "reyal")
          ? value
          : 0,
      creditor_gram:
        computational_movement === "creditor" &&
        (unit_id === "جرام" || unit_id === "gram")
          ? value
          : 0,
      creditor_SRA:
        computational_movement === "creditor" &&
        (unit_id === "ريال" || unit_id === "reyal")
          ? value
          : 0,
    })) ?? [];

  let restrictions = processRestrictions(item?.boxes);
  let restrictionsGain = processRestrictions(item?.boxes_gain);

  const calculateTotals = (data) =>
    data.reduce(
      (prev, curr) => ({
        bian: t("totals"),
        debtor_gram: prev.debtor_gram + curr.debtor_gram,
        debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
        creditor_gram: prev.creditor_gram + curr.creditor_gram,
        creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
      }),
      {
        bian: t("totals"),
        debtor_gram: 0,
        debtor_SRA: 0,
        creditor_gram: 0,
        creditor_SRA: 0,
      }
    );

  restrictions.push(calculateTotals(restrictions));
  restrictionsGain.push(calculateTotals(restrictionsGain));

  return (
    <div className="mt-6">
      <div className="mb-6">
        <h2 className="text-xl mb-5 font-bold">
          {t("accounting entry")} (
          {t("Record inventory differences as gain Record")})
        </h2>
        <Table data={restrictionsGain} footered columns={cols} />
      </div>
      <div>
        <h2 className="text-xl mb-5 font-bold">
          {t("accounting entry")} ({t("inventory differences as loss")})
        </h2>
        <Table data={restrictions} footered columns={cols} />
      </div>
    </div>
  );
};

export default InventoryEntry;
