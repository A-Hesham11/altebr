import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { ClientData_TP, Selling_TP } from "../selling/PaymentSellingPage";
import { Button } from "../../components/atoms";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { Loading } from "../../components/organisms/Loading";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const SupplyReturnInvoice = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ SellingInvoiceTablePreview ~ item:", item);
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();

  const { userData } = useContext(authCtx);

  //   const chunkArray = (array, chunkSize) => {
  //     const chunks = [];
  //     for (let i = 0; i < array.length; i += chunkSize) {
  //       chunks.push(array.slice(i, i + chunkSize));
  //     }
  //     return chunks;
  //   };

  //   const chunkedItems = chunkArray(item?.items, 10);
  //   console.log("🚀 ~ SellingInvoiceTablePreview ~ chunkedItems:", chunkedItems);

  const clientData = {
    client_id: item?.client_id,
    client_value: item?.supplier_id,
    bond_date: item?.date,
    supplier_id: item?.supplier,
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
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "hwya",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "classification_id",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("category")} </span>,
        accessorKey: "category",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stone weight")} </span>,
        accessorKey: "stone_weight",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_id",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "value",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
    ],
    []
  );

  const totalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const totalItemsTaxes = item?.items?.reduce((acc, curr) => {
    acc += +curr.vat;
    return acc;
  }, 0);

  const totalFinalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.total;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost: totalFinalCost,
    totalCost,
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

        <div className={`${isRTL ? "rtl" : "ltr"} m-4`} ref={invoiceRefs}>
          <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
            <div className="mx-5 bill-shadow rounded-md p-6">
              <FinalPreviewBillData
                clientData={clientData}
                invoiceNumber={item?.id}
              />
            </div>

            <div className="">
              <InvoiceTable
                data={item?.items}
                columns={Cols}
                costDataAsProps={costDataAsProps}
              ></InvoiceTable>
            </div>

            <div className="mx-5 bill-shadow rounded-md p-6 my-9 ">
              <FinalPreviewBillPayment responseSellingData={item}  />
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

export default SupplyReturnInvoice;
