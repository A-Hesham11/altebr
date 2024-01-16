import { t } from "i18next";
import { useMemo } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { ColumnDef } from "@tanstack/react-table";
import { Box_TP } from "../../supply/Bond";

type TableRow_TP = {
  itemType: string;
  goldWeight: number;
  entity_gold_price: number;
  itemStock: number;
  payoffTaxes: number;
  wage: number;
  totalWage: number;
  goldTaxes: number;
  goldKarat: string;
  itemTaxes: number;
};

type Contract_TP = {
  id: number;
  bond_number: number;
  bond_date: string;
  classification: "gold";
  supplier_name: string;
  entity_gold_price: number;
  items: {
    category: {
      name: string;
      name_ar: string;
      name_en: string;
    };
    goldWeight: number;
    stocks: number;
    id: string;
    gold_wage: number;
    gold_tax: number;
    wage_tax: number;
    total_tax: number;
    payoffTaxes: number;
    wage: number;
    totalWage: number;
    goldKarat: {
      name: string;
    };
  }[];
  boxes: Box_TP[];
};

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const TableOfBranchBondsModal = ({ item }: { item?: {} }) => {
console.log("🚀 ~ file: TableOfBranchBondsModal.tsx:60 ~ TableOfBranchBondsModal ~ item:", item)

  const { formatGram, formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE OF DETAILS BOND DETAILS
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_id",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => {
          return info.getValue() || info.row.original.karatmineral ;
        } ,
        accessorKey: "karat_id",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "thwelbond_id",
        header: () => <span>{t("supply bond")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "-",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue(info.getValue()))) || "-",
        accessorKey: "value",
        header: () => <span>{t("value")}</span>,
      },
    ],
    []
  );

  // COLUMNS FOR THE TABLE OF DETAILS BOND DETAILS
  //   const tableColumnAccountingEntry = useMemo<any>(
  //     () => [
  //       {
  //         cell: (info: any) => info.getValue() || "-",
  //         accessorKey: "hwya",
  //         header: () => <span>{t("hwya")}</span>,
  //       },
  //     ],
  //     []
  //   );

  const cols2 = useMemo<ColumnDef<Entry_TP>[]>(
    () => [
      {
        header: `${t("description")}`,
        cell: (info) => info.renderValue() || "-",
        accessorKey: "bian",
      },
      {
        header: `${t("gram (debtor)")}`,
        cell: (info) => formatGram(Number(info.renderValue())) || "-",
        accessorKey: "debtor_gram",
      },
      {
        header: `${t("reyal (debtor)")}`,
        cell: (info) => formatReyal(Number(info.renderValue())) || "-",
        accessorKey: "debtor_SRA",
      },
      {
        header: `${t("gram (creditor)")}`,
        cell: (info) => formatGram(Number(info.renderValue())) || "-",
        accessorKey: "creditor_gram",
      },
      {
        header: `${t("reyal (creditor)")}`,
        cell: (info) => formatReyal(Number(info.renderValue())) || "-",
        accessorKey: "creditor_SRA",
      },
    ],
    []
  );

  // FOR TABLE ACCOUNTING ENTRY
  let restrictions = item.boxes?.map(
    ({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_gram:
        computational_movement === "debtor" && unit_id === "gram" ? value : 0,
      debtor_SRA:
        computational_movement === "debtor" && unit_id === "reyal" ? value : 0,
      creditor_gram:
        computational_movement === "creditor" && unit_id === "gram" ? value : 0,
      creditor_SRA:
        computational_movement === "creditor" && unit_id === "reyal"
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

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-slate-700 mb-4">
        {t("view bond details")}
      </h2>

      {/* BOND DETAILS */}
      <div>
        <div className="flex items-center justify-between mb-6 mt-8">
          <h2 className="text-xl font-bold text-slate-700">
            {t("bond details")} 
          </h2>
          <p className="text-base font-semibold">{t("bond number")} <span className="text-mainOrange">{item?.id}</span></p>
        </div>

        <Table data={item?.items || []} showNavigation columns={tableColumn}>
          {/* <div className="mt-3 flex items-center justify-center gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              {<span className=" text-mainGreen">{dataSource?.total}</span>}
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className=" rounded bg-mainGreen p-[.18rem]"
                action={() => setPage((prev: any) => prev - 1)}
                disabled={page == 1}
              >
                {isRTL ? (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                )}
              </Button>

              <Button
                className="rounded bg-mainGreen p-[.18rem]"
                action={() => setPage((prev: any) => prev + 1)}
                disabled={page == dataSource?.pages}
              >
                {isRTL ? (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                )}
              </Button>
            </div>
          </div> */}
        </Table>
      </div>

      {/* ACCOUNTING ENTRY */}
      <div className="mt-6">
        <h2 className="text-xl mb-5 font-bold">{t("accounting entry")}</h2>
        <Table data={restrictions} footered columns={cols2} />
      </div>
    </div>
  );
};

export default TableOfBranchBondsModal;
