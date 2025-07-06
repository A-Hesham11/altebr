import React, { useEffect } from "react";
import {
  BaseInputField,
  DateInputField,
  InnerFormLayout,
  OuterFormLayout,
  Select,
  TextAreaField,
} from "../../components/molecules";
import { t } from "i18next";
import { Button } from "../../components/atoms";
import { CiCalendarDate } from "react-icons/ci";
import { numberContext } from "../../context/settings/number-formatter";
import { formatDate } from "../../utils/date";
import RadioGroup from "../../components/molecules/RadioGroup";
import { DropFile } from "../../components/molecules/files/DropFile";
import { SelectBranches } from "../../components/templates/reusableComponants/branches/SelectBranches";
import { useFormikContext } from "formik";
import { notify } from "../../utils/toast";
import { useFetch } from "../../hooks";
import { SelectOption_TP } from "../../types";
import { FilesPreview } from "../../components/molecules/files/FilesPreview";
import { FilesUpload } from "../../components/molecules/files/FileUpload";
import { DropMultiFile } from "../../components/molecules/files/DropMultiFile";

interface ManualEntryMainDataTP {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  editEntryBond: any;
  dataSource: any;
  setBranchID: React.Dispatch<React.SetStateAction<Number>>;
  nextBond?: number;
}

const ManualEntryMainData = ({
  setSteps,
  editEntryBond,
  dataSource,
  setBranchID,
  nextBond,
}: ManualEntryMainDataTP) => {
  const { values } = useFormikContext<any>();

  const { data: branchesOptions } = useFetch<SelectOption_TP[]>({
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
  });

  const branchName = branchesOptions?.filter(
    (branch) => branch.id === values.branch_id
  );

  useEffect(() => {
    setBranchID(values?.branch_id);
  }, [values?.branch_id]);

  return (
    <OuterFormLayout
      submitComponent={
        <Button
          action={() => {
            if (!values?.entry_type || !values?.branch_id || !values?.date) {
              notify("info", `${t("the data is not complete")}`);
              return;
            }
            setSteps((prev) => prev + 1);
          }}
          className="ms-auto mt-8"
        >
          {t("next")}
        </Button>
      }
    >
      <InnerFormLayout
        title={`${t("main data")}`}
        leftComponent={
          <p className="font-bold">
            {`${t("bond number")}`} :
            <span className="mx-2 text-mainOrange">
              {editEntryBond?.id ? editEntryBond?.id : nextBond}
            </span>
          </p>
        }
      >
        <div className="col-span-4 flex gap-x-5">
          <div className="flex gap-x-2 mt-8 col-span-4">
            <span className="font-bold">{t("entry type")}</span>
            <RadioGroup name="entry_type">
              <div className="flex gap-x-2">
                <RadioGroup.RadioButton
                  value="daily"
                  label={`${t("daily")}`}
                  id="daily"
                />
                <RadioGroup.RadioButton
                  value="settlement"
                  label={`${t("settlement")}`}
                  id="settlement"
                />
                <RadioGroup.RadioButton
                  value="opening"
                  label={`${t("opening")}`}
                  id="opening"
                />
                <RadioGroup.RadioButton
                  value="closing"
                  label={`${t("closing")}`}
                  id="closing"
                />
              </div>
            </RadioGroup>
          </div>
        </div>

        {!!editEntryBond?.branch_id || dataSource?.length > 0 ? (
          <Select
            id="branch_id"
            label={`${t("branch name")}`}
            name="branch_id"
            placeholder={`${t("branch name")}`}
            loadingPlaceholder={`${t("loading")}`}
            fieldKey="id"
            value={{
              id: values?.branch_id,
              label: branchName?.[0]?.value,
              value: branchName?.[0]?.value,
            }}
            isDisabled={editEntryBond?.branch_id || dataSource?.length > 0}
          />
        ) : (
          <SelectBranches
            required
            name="branch_id"
            editData={{
              branch_id: values?.branch_id,
              branch_name: branchName?.[0]?.value,
            }}
          />
        )}

        <BaseInputField
          id="bond_number"
          name="bond_number"
          label={`${t("attachment number")}`}
          placeholder={`${t("attachment number")}`}
          type="number"
          min={0}
        />
        <DateInputField
          label={`${t("entry date")}`}
          name="date"
          icon={<CiCalendarDate />}
          required
          labelProps={{ className: "mb-2" }}
          placeholder={`${formatDate(new Date())}`}
        />
        <DateInputField
          label={`${t("actual date of operation")}`}
          name="operation_date"
          icon={<CiCalendarDate />}
          required
          labelProps={{ className: "mb-2" }}
          placeholder={`${formatDate(new Date())}`}
        />
        <div className="col-span-4">
          <h2>{t("attachment")}</h2>
          <DropMultiFile name="media" />
        </div>
        <div className="col-span-4">
          <TextAreaField
            name="description"
            className="col-span-4"
            rows={3}
            placeholder={`${t("entry description")}`}
            id="description"
            label={`${t("entry description")}`}
            defaultValue={values?.description || ""}
          />
        </div>
      </InnerFormLayout>
    </OuterFormLayout>
  );
};

export default ManualEntryMainData;
