import { t } from "i18next";
import React, { useContext, useState } from "react";
import { Button } from "../../atoms";
import FinalPreviewBillData from "./bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "./bill/FinalPreviewBillPayment";
import InvoiceFooter from "../../Invoice/InvoiceFooter";
import InvoiceHeader from "../../Invoice/InvoiceHeader";

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
  return (
    <div className="relative h-full p-10 bg-flatWhite">
      <div id="content-to-print">
        <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-5 bill-shadow rounded-md p-6">
            {/* <FinalPreviewBillData
              clientData={clientData}
              invoiceNumber={invoiceNumber}
            /> */}
            <InvoiceHeader invoiceHeaderData={invoiceHeaderData} />
          </div>

          {ItemsTableContent}

          {isSuccess && (
            <div className="mx-5 bill-shadow rounded-md p-6 my-9">
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
