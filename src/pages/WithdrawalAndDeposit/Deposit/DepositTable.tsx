import React, { useMemo } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";

type DepositTable_TP = {
  data: any[];
};

const DepositTable: React.FC<DepositTable_TP> = ({ data }) => {
  const { formatGram, formatReyal } = numberContext();

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "withdrawal",
        header: () => <span>{t("withdrawal")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "deposit",
        header: () => <span>{t("deposit")}</span>,
      },
    ],
    []
  );

  return (
    <Table rowBackground="!bg-gray-50" data={data || []} columns={tableColumn}>
      {data?.length === 0 && (
        <p className="text-center text-lg font-bold text-mainGreen">
          {t("there is no data to make withdrawal or deposit")}
        </p>
      )}
    </Table>
  );
};

export default DepositTable;
