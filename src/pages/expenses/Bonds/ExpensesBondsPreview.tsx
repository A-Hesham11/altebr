import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import cashImg from "../../../assets/cash.png";
import { numberContext } from "../../../context/settings/number-formatter";
import { useIsRTL } from "../../../hooks";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { Selling_TP } from "../../selling/PaymentSellingPage";
import { Button } from "../../../components/atoms";
import InvoiceHeader from "../../../components/Invoice/InvoiceHeader";
import InvoiceTable from "../../../components/selling/selling components/InvoiceTable";
import FinalPreviewBillPayment from "../../../components/selling/selling components/bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import ExpenseInvoiceTable from "../Invoice/ExpensesInvoiceTable";
import ExpenseBillData from "../Invoice/ExpenseBillData";
import { authCtx } from "../../../context/auth-and-perm/auth";

const ExpensesBondsPreview = ({
  item,
  inEdara,
}: {
  item?: {};
  inEdara?: boolean;
}) => {
  console.log("🚀 ~ SellingInvoiceTablePreview ~ item:", item);
  const { formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const { pathname } = location;
  const isRTL = useIsRTL();
  const { userData } = useContext(authCtx);

  const ExpensesData = [
    {
      add_description: item?.description,
      directed_to: item?.description,
      expense_date:
        pathname === "/edara/viewExpenses"
          ? item?.expense_date
          : item?.expence_date,
      expense_price:
        pathname === "/edara/viewExpenses"
          ? item?.expense_amount
          : item?.expence_amount,
      expense_price_after_tax:
        pathname === "/edara/viewExpenses"
          ? item?.expense_tax
          : item?.expence_tax,
      expense_type_name: item?.child,
    },
  ];
  console.log("🚀 ~ ExpensesData ~ ExpensesData:", ExpensesData);

  const clientData = {
    client_id: item?.client_id,
    bond_date: item?.expence_date,
  };

  const paymentData = item?.invoicepayments?.map((item) => ({
    add_commission_ratio: "no",
    cardImage: item.image === "cash" ? cashImg : item.image,
    cost_after_tax: item.amount,
  }));

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("expense type")}</span>,
        accessorKey: "expense_type_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("We paid to")}</span>,
        accessorKey: "directed_to",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("description")} </span>,
        accessorKey: "add_description",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("expense price")}</span>,
        accessorKey: "expense_price",
        cell: (info) =>
          formatReyal(
            Number(info.getValue()) - info.row.original.expense_price_after_tax
          ),
      },
      {
        header: () => <span>{t("expense tax")} </span>,
        accessorKey: "expense_price_after_tax",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) => {
          return formatReyal(+info.row.original.expense_price) || "---";
        },
      },
    ],
    []
  );

  // const Cols = useMemo<ColumnDef<Selling_TP>[]>(
  //   () => [
  //     {
  //       header: () => <span>{t("expense type")}</span>,
  //       accessorKey: "child",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("We paid to")}</span>,
  //       accessorKey: "description",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("description")} </span>,
  //       accessorKey: "description",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("expense price")}</span>,
  //       accessorKey: "expence_amount",
  //       cell: (info) =>
  //         formatReyal(
  //           Number(info.getValue()) - Number(info.row.original.expence_tax)
  //         ),
  //     },
  //     {
  //       header: () => <span>{t("expense tax")} </span>,
  //       accessorKey: "expence_tax",
  //       cell: (info) => formatReyal(Number(info.getValue())) || "---",
  //     },
  //     {
  //       header: () => <span>{t("total value")} </span>,
  //       accessorKey: "expence_amount",
  //       cell: (info) => formatReyal(Number(info.getValue())),
  //     },
  //   ],
  //   []
  // );

  const totalCost = ExpensesData?.reduce((acc: number, curr: any) => {
    acc = +curr.expense_price;
    return acc;
  }, 0);
  console.log("🚀 ~ totalCost ~ totalCost:", totalCost);

  const totalValueAfterTax = ExpensesData?.reduce((acc: number, curr: any) => {
    acc += +curr.expense_price_after_tax;
    return acc;
  }, 0);
  console.log("🚀 ~ totalValueAfterTax:", totalValueAfterTax);

  const costDataAsProps = {
    totalCost,
    totalValueAfterTax,
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRefs.current,
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
      .container_print {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
    `,
  });

  return (
    <>
      <div className="relative h-full py-16 px-8">
        <div className="flex justify-end mb-8 w-full">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={handlePrint}
          >
            {t("print")}
          </Button>
        </div>

        <div
          className={`${isRTL ? "rtl" : "ltr"} container_print`}
          ref={invoiceRefs}
        >
          <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
            <div className="mx-6 bill-shadow rounded-md p-6">
              <ExpenseBillData
                clientData={clientData}
                invoiceNumber={
                  pathname === "/edara/viewExpenses"
                    ? Number(item?.expense_bond_number) - 1
                    : Number(item?.expence_bond_number) - 1
                }
              />
            </div>

            <div className="text-center">
              <ExpenseInvoiceTable
                data={ExpensesData}
                columns={Cols}
                paymentData={paymentData}
                costDataAsProps={costDataAsProps}
              ></ExpenseInvoiceTable>
            </div>

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
    </>
  );
};

export default ExpensesBondsPreview;
