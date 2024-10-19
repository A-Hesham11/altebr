/////////// IMPORTS
///
import { useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { useFetch } from "../../../../hooks";
import { SelectOption_TP } from "../../../../types";
import { Select } from "../../../molecules";
import { RefetchErrorHandler } from "../../../molecules/RefetchErrorHandler";
import { CreateBranch } from "./CreateBranch";
///
/////////// Types
type SelectBranchesProps_TP = {
  name: string;
  editData?: any;
  isSuccessPost?: any;
  resetSelect?: any;
  required?: any;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectBranches = ({
  name,
  editData,
  isSuccessPost,
  required,
  resetSelect,
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
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        return {
          id: branch.id,
          value: branch.name || "",
          label: branch.name || "",
          number: branch?.number || "",
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
      value: editData?.branch_name,
      label: editData?.branch_name || "اختر فرع",
    });
  }, []);
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
        options={branchesOptions?.reverse()}
        loading={branchesLoading}
        formatOptionLabel={(option) => (
          <div className="flex justify-between">
            <span>{option.label}</span>
            {option.number && (
              <p>
                {t("Branch")} - <span>{option.number}</span>
              </p>
            )}
          </div>
        )}
        // defaultValue={}
        creatable
        CreateComponent={CreateBranch}
        fieldKey="id"
        value={newValue}
        isDisabled={!branchesLoading && !!branchesErrorReason}
        onChange={(option) => {
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
