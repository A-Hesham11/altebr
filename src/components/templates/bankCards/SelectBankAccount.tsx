// import React from 'react'

// const SelectBranchAccountBank = () => {
//   return (
//     <div>SelectBranchAccountBank</div>
//   )
// }

// export default SelectBranchAccountBank

/////////// IMPORTS
///
import { useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { Select } from "../../molecules";
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler";
import { SelectOption_TP } from "../../../types";
import { useFetch, useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
///
/////////// Types
type SelectBankAccountProps_TP = {
  editData?: any;
  resetSelect?: any;
  isSuccessPost?: any;
  disabled?: Boolean;
  bankId?: string;
  setAccountNumberId?: any;
  accountNumberId?: string;
  main_account_number?: string;

  id?: string | number | undefined;
  value: string;
  label: string;
  name?: string | undefined;
};

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectBankAccount = ({
  name,
  resetSelect,
  editData,
  isSuccessPost,
  disabled,
  bankId,
  setAccountNumberId,
  accountNumberId,
}: SelectBankAccountProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  const {
    data: banksAccountOptions,
    isLoading: banksAccountLoading,
    refetch: refetchBankAccount,
    failureReason: nationalityErrorReason,
    isFetching,
  } = useFetch<SelectBankAccountProps_TP[]>({
    endpoint: `/selling/api/v1/accounts_per_bank/${bankId?.id}`,
    queryKey: ["bankAccount"],
    select: (banks) =>
      banks.map((bank) => {
        return {
          id: bank.id,
          value: bank.main_account_number,
          label: bank.main_account_number,
          name: bank.main_account_number,
        };
      }),
  });

  useEffect(() => {
    refetchBankAccount();
  }, [bankId?.id]);

  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();

  useEffect(() => {
    setAccountNumberId(newValue && newValue);
  }, [newValue?.id]);
  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setNewValue({
      id: editData?.id,
      value: editData?.main_account_number,
      label: editData?.main_account_number || `${t("account number")}`,
    });
  }, []);

  ///
  /////////// IF CASES
  ///
  useEffect(() => {
    if (!!!editData) {
      setNewValue({
        id: "",
        value: "",
        label: `${t("account number")}`,
      });
      if (resetSelect) resetSelect();
    }
  }, [isSuccessPost]);
  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <div className="flex flex-col">
      <Select
        id="1"
        label={`${t("account number")}`}
        name={name}
        placeholder={`${t("account number")}`}
        loadingPlaceholder={`${t("loading")}`}
        options={banksAccountOptions}
        loading={banksAccountLoading || isFetching}
        creatable
        modalTitle={`${t("account number")}`}
        required
        fieldKey="id"
        value={newValue}
        isDisabled={
          disabled || (!banksAccountLoading && !!nationalityErrorReason)
        }
        onChange={(option) => {
          setNewValue(option);
        }}
      />
      <RefetchErrorHandler
        failureReason={nationalityErrorReason}
        isLoading={banksAccountLoading}
        refetch={refetchBankAccount}
      />
    </div>
  );
};
