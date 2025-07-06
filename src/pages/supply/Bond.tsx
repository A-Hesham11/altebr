import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";
import { Loading } from "../../components/organisms/Loading";
import { BondTotals } from "../../components/supply/BondTotals";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../hooks";
import { FilesPreview } from "../../components/molecules/files/FilesPreview";
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik";
import { CImageFile_TP } from "../../types";
import { Back } from "../../utils/utils-components/Back";
import { Button } from "../../components/atoms";
import { useReactToPrint } from "react-to-print";

type BondProps_TP = {
  title: string;
};

export type Box_TP = {
  id: number;
  accountable_type: string;
  accountable_id: number;
  account: string;
  value: number;
  unit_id: "reyal and gram" | "gram" | "reyal";
  computational_movement: "creditor" | "debtor";
  text: "test";
};

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

export const Bond = ({ title }: BondProps_TP) => {
  const { bondID } = useParams();
  const [factorialValue, setFactorialValue] = useState(1);
  const { formatGram, formatReyal } = numberContext();
  const [images, setImages] = useState<CImageFile_TP[]>([]);
  const [files, setFiles] = useState<CImageFile_TP[]>([]);

  const location = useLocation();
  const path = location.pathname;
  const bondRefs = useRef([]);

  const isRTL = useIsRTL();

  const {
    data: contract,
    isError,
    isLoading,
    isSuccess,
    isFetching,
    failureReason,
  } = useFetch<Contract_TP>({
    endpoint:
      path == `/gold-bonds/${bondID}`
        ? `twredGold/api/v1/bond/${bondID}`
        : path == `/diamond-bonds/${bondID}`
        ? `twredDiamond/api/v1/diamondBonds/${bondID}`
        : `twredAccessory/api/v1/accessoryBonds/${bondID}`,
    queryKey:
      path == `/gold-bonds/${bondID}`
        ? ["one_gold_bond"]
        : path == `/diamond-bonds/${bondID}`
        ? ["one_diamond_bond"]
        : ["one_accessory_bond"],
    onSuccess(data: any) {
      data?.images?.map((image: any) => {
        if (image?.preview.includes("pdf")) {
          setFiles((prev: any) => [
            ...prev,
            {
              preview: image?.type === "image" ? image?.path : image?.preview,
              path: image?.preview,
              type: "image",
            },
          ]);
        } else {
          setImages((prev: any) => [
            ...prev,
            {
              preview: image?.type === "image" ? image?.path : image?.preview,
              path: image?.preview,
              type: "image",
            },
          ]);
        }
      });
    },
    select: (contract: any): any =>
      path == `/gold-bonds/${bondID}`
        ? {
            id: contract.id,
            bond_number: contract.bond_number,
            bond_date: contract.bond_date,
            classification: contract.classification,
            supplier_name: contract.supplier_name,
            images: contract.images,
            items: contract.items.map((item: any) => {
              return {
                itemType: item?.category?.name,
                itemStock: item?.stocks,
                itemTaxes: item?.totalWage,
                payoffTaxes: item?.totalWage,
                entity_gold_price: contract.entity_gold_price,
                gold_tax: item?.gold_tax,
                wage_tax: item?.wage_tax,
                total_tax: item?.total_tax,
                id: item?.id,
                goldKarat: item?.goldKarat.name,
                goldWeight: item?.goldWeight,
                wage: item?.wage,
                totalWage: item?.totalWage,
              };
            }),
            boxes: contract.boxes.map((box: any) => {
              return {
                id: box.id,
                account: box.account,
                value: box.value,
                unit_id: box.unit_id,
                computational_movement: box.computational_movement,
              };
            }),
          }
        : path == `/diamond-bonds/${bondID}`
        ? {
            id: contract.id,
            bond_number: contract.bond_number,
            bond_date: contract.bond_date,
            factorial: contract?.factorial,
            classification: contract.classification,
            supplier_name: contract.supplier_name,
            images: contract.images,
            items: contract.items.map((item: any) => {
              return {
                itemType: item?.category_name,
                karatmineral: item?.karatmineral_name,
                id: item?.id,
                weight: item?.total_weight,
                goldKarat: item?.goldKarat?.name,
                gold_weight: item?.gold_weight,
                total_weight: item?.total_weight,
                diamond_value: item?.diamond_value,
                diamond_amount: item?.diamond_number,
                diamond_stone_weight: item?.diamond_stone_weight,
                other_stones_weight: item?.other_stones_weight,
                diamond_tax: item?.diamond_tax,
                mineral_name: item?.mineral_name,
              };
            }),
            boxes: contract.boxes.map((box: any) => {
              return {
                id: box.id,
                account: box.account,
                value: box.value,
                unit_id: box.unit_id,
                computational_movement: box.computational_movement,
              };
            }),
          }
        : {
            id: contract.id,
            bond_number: contract.bond_number,
            bond_date: contract.bond_date,
            factorial: contract?.factorial,
            classification: contract.classification,
            supplier_name: contract.supplier_name,
            images: contract.images,
            items: contract.items.map((item: any) => {
              return {
                itemType: item?.category_name,
                karatmineral: item?.karatmineral_name,
                id: item?.id,
                weight: item?.total_weight,
                goldKarat: item?.goldKarat?.name,
                gold_weight: item?.gold_weight,
                total_weight: item?.total_weight,
                accessory_value: item?.accessory_value,
                accessory_value_ryal: item?.accessory_value_ryal,
                accessory_amount: contract?.item_count,
                other_stones_weight: item?.other_stones_weight,
                accessory_tax: item?.accessory_tax,
                mineral_name: item?.mineral_name,
              };
            }),
            boxes: contract.boxes.map((box: any) => {
              return {
                id: box.id,
                account: box.account,
                value: box.value,
                unit_id: box.unit_id,
                computational_movement: box.computational_movement,
              };
            }),
          },
  });

  const cols1 =
    path == `/gold-bonds/${bondID}`
      ? useMemo<ColumnDef<TableRow_TP>[]>(
          () => [
            {
              header: `${t("category")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "itemType",
            },
            {
              header: `${t("weight")}`,
              cell: (info) => formatGram(Number(info.renderValue())),
              accessorKey: "goldWeight",
            },
            {
              header: `${t("karat")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "goldKarat",
            },
            {
              header: `${t("stocks")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "itemStock",
            },
            {
              header: `${t("wage")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "wage",
            },
            {
              header: `${t("gold price")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "entity_gold_price",
            },
            {
              header: `${t("total wages")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "totalWage",
            },
            {
              header: `${t("wage tax")}`,
              cell: (info) =>
                info.renderValue() == 0
                  ? t("no tax")
                  : formatReyal(Number(info.renderValue())),
              accessorKey: "wage_tax",
            },
            {
              header: `${t("gold tax")}`,
              cell: (info) =>
                info.renderValue() == 0
                  ? t("no tax")
                  : formatReyal(Number(info.renderValue())),
              accessorKey: "gold_tax",
            },
            {
              header: `${t("total tax")}`,
              cell: (info) =>
                info.renderValue() == 0
                  ? t("no tax")
                  : formatReyal(Number(info.renderValue())),
              accessorKey: "total_tax",
            },
          ],
          []
        )
      : path == `/diamond-bonds/${bondID}`
      ? useMemo<ColumnDef<TableRow_TP>[]>(
          () => [
            {
              header: `${t("category")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "itemType",
            },
            {
              header: `${t("weight")}`,
              cell: (info) => formatGram(Number(info.renderValue())),
              accessorKey: "total_weight",
            },
            {
              header: `${t("mineral weight")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "gold_weight",
            },
            {
              header: `${t("mineral type")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "mineral_name",
            },
            {
              header: `${t("karat")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "karatmineral",
            },
            {
              header: `${t("diamond value")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "diamond_value",
            },
            {
              header: `${t("diamond value ryal")}`,
              cell: (info) =>
                formatReyal(
                  Number(info.row.original.diamond_value * factorialValue)
                ),
              accessorKey: "diamond_value_ryal",
            },
            {
              header: `${t("diamond amount")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "diamond_amount",
            },
            {
              header: `${t("diamond stone weight")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "diamond_stone_weight",
            },
            {
              header: `${t("other stones weight")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "other_stones_weight",
            },
            {
              header: `${t("diamond tax")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "diamond_tax",
            },
          ],
          [factorialValue]
        )
      : useMemo<ColumnDef<TableRow_TP>[]>(
          () => [
            {
              header: `${t("category")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "itemType",
            },
            {
              header: `${t("weight")}`,
              cell: (info) => formatGram(Number(info.renderValue())),
              accessorKey: "total_weight",
            },
            {
              header: `${t("mineral weight")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "gold_weight",
            },
            {
              header: `${t("mineral type")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "mineral_name",
            },
            {
              header: `${t("karat")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "karatmineral",
            },
            {
              header: `${t("accessory value")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "accessory_value",
            },
            {
              header: `${t("accessory value ryal")}`,
              cell: (info) =>
                info.row.original.accessory_value * factorialValue,
              accessorKey: "accessory_value_ryal",
            },
            {
              header: `${t("accessory amount")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "accessory_amount",
            },
            {
              header: `${t("other stones weight")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "other_stones_weight",
            },
            {
              header: `${t("accessory tax")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "accessory_tax",
            },
          ],
          [factorialValue]
        );

  const cols2 =
    path == `/gold-bonds/${bondID}`
      ? useMemo<ColumnDef<Entry_TP>[]>(
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
        )
      : useMemo<ColumnDef<Entry_TP>[]>(
          () => [
            {
              header: `${t("description")}`,
              cell: (info) => info.renderValue(),
              accessorKey: "bian",
            },
            {
              header: `${t("reyal (debtor)")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "debtor_SRA",
            },
            {
              header: `${t("reyal (creditor)")}`,
              cell: (info) => formatReyal(Number(info.renderValue())),
              accessorKey: "creditor_SRA",
            },
          ],
          []
        );

  let restrictions = contract?.boxes?.map(
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

  const handlePrint = useReactToPrint({
    content: () => bondRefs.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: A5 landscape;
        margin: 15px !important;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          zoom: 0.5;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
        .container_print {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
        }
        .no-print, .rt-table-pagination {
          display: none !important;
        }
        table {
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
      }
    `,
  });

  return (
    <div className={`${isRTL ? "rtl" : "ltr"} container_print`} ref={bondRefs}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {isError && (
        <h2 className="text-mainRed">{failureReason?.response.data.message}</h2>
      )}

      {(isLoading || isFetching) && <Loading mainTitle={t("bond total")} />}

      {!(isLoading || isFetching) && isSuccess && (
        <>
          {contract?.boxes?.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {title ? title : t("bond total")}
                </h2>
                <div className="flex gap-x-4 no-print">
                  <Button action={handlePrint}>{t("print")}</Button>
                  <Back />
                </div>
              </div>
              <BondTotals boxesData={contract.boxes} />
            </>
          ) : (
            <h2 className="text-center">{t("no items")}</h2>
          )}

          {contract?.items?.length > 0 ? (
            <div className="my-9 ">
              {(images?.length > 0 || files?.length > 0) && (
                <div className="mb-6 flex gap-4 justify-end no-print">
                  {files?.length > 0 && (
                    <FilesPreviewOutFormik preview pdfs={files} />
                  )}
                  {images?.length > 0 && (
                    <FilesPreviewOutFormik images={images} preview />
                  )}
                </div>
              )}
              <Table data={contract.items} showNavigation columns={cols1} />
            </div>
          ) : (
            <h2 className="text-center no-print">{t("no bonds")}</h2>
          )}

          {!!restrictions?.length && (
            <>
              <h2 className="text-xl mb-5 font-bold">
                {t("accounting entry")}
              </h2>
              <Table
                data={restrictions}
                footered
                showNavigation
                columns={cols2}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
