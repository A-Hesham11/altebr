import React, { SetStateAction, useEffect, useMemo, useState } from "react";
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
  const { formatGram, formatReyal } = numberContext();
  const [sortedData, setSortedData] = useState([]);

  const mainCardDataBoxes = mainCardData
    ?.map((cardData) => cardData.boxes)
    .flat();

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "restriction_name",
        header: () => <span>{t("operation type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "account",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) => {
          const value =
            info.row.original?.value -
            info.row.original.card_commission -
            info.row.original.card_vat;

          return formatReyal(value) || "---";
        },
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "card_commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "card_vat",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "value",
        header: () => <span>{t("total balance")}</span>,
      },

      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date_time",
        header: () => <span>{t("date and time")}</span>,
      },
    ],
    []
  );

  useEffect(() => {
    if (mainCardDataBoxes.length > 0) {
      const sortedBoxes = mainCardDataBoxes.sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time)
      );
      setSortedData(sortedBoxes);
    }
  }, []);

  return (
    <Table
      rowBackground="!bg-gray-50"
      data={sortedData || []}
      columns={tableColumn}
      showNavigation={sortedData.length > 10}
    >
      {sortedData.length === 0 && (
        <p className="text-center text-lg font-bold text-mainGreen">
          {t("there is no data to transfer")}
        </p>
      )}
    </Table>
  );
};

export default BudgetStatementTable;
