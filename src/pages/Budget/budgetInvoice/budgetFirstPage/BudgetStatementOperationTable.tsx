import React, { useMemo } from "react";
import { numberContext } from "../../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";

interface BudgetStatementOperationTable_TP {
  mainCardData: never[];
}

const BudgetStatementOperationTable: React.FC<
  BudgetStatementOperationTable_TP
> = ({ mainCardData }) => {
  const { formatGram, formatReyal } = numberContext();

  // TODO: LINK IT WITH THE CORRECT ACCESSOR KEY
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "accountable",
        header: () => <span>{t("card name")}</span>,
      },
      // {
      //   cell: (info: any) => info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
      //   accessorKey: "karat_name",
      //   header: () => <span>{t("balance")}</span>,
      // },
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
          info.row.original.debtor
            ? formatReyal(Number(info.row.original.debtor))
            : info.row.original.creditor
            ? formatReyal(Number(info.row.original.creditor))
            : "---",
        accessorKey: "total_balance",
        header: () => <span>{t("total balance")}</span>,
      },
      {
        cell: (info: any) => info.row.original.boxes.length || "---",
        accessorKey: "operation_number",
        header: () => <span>{t("operation number")}</span>,
      },
    ],
    []
  );

  return (
    <Table
      rowBackground="!bg-white"
      data={mainCardData || []}
      columns={tableColumn}
      showNavigation={mainCardData.length > 10}
    />
  );
};

export default BudgetStatementOperationTable;
