import { useContext, useState } from "react";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import { BaseInputField, Select } from "../../components/molecules";
import { SelectOption_TP } from "../../types";
import { Button } from "../../components/atoms";
import RadioGroup from "../../components/molecules/RadioGroup";
import { SelectBanks } from "../../components/templates/accountsBank/SelectBanks";
import { SingleValue } from "react-select";
import * as Yup from "yup";
import { authCtx } from "../../context/auth-and-perm/auth";
import { numberContext } from "../../context/settings/number-formatter";

const validationSchema = () =>
  Yup.object({
    branch_id: Yup.string().required("branch is required"),
    bank_id: Yup.string().required("bank is required"),
    bank_account_id: Yup.string().required("bank account is required"),
    amount: Yup.string().required("amount is required"),
  });

const CashTransferProccess = ({ refetch, setOpen }: any) => {
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();
  const [selectedAccountData, setSelectedAccountData] = useState(null);

  const { userData } = useContext(authCtx);
  const { formatReyal } = numberContext();

  const initialValues = {
    transfer_type: "cash",
    branch_id: "",
    bank_id: "",
    bank_account_id: "",
    amount: "",
    bond_date: new Date(),
    bankFrontKey: "",
    notes: "",
  };

  const {
    mutate,
    error: errorQuery,
    isLoading,
  } = useMutate<any>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      refetch();
      setOpen(false);
    },
    onError: (error) => {
      notify("error");
    },
  });

  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        return {
          id: branch.id,
          value: branch.id || "",
          label: branch.name || "",
          number: branch.number || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const {
    data: banksAccountOptions,
    isLoading: banksAccountLoading,
    refetch: refetchBankAccount,
    failureReason: nationalityErrorReason,
    isFetching,
  } = useFetch<any[]>({
    endpoint: `/aTM/api/v1/getAccountBankBranches/${newValue?.id}`,
    queryKey: ["bankAccount", newValue?.id],
    select: (banks) =>
      banks.map((bank) => {
        return {
          id: bank.id,
          value: bank.main_account_number,
          label: bank.main_account_number,
          name: bank.main_account_number,
          front_key: bank.front_key_ThweelMony,
        };
      }),
    enabled: !!newValue?.id,
  });

  const filterBranchesOptions = branchesOptions?.filter(
    (branch: any) => branch.id !== 1
  );

  const { data: accountsDetailsData } = useFetch({
    endpoint: `/aTM/api/v1/getAccountCardAmount/1/${
      selectedAccountData ? selectedAccountData?.front_key : 0
    }/${selectedAccountData ? selectedAccountData?.id : 0}`,
    queryKey: ["accounts-details-data_transform", selectedAccountData?.id],
    enabled: !!selectedAccountData?.front_key || !!selectedAccountData?.id,
  });

  const amountOfAccountNumber =
    accountsDetailsData?.base?.debtor - accountsDetailsData?.base?.creditor;

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

  const amountNaqdya = +naqdya?.[0]?.debtor - +naqdya?.[0]?.creditor;

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          if (values.transfer_type === "bank" && !values.bank_id) {
            notify("info", `${t("bank is required")}`);
            return;
          }

          if (values.transfer_type === "bank" && !values.bank_account_id) {
            notify("info", `${t("bank account is required")}`);
            return;
          }

          if (Number(values.amount) <= 0) {
            notify("info", `${t("you should type number greater than 0")}`);
            return;
          }

          if (
            values.transfer_type === "cash"
              ? Number(values.amount) > Number(amountNaqdya)
              : Number(values.amount) > Number(amountOfAccountNumber)
          ) {
            notify(
              "info",
              `${t("price must be less than or equal to")} ${
                values.transfer_type === "cash"
                  ? amountNaqdya
                  : amountOfAccountNumber
              }`
            );
            return;
          }
          mutate({
            endpointName: "/aTM/api/v1/tahweeMonyEdaraa",
            values: {
              transfer_type: values.transfer_type,
              branch_id: values.branch_id,
              bank_id: values.bank_id,
              bank_account_id: values.bank_account_id,
              amount: values.amount,
              bond_date: values.bond_date,
              bankFrontKey: values.bankFrontKey,
              notes: values.notes,
              employee_id: userData?.id,
            },
          });
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <h2 className="text-xl font-semibold mb-8">
                {t("Send cash to branch")}
              </h2>

              <RadioGroup name="transfer_type">
                <div className="flex gap-x-2 mb-5">
                  <span className="flex items-center font-bold">
                    {t("Type conversion")}:
                  </span>
                  <RadioGroup.RadioButton
                    value="cash"
                    label={`${t("monetary")}`}
                    id="cash"
                  />
                  <RadioGroup.RadioButton
                    value="bank"
                    label={`${t("Bank")}`}
                    id="bank"
                  />
                </div>
              </RadioGroup>
              <div className="grid grid-cols-3 gap-3">
                <div className="">
                  <Select
                    id="branch_id"
                    name="branch_id"
                    label={`${t("branches")}`}
                    placeholder={`${t("branches")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={filterBranchesOptions}
                    required
                    formatOptionLabel={(option) => (
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        <p>
                          {t("Branch")} - <span>{option.number}</span>
                        </p>
                      </div>
                    )}
                  />
                </div>

                {values.transfer_type === "bank" && (
                  <>
                    <div>
                      <SelectBanks
                        name="bank_id"
                        newValue={newValue}
                        setNewValue={setNewValue}
                      />
                    </div>
                    <div>
                      <Select
                        id="bank_account_id"
                        label={`${t("account number")}`}
                        name="bank_account_id"
                        placeholder={`${t("account number")}`}
                        loadingPlaceholder={`${t("loading")}`}
                        options={banksAccountOptions}
                        loading={banksAccountLoading || isFetching}
                        creatable
                        modalTitle={`${t("account number")}`}
                        required
                        fieldKey="id"
                        // value={banksAccountOptions}
                        isDisabled={!banksAccountOptions}
                        onChange={(option) => {
                          setFieldValue("bankFrontKey", option?.front_key);
                          setSelectedAccountData(option);
                        }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <BaseInputField
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder={t("amount")}
                    label={
                      <div className="flex items-center justify-between">
                        <p>{t("amount")}</p>
                        {values.transfer_type === "cash" ? (
                          <span className="text-mainGreen">
                            {t("total cash amount")} :{" "}
                            {naqdya ? formatReyal(amountNaqdya) : 0}
                          </span>
                        ) : (
                          <p className="text-mainGreen">
                            <span>{t("Bank account")} : </span>
                            {accountsDetailsData
                              ? formatReyal(amountOfAccountNumber)
                              : 0}
                          </p>
                        )}
                      </div>
                    }
                  />
                  {Number(values.amount) !== 0 && (
                    <p className="text-mainRed">
                      {values.transfer_type === "cash"
                        ? Number(values.amount) > Number(amountNaqdya)
                        : Number(values.amount) >
                            Number(amountOfAccountNumber) && (
                            <div>
                              <span>
                                {t("price must be less than or equal to")}{" "}
                              </span>
                              <span>
                                {values.transfer_type === "cash"
                                  ? amountNaqdya
                                  : amountOfAccountNumber}
                              </span>
                            </div>
                          )}
                    </p>
                  )}
                </div>

                <div>
                  <BaseInputField
                    id="notes"
                    name="notes"
                    placeholder={t("notes")}
                    label={t("notes")}
                    required
                  />
                </div>
              </div>
              <div className="flex items-end justify-end mt-5">
                <Button type="submit" loading={isLoading}>
                  {t("save")}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CashTransferProccess;
