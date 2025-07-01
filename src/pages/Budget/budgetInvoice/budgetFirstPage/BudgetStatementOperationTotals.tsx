import React from "react";
import { numberContext } from "../../../../context/settings/number-formatter";
import { t } from "i18next";
import { processBudgetData } from "../../../../utils/helpers";

interface BudgetStatementOperationTotals_TP {
  mainCardData: never[];
}

const BudgetStatementOperationTotals: React.FC<
  BudgetStatementOperationTotals_TP
> = ({ mainCardData, setOperationData }) => {
  const { formatReyal } = numberContext();
  const budgetOperation = processBudgetData(mainCardData);
  const formattedBudgetOperation = Object.entries(budgetOperation);

  const operationDataTotals = formattedBudgetOperation.map((budgets) => {
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

  const totalCardCommission = operationDataTotals.reduce(
    (acc, curr) => (acc += curr.card_commission),
    0
  );

  const totalCardCommissionTax = operationDataTotals.reduce(
    (acc, curr) => (acc += curr.card_vat),
    0
  );

  // const totalOfCardBalance = mainCardData?.reduce((acc, curr) => {
  //   let total = acc;
  //   if (curr.debtor) {
  //     total += curr.debtor;
  //   } else {
  //     total += curr.creditor;
  //   }

  //   return total;
  // }, 0);

  const totalOfCardBalance = operationDataTotals.reduce(
    (acc, curr) => (acc += curr.total_balance),
    0
  );

  const totalCardBalance =
    totalOfCardBalance - totalCardCommission - totalCardCommissionTax;

  const tarqimBoxes = [
    {
      label: "total transfer amount",
      id: 0,
      value: formatReyal(Number(totalCardBalance)) || "---",
      unit: "ryal",
    },

    {
      label: "total card commission",
      id: 2,
      value: formatReyal(Number(totalCardCommission)) || "---",
      unit: "ryal",
    },
    {
      label: "total card commission tax",
      id: 3,
      value: formatReyal(Number(totalCardCommissionTax)) || "---",
      unit: "ryal",
    },
    {
      label: "total card balance",
      id: 1,
      value: formatReyal(Number(totalOfCardBalance)) || "---",
      unit: "ryal",
    },
  ];

  return (
    <div className="py-10">
      <h3 className="text-xl font-bold text-slate-700 mb-6">{t("totals")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tarqimBoxes?.map((data: any) => (
          <li
            key={data.id}
            className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md"
          >
            <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
              {t(`${data.label}`)}
            </p>
            <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
              {data.value} <span>{t(`${data.unit}`)}</span>
            </p>
          </li>
        ))}
      </div>
    </div>
  );
};

export default BudgetStatementOperationTotals;
