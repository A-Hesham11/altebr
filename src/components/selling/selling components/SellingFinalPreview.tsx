import { t } from "i18next";
import React, { useContext, useState } from "react";
import { Button } from "../../atoms";
import FinalPreviewBillData from "./bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "./bill/FinalPreviewBillPayment";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import { useNavigate } from "react-router-dom";

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
  responseSellingData: any;
};
export const SellingFinalPreview = ({
  ItemsTableContent,
  setStage,
  paymentData,
  clientData,
  costDataAsProps,
  sellingItemsData,
  invoiceNumber,
  isSuccess,
  responseSellingData,
}: SellingFinalPreviewProps_TP) => {
  console.log("🚀 ~ isSuccess:", isSuccess);
  // get client data
  // const { client_value, client_id, client_name } = clientData;

  const navigate = useNavigate();

  const { userData } = useContext(authCtx);

  const { data } = useFetch<Client_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  const { data: companyData } = useFetch<Client_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

  return (
    <div className="relative h-full p-10 bg-flatWhite">
      <div id="content-to-print">
        <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-5 bill-shadow rounded-md p-6">
            <FinalPreviewBillData
              clientData={clientData}
              invoiceNumber={invoiceNumber}
            />
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
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      {!isSuccess ? (
        <div className="flex gap-3 justify-end mt-14">
          <Button bordered action={() => setStage(2)}>
            {t("back")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end items-center my-6">
          <Button action={() => navigate(-1)} bordered>
            {t("back")}
          </Button>
        </div>
      )}
    </div>
  );
};
