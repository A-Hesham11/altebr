import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { t } from "i18next";
import { BsEye } from "react-icons/bs";
import { BiSpreadsheet } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import { Modal } from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import PaymentFinalPreviewBillData from "../../Payment/PaymentFinalPreviewBillData";
import InvoiceTable from "../../../components/selling/selling components/InvoiceTable";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import InvoiceTableData from "../../../components/selling/selling components/InvoiceTableData";

const ThweelBondsPrint = ({
  operationTypeSelect,
  thwelPrint,
  setThwelPrint,
  bondDataPrint,
}) => {
  console.log("🚀 ~ operationTypeSelect:", operationTypeSelect);
  console.log("🚀 ~ thwelPrint:", thwelPrint);
  const { formatReyal, formatGram } = numberContext();

  // STATE
  const isRTL = useIsRTL();
  const { userData } = useContext(authCtx);

  ////////////////////////////////////////////////////////////
  //////////// OPERATION OF SEPERATE FOR PRINT
  /////// GOLD 18
  const gold18 = operationTypeSelect?.filter(
    (gold18: any) => gold18?.karat_id === "18"
  );

  const printGold18 = gold18?.reduce(
    (acc: any, curr: any) => {
      return {
        category: t("gold 18"),
        karat_id: "18",
        total_weight: +acc?.total_weight + +curr?.weight,
        total_wage: +acc?.total_wage + +curr?.wage_total,
        total_value: +acc?.total_value + +curr?.value,
        count_items: gold18.length,
      };
    },
    {
      category: t("gold 18"),
      karat_id: "18",
      total_weight: 0,
      total_wage: 0,
      total_value: 0,
      count_items: gold18?.length || 0,
    }
  );

  /////// GOLD 21
  const gold21 = operationTypeSelect?.filter(
    (gold21: any) => gold21?.karat_id === "21"
  );

  const printGold21 = gold21?.reduce(
    (acc: any, curr: any) => {
      return {
        category: t("gold 21"),
        karat_id: "21",
        total_weight: +acc?.total_weight + +curr?.weight,
        total_wage: +acc?.total_wage + +curr?.wage_total,
        total_value: +acc?.total_value + +curr?.value,
        count_items: gold21.length,
      };
    },
    {
      category: t("gold 21"),
      karat_id: "21",
      total_weight: 0,
      total_wage: 0,
      total_value: 0,
      count_items: gold21?.length || 0,
    }
  );

  /////// GOLD 22
  const gold22 = operationTypeSelect?.filter(
    (gold22: any) => gold22?.karat_id === "22"
  );

  const printGold22 = gold22?.reduce(
    (acc: any, curr: any) => {
      return {
        category: t("gold 22"),
        karat_id: "22",
        total_weight: +acc.total_weight + +curr?.weight,
        total_wage: +acc.total_wage + +curr?.wage_total,
        total_value: +acc.total_value + +curr?.value,
        count_items: acc.count_items,
      };
    },
    {
      category: t("gold 22"),
      karat_id: "22",
      total_weight: 0,
      total_wage: 0,
      total_value: 0,
      count_items: gold22?.length || 0,
    }
  );

  /////// GOLD 24
  const gold24 = operationTypeSelect?.filter(
    (gold24: any) => gold24?.karat_id === "24"
  );

  const printGold24 = gold24?.reduce(
    (acc: any, curr: any) => {
      return {
        category: t("gold 24"),
        karat_id: "24",
        total_weight: +acc?.total_weight + +curr?.weight,
        total_wage: +acc?.total_wage + +curr?.wage_total,
        total_value: +acc?.total_value + +curr?.value,
        count_items: gold24.length,
      };
    },
    {
      category: t("gold 24"),
      karat_id: "24",
      total_weight: 0,
      total_wage: 0,
      total_value: 0,
      count_items: gold24?.length || 0,
    }
  );

  /////// diamond
  const diamond = operationTypeSelect?.filter(
    (diamond: any) => diamond?.classification_id === "الماس"
  );

  const printDiamond = diamond?.reduce(
    (acc: any, curr: any) => {
      return {
        category: t("diamond"),
        karat_id: 0,
        total_weight: acc?.total_weight,
        total_wage: +acc?.total_wage + +curr?.wage_total,
        total_value: +acc?.total_value + +curr?.value,
        count_items: diamond.length,
      };
    },
    {
      category: t("diamond"),
      karat_id: 0,
      total_weight: 0,
      total_wage: 0,
      total_value: 0,
      count_items: diamond?.length || 0,
    }
  );

  /////// motafreqat
  const motafreqat = operationTypeSelect?.filter(
    (motafreqat: any) => motafreqat?.classification_id === "متفرقات"
  );

  const printMotafreqat = motafreqat?.reduce(
    (acc: any, curr: any) => {
      return {
        category: t("motafreqat"),
        karat_id: 0,
        total_weight: acc?.total_weight,
        total_wage: +acc?.total_wage + +curr?.wage_total,
        total_value: +acc?.total_value + +curr?.value,
        count_items: motafreqat.length,
      };
    },
    {
      category: t("motafreqat"),
      karat_id: 0,
      total_weight: 0,
      total_wage: 0,
      total_value: 0,
      count_items: motafreqat?.length || 0,
    }
  );

  const filteredItem = [
    printGold18,
    printGold21,
    printGold22,
    printGold24,
    printDiamond,
    printMotafreqat,
  ];
  console.log("🚀 ~ TableOfBranchBonds ~ filteredItem:", filteredItem);

  const filteredItemWithoutEmpty = filteredItem?.filter(
    (item) => item?.count_items !== 0
  );

  //////////////////////////////TOTALS
  const totalWeights = filteredItem?.reduce(
    (acc, curr) => (acc += +curr?.total_weight),
    0
  );
  const totalWage = filteredItem?.reduce(
    (acc, curr) => (acc += +curr?.total_wage),
    0
  );
  const totalValues = filteredItem?.reduce(
    (acc, curr) => (acc += +curr?.total_value),
    0
  );
  const totalItems = filteredItem?.reduce(
    (acc, curr) => (acc += +curr?.count_items),
    0
  );

  ////////////////////////////////////////////////////////////

  // ========================================================
  const contentRef = useRef();

  const clientData = {
    client_id: 1,
    client_value: 1,
    bond_date: bondDataPrint?.bond_date,
    supplier_id: 1,
    branchName: bondDataPrint?.branch_name,
    bondType: "توريد عادي",
  };

  // const clientData = {
  //   client_id: selectedPrintItem?.client_id,
  //   client_value: selectedPrintItem?.client_name,
  //   bond_date: selectedPrintItem?.date,
  //   supplier_id: selectedPrintItem?.supplier_id,
  //   branchName: selectedPrintItem?.branch_id,
  //   bondType: "توريد عادي",
  // };

  // const costDataAsProps = {
  //   totalWeights,
  //   totalWage,
  //   totalValues,
  //   totalItems,
  // };

  const totalWeightConvertedTo24 =
    (+printGold18?.total_weight * 18) / 24 +
    (+printGold21?.total_weight * 21) / 24 +
    (+printGold22?.total_weight * 22) / 24 +
    (+printGold24?.total_weight * 24) / 24;

  const finalArabicTotals = {
    value:
      +printDiamond?.total_value +
      +printMotafreqat?.total_value +
      +printGold18?.total_wage +
      +printGold21?.total_wage +
      +printGold22?.total_wage +
      +printGold24?.total_wage,
    weight: totalWeightConvertedTo24,
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
      }
    `,
  });

  const tableColumnPrint = useMemo<any>(
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
          return info.getValue() || info.row.original.karatmineral;
        },
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "-",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(
            Number(info.row.original.wage) * Number(info.row.original.weight)
          ) || "-",
        accessorKey: "total_wages",
        header: () => <span>{t("total wages")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "-",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
    ],
    []
  );

  const totalNet = operationTypeSelect?.reduce((acc, curr) => {
    acc += (+curr.karat_id * +curr.weight) / 24;
    return acc;
  }, 0);

  const totalWeight = operationTypeSelect?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = operationTypeSelect?.reduce((acc, curr) => {
    acc += +curr.selling_price;
    return acc;
  }, 0);

  const totalWages = operationTypeSelect?.reduce((acc, curr) => {
    acc += +curr.wage;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalWeights,
    totalWage,
    totalValues,
    totalItems,
    finalArabicData: [
      {
        title: t("Total net"),
        totalFinalCostIntoArabic: formatGram(totalNet),
        type: t("gram"),
      },
      {
        title: t("total cash"),
        totalFinalCostIntoArabic: formatReyal(
          Number(totalWages) + Number(totalCost)
        ),
        type: t("reyal"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        weight: formatGram(Number(totalWeight)),
        wage: formatReyal(Number(totalWages)),
        cost: formatReyal(Number(totalCost)),
      },
    ],
  };

  // =============================================

  return (
    <Modal isOpen={thwelPrint} onClose={() => setThwelPrint(false)}>
      <div className="relative h-full py-16 px-8">
        <div className="flex justify-end mb-8 w-full">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={handlePrint}
          >
            {t("print")}
          </Button>
        </div>
        <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
          <div
            className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow "
            id="content-to-print"
          >
            <div className="mx-5 bill-shadow rounded-md p-6">
              <PaymentFinalPreviewBillData
                isSupply
                clientData={clientData}
                invoiceNumber={bondDataPrint?.bond_number}
                invoiceData={operationTypeSelect}
              />
            </div>

            <InvoiceTableData
              data={operationTypeSelect || []}
              columns={tableColumnPrint}
              costDataAsProps={costDataAsProps}
            ></InvoiceTableData>

            <div className="mx-5 bill-shadow rounded-md p-6 my-9">
              <div className="flex justify-between items-start pb-12 pe-8">
                <div className="text-center flex flex-col gap-4">
                  <span className="font-medium text-xs">
                    {t("recipient's signature")}
                  </span>
                  <p>------------------------------</p>
                </div>
                <div className="text-center flex flex-col gap-4">
                  <span className="font-medium text-xs">
                    {t("bond organizer")}
                  </span>
                  <p>{userData?.name}</p>
                </div>
              </div>
            </div>

            <div>
              <InvoiceFooter />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ThweelBondsPrint;
