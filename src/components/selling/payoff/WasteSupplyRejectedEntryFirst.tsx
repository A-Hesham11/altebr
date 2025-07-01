import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { Button } from "../../atoms";
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase";
import { Loading } from "../../organisms/Loading";
import { Table } from "../../templates/reusableComponants/tantable/Table";

type RejectedItemsAccountingEntryProps_TP = {
  selectedItem: number;
  isInPopup?: boolean;
  setStage: React.Dispatch<React.SetStateAction<number>>;
};
///
export const WasteSupplyRejectedEntryFirst = ({
  selectedItem,
  isInPopup,
  setStage,
}: RejectedItemsAccountingEntryProps_TP) => {
  /////////// VARIABLES
  ///
  const { formatGram, formatReyal } = numberContext();

  const isRTL = useIsRTL();

  const goldCols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("item number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("identification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("gold karat")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue()
            ? formatReyal(
                Number(info.row.original.weight * info.row.original.wage)
              )
            : "",
        accessorKey: "wage_total",
        header: () => <span>{t("total wages")}</span>,
      },
      {
        cell: (info: any) =>
          selectedItem?.api_gold_price
            ? formatReyal(Number(selectedItem?.api_gold_price))
            : "---",
        accessorKey: "api_gold_price",
        header: () => <span>{t("selling price")}</span>,
      },
    ],
    []
  );

  const cols2 = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: `${t("description")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "bian",
      },
      {
        header: `${t("gram (debtor)")}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: "debtor_gram",
      },
      {
        header: `${t("reyal (debtor)")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "debtor_SRA",
      },
      {
        header: `${t("gram (creditor)")}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: "creditor_gram",
      },
      {
        header: `${t("reyal (creditor)")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "creditor_SRA",
      },
    ],
    []
  );
  ///
  /////////// STATES
  ///

  // restriction start BOX 1
  let restrictions = selectedItem?.boxes?.map(
    ({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_gram:
        computational_movement === "debtor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      debtor_SRA:
        computational_movement === "debtor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
      creditor_gram:
        computational_movement === "creditor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      creditor_SRA:
        computational_movement === "creditor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
    })
  );

  // group by account
  const restrictionsWithoutTotals = restrictions?.reduce((prev, curr) => {
    const index = prev.findIndex((item) => item.bian === curr.bian);
    if (index === -1) {
      prev.push(curr);
    } else {
      prev[index].debtor_gram += curr.debtor_gram;
      prev[index].debtor_SRA += curr.debtor_SRA;
      prev[index].creditor_gram += curr.creditor_gram;
      prev[index].creditor_SRA += curr.creditor_SRA;
    }
    return prev;
  }, [] as typeof restrictions);

  restrictions = restrictionsWithoutTotals;

  let restrictionsTotals;
  if (restrictions && !!restrictions.length) {
    restrictionsTotals = restrictions?.reduce((prev, curr) => ({
      bian: `${t("totals")}`,
      debtor_gram: prev.debtor_gram + curr.debtor_gram,
      debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
      creditor_gram: prev.creditor_gram + curr.creditor_gram,
      creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
    }));
  }

  if (restrictionsTotals) restrictions?.push(restrictionsTotals!);

  // restriction end BOX 1

  const total24 = selectedItem?.counts?.total_3yar_24 || 0;
  const total22 = selectedItem?.counts?.total_3yar_22 || 0;
  const total21 = selectedItem?.counts?.total_3yar_21 || 0;
  const total18 = selectedItem?.counts?.total_3yar_18 || 0;
  const allCounts = selectedItem?.counts?.items_count || 0;
  const totalWages = selectedItem?.counts?.wage_total || 0;

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: allCounts,
    },
    {
      name: "إجمالي وزن 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total24,
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total22,
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total21,
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total18,
    },
    {
      name: t("total wages"),
      key: crypto.randomUUID(),
      unit: t("ryal"),
      value: totalWages,
    },
  ];

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  ///
  return (
    <div className="md:px-16 px-4 mt-8 md:mt-16">
      <ul className="grid grid-cols-4 gap-6 mb-5 md:mb-16">
        {totals.map(({ name, key, unit, value }) => (
          <BoxesDataBase variant="secondary" key={key}>
            <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
              {name}
            </p>
            <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
              {value} {t(unit)}
            </p>
          </BoxesDataBase>
        ))}
      </ul>

      <Table data={selectedItem?.items} columns={goldCols} showNavigation>
        <>
          <h2 className="text-xl mb-5 font-bold">
            {t("Accounting entry for returning parts to management")}{" "}
            {selectedItem?.branch_is_wasting === 1 && (
              <span>({t("Convert new pieces to fractions")})</span>
            )}
          </h2>
          <Table data={restrictions} footered showNavigation columns={cols2} />
        </>
        {/* )} */}
        <div className="flex gap-x-2 mr-auto">
          {!isInPopup && (
            <>
              <Button action={() => setStage(1)} bordered>
                {t("back")}
              </Button>
            </>
          )}
        </div>
      </Table>
    </div>
  );
};
