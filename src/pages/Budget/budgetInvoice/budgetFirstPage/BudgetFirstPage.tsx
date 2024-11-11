import { t } from "i18next";
import BudgetFirstPageHeader from "./BudgetFirstPageHeader";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { Back } from "../../../../utils/utils-components/Back";
import BudgetOperationsData from "./BudgetOperationsData";
import { useFetch } from "../../../../hooks";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFormikContext } from "formik";
import { formatDate } from "../../../../utils/date";

interface BudgetFirstPage_TP {
  budgetFiles: File[];
  setBudgetFiles: React.Dispatch<SetStateAction<File[]>>;
  setStage: React.Dispatch<SetStateAction<number>>;
  selectedAccountData: any;
  selectedBankData: any;
  setSelectedAccountData: React.Dispatch<SetStateAction<any>>;
  setSelectedBankData: React.Dispatch<SetStateAction<any>>;
  setOperationCardData: React.Dispatch<SetStateAction<any>>;
  operationCardData: never[];
  mainCardData: never[];
  setMainCardData: React.Dispatch<SetStateAction<any>>;
}

const BudgetFirstPage: React.FC<BudgetFirstPage_TP> = ({
  budgetFiles,
  setStage,
  setBudgetFiles,
  selectedAccountData,
  selectedBankData,
  setSelectedAccountData,
  setSelectedBankData,
  setOperationCardData,
  operationCardData,
  mainCardData,
  setMainCardData,
  invoiceData,
  setOperationData,
}) => {
  console.log("🚀 ~ mainCardData:", mainCardData);
  const { userData } = useContext(authCtx);
  const { values } = useFormikContext();
  const isBoxesHaveData = mainCardData?.map((data) => data?.boxes).flat();

  const {
    data: accountsDetailsData,
    isLoading: accountsDetailsDataIsLoading,
    isFetching: accountsDetailsDataIsFetching,
    isRefetching: accountsDetailsDataIsRefetching,
    refetch: accountsDetailsDataRefetch,
  } = useFetch({
    endpoint: `branchAccount/api/v1/getAccountCardAmount/${
      userData?.branch_id
    }/${selectedAccountData ? selectedAccountData?.frontKey : 0}/${
      selectedAccountData ? selectedAccountData?.id : 0
    }?form=${formatDate(values.from) || 0}&to=${formatDate(values.to) || 0}`,
    queryKey: ["accounts-details-data"],
    onSuccess: (data: any) => {
      setMainCardData(data);
    },
  });
    console.log("🚀 ~ accountsDetailsData:", accountsDetailsData)

  useEffect(() => {
    accountsDetailsDataRefetch();
  }, [selectedAccountData, values, accountsDetailsData]);

  return (
    <div className="overflow-hidden">
      <div className="relative h-full p-10">
        <div className="flex justify-end">
          <Back />
        </div>
        <h2 className="mb-4 text-base font-bold">{t("bank / budget")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 mb-10 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <BudgetFirstPageHeader
              budgetFiles={budgetFiles}
              setBudgetFiles={setBudgetFiles}
              selectedAccountData={selectedAccountData}
              selectedBankData={selectedBankData}
              setSelectedAccountData={setSelectedAccountData}
              setSelectedBankData={setSelectedBankData}
              setOperationCardData={setOperationCardData}
              operationCardData={operationCardData}
              mainCardData={mainCardData}
              accountsDetailsDataRefetch={accountsDetailsDataRefetch}
              accountsDetailsData={accountsDetailsData}
              setMainCardData={setMainCardData}
            />
          </div>
        </div>

        {/* BUDGET STATEMENT */}
        {mainCardData?.length >= 1 && (
          <BudgetOperationsData
            invoiceData={invoiceData}
            setStage={setStage}
            mainCardData={mainCardData}
            budgetFiles={budgetFiles}
            isLoading={accountsDetailsDataIsLoading}
            isFetching={accountsDetailsDataIsFetching}
            isRefetching={accountsDetailsDataIsRefetching}
            setOperationCardData={setOperationCardData}
            setOperationData={setOperationData}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetFirstPage;
