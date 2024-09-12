import React, { useContext } from "react";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../../hooks";
import { ClientData_TP } from "../../../../selling/PaymentSellingPage";
import FinalPreviewBillData from "../../../../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBuyingPayment from "../../../../Buying/FinalPreviewBuyingPayment";
import { t } from "i18next";
import { Button } from "../../../../../components/atoms";
import { useFormikContext } from "formik";

const ReserveSecondPageFinalPreview = (props: any) => {
  const {
    invoiceNumber,
    costDataAsProps,
    sellingItemsData,
    setStage,
    ItemsTableContent,
  } = props;
  const { userData } = useContext(authCtx);
  const { values } = useFormikContext();
  const clientData = {
    client_value: values!.supplier_name,
    client_id: values!.supplier_id,
    bond_date: values!.reserve_selling_data,
  };

  // SENTENCE API
  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  // COMPANY DATA API
  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

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
            <FinalPreviewBuyingPayment
              costDataAsProps={costDataAsProps}
              sellingItemsData={sellingItemsData}
              hideCash
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

export default ReserveSecondPageFinalPreview;
