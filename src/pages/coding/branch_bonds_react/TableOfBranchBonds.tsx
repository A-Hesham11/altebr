import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useFetch, useIsRTL } from "../../../hooks";
import { BsEye } from "react-icons/bs";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import { numberContext } from "../../../context/settings/number-formatter";
import TableOfBranchBondsModal from "./TableOfBranchBondsModal";
import { BiSpreadsheet } from "react-icons/bi";
import { ClientData_TP } from "../../selling/PaymentSellingPage";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useReactToPrint } from "react-to-print";
import FinalPreviewBillData from "../../../components/selling/selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../../../components/selling/selling components/InvoiceTable";
import PaymentFinalPreviewBillData from "../../Payment/PaymentFinalPreviewBillData";
import PaymentInvoiceTable from "../../Payment/PaymentInvoiceTable";
import InvoiceBondsReactTable from "./InvoiceBondsReactTable";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";

const TableOfBranchBonds = ({ dataSource, setPage, page }) => {
  const { formatReyal, formatGram } = numberContext();
  const invoiceRefs = useRef([]);

  // STATE
  const isRTL = useIsRTL();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [IdentitiesPrintModal, setOpenIdentitiesPrintModal] = useState(false);
  const [selectedPrintItem, setSelectedPrintItem] = useState<any>({});
  console.log(
    "🚀 ~ TableOfBranchBonds ~ selectedPrintItem:",
    selectedPrintItem
  );
  const [printItems, setPrintItems] = useState([]);
  console.log("🚀 ~ TableOfBranchBonds ~ printItems:", printItems);
  const { userData } = useContext(authCtx);

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => {
          if (info.getValue() == "normal") {
            return "توريد عادي";
          } else {
            return info.getValue();
          }
        },
        accessorKey: "type",
        header: () => <span>{t("bond type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date",
        header: () => <span>{t("bond date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "branch_id",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "count_items",
        header: () => <span>{t("pieces count")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "---",
        accessorKey: "total_wage",
        header: () => <span>{t("total wages")}</span>,
      },
      {
        cell: (info: any) => formatGram(info.getValue()) || "---",
        accessorKey: "total_gold_weight",
        header: () => <span>{t("total gold weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "count_stones",
        header: () => <span>{t("stones count")}</span>,
      },
      {
        cell: (info: any) => (
          <div className="flex items-center justify-center gap-4">
            <BsEye
              onClick={() => {
                setOpenIdentitiesPrintModal(true);
                setSelectedPrintItem(info.row.original);
              }}
              size={23}
              className="text-mainGreen cursor-pointer"
            />
            <BiSpreadsheet
              onClick={() => {
                setOpenIdentitiesModal(true);
                setSelectedItem(info.row.original);
              }}
              size={23}
              className="text-mainGreen cursor-pointer"
            />
          </div>
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  ////////////////////////////////////////////////////////////
  //////////// OPERATION OF SEPERATE FOR PRINT
  /////// GOLD 18
  const gold18 = selectedPrintItem?.items?.filter(
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
  console.log(printGold18);

  /////// GOLD 21
  const gold21 = selectedPrintItem?.items?.filter(
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
  const gold22 = selectedPrintItem?.items?.filter(
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

  console.log([printGold22]);

  /////// GOLD 24
  const gold24 = selectedPrintItem?.items?.filter(
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
  const diamond = selectedPrintItem?.items?.filter(
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
  const motafreqat = selectedPrintItem?.items?.filter(
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
  console.log(
    "🚀 ~ TableOfBranchBonds ~ filteredItemWithoutEmpty:",
    filteredItemWithoutEmpty
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
    client_id: selectedPrintItem?.client_id,
    client_value: selectedPrintItem?.client_name,
    bond_date: selectedPrintItem?.date,
    supplier_id: selectedPrintItem?.supplier_id,
    branchName: selectedPrintItem?.branch_id,
    bondType: "توريد عادي",
  };

  const costDataAsProps = {
    totalWeights,
    totalWage,
    totalValues,
    totalItems,
  };

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

  // COLUMNS FOR THE TABLE
  // const tableColumnPrint = useMemo<any>(
  //   () => [
  //     // {
  //     //   cell: (info: any) => {
  //     //     if (info.getValue() == "normal") {
  //     //       return "توريد عادي";
  //     //     } else {
  //     //       return info.getValue();
  //     //     }
  //     //   },
  //     //   accessorKey: "type",
  //     //   header: () => <span>{t("bond type")}</span>,
  //     // },
  //     {
  //       cell: (info: any) => info.getValue() || "---",
  //       accessorKey: "category",
  //       header: () => <span>{t("category")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue() || "---",
  //       accessorKey: "karat_id",
  //       header: () => <span>{t("karat")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue() || "---",
  //       accessorKey: "total_weight",
  //       header: () => <span>{t("total weight")}</span>,
  //     },
  //     {
  //       cell: (info: any) => formatReyal(info.getValue()) || "---",
  //       accessorKey: "total_wage",
  //       header: () => <span>{t("total wages")}</span>,
  //     },
  //     {
  //       cell: (info: any) => formatReyal(info.getValue()) || "---",
  //       accessorKey: "total_value",
  //       header: () => <span>{t("total value")}</span>,
  //     },
  //     // {
  //     //   cell: (info: any) => info.getValue() || "---",
  //     //   accessorKey: "count_stones",
  //     //   header: () => <span>{t("stones count")}</span>,
  //     // },
  //     {
  //       cell: (info: any) => info.getValue() || "---",
  //       accessorKey: "count_items",
  //       header: () => <span>{t("pieces count")}</span>,
  //     },
  //   ],
  //   []
  // );

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
        accessorKey: "karat_id",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      // {
      //   cell: (info: any) => info.getValue() || "-",
      //   accessorKey: "thwelbond_id",
      //   header: () => <span>{t("supply bond")}</span>,
      // },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "-",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.getValue(info.getValue()))) || "-",
        accessorKey: "value",
        header: () => <span>{t("value")}</span>,
      },
    ],
    []
  );
  const totalWeight = selectedPrintItem?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = selectedPrintItem?.items?.reduce((acc, curr) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const totalWages = selectedPrintItem?.items?.reduce((acc, curr) => {
    acc += +curr.wage;
    return acc;
  }, 0);

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      wage: formatReyal(Number(totalWages)),
      cost: formatReyal(Number(totalCost)),
    },
  ];

  // =============================================

  return (
    <>
      <div className="">
        <h2 className="text-xl font-bold text-slate-700 mb-4">
          {t("all bonds")}
        </h2>
        <Table data={dataSource.data || []} columns={tableColumn}>
          <div className="mt-3 flex items-center justify-center gap-5 p-2">
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
          </div>
        </Table>
      </div>

      {/* 3) MODAL */}
      <Modal
        isOpen={IdentitiesModal}
        onClose={() => setOpenIdentitiesModal(false)}
      >
        <TableOfBranchBondsModal item={selectedItem} />
      </Modal>
      <Modal
        isOpen={IdentitiesPrintModal}
        onClose={() => setOpenIdentitiesPrintModal(false)}
      >
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
                  invoiceNumber={selectedPrintItem?.id}
                  invoiceData={selectedPrintItem}
                />
              </div>

              <InvoiceTable
                data={selectedPrintItem?.items || []}
                columns={tableColumnPrint}
                costDataAsProps={costDataAsProps}
                finalArabicTotals={finalArabicTotals}
                resultTable={resultTable}
              ></InvoiceTable>

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
    </>
  );
};

export default TableOfBranchBonds;

{
  /* <div className="relative h-full py-16 px-8">
          <div className="flex justify-end mb-8 w-full">
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              action={handlePrint}
            >
              {t("print")}
            </Button>
          </div>

          <div className={`${isRTL ? "rtl" : "ltr"}`} ref={invoiceRefs}>
            <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
              <div className="mx-5 bill-shadow rounded-md p-6">
                <FinalPreviewBillData
                  clientData={clientData}
                  invoiceNumber={selectedPrintItem?.invoice_number}
                />
              </div>

              <div className="">
                <InvoiceTable
                  data={selectedPrintItem?.items}
                  columns={tableColumn}
                  costDataAsProps={costDataAsProps}
                ></InvoiceTable>
              </div>

              <div className="mx-5 bill-shadow rounded-md p-6 my-9 ">
                {/* <FinalPreviewBillPayment responseSellingData={item} /> */
}
//       </div>

//       <div className="text-center">
//         <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
//           {data && data?.sentence}
//         </p>
//         <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
//           <p>
//             {" "}
//             العنوان : {userData?.branch?.country?.name} ,{" "}
//             {userData?.branch?.city?.name} ,{" "}
//             {userData?.branch?.district?.name}
//           </p>
//           <p>
//             {t("phone")}: {userData?.phone}
//           </p>
//           <p>
//             {t("email")}: {userData?.email}
//           </p>
//           <p>
//             {t("tax number")}:{" "}
//             {companyData && companyData[0]?.taxRegisteration}
//           </p>
//           <p>
//             {t("Mineral license")}:{" "}
//             {companyData && companyData[0]?.mineralLicence}
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div> */}
