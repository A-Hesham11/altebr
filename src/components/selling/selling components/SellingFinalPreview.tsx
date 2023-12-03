import { t } from "i18next";
import React, { useContext, useState } from "react";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../atoms";
import FinalPreviewBillData from "./bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "./bill/FinalPreviewBillPayment";
import FinalPreviewBoxs from "./data/FinalPreviewBoxs";
import { Payment_TP } from "./data/PaymentProcessing";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import BillFinalPreview from "./bill/BillFinalPreview";
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
export const SellingFinalPreview = ({
  ItemsTableContent,
  setStage,
  paymentData,
  clientData,
  costDataAsProps,
  sellingItemsData,
  invoiceNumber
}: SellingFinalPreviewProps_TP) => {
  // const [printStatus, setPrintStatus] = useState("block")
  // const handlePrint = () => {
  //     window.print();
  // };

  // const [printContent, setPrintContent] = useState(null);

  // const handlePrintClick = () => {
  //   const contentToPrint = document.getElementsByName('content-to-print');
  //   // setPrintContent(contentToPrint.innerHTML);
  //   window.print();
  // };
  // get client data
  // const { client_value, client_id, client_name } = clientData;

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ file: SellingFinalPreview.tsx:54 ~ userData:", userData)

  const { data } = useFetch<Client_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });
  console.log("🚀 ~ file: SellingFinalPreview.tsx:60 ~ data:", data)
  

  return (
    <div className="relative h-full p-10 bg-flatWhite ">
      <div className="print-section">
        <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-6 bill-shadow rounded-md p-6">
            <FinalPreviewBillData 
              clientData={clientData}
              invoiceNumber={invoiceNumber}
            />
          </div>
          {ItemsTableContent}
          <div className="mx-6 bill-shadow rounded-md p-6 my-9">
            <FinalPreviewBillPayment
              paymentData={paymentData}
              costDataAsProps={costDataAsProps}
              sellingItemsData={sellingItemsData}
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
              {/* <p>رقم المحل</p> */}
              <p>
                {t("phone")}: {userData?.phone}
              </p>
              <p>
                {t("email")}: {userData?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      <div className="flex gap-3 justify-end mt-14">
          <Button bordered action={() => setStage(2)}>
            {t("back")}
          </Button>
      </div>
    </div>
  );
};
