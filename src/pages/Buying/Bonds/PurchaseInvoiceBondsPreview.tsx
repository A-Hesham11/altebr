// import { t } from "i18next";
// import React, { useMemo } from "react";
// import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
// import { numberContext } from "../../../context/settings/number-formatter";

// const PurchaseInvoiceBondsPreview = ({ item }: { item?: {} }) => {
//   const { formatReyal } = numberContext();

//   // COLUMNS FOR THE TABLE
//   const tableColumn = useMemo<any>(
//     () => [
//       {
//         cell: (info: any) => info.getValue(),
//         accessorKey: "category_name",
//         header: () => <span>{t("classification")}</span>,
//       },
//       {
//         cell: (info: any) => {
//           if (info.getValue() == 1) {
//             return <span>{t("there are stones")}</span>;
//           } else {
//             return <span>{t("there are no stones")}</span>;
//           }
//         },
//         accessorKey: "has_stones",
//         header: () => <span>{t("stones")}</span>,
//       },
//       {
//         cell: (info: any) => info.getValue() || "-",
//         // accessorKey: "old_weight",
//         accessorKey: "weight",
//         header: () => <span>{t("weight")}</span>,
//       },
//       {
//         cell: (info: any) => info.renderValue(),
//         accessorKey: "karat_name",
//         header: () => <span>{t("karat")}</span>,
//       },
//       {
//         cell: (info: any) => formatReyal(Number(info.renderValue())),
//         accessorKey: "gram_price",
//         header: () => <span>{t("piece per gram")}</span>,
//       },
//       {
//         cell: (info: any) =>
//           formatReyal(Number(info.renderValue()).toFixed(2)) || "-",
//         accessorKey: "value",
//         header: () => <span>{t("value")}</span>,
//       },
//       {
//         cell: (info: any) =>
//           formatReyal(Number(info.renderValue()).toFixed(2)) == 0
//             ? "-"
//             : formatReyal(Number(info.renderValue()).toFixed(2)),
//         accessorKey: "value_added_tax",
//         header: () => <span>{t("VAT")}</span>,
//       },
//       {
//         cell: (info: any) =>
//           formatReyal(Number(info.renderValue()).toFixed(2)) == 0
//             ? formatReyal(Number(info.row.original.value).toFixed(2))
//             : formatReyal(Number(info.renderValue()).toFixed(2)),
//         accessorKey: "total_value",
//         header: () => <span>{t("total value")}</span>,
//       },
//     ],
//     []
//   );

//   return (
//     <>
//       <div className="mt-16">
//         <Table data={item?.items} columns={tableColumn}></Table>
//       </div>
//     </>
//   );
// };

// export default PurchaseInvoiceBondsPreview;

import { t } from "i18next";
import React, { useContext, useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";
import { Button } from "@/components/ui/button";
import { BuyingFinalPreview } from "../BuyingFinalPreview";
import { authCtx } from "@/context/auth-and-perm/auth";
import { useNavigate } from "react-router-dom";
import { convertNumToArWord } from "@/utils/number to arabic words/convertNumToArWord";
import InvoiceTableData from "@/components/selling/selling components/InvoiceTableData";
import { ColumnDef } from "@tanstack/react-table";
import { Selling_TP } from "../BuyingPage";

const PurchaseInvoiceBondsPreview = ({ item }: { item?: any }) => {
  console.log("🚀 ~ PurchaseInvoiceBondsPreview ~ item:", item);
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();

  const odwyaTypeValue =
    !!item?.supplier_id || !!item?.supplier_name ? "supplier" : "client";

  const clientData = {
    client_value:
      odwyaTypeValue === "supplier" ? item?.supplier_name : item.client_name,
    client_id:
      odwyaTypeValue === "supplier" ? item?.supplier_id : item.client_id,
    bond_date: new Date(item?.invoice_date),
  };

  // FORMULA TO CALC THE TOTAL COST OF BUYING INVOICE
  const totalCost = item?.items?.reduce((acc: number, curr: any) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const totalValueAddedTax = item?.items?.reduce((acc: number, curr: any) => {
    acc += +curr.value_added_tax;
    return acc;
  }, 0);

  const totalValueAfterTax = item?.items?.reduce((acc: number, curr: any) => {
    acc += +curr.total_value;
    return acc;
  }, 0);

  const totalGold18 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name == "18" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold21 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name == "21" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold22 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name == "22" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold24 =
    item?.items?.reduce((acc, curr) => {
      return curr.karat_name == "24" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;

  const totalWeight18To24 = (totalGold18 * 18) / 24;
  const totalWeight21To24 = (totalGold21 * 21) / 24;
  const totalWeight22To24 = (totalGold22 * 22) / 24;

  const totalKaratWeight = [
    { title: "karat 18", weight: totalGold18 },
    { title: "karat 21", weight: totalGold21 },
    { title: "karat 22", weight: totalGold22 },
    { title: "karat 24", weight: totalGold24 },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(Math.round(totalCost));

  const totalFinalWeightIntoArabic = convertNumToArWord(
    Math.round(
      Number(
        totalWeight18To24 + totalWeight21To24 + totalWeight22To24 + totalGold24
      )
    )
  );

  const costDataAsProps = {
    totalCost,
    totalValueAddedTax,
    totalValueAfterTax,
    finalArabicData: [
      {
        title: t("total"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("total weight converted to 24"),
        totalFinalCostIntoArabic: totalFinalWeightIntoArabic,
        type: t("gram"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        cost: formatReyal(totalCost),
      },
    ],
    totalKaratWeight: totalKaratWeight,
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stones")} </span>,
        accessorKey: "stones_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("price per gram")} </span>,
        accessorKey: "piece_per_gram",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
    ],
    []
  );

  if (odwyaTypeValue === "supplier") {
    Cols.push(
      {
        header: () => <span>{t("value added tax")} </span>,
        accessorKey: "value_added_tax",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      }
    );
  }

  const BuyingTableComp = () => (
    <InvoiceTableData
      data={item?.items}
      columns={Cols}
      costDataAsProps={costDataAsProps}
      odwyaTypeValue={odwyaTypeValue}
      // setOdwyaTypeValue={setOdwyaTypeValue}
    ></InvoiceTableData>
  );

  return (
    <div>
      <div className="flex items-center justify-between mx-8 mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={() => window.print()}
          >
            {t("print")}
          </Button>
        </div>
      </div>
      <BuyingFinalPreview
        ItemsTableContent={<BuyingTableComp />}
        // paymentData={paymentData}
        clientData={clientData}
        sellingItemsData={item?.items}
        costDataAsProps={costDataAsProps}
        invoiceNumber={item?.invoice_number}
        odwyaTypeValue={odwyaTypeValue}
      />
    </div>
  );
};

export default PurchaseInvoiceBondsPreview;
