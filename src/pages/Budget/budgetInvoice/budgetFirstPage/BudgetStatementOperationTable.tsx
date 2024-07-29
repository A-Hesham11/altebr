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
  const isBoxesHaveData = mainCardData?.some((data) => data?.boxes.length > 0);
  console.log("🚀 ~ isBoxesHaveData:", isBoxesHaveData);

  const budgetOperation = processBudgetData(mainCardData);
  const formattedBudgetOperation = Object.entries(budgetOperation);

  const operationDataTable = formattedBudgetOperation.map((budgets) => {
    return budgets[1].reduce(
      (acc, curr) => {
        return {
          accountable: curr.account,
          card_commission:
            acc.card_commission + Number(curr.card_commission) || 0,
          card_vat: acc.card_vat + Number(curr.card_vat) || 0,
          total_balance: acc.total_balance + curr.value || 0,
          operation_number: budgets[1].length,
        };
      },
      {
        card_commission: 0,
        card_vat: 0,
        total_balance: 0,
      }
    );
  });
  console.log(
    "🚀 ~ operationDataTable ~ operationDataTable:",
    operationDataTable
  );

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "accountable",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) => {
          const balanceValue =
            info.row.original.total_balance -
            info.row.original.card_commission -
            info.row.original.card_vat;

          return +balanceValue > 0 ? formatReyal(Number(balanceValue)) : "---";
        },
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "card_commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "card_vat",
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
    <div>
      {isBoxesHaveData && (
        <Table
          rowBackground="!bg-white"
          data={operationDataTable || []}
          columns={tableColumn}
          showNavigation={operationDataTable?.length > 10}
        />
      )}
    </div>
  );
};

export default BudgetStatementOperationTable;
