import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { Back } from "../../../utils/utils-components/Back";
import CashAndAccountTotals from "./CashAndAccountTotals";
import { Button } from "../../../components/atoms";
import {
  BaseInputField,
  DateInputField,
  Modal,
  Select,
} from "../../../components/molecules";
import { Formik } from "formik";
import WithdrawalTable from "./WithdrawalTable";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { formatDate } from "../../../utils/date";
import { numberContext } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { Loading } from "../../../components/organisms/Loading";

const Withdrawal = () => {
  const [showOperationPopup, setShowOperationPopup] = useState(false);
  const [selectedBankData, setSelectedBankData] = useState(null);
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
  const handleHidePopup = () => setShowOperationPopup(false);

  const {
    data: withdrawalData,
    isLoading: withdrawalDataIsLoading,
    isFetching: withdrawalDataIsFetching,
    isRefetching: withdrawalDataIsRefetch,
    refetch: withdrawalDataRefetch,
  } = useFetch({
    endpoint: `/aTM/api/v1/withDrow/${userData?.branch_id}`,
    queryKey: ["all-withdrawal-data"],
  });

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
    setSelectedBankData(allBanksOption?.[0]);
  }, [allBanksOption?.length === 1]);

  const {
    data: accountsOption,
    isLoading: accountsIsLoading,
    isFetching: accountsIsFetching,
    isRefetching: accountsIsRefetching,
    refetch: accountsRefetch,
  } = useFetch({
    endpoint: `branchAccount/api/v1/getAccountBankBranches/${
      userData?.branch_id
    }/${selectedBankData?.id ? selectedBankData?.id : 0}`,
    queryKey: ["accounts-option"],
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
  });

  useEffect(() => {
    if (accountsOption?.length === 1) {
      setSelectedAccountData(accountsOption?.[0]);
    }
  }, [accountsOption?.length === 1 && selectedBankData]);

  useEffect(() => {
    accountsRefetch();
  }, [selectedBankData]);

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
    }`,
    queryKey: ["accounts-details-data"],
    onSuccess: (data: any) => {
      setMainCardData(data);
    },
  });

  useEffect(() => {
    accountsDetailsDataRefetch();
  }, [selectedAccountData, accountsDetailsData]);

  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      setShowOperationPopup(false);
      withdrawalDataRefetch();
    },
  });

  const handleSubmit = (values: any) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);

    const formatedValue = {
      branch_id: userData?.branch_id,
      bankFrontKey: mainCardData?.base?.front_key_Withdraw,
      bond_date: values?.bond_date,
      employee_id: userData?.id,
      account_number: selectedAccountData?.value,
      cash: values?.cash,
      media: withdrawalFiles,
    };

    mutate({
      endpointName: "/aTM/api/v1/withDrow",
      values: formatedValue,
      dataType: "formData",
    });
  };

  if (
    withdrawalDataIsLoading ||
    withdrawalDataIsFetching ||
    withdrawalDataIsRefetch
  )
    return <Loading mainTitle={t("loading withdrawal")} />;

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values, setFieldValue }) => {
        return (
          <>
            <div className="overflow-hidden">
              <div className="relative h-full p-10">
                <div>
                  <div className="flex justify-end">
                    <Back />
                  </div>
                  <h2 className="mb-4 text-base font-bold">
                    {t("withdrawal")}
                  </h2>
                </div>
                <CashAndAccountTotals />

                <div className="my-12">
                  <Button
                    type="button"
                    action={handleShowPopup}
                    className="flex mr-auto mb-6 gap-2"
                  >
                    {t("withdrawal")}
                  </Button>
                  <WithdrawalTable data={withdrawalData || []} />
                </div>
              </div>
            </div>

            {showOperationPopup && (
              <Modal onClose={handleHidePopup} isOpen={showOperationPopup}>
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
                        formatReyal(
                          accountsDetailsData?.base?.debtor -
                            accountsDetailsData?.base?.creditor
                        ) || 0
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
                      // value={values.from}
                    />
                  </div>

                  <BaseInputField
                    id="cash"
                    label={`${t("withdrawal amount")}`}
                    name="cash"
                    type="text"
                    placeholder={`${t("withdrawal amount")}`}
                    required
                  />

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
                    action={() => handleSubmit(values)}
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

export default Withdrawal;
