import { t } from "i18next";
import React, { useContext } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch } from "../../hooks";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import { Button } from "../../components/atoms";

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

  const { data } = useFetch<Client_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  const { data: companyData } = useFetch<Client_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

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
              {t("phone")}: {companyData?.[0]?.phone}
            </p>
            <p>
              {t("email")}: {companyData?.[0]?.email}
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
