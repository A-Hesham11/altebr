import { t } from "i18next";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import { formatDate, getDayAfter } from "../../../utils/date";
import { Back } from "../../../utils/utils-components/Back";
import BudgetFirstPageHeader from "../../Budget/budgetInvoice/budgetFirstPage/BudgetFirstPageHeader";
import BudgetOperationsData from "../../Budget/budgetInvoice/budgetFirstPage/BudgetOperationsData";
import BankBudgetInEdaraHeader from "./BankBudgetInEdaraHeader";

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

const BankBudgetInEdaraFirstPage: React.FC<BudgetFirstPage_TP> = ({
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
  console.log("🚀 ~ values:", values);
  const isBoxesHaveData = mainCardData?.map((data) => data?.boxes).flat();
  const test = formatDate(values?.from);
  console.log("🚀 ~ test:", test);

  const {
    data: accountsDetailsData,
    isLoading: accountsDetailsDataIsLoading,
    isFetching: accountsDetailsDataIsFetching,
    isRefetching: accountsDetailsDataIsRefetching,
    refetch: accountsDetailsDataRefetch,
  } = useFetch({
    endpoint: `aTM/api/v1/getAccountCardAmount2/1/${
      selectedAccountData ? selectedAccountData?.id : 0
    }?form=${
      values?.from ? formatDate(getDayAfter(new Date(values?.from))) : 0
    }&to=${values?.to ? formatDate(getDayAfter(new Date(values?.to))) : 0}`,
    queryKey: ["accounts-details-data_edara"],
    onSuccess: (data: any) => {
      console.log("🚀 ~ data:", data);
      setMainCardData(data);
    },
  });
  console.log("🚀 ~ accountsDetailsData:", accountsDetailsData);

  useEffect(() => {
    accountsDetailsDataRefetch();
  }, [selectedAccountData, values, accountsDetailsData]);

  return (
    <div className="">
      <div className="relative h-full">
        <h2 className="mb-4 text-base font-bold">{t("bank / budget")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 mb-10 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <BankBudgetInEdaraHeader
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

export default BankBudgetInEdaraFirstPage;
