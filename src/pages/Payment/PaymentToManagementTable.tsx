import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../context/settings/number-formatter";

const PaymentToManagementTable = ({ item }: { item?: {} }) => {
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "payment_method",
        header: () => <span>{t("payment method")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amount",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("Gold value (in grams)")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "total",
        header: () => <span>{t("total")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <div className="mt-16">
        <Table data={item?.items} columns={tableColumn}></Table>
      </div>
    </>
  );
};

export default PaymentToManagementTable;