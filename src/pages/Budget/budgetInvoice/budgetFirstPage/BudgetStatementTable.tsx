import React, { SetStateAction, useMemo } from "react";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";
import { t } from "i18next";
import { numberContext } from "../../../../context/settings/number-formatter";

interface BudgetStatementTable_TP {
  mainCardData: never[];
  setOperationCardData: React.Dispatch<SetStateAction<any>>;
}

const BudgetStatementTable: React.FC<BudgetStatementTable_TP> = ({
  mainCardData,
  setOperationCardData,
}) => {
  console.log("🚀 ~ mainCardData:", mainCardData);
  const { formatGram, formatReyal } = numberContext();

  const mainCardDataBoxes = mainCardData
    ?.map((cardData) => cardData.boxes)
    .flat();

  // TODO: LINK IT WITH THE CORRECT ACCESSOR KEY
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "account",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original.debtor
            ? formatReyal(Number(info.row.original.debtor))
            : info.row.original.creditor
            ? formatReyal(Number(info.row.original.creditor))
            : "---",
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission_tax",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "value",
        header: () => <span>{t("total balance")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "restriction_name",
        header: () => <span>{t("operation type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date_time",
        header: () => <span>{t("date and time")}</span>,
      },
    ],
    []
  );

  return (
    <Table
      rowBackground="!bg-gray-50"
      data={mainCardDataBoxes || []}
      columns={tableColumn}
      showNavigation={mainCardDataBoxes.length > 10}
    />
  );
};

export default BudgetStatementTable;
