import { useContext, useMemo } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { t } from "i18next";
import Report from "../Report/Report";
import { numberContext } from "../../context/settings/number-formatter";

const SalesReturnReports = () => {
  const { userData } = useContext(authCtx);
  const { formatReyal, formatGram } = numberContext();

  const columnsHeader = useMemo<any>(
    () => [
      {
        accessorKey: "#",
        header: () => <span>{t("")}</span>,
        colSpan: 1,
      },
      {
        accessorKey: "total_Sales",
        header: () => <span>{t("Total Sales and Tax")}</span>,
        colSpan: 2,
      },
      {
        accessorKey: "detailed",
        header: () => <span>{t("Detailed")}</span>,
        colSpan: 2,
      },
      {
        accessorKey: "gold",
        header: () => <span>{t("Gold")}</span>,
        colSpan: 4,
      },
      {
        accessorKey: "non_Gold",
        header: () => <span>{t("Non-Gold")}</span>,
        colSpan: 2,
      },
    ],
    []
  );

  const columns = useMemo<any>(
    () => [
      {
        header: () => <span>{t("bill number")}</span>,
        accessorKey: "bill_number",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("Cash")}</span>,
        accessorKey: "cash",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("The Bank")}</span>,
        accessorKey: "bank",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("Sales Only")}</span>,
        accessorKey: "sales_only",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("VAT")}</span>,
        accessorKey: "vat",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("18")}</span>,
        accessorKey: "gold_18",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("21")}</span>,
        accessorKey: "gold_21",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("22")}</span>,
        accessorKey: "gold_22",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("24")}</span>,
        accessorKey: "gold_24",
        cell: (info: any) => formatGram(Number(info.getValue())),
      },
      {
        header: () => <span>{t("Diamond")}</span>,
        accessorKey: "diamond",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("accessory")}</span>,
        accessorKey: "accessory",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
    ],
    []
  );

  return (
    <Report
      endpoint={`/report/api/v1/return/${userData?.branch_id}`}
      endpointQueryKey={"SalesReturnReports"}
      columns={columns}
      columnsHeader={columnsHeader}
    />
  );
};

export default SalesReturnReports;

{
  /* <p className="text-mainGreen py-4 text-center text-2xl font-bold">
{t("there is no data for your search")}
</p> */
}
