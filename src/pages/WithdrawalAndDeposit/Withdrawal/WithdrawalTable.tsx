import React, { useMemo } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { FilesPreviewOutFormik } from "../../../components/molecules/files/FilesPreviewOutFormik";

type WithdrawalTable_TP = {
  data: any[];
};

const WithdrawalTable: React.FC<WithdrawalTable_TP> = ({ data }) => {
  const { formatGram, formatReyal } = numberContext();

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "bond_date",
        header: () => <span>{t("bond date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "account_name",
        header: () => <span>{t("account name")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "---",
        accessorKey: "total",
        header: () => <span>{t("total")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <>
              <div className="flex items-center gap-4 justify-center">
                <FilesPreviewOutFormik
                  images={info.row.original.images || []}
                  preview
                  pdfs={[]}
                />
              </div>
            </>
          );
        },
        accessorKey: "images",
        header: () => <span>{t("images")}</span>,
      },
    ],
    []
  );

  return (
    <Table showNavigation data={data || []} columns={tableColumn}>
      {data?.length === 0 && (
        <p className="text-center text-lg font-bold text-mainGreen">
          {t("there is no data to make deposit")}
        </p>
      )}
    </Table>
  );
};

export default WithdrawalTable;
