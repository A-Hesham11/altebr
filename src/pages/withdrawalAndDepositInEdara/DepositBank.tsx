import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../hooks";
import { notify } from "../../utils/toast";
import { mutateData } from "../../utils/mutateData";
import { Loading } from "../../components/organisms/Loading";
import { Formik } from "formik";
import { Button } from "../../components/atoms";
import { Back } from "../../utils/utils-components/Back";
import WithdrawalTable from "../WithdrawalAndDeposit/Withdrawal/WithdrawalTable";
import {
  BaseInputField,
  DateInputField,
  Modal,
  Select,
} from "../../components/molecules";
import { FilesUpload } from "../../components/molecules/files/FileUpload";
import * as Yup from "yup";

const DepositBank = () => {
  const [showOperationPopup, setShowOperationPopup] = useState(false);
  const [selectedBankData, setSelectedBankData] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [mainCardData, setMainCardData] = useState([]);
  const [withdrawalFiles, setWithdrawalFiles] = useState([]);
  const { formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();

  const initialValues = {
    cash: "",
    bankName: "",
    bond_date: new Date(),
    accountNumber: "",
    accountBalance: "",
  };

  const handleShowPopup = () => setShowOperationPopup(true);
  const handleHidePopup = (resetForm: any) => {
    setShowOperationPopup(false);
    // withdrawalDataRefetch();
    setSelectedBankData(null);
    setSelectedAccountData(null);
    setWithdrawalFiles([]);
    resetForm();
  };

  const {
    data: withdrawalData,
    isLoading: withdrawalDataIsLoading,
    isFetching: withdrawalDataIsFetching,
    isRefetching: withdrawalDataIsRefetch,
    refetch: withdrawalDataRefetch,
  } = useFetch({
    endpoint: `/aTM/api/v1/DepositeEdaraa?page=${page}`,
    queryKey: ["all-deposit-data-InEdara"],
    pagination: true,
  });

  const { data: balances } = useFetch({
    queryKey: ["Balances_inEdara"],
    endpoint: `/branchAccount/api/v1/getAccountEdara?per_page=10000`,
  });

  const cleanedBalances = balances?.map((item) => {
    return {
      ...item,
      accountable: item.accountable.replace(/\s*\(\d+\)$/, ""),
    };
  });

  const naqdya = cleanedBalances?.filter(
    (card) => card.numeric_system == "1301"
  );

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
    endpoint: `/aTM/api/v1/getAccountBankBranches/${selectedBankData?.id}`,
    queryKey: ["accounts-option_Edara", selectedBankData?.id],
    select: (data) => {
      return data?.map((bank) => {
        return {
          id: bank?.id,
          label: bank?.main_account_number,
          value: bank?.main_account_number,
          frontKey: bank?.front_key_DepositEdaraa,
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

  const { data: accountsDetailsData } = useFetch({
    endpoint: `/aTM/api/v1/getAccountCardAmount/1/${
      selectedAccountData ? selectedAccountData?.frontKey : 0
    }/${selectedAccountData ? selectedAccountData?.id : 0}`,
    queryKey: ["accounts-details-data_Edara", selectedAccountData?.id],
    onSuccess: (data: any) => {
      setMainCardData(data);
    },
    enabled: !!selectedAccountData?.frontKey || !!selectedAccountData?.id,
  });

  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      setShowOperationPopup(false);
      withdrawalDataRefetch();
      setSelectedBankData(null);
      setSelectedAccountData(null);
      setWithdrawalFiles([]);
    },
  });

  const handleSubmit = (values: any, resetForm: any) => {
    if (!selectedAccountData) {
      notify("error", `${t("Account number required")}`);
      return;
    }
    if (+values?.cash <= 0) {
      notify("error", `${t("you should type number greater than 0")}`);
      return;
    }

    if (!withdrawalFiles?.length) {
      notify("error", `${t("attachments is required")}`);
      return;
    }

    const formatedValue = {
      branch_id: userData?.branch_id,
      bankFrontKey: mainCardData?.base?.front_key_DepositEdaraa,
      bond_date: values?.bond_date,
      employee_id: userData?.id,
      account_number: selectedAccountData?.value,
      cash: values?.cash,
      media: withdrawalFiles,
    };

    mutate({
      endpointName: "/aTM/api/v1/DepositeEdaraa",
      values: formatedValue,
      dataType: "formData",
    });

    if (isSuccess) {
      resetForm();
    }
  };

  useEffect(() => {
    withdrawalDataRefetch();
  }, [page]);

  if (
    withdrawalDataIsLoading ||
    withdrawalDataIsFetching ||
    withdrawalDataIsRefetch
  )
    return <Loading mainTitle={t("loading deposit")} />;

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values, setFieldValue, resetForm }) => {
        return (
          <>
            <div className="overflow-hidden">
              <div className="relative h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">{t("deposit")}</h2>
                  <div className="flex gap-4">
                    <Button type="button" action={handleShowPopup} className="">
                      {t("deposit")}
                    </Button>
                    <Back />
                  </div>
                </div>

                <div className="my-12">
                  <WithdrawalTable
                    setPage={setPage}
                    page={page}
                    data={withdrawalData || []}
                  />
                </div>
              </div>
            </div>

            {showOperationPopup && (
              <Modal
                onClose={() => handleHidePopup(resetForm)}
                isOpen={showOperationPopup}
              >
                <div className="grid py-8 grid-cols-3 items-center gap-8">
                  <div>
                    <Select
                      id="bankName"
                      label={`${t("bank name")}`}
                      name="bankName"
                      placeholder={`${t("bank name")}`}
                      loadingPlaceholder={`${t("loading")}`}
                      options={allBanksOption}
                      isDisabled={
                        allBankIsFetching ||
                        allBankIsLoading ||
                        allBankIsRefetching
                      }
                      value={selectedBankData}
                      onChange={(e) => {
                        setSelectedAccountData(null);
                        setSelectedBankData(e);
                      }}
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
                        accountsIsLoading ||
                        accountsIsFetching ||
                        accountsIsRefetching
                      }
                      value={selectedAccountData}
                      onChange={(e) => {
                        setSelectedAccountData(e);
                      }}
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
                        accountsDetailsData
                          ? formatReyal(
                              accountsDetailsData?.base?.debtor -
                                accountsDetailsData?.base?.creditor
                            )
                          : 0
                      }`}
                      disabled
                      className="bg-mainDisabled"
                    />
                  </div>

                  <div className="">
                    <DateInputField
                      label={`${t("date")}`}
                      placeholder={`${t("date")}`}
                      name="bond_date"
                      // disabled
                    />
                  </div>

                  <div>
                    <BaseInputField
                      id="cash"
                      label={
                        <div className="flex justify-between items-center">
                          <span> {t("deposit amount")}</span>{" "}
                          <span className="text-mainGreen">
                            {t("total cash amount")}{" "}
                            {formatReyal(
                              +naqdya?.[0]?.debtor -
                                +naqdya?.[0]?.creditor -
                                +values?.cash
                            )}
                          </span>
                        </div>
                      }
                      name="cash"
                      type="number"
                      min={1}
                      placeholder={`${t("deposit amount")}`}
                      required
                    />
                    <p></p>
                  </div>

                  <div className="mt-4 w-60">
                    {
                      <FilesUpload
                        files={withdrawalFiles}
                        setFiles={setWithdrawalFiles}
                      />
                    }
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    loading={isLoading}
                    action={() => handleSubmit(values, resetForm)}
                    className="mt-12-t gap-2"
                  >
                    {t("save")}
                  </Button>
                </div>
              </Modal>
            )}
          </>
        );
      }}
    </Formik>
  );
};

export default DepositBank;
