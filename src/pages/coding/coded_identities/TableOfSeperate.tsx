import { t } from 'i18next';
import React, { useMemo, useState } from 'react'
import { useFetch } from '../../../hooks';
import { Table } from '../../../components/templates/reusableComponants/tantable/Table';

const TableOfSeperate = () => {
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // FETCHING DATA FROM API
  const {
    data: transformBranch,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["selling-invoice"],
    endpoint: "selling/api/v1/invoices_per_branch/",
    pagination: true,
  });

  console.log(
    "🚀 ~ file: ViewSellingInvoice.tsx:15 ~ ViewSellingInvoice ~ transformBranch:",
    transformBranch
  );

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_number", // THIS WILL CHANGE
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "client_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_date",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("wage geram/ryal")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("total wage by ryal")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("weight of diamond stone")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("stone weight")}</span>,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl ml-4 mb-2 font-bold text-slate-700">
        {t("selected pieces")}
      </h2>
      <Table data={dataSource || []} columns={tableColumn}>
        <div className="text-xl text-center ml-4 mb-2 font-bold text-slate-700">{t("no combined pieces were selected for separation")}</div>
      </Table>
    </div>
  );
}

export default TableOfSeperate