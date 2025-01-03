import { t } from "i18next";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { numberContext } from "../../../context/settings/number-formatter";
import { BaseInput, Button } from "../../../components/atoms";
import { useQueryClient } from "@tanstack/react-query";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import {
  BaseInputField,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SelectOption_TP } from "../../../types";
import { useNavigate } from "react-router-dom";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import ReceiveMoneyEntry from "./ReceiveMoneyEntry";
import { authCtx } from "../../../context/auth-and-perm/auth";

const ReceiveMoneyTable = ({
  item,
  setOpenInvoiceModal,
  refetch,
}: {
  item?: {};
}) => {
  console.log("🚀 ~ item:", item);

  const { formatReyal, formatGram } = numberContext();
  const [files, setFiles] = useState([]);
  console.log("🚀 ~ files:", files);
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);
  const [selectedBankData, setSelectedBankData] = useState("");
  const [selectedAccountData, setSelectedAccountData] = useState("");
  console.log("🚀 ~ selectedAccountData:", selectedAccountData);

  const isRTL = useIsRTL();

  // const { data: accountBanks } = useFetch<Cards_Props_TP[]>({
  //   endpoint: `/aTM/api/v1/getAccountBankBranches/${userData?.branch_id}`,
  //   queryKey: ["accountBanksbranch_transform"],
  //   select: (data) => {
  //     console.log("🚀 ~ data:", data);
  //     return data?.map((item) => ({
  //       id: item.front_key_tahwel_delivered,
  //       value: item.front_key_tahwel_delivered,
  //       label: `${isRTL ? item.name_ar : item.name_en} (${
  //         item.main_account_number
  //       })`,
  //     }));
  //   },
  // });
  // console.log("🚀 ~ accountBanks:", accountBanks);

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
          frontKey: bank?.front_key_tahwel_delivered,
        };
      });
    },
    enabled: !!selectedBankData?.id,
  });
  console.log("🚀 ~ accountsOption:", accountsOption);

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading,
    isSuccess,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["accept-reject"]);
      refetch();
      setOpenInvoiceModal(false);
      notify("success");
    },
  });

  return (
    <Formik
      initialValues={{
        bank_Account: "",
        amount: item?.amount || "",
        notes: "",
        bond_id: item?.id,
      }}
      onSubmit={(values) => {
        if (!files?.length) {
          notify("info", `${t("attachments is required")}`);
          return;
        }

        mutate({
          endpointName: `/aTM/api/v1/deliverdTahweeMonyEdaraa`,
          values: {
            branch_employee_id: userData?.id,
            branch_notes: values.notes,
            bankFrontKey: selectedAccountData?.frontKey,
            bond_id: values.bond_id,
            branch_id: userData?.branch_id,
            media: files,
          },
          method: "post",
          dataType: "formData",
        });
      }}
    >
      <Form>
        <div className="mt-16">
          {item?.is_accpet === 0 ? (
            <>
              <div className="grid grid-cols-10 items-end gap-6">
                <div className="col-span-3">
                  <BaseInput
                    name="amount"
                    id="amount"
                    label={t("receive")}
                    placeholder={t("receive")}
                    value={item?.amount}
                    className="bg-mainDisabled"
                    disabled
                  />
                </div>

                {item?.transfer_type === "bank" && (
                  // <div className="col-span-3">
                  //   <Select
                  //     id="1"
                  //     label={`${t("choose bank")}`}
                  //     name="bank_Account"
                  //     placeholder={`${t("bank name")}`}
                  //     loadingPlaceholder={`${t("loading")}`}
                  //     options={accountBanks}
                  //     creatable
                  //     modalTitle={`${t("choose bank")}`}
                  //     required
                  //     fieldKey="id"
                  //   />
                  // </div>
                  <>
                    <div className="col-span-3">
                      <Select
                        id="bank_Account"
                        label={`${t("bank name")}`}
                        name="bank_Account"
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
                        loading={allBankIsLoading || allBankIsFetching}
                      />
                    </div>

                    <div className="col-span-3">
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
                        loading={accountsIsLoading || accountsIsFetching}
                      />
                    </div>
                  </>
                )}

                <div className="col-span-4">
                  <BaseInputField
                    name="notes"
                    id="notes"
                    label={`${t("notes")}`}
                    placeholder={`${t("notes")}`}
                  />
                </div>

                <div className="col-span-2">
                  <FilesUpload setFiles={setFiles} files={files} />
                </div>
              </div>
              <Button
                type="submit"
                className={`${isRTL ? "float-left" : "float-right"} mt-8`}
                loading={isLoading}
              >
                {t("receive")}
              </Button>
            </>
          ) : (
            <ReceiveMoneyEntry item={item} />
          )}
        </div>
      </Form>
    </Formik>
  );
};

export default ReceiveMoneyTable;
