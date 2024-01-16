import { t } from "i18next";
import { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";

const TableOfMerging = ({ operationTypeSelect }: any) => {
  const { formatReyal, formatGram } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "wage",
        header: () => <span>{t("wage geram/ryal")}</span>,
      },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return formatReyal(wages) || "-";
        },
        accessorKey: "total_wages",
        header: () => <span>{t("total wage by ryal")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "-",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => {
          // return info.getValue()[0]?.diamondWeight || "-";
          const stonesDetails = info.getValue().reduce((acc: number, curr: any) => {
            return acc + curr.diamondWeight;
          }, 0);

          return stonesDetails;
        },
        accessorKey: "stonesDetails",
        header: () => <span>{t("weight of diamond stone")}</span>,
      },
      {
        cell: (info: any) => {
          const stonesDetails = info.getValue().reduce((acc: number, curr: any) => {
            return acc + curr.weight;
          }, 0);

          return stonesDetails || "-";
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
        <div className="mt-3 flex items-center justify-center gap-5 p-2"></div>
      </Table>
    </div>
  );
};

export default TableOfMerging;
