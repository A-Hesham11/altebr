import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useMemo } from "react";

export const MissingItemsStoneDetailsTable = ({
  selectedItem,
  selectedRowDetailsId,
}: {
  selectedItem: any;
  selectedRowDetailsId: number | null;
}) => {
  const selectedItemDetails = Array.isArray(selectedItem)
    ? selectedItem
        ?.filter((item: any) => item.id === selectedRowDetailsId)[0]
        ?.detailsItem?.map((stone: any) => stone?.stonesDetails)[0]
    : selectedItem?.items
        ?.filter((item: any) => selectedItem?.id === selectedRowDetailsId)[0]
        ?.detailsItem?.map((stone: any) => stone?.stonesDetails)[0];

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) =>
          info.getValue() === "added" ? t("added") : t("not added"),
        accessorKey: "stone_type",
        header: () => <span>{t("stone type")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "color_id",
        header: () => <span>{t("color")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "shape_id",
        header: () => <span>{t("stone shape")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "count",
        header: () => <span>{t("stone count")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "purity_id",
        header: () => <span>{t("stone purity")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "nature_id",
        header: () => <span>{t("stone nature")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "certificate_number",
        header: () => <span>{t("certificate number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "certificate_source",
        header: () => <span>{t("certificate source")}</span>,
      },
      {
        cell: (info: any) => (
          <span
            className="cursor-pointer"
            onClick={() =>
              window.open(info.getValue(), "_blank", "noopener,noreferrer")
            }
          >
            url
          </span>
        ),
        accessorKey: "certificate_url",
        header: () => <span>{t("url")}</span>,
      },
    ],
    []
  );
  if (!selectedItemDetails?.length)
    return (
      <h2 className="text-center font-bold text-xl mt-16 text-mainGreen">
        {t("there are no stones in this item")}
      </h2>
    );
  return (
    <div>
      <p className="text-center mb-2 bg-green-200">{t("stone details")}</p>
      <Table data={selectedItemDetails} columns={Cols}></Table>
    </div>
  );
};
