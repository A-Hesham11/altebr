import React, { useMemo } from "react";
import { numberContext } from "../../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";
import { processBudgetData } from "../../../../utils/helpers";

interface BudgetStatementOperationTable_TP {
  mainCardData: never[];
}

const BudgetStatementOperationTable: React.FC<
  BudgetStatementOperationTable_TP
> = ({ mainCardData }) => {
  console.log("🚀 ~ mainCardData:", mainCardData);
  const { formatGram, formatReyal } = numberContext();

  const budgetOperation = processBudgetData(mainCardData);
  const formattedBudgetOperation = Object.entries(budgetOperation);

  const operationDataTable = formattedBudgetOperation.map((budgets) => {
    return budgets[1].reduce(
      (acc, curr) => {
        return {
          accountable: curr.account,
          amount: acc.amount + Number(curr.amount) || 0,
          commission: acc.commission + Number(curr.commission) || 0,
          commission_tax: acc.commission_tax + Number(curr.commission_tax) || 0,
          total_balance: acc.total_balance + curr.value || 0,
          operation_number: budgets[1].length,
        };
      },
      { amount: 0, commission: 0, commission_tax: 0, total_balance: 0 }
    );
  });
  console.log(
    "🚀 ~ operationDataTable ~ operationDataTable:",
    operationDataTable
  );

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
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "total_balance",
        header: () => <span>{t("total balance")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "operation_number",
        header: () => <span>{t("operation number")}</span>,
      },
    ],
    []
  );

  return (
    <Table
      rowBackground="!bg-white"
      data={operationDataTable || []}
      columns={tableColumn}
      showNavigation={operationDataTable?.length > 10}
    />
  );
};

export default BudgetStatementOperationTable;
