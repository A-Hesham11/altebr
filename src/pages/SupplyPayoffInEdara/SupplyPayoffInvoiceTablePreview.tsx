import { t } from "i18next";
import { useMemo } from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import SupplyPayoffEntry from "./SupplyPayoffEntry";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SupplyPayoffInvoiceTablePreview = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ SupplyPayoffInvoiceTablePreview ~ item:", item)
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
        accessorKey: "category",
        header: () => <span>{t("category")}</span>,
        cell: (info: any) => {
          return info.getValue();
        },
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_id",
        header: () => <span>{t("classification")}</span>,
      },
      {
        header: () => <span>{t("karat")}</span>,
        accessorKey: "karat_id" || "karatmineral",
        cell: (info: any) =>
          info.row.original.karat_id === ""
            ? info.row.original.karatmineral || "---"
            : info.row.original.karat_id || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue())) || "---",
        accessorKey: "wage",
        header: () => <span>{t("fare")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue())) || "---",
        accessorKey: "value",
        header: () => <span>{t("cost")}</span>,
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
          <SupplyPayoffEntry item={item} />
        </div>
      </div>
    </>
  );
};

export default SupplyPayoffInvoiceTablePreview;
