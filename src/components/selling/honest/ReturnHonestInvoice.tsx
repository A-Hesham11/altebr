import { t } from "i18next";
import React, { useContext, useMemo, useRef, useState } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { ClientData_TP } from "../SellingClientForm";
import { ColumnDef } from "@tanstack/react-table";
import { Selling_TP } from "../../../pages/selling/PaymentSellingPage";
import { useReactToPrint } from "react-to-print";
import { Button } from "../../atoms";
import FinalPreviewBillData from "../selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../selling components/InvoiceTable";
import FinalPreviewBillPayment from "../selling components/bill/FinalPreviewBillPayment";
import { formatDate } from "../../../utils/date";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const ReturnHonestInvoice = ({ item }: { item?: {} }) => {
  const { formatGram, formatReyal } = numberContext();
  // const contentRef = useRef();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();

  const { userData } = useContext(authCtx);

  const mineralLicence = userData?.branch.document?.filter(
    (item) => item.data.docType.label === "رخصة المعادن"
  )?.[0]?.data.docNumber;

  const taxRegisteration = userData?.branch.document?.filter(
    (item) => item.data.docType.label === "شهادة ضريبية"
  )?.[0]?.data.docNumber;

  const clientData = {
    client_id: item?.client_id_2,
    client_value: item?.client_id,
    bond_date: item?.bond_date,
    supplier_id: item?.supplier_id,
  };

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_id",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_id",
        header: () => <span>{t("karat")}</span>,
      },

      {
        cell: (info: any) => item?.employee_id || "---",
        accessorKey: "employee_value",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date",
        header: () => <span>{t("receive date")}</span>,
      },
      {
        cell: (info: any) => formatDate(new Date()),
        accessorKey: "deliver_date",
        header: () => <span>{t("deliver date")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        header: () => <span>{t("cost")}</span>,
        accessorKey: "cost",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("VAT")}</span>,
        accessorKey: "vat",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("total")}</span>,
        accessorKey: "total",
        cell: (info: any) => info.getValue() || "---",
      },
    ],
    []
  );

  const totalWeight = item?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = item?.items?.reduce((acc, curr) => {
    acc += +curr.cost;
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

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost: totalFinalCost,
    totalCost,
    totalFinalCostIntoArabic,
  };

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      cost: formatReyal(Number(totalCost)),
      vat: formatReyal(Number(totalItemsTaxes)),
      total: formatReyal(Number(totalFinalCost)),
    },
  ];

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
                invoiceNumber={item?.bond_id}
              />
            </div>

            <div className="">
              <InvoiceTable
                data={item?.items}
                columns={Cols}
                costDataAsProps={costDataAsProps}
                resultTable={resultTable}
              ></InvoiceTable>
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
                  {taxRegisteration && taxRegisteration}
                </p>
                <p>
                  {t("Mineral license")}:{" "}
                  {mineralLicence && mineralLicence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnHonestInvoice;
