/////////// IMPORTS
///
import { useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { useFetch } from "../../../hooks";
import { SelectOption_TP } from "../../../types";
import { Select } from "../../molecules";
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler";
import { CreateBranch } from "../reusableComponants/branches/CreateBranch";

///
/////////// Types
type SelectBranchesProps_TP = {
  name: string;
  editData?: any;
  isSuccessPost?: any;
  resetSelect?: any;
  required?: any;
  bankId?: string;
  accountNumberId?: string;
};

type SelectBranchOption_TP = {
  id: number;
  branch_id: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectBranchCard = ({
  name,
  editData,
  isSuccessPost,
  required,
  resetSelect,
  bankId,
  accountNumberId,
}: SelectBranchesProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectBranchOption_TP>({
    endpoint: `/selling/api/v1/get_branch/${bankId?.id}/${accountNumberId?.value}`,
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        console.log(
          "🚀 ~ file: SelectBranchCard.tsx:67 ~ branches.map ~ branch:",
          branch
        );
        return {
          id: branch.branch_id,
          value: branch.branch_name || "",
          label: branch.branch_name || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();
  const { setFieldValue, values } = useFormikContext();

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setNewValue({
      id: editData?.branch_id,
      value: editData?.branch_id,
      label: editData?.branch_id || "اختر فرع",
    });
  }, []);

  useEffect(() => {
    refetchBranches();
  }, [bankId?.id && accountNumberId?.id]);
  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///
  useEffect(() => {
    if (!!!editData) {
      setNewValue({
        id: "",
        value: "",
        label: "اختر فرع",
      });
      if (resetSelect) resetSelect();
    }
  }, [isSuccessPost]);
  ///
  return (
    <div className="flex flex-col">
      <Select
        id="branch"
        label={`${t("branch")}`}
        name={name}
        required={required}
        placeholder={
          branchesOptions?.length !== 0 ? `${t("branch")}` : "اضف فرع "
        }
        loadingPlaceholder={`${t("loading")}`}
        options={branchesOptions}
        loading={branchesLoading}
        creatable
        CreateComponent={CreateBranch}
        fieldKey="id"
        value={newValue}
        isDisabled={!branchesLoading && !!branchesErrorReason}
        onChange={(option) => {
          console.log("🚀 ~ file: SelectBranchCard.tsx:128 ~ option:", option);
          setNewValue(option);
        }}
      />
      <RefetchErrorHandler
        failureReason={branchesErrorReason}
        isLoading={branchesLoading}
        refetch={refetchBranches}
      />
    </div>
  );
};
