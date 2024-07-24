import React from "react";
import { numberContext } from "../../../../context/settings/number-formatter";
import { t } from "i18next";

interface BudgetStatementOperationTotals_TP {
  mainCardData: never[];
}

const BudgetStatementOperationTotals: React.FC<
  BudgetStatementOperationTotals_TP
> = ({ mainCardData }) => {
  const { formatReyal } = numberContext();

  const totalOfTransferAmount = 0;

  const totalOfCardBalance = mainCardData?.reduce((acc, curr) => {
    let total = acc;
    if (curr.debtor) {
      total += curr.debtor;
    } else {
      total += curr.creditor;
    }

    return total;
  }, 0);

  const totalOfTCardCommission = 0;
  const totalOfCardTaxCommission = 0;

  const tarqimBoxes = [
    {
      label: "total transfer amount",
      id: 0,
      value:
        totalOfTransferAmount > 0
          ? formatReyal(Number(totalOfTransferAmount))
          : "---",
      unit: "ryal",
    },
    {
      label: "total card balance",
      id: 1,
      value:
        totalOfCardBalance > 0
          ? formatReyal(Number(totalOfCardBalance))
          : "---",
      unit: "ryal",
    },
    {
      label: "total card commission",
      id: 2,
      value:
        totalOfTCardCommission > 0
          ? formatReyal(Number(totalOfTCardCommission))
          : "---",
      unit: "ryal",
    },
    {
      label: "total card commission tax",
      id: 3,
      value:
        totalOfCardTaxCommission > 0
          ? formatReyal(Number(totalOfCardTaxCommission))
          : "---",
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
