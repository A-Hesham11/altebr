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

          return value > 0 ? formatReyal(value) : "---";
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

  return (
    <Table
      rowBackground="!bg-gray-50"
      data={mainCardDataBoxes || []}
      columns={tableColumn}
      showNavigation={mainCardDataBoxes.length > 10}
    >
      {mainCardDataBoxes.length === 0 && (
        <p className="text-center text-lg font-bold text-mainGreen">
          {t("there is no data to transfer")}
        </p>
      )}
    </Table>
  );
};

export default BudgetStatementTable;
