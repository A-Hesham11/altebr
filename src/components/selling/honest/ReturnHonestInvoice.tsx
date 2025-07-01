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
import InvoiceFooter from "../../Invoice/InvoiceFooter";
import InvoiceBasicHeader from "../../Invoice/InvoiceBasicHeader";
import { GlobalDataContext } from "../../../context/settings/GlobalData";

type Entry_TP = {
  bian: string;
  debtor_gram: number;
  debtor_SRA: number;
  creditor_gram: number;
  creditor_SRA: number;
};

const ReturnHonestInvoice = ({ item }: { item?: any }) => {
  const { formatGram, formatReyal } = numberContext();
  const invoiceRefs = useRef([]);
  const isRTL = useIsRTL();
  const { invoice_logo } = GlobalDataContext();

  // const clientData = {
  //   client_id: item?.client_id_2,
  //   client_value: item?.client_id,
  //   bond_date: item?.bond_date,
  //   supplier_id: item?.supplier_id,
  // };

  const { data: clientInfo } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/${item?.client_id_2}`,
    queryKey: [`clients_info`, item?.client_id_2],
    enabled: !!item?.client_id_2,
  });

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: item?.bond_date,
    second_title: "client name",
    second_value: item?.client_id,
    third_title: "mobile number",
    third_value: clientInfo?.phone,
    bond_title: "bill no",
    invoice_number: item?.id,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
    bond_date: item?.bond_date,
    client_id: item?.client_id_2,
  };

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
        size: A5 landscape;;
        margin: 5px !important;
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
      }
    `,
  });

  return (
    <>
      <div className="relative h-full py-16 px-4">
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
          {/* <div className="mx-5 bill-shadow rounded-md p-6">
              <FinalPreviewBillData
                clientData={clientData}
                invoiceNumber={item?.bond_id}
              />
            </div> */}

          <div className="print-header">
            <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
          </div>

          <div className="print-content -mx-5">
            <InvoiceTable
              data={item?.items}
              columns={Cols}
              costDataAsProps={costDataAsProps}
              resultTable={resultTable}
            ></InvoiceTable>
          </div>

          <div className="print-footer">
            <FinalPreviewBillPayment
              responseSellingData={item}
              notQRCode={true}
            />
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnHonestInvoice;
