import { useContext, useState } from "react";
import { t } from "i18next";
import { authCtx } from "../../context/auth-and-perm/auth";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBuyingPayment from "./FinalPreviewBuyingPayment";
import { useFetch } from "../../hooks";
import { Button } from "../../components/atoms";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import InvoiceBasicHeader from "../../components/Invoice/InvoiceBasicHeader";
import { formatDate } from "../../utils/date";

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
};

export const BuyingFinalPreview = ({
  ItemsTableContent,
  setStage,
  paymentData,
  clientData,
  costDataAsProps,
  sellingItemsData,
  invoiceNumber,
  odwyaTypeValue,
  setOdwyaTypeValue,
}: SellingFinalPreviewProps_TP) => {
  const { invoice_logo, gold_price } = GlobalDataContext();
  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: formatDate(clientData?.bond_date),
    second_title: "client name",
    second_value: clientData?.client_value,
    bond_date: sellingItemsData?.invoice_date,
    bond_title: "bill no",
    invoice_number: Number(invoiceNumber?.length),
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "broken gold purchase invoice",
  };
  return (
    <div className="relative h-full p-10 bg-flatWhite ">
      <div className="print-section">
        <div
          className={`print-header ${
            invoice_logo?.is_include_header_footer === "1"
              ? "opacity-1"
              : "opacity-0 h-12 print:h-80"
          }`}
        >
          <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
        </div>
        {ItemsTableContent}
        <div className="print-footer my-6">
          <FinalPreviewBuyingPayment
            paymentData={paymentData}
            costDataAsProps={costDataAsProps}
            sellingItemsData={sellingItemsData}
            odwyaTypeValue={odwyaTypeValue}
            setOdwyaTypeValue={setOdwyaTypeValue}
          />
        </div>
        <div>
          <InvoiceFooter />
        </div>
      </div>
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      <div className="flex gap-3 justify-end mt-14">
        <Button bordered action={() => setStage(1)}>
          {t("back")}
        </Button>
      </div>
    </div>
  );
};
