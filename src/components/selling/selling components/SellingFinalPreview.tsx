import { t } from "i18next";
import React, { useContext, useState } from "react";
import { Button } from "../../atoms";
import FinalPreviewBillData from "./bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "./bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../Invoice/InvoiceFooter";
import InvoiceHeader from "../../Invoice/InvoiceHeader";
import InvoiceBasicHeader from "../../Invoice/InvoiceBasicHeader";
import { GlobalDataContext } from "../../../context/settings/GlobalData";

type Client_TP = {
  amount: number;
  bond_date: string;
  client_id: number;
  client_value: string;
  employee_id: number;
  employee_value: string;
  id: number;
};

type SellingFinalPreviewProps_TP = {
  ItemsTableContent: React.ReactNode;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  paymentData: never[];
  costDataAsProps: any;
  sellingItemsData: any;
  invoiceNumber: any;
  isSuccess: any;
  responseSellingData: any;
  invoiceHeaderData: any;
};
export const SellingFinalPreview = ({
  ItemsTableContent,
  paymentData,
  costDataAsProps,
  sellingItemsData,
  isSuccess,
  responseSellingData,
  invoiceHeaderData,
}: SellingFinalPreviewProps_TP) => {
  const { invoice_logo } = GlobalDataContext();

  return (
    <div className="relative h-full my-5 py-5 px-10 bg-white">
      <div id="content-to-print">
        <div className="rounded-lg">
          <div
            className={`${
              invoice_logo?.is_include_header_footer === "1"
                ? "opacity-1"
                : "opacity-0 h-12 print:h-80"
            }`}
          >
            <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderData} />
          </div>

          {invoice_logo?.is_include_header_footer !== "1" && (
            <div className="flex items-center justify-between">
              <p className="font-bold text-xl">
                {t(invoiceHeaderData?.bond_title)} :{" "}
                <span>{Number(invoiceHeaderData?.invoice_number) + 1}</span>{" "}
              </p>
              <p className="text-2xl font-bold text-mainGreen">
                {t(invoiceHeaderData?.invoice_text)}
              </p>
            </div>
          )}

          {ItemsTableContent}

          {isSuccess && (
            <div className="bill-shadow rounded-md p-6 my-9">
              <FinalPreviewBillPayment
                paymentData={paymentData}
                costDataAsProps={costDataAsProps}
                sellingItemsData={sellingItemsData}
                responseSellingData={responseSellingData}
              />
            </div>
          )}

          <div>
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </div>
  );
};
