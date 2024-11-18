import React, { SetStateAction, useContext, useEffect, useState } from "react";
import {
  BaseInputField,
  DateInputField,
  Select,
} from "../../../../components/molecules";
import { t } from "i18next";
import { FilesUpload } from "../../../../components/molecules/files/FileUpload";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../../hooks";
import { useFormikContext } from "formik";

interface BudgetFirstPageHeader_TP {
  budgetFiles: File[];
  setBudgetFiles: React.Dispatch<SetStateAction<File[]>>;
  selectedAccountData: any;
  selectedBankData: any;
  setSelectedAccountData: React.Dispatch<SetStateAction<any>>;
  setSelectedBankData: React.Dispatch<SetStateAction<any>>;
  setOperationCardData: React.Dispatch<SetStateAction<[]>>;
  operationCardData: never[];
  mainCardData: never[];
  setMainCardData: React.Dispatch<SetStateAction<[]>>;
  accountsDetailsDataRefetch: () => void;
  accountsDetailsData: never[];
}

const BudgetFirstPageHeader: React.FC<BudgetFirstPageHeader_TP> = ({
  budgetFiles,
  setBudgetFiles,
  selectedAccountData,
  selectedBankData,
  setSelectedAccountData,
  setSelectedBankData,
  setOperationCardData,
  operationCardData,
  mainCardData,
  setMainCardData,
  accountsDetailsDataRefetch,
  accountsDetailsData,
  setDateFrom,
  setDateTo,
}) => {
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const { values, setFieldValue } = useFormikContext();
  const [minDate, setMinDate] = useState("");

  const {
    data: allBanksOption,
    isLoading: allBankIsLoading,
    isFetching: allBankIsFetching,
    isRefetching: allBankIsRefetching,
  } = useFetch({
    endpoint: `/selling/api/v1/banks`,
    queryKey: ["all-banks-option"],
    select: (data) => {
      return data?.map((bank) => {
        return {
          id: bank?.id,
          label: isRTL ? bank?.name_ar : bank?.name_en,
          value: bank?.id,
          frontKey: bank?.front_key,
        };
      });
    },
  });
  console.log("🚀 ~ allBanksOption:", allBanksOption);

  useEffect(() => {
    if (allBanksOption?.length === 1) {
      setSelectedBankData(allBanksOption?.[0]);
    }
  }, [allBanksOption?.length === 1]);

  const {
    data: accountsOption,
    isLoading: accountsIsLoading,
    isFetching: accountsIsFetching,
    isRefetching: accountsIsRefetching,
    refetch: accountsRefetch,
  } = useFetch({
    endpoint: `branchAccount/api/v1/getAccountBankBranches/${userData?.branch_id}/${selectedBankData?.id}`,
    queryKey: ["accounts-option", selectedBankData?.id],
    select: (data) => {
      return data?.map((bank) => {
        return {
          id: bank?.id,
          label: bank?.main_account_number,
          value: bank?.main_account_number,
          frontKey: bank?.front_key,
        };
      });
    },
    enabled: !!selectedBankData?.id,
  });

  useEffect(() => {
    if (accountsOption?.length === 1) {
      setSelectedAccountData(accountsOption?.[0]);
    }
  }, [accountsOption?.length === 1 && selectedBankData]);

  useEffect(() => {
    accountsRefetch();
  }, [selectedBankData]);

  useEffect(() => {
    setMinDate(values.from);
  }, [values.from, values.to]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end gap-x-12 gap-y-8">
      <div>
        <Select
          id="bankName"
          label={`${t("bank name")}`}
          name="bankName"
          placeholder={`${t("bank name")}`}
          loadingPlaceholder={`${t("loading")}`}
          options={allBanksOption}
          isDisabled={
            allBankIsFetching || allBankIsLoading || allBankIsRefetching
          }
          value={selectedBankData}
          onChange={(e) => {
            setSelectedBankData(e);
          }}
          loading={allBankIsLoading || allBankIsFetching}
        />
      </div>

      <div>
        <Select
          id="accountNumber"
          label={`${t("account number")}`}
          name="accountNumber"
          placeholder={`${t("account number")}`}
          loadingPlaceholder={`${t("loading")}`}
          options={accountsOption}
          isDisabled={
            accountsIsLoading || accountsIsFetching || accountsIsRefetching
          }
          value={selectedAccountData}
          onChange={(e) => {
            setSelectedAccountData(e);
          }}
          loading={accountsIsLoading || accountsIsFetching}
        />
      </div>

      <div>
        <BaseInputField
          id="accountBalance"
          type="text"
          name="accountBalance"
          label={`${t("account balance")}`}
          placeholder={`${t("account balance")}`}
          value={`${
            accountsDetailsData?.base?.debtor -
              accountsDetailsData?.base?.creditor || 0
          }`}
          disabled
          className="bg-mainDisabled"
        />
      </div>

      <div className="mt-4 w-60">
        {<FilesUpload files={budgetFiles} setFiles={setBudgetFiles} />}
      </div>

      <div className="">
        <DateInputField
          label={`${t("date from")}`}
          placeholder={`${t("date from")}`}
          name="from"
          // value={values.from}
        />
      </div>

      <div className="">
        <DateInputField
          label={`${t("date to")}`}
          placeholder={`${t("date to")}`}
          name="to"
          minDate={minDate}
          // value={values.to}
        />
      </div>
    </div>
  );
};

export default BudgetFirstPageHeader;
