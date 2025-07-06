/////////// IMPORTS
///
import { useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect } from "react";
import { Button } from "../../atoms";
import { EditIcon } from "../../atoms/icons";
import {
  BaseInputField,
  DateInputField,
  InnerFormLayout,
  Modal,
  OuterFormLayout,
  PhoneInput,
} from "../../molecules";
import RadioGroup from "../../molecules/RadioGroup";
import { DropFile } from "../../molecules/files/DropFile";
import { NationalAddress } from "../NationalAddress";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { Documents } from "../reusableComponants/documents/Documents";
import { SelectRole } from "../reusableComponants/roles/SelectRole";
import { SelectNationality } from "../systemEstablishment/SelectNationality";
import { InitialValues_TP } from "./validation-and-types";
///
/////////// Types
///
type EmployeeMainDataProps_TP = {
  title: string;
  editEmployeeData: InitialValues_TP | undefined;
  isLoading?: any;
  isSuccessPost?: any;
  restData?: any;
  setDocsFormValues?: any;
  docsFormValues?: any;
  setModalOpen?: any;
  modalOpen?: any;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const EmployeeMainData = ({
  title,
  editEmployeeData,
  isLoading,
  isSuccessPost,
  restData,
  setDocsFormValues,
  docsFormValues,
  setModalOpen,
  modalOpen,
}: EmployeeMainDataProps_TP) => {
  /////////// VARIABLES
  /////

  ///
  /////////// CUSTOM HOOKS
  ///
  const { values, setFieldValue, resetForm } = useFormikContext();
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    if (isSuccessPost) {
      if (!editEmployeeData) {
        restData();
        resetForm();
        setFieldValue("date_of_birth", new Date());
        setFieldValue("national_expire_date", new Date());
        setDocsFormValues([]);
        setModalOpen(false);
      }
    }
  }, [isSuccessPost]);
  ///
  return (
    <>
      <OuterFormLayout
        header={title}
        submitComponent={
          <Button type="submit" className="ms-auto mt-8" loading={isLoading}>
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          {/* name ar start */}
          <BaseInputField
            id="name"
            label={`${t("name")}`}
            name="name"
            type="text"
            placeholder={`${t("name")}`}
            labelProps={{ className: "mb-1" }}
            required
          />
          {/* name ar end */}

          {/* branch start */}
          <SelectBranches
            required
            name="branch_id"
            editData={editEmployeeData}
            isSuccessPost={!editEmployeeData && isSuccessPost}
            resetSelect={!editEmployeeData && restData}
          />
          {/* branch end */}

          {/* job title start */}

          {/* job title end */}
          <SelectRole name="role_id" required />
          {/* address start */}
          <BaseInputField
            id="address_out"
            label={`${t("address")}`}
            name="address_out"
            type="text"
            placeholder={`${t("address")}`}
            required
          />
          {/* address end */}

          {/* mobile start */}
          {!!!editEmployeeData && (
            <PhoneInput
              label={`${t("mobile number")}`}
              name="mobile"
              placeholder={`${t("mobile number")}`}
              restData={restData}
              isSuccessPost={isSuccessPost}
              required
            />
          )}
          {/* mobile end */}

          {/* phone start */}
          <BaseInputField
            id="phone"
            label={`${t("phone number")}`}
            name="phone"
            type="text"
            placeholder={`${t("phone number")}`}
            required
          />
          {/* phone end */}

          {/* nationalities start */}
          <div className="flex flex-col">
            <SelectNationality
              name="nationality_id"
              editData={editEmployeeData}
              isSuccessPost={!editEmployeeData && isSuccessPost}
              resetSelect={!editEmployeeData && restData}
            />
          </div>
          {/* nationalities end */}

          {/* birth date start */}
          <DateInputField
            label={`${t("birth date")}`}
            name="date_of_birth"
            required
            maxDate={new Date()}
          />
          {/* birth date end */}

          {/* hiring date start */}
          {!!!editEmployeeData && (
            <DateInputField
              label={`${t("hiring date")}`}
              name="date_of_hiring"
              maxDate={new Date()}
              required
            />
          )}

          {/* hiring date end */}

          {/* national_number start */}
          <BaseInputField
            id="national_number"
            label={`${t("national number")}`}
            name="national_number"
            type="text"
            placeholder={`${t("national number")}`}
            required
          />
          {/* national_number end */}

          {/* national_expire_date start */}
          <DateInputField
            label={`${t("national expire date")}`}
            name="national_expire_date"
            minDate={new Date()}
            required
          />
          {/* national_expire_date end */}

          {/* email start */}
          <BaseInputField
            id="email"
            label={`${t("email")}`}
            name="email"
            type="email"
            placeholder={`${t("email")}`}
            required
          />
          {/* email end */}

          {/* username start */}
          <BaseInputField
            id="username"
            label={`${t("username")}`}
            name="username"
            type="text"
            placeholder={`${t("username")}`}
            required
          />
          {/* username end */}

          {/* password start */}
          <div className="flex items-center gap-x-2">
            <BaseInputField
              id="password"
              label={`${t("password")}`}
              name="password"
              type="password"
              placeholder={
                !!editEmployeeData ? "***********" : `${t("password")}`
              }
              required
              disabled={!!editEmployeeData}
              className={
                !!editEmployeeData
                  ? "placeholder:font-bold placeholder:text-black placeholder:text-xl"
                  : ""
              }
            />
            {!!editEmployeeData && (
              <EditIcon action={() => setModalOpen(true)} />
            )}
          </div>
          {/* password end */}

          {/* isActive start */}
          <div className="flex gap-x-2 mt-8">
            <span className="font-bold">{t("is active")}</span>
            <RadioGroup name="is_active">
              <div className="flex gap-x-2">
                <RadioGroup.RadioButton
                  value="Yes"
                  label={`${t("Yes")}`}
                  id="Yes"
                />
                <RadioGroup.RadioButton
                  value="No"
                  label={`${t("No")}`}
                  id="No"
                />
              </div>
            </RadioGroup>
          </div>
          {/* isActive end */}
          <div className="col-span-4 flex">
            <div className="w-1/2">
              <h2 className="pr-3">ارفاق صورة الهوية</h2>
              <DropFile name="national_image" />
            </div>
            <div className="w-1/2">
              <h2 className="pr-3">ارفاق الصورة الشخصية</h2>
              <DropFile name="image" />
            </div>
          </div>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <BaseInputField
              id="password"
              label={`${t("edit password")}`}
              name="password"
              type="password"
              placeholder={`${t("password")}`}
              className="w-1/5"
            />
            {values?.password.length <= 8 && (
              <p className="text-red-700">{t("at least 8 characters")}</p>
            )}
            <Button
              type="button"
              action={() => {
                if (values?.password.length >= 8) setModalOpen(false);
              }}
              className="flex mr-auto mt-8"
            >
              {t("submit")}
            </Button>
          </Modal>
        </InnerFormLayout>
        <Documents
          docsFormValues={docsFormValues}
          setDocsFormValues={setDocsFormValues}
          editable={!!editEmployeeData}
          isSuccessPost={!editEmployeeData && isSuccessPost}
          restData={!editEmployeeData && restData}
        />
        <NationalAddress
          editData={editEmployeeData}
          isSuccessPost={!editEmployeeData && isSuccessPost}
          resetSelect={!editEmployeeData && restData}
        />
      </OuterFormLayout>
    </>
  );
};
