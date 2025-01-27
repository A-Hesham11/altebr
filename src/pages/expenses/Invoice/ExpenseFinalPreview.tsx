import { useContext, useState } from "react";
import { t } from "i18next";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Button } from "../../../components/atoms";
import ExpenseBillData from "./ExpenseBillData";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";

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
  responseSellingData: any;
};

export const ExpenseFinalPreview = ({
  ItemsTableContent,
  setStage,
  clientData,
  invoiceNumber,
  paymentData,
}: SellingFinalPreviewProps_TP) => {
  const { userData } = useContext(authCtx);

  return (
    <div className="relative h-full p-10 bg-flatWhite ">
      <div className="print-section">
        <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-6 bill-shadow rounded-md p-6">
            <ExpenseBillData
              clientData={clientData}
              invoiceNumber={invoiceNumber}
            />
          </div>
          {ItemsTableContent}

          <div className="mx-5 bill-shadow rounded-md p-6 my-9">
            <div className="flex justify-between items-start pb-12 pe-8">
              <div className="text-center flex flex-col gap-4">
                <span className="font-medium text-xs">
                  {t("recipient's signature")}
                </span>
                <p>------------------------------</p>
              </div>
              <div className="flex items-center">
                {paymentData.map((card, index) => (
                  <>
                    <div
                      key={index}
                      className="flex flex-col  items-center gap-1"
                    >
                      <img src={card.cardImage} alt="card image" />
                      <p>{card.card}</p>
                    </div>
                  </>
                ))}
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
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      <div className="flex gap-3 print:hidden justify-end mt-14">
        <Button bordered action={() => setStage(1)}>
          {t("back")}
        </Button>
      </div>
    </div>
  );
};
