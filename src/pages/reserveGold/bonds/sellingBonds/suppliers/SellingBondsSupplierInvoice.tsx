import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../../../hooks";
import {
  ClientData_TP,
  Selling_TP,
} from "../../../../selling/PaymentSellingPage";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReactToPrint } from "react-to-print";
import { Button } from "../../../../../components/atoms";
import FinalPreviewBillData from "../../../../../components/selling/selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../../../../../components/selling/selling components/InvoiceTable";
import FinalPreviewBillPayment from "../../../../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { convertNumToArWord } from "../../../../../utils/number to arabic words/convertNumToArWord";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SellingBondsSupplierInvoice = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ SellingInvoiceTablePreview ~ item:", item);
  const { formatGram, formatReyal } = numberContext();
  // const contentRef = useRef();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  console.log("🚀 ~ SellingInvoiceTablePreview ~ isRTL:", isRTL);

  const { userData } = useContext(authCtx);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // const chunkedItems = chunkArray(item?.items, 10);
  // console.log("🚀 ~ SellingInvoiceTablePreview ~ chunkedItems:", chunkedItems);

  const chunkedItems = chunkArray(item?.items, 10);
  console.log("🚀 ~ SellingInvoiceTablePreview ~ chunkedItems:", chunkedItems);

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.client_name,
    bond_date: item?.invoice_date,
    supplier_id: item?.supplier_id,
    supplier_name: item?.supplier_name,
  };

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "cost_after_tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const totalWeigth = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items?.reduce((acc, curr) => {
    acc += +curr.tax;
    return acc;
  }, 0);

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost_after_tax;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost: totalFinalCost,
    totalCost,
  };

  const table = useReactTable({
    data: item?.items,
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: item?.items?.length,
      },
    },
  });

  const resultSellingBondTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeigth)),
      cost: formatReyal(Number(totalCost)),
      vat: formatReyal(Number(totalItemsTaxes)),
      total: formatReyal(Number(totalFinalCost)),
    },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

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

        <div className={`${isRTL ? "rtl" : "ltr"}`} ref={invoiceRefs}>
          <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
            <div className="mx-5 bill-shadow rounded-md p-6">
              <FinalPreviewBillData
                clientData={clientData}
                invoiceNumber={item?.invoice_number}
              />
            </div>

            <div className="mx-5">
              <div className="mb-6 overflow-x-auto lg:overflow-x-visible w-full">
                <table className="mt-8 w-full table-shadow">
                  <thead className="bg-mainGreen text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="py-4 px-2 text-center"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-4 text-sm font-medium text-mainGreen bg-[#E5ECEB] border border-[#7B7B7B4D]"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <tr key={row.id} className="text-center item">
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <td
                                className="px-2 py-2 text-mainGreen bg-white gap-x-2 items-center border border-[#7B7B7B4D]"
                                key={cell.id}
                                colSpan={1}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    <tr className="text-center">
                      {Object.keys(resultSellingBondTable[0]).map(
                        (key, index) => {
                          return (
                            <td
                              key={key}
                              className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                              colSpan={index === 0 ? 1 : 1}
                            >
                              {resultSellingBondTable[0][key]}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  </tbody>
                  <tfoot className="text-center">
                    <tr className="text-center border-[1px] border-[#7B7B7B4D]">
                      <td
                        className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                        colSpan={9}
                      >
                        <span className="font-semibold">{t("total")}</span>:{" "}
                        <span className="font-medium">
                          {totalFinalCostIntoArabic}
                        </span>
                        <span className="font-semibold"> {t("reyal")}</span>{" "}
                        <span className="font-semibold">
                          {t("Only nothing else")}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mx-5 bill-shadow rounded-md p-6 my-9 ">
              <FinalPreviewBillPayment
                responseSellingData={item}
                notQRCode={true}
              />
            </div>

            <div className="text-center">
              <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
                {data && data?.sentence}
              </p>
              <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
                <p>
                  {" "}
                  العنوان : {userData?.branch?.country?.name} ,{" "}
                  {userData?.branch?.city?.name} ,{" "}
                  {userData?.branch?.district?.name}
                </p>
                <p>
                  {t("phone")}: {userData?.phone}
                </p>
                <p>
                  {t("email")}: {userData?.email}
                </p>
                <p>
                  {t("tax number")}:{" "}
                  {companyData && companyData[0]?.taxRegisteration}
                </p>
                <p>
                  {t("Mineral license")}:{" "}
                  {companyData && companyData[0]?.mineralLicence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellingBondsSupplierInvoice;
