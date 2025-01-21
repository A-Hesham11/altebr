import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";

const ShowDetailsItemOfInventory = ({ itemDetails }: any) => {
  console.log("🚀 ~ ShowDetailsItemOfInventory ~ itemDetails:", itemDetails);

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      ...(itemDetails?.[0]?.classification_id === 1
        ? [
            {
              cell: (info: any) => info.getValue(),
              accessorKey: "wage_total",
              header: () => <span>{t("total wages")}</span>,
            },
          ]
        : [
            {
              cell: (info: any) => info.getValue(),
              accessorKey: "selling_price",
              header: () => <span>{t("cost")}</span>,
            },
          ]),
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "Iban",
        header: () => <span>{t("Status")}</span>,
      },
    ],
    []
  );
  return (
    <div>
      <h2 className="text-lg font-semibold pb-8">{t("piece details")}</h2>
      <Table data={itemDetails ?? []} columns={columns} />
    </div>
  );
};

export default ShowDetailsItemOfInventory;
