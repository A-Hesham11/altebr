import { t } from "i18next";
import React, { useContext } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch } from "../../hooks";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { Button } from "../../components/atoms";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";

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
  clientData: Client_TP;
  costDataAsProps: any;
  sellingItemsData: any;
  invoiceNumber: any;
  isSuccess: any;
};
export const SupplyPayoffFinalPreview = ({
  ItemsTableContent,
  setStage,
  paymentData,
  clientData,
  costDataAsProps,
  sellingItemsData,
  invoiceNumber,
  isSuccess,
}: SellingFinalPreviewProps_TP) => {
  return (
    <div className="relative h-full py-10 px-3 bg-flatWhite">
      <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
        <div className="mx-6 bill-shadow rounded-md p-6">
          <FinalPreviewBillData
            clientData={clientData}
            invoiceNumber={invoiceNumber}
          />
        </div>
        {ItemsTableContent}

        {isSuccess && (
          <div className="mx-6 bill-shadow rounded-md p-6 my-9">
            <FinalPreviewBillPayment
              paymentData={paymentData}
              costDataAsProps={costDataAsProps}
              sellingItemsData={sellingItemsData}
            />
          </div>
        )}
        <div>
          <InvoiceFooter />
        </div>
      </div>
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      {!isSuccess && (
        <div className="flex gap-3 justify-end mt-14">
          <Button bordered action={() => setStage(1)}>
            {t("back")}
          </Button>
        </div>
      )}
    </div>
  );
};
