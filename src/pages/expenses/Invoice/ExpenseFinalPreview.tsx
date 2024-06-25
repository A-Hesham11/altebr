import { useContext, useState } from "react";
import { t } from "i18next";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import FinalPreviewBillData from "./ExpenseBillData";
import FinalPreviewBuyingPayment from "./FinalPreviewExpensePayment";
import { Button } from "../../../components/atoms";
import ExpenseBillData from "./ExpenseBillData";
import FinalPreviewExpensePayment from "./FinalPreviewExpensePayment";

type Client_TP = {
  amount: number;
  bond_date: string;
  client_id: number;
  client_value: string;
  employee_id: number;F
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
  paymentData,
  clientData,
  costDataAsProps,
  sellingItemsData,
  invoiceNumber,
  odwyaTypeValue,
  setOdwyaTypeValue,
  responseSellingData
}: SellingFinalPreviewProps_TP) => {
  const { userData } = useContext(authCtx);

  // SENTENCE API
  const { data } = useFetch<Client_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  // COMPANY DATA API
  const { data: companyData } = useFetch<Client_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

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
          <div className="mx-6 bill-shadow rounded-md p-6 my-9">
            <FinalPreviewExpensePayment
              paymentData={paymentData}
              costDataAsProps={costDataAsProps}
              sellingItemsData={sellingItemsData}
              odwyaTypeValue={odwyaTypeValue}
              setOdwyaTypeValue={setOdwyaTypeValue}
              responseSellingData={responseSellingData}
            />
          </div>
          <div className="text-center">
            <p className="my-4 py-1 border-y border-mainOrange">
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
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      <div className="flex gap-3 justify-end mt-14">
        <Button bordered action={() => setStage(1)}>
          {t("back")}
        </Button>
      </div>
    </div>
  );
};
