/////////// IMPORTS
///
import { FormikSharedConfig, useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useFetch } from "../../../../hooks";
import { supplier } from "../../../../pages/suppliers/AllSuppliers";
import { SelectOption_TP } from "../../../../types";
import { Button } from "../../../atoms";
import {
  BaseInputField,
  CheckBoxField,
  DateInputField,
  InnerFormLayout,
  OuterFormLayout,
  PhoneInput,
} from "../../../molecules";
import RadioGroup from "../../../molecules/RadioGroup";
import { DropFile } from "../../../molecules/files/DropFile";
import { NationalAddress } from "../../NationalAddress";
import { Country_city_distract_markets } from "../../reusableComponants/Country_city_distract_markets";
import { Documents } from "../../reusableComponants/documents/Documents";
import { SelectNationality } from "../SelectNationality";
///
/////////// Types
///
type SupplierMainDataProps_TP = {
  title: string;
  editData?: supplier;
  postLoading?: any;
  isSuccessPost?: any;
  restData?: any;
  setDocsFormValues?: any;
  docsFormValues?: any;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const SupplierMainData = ({
  title,
  editData,
  postLoading,
  isSuccessPost,
  restData,
  setDocsFormValues,
  docsFormValues,
  setSupplierType,
}: SupplierMainDataProps_TP) => {
  /////////// VARIABLES
  /////
  const { setFieldValue, values, resetForm } =
    useFormikContext<FormikSharedConfig>();
  console.log("🚀 ~ values:", values);
  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: nationalitiesOptions,
    isLoading: nationalitiesLoading,
    refetch: refetchNationalities,
    failureReason: nationalitiesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "governorate/api/v1/nationalities",
    queryKey: ["nationalities"],
    select: (nationalities) =>
      nationalities.map((nationality: any) => ({
        id: nationality.id,
        value: nationality.id,
        label: nationality.name,
      })),
  });

  ///
  /////////// STATES
  ///
  const [updateLogo, setUpdateLogo] = useState(false);
  ///
  /////////// SIDE EFFECTS

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    if (isSuccessPost) {
      if (!editData) {
        resetForm();
        restData();
        setFieldValue("end_date", new Date());
        setFieldValue("start_date", new Date());
        setDocsFormValues([]);
      }
    }
  }, [isSuccessPost]);

  useEffect(() => {
    if (!!!editData && values.type == "global") {
      setFieldValue("gold_tax", false);
      setFieldValue("wages_tax", false);
    } else if (!!!editData && values.type == "local") {
      setFieldValue("gold_tax", true);
      setFieldValue("wages_tax", true);
      setFieldValue("diamond_tax", true);
    }
  }, [values.type]);
  ///

  return (
    <>
      <OuterFormLayout
        header={title}
        submitComponent={
          <Button type="submit" className="ms-auto mt-8" loading={postLoading}>
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          <div className="col-span-4 flex justify-between">
            <div className="flex gap-3 items-center">
              <span className="font-bold">{t("supplier type")}:</span>
              <RadioGroup
                name="type"
                onChange={(value) => setSupplierType(value)}
              >
                <div className="flex gap-3">
                  <RadioGroup.RadioButton
                    value="local"
                    label={`${t("local")}`}
                    id="local"
                  />
                  <RadioGroup.RadioButton
                    value="global"
                    label={`${t("global")}`}
                    id="global"
                  />
                </div>
              </RadioGroup>
              <CheckBoxField
                label={`${t("is mediator")}`}
                name="is_mediator"
                id="is_mediator"
              />
            </div>
            <div className="flex gap-3 items-center">
              <span className="flex items-center font-bold">
                {t("dealing type")}:
              </span>
              <CheckBoxField
                label={`${t("gold tax")}`}
                name="gold_tax"
                id="gold_tax"
              />
              <CheckBoxField
                label={`${t("wages tax")}`}
                name="wages_tax"
                id="wages_tax"
              />
              <CheckBoxField
                label={`${t("diamond and accessory tax")}`}
                name="diamond_tax"
                id="diamond_tax"
              />
            </div>
          </div>
          <BaseInputField
            id="company_name"
            required
            label={`${t("company name")}`}
            name="company_name"
            type="text"
            placeholder={`${t("company name")}`}
            labelProps={{ className: "mb-1" }}
          />
          <BaseInputField
            id="name"
            required
            label={`${t("Representative name")}`}
            name="name"
            type="text"
            placeholder={`${t("Representative name")}`}
            labelProps={{ className: "mb-1" }}
          />
          <BaseInputField
            id="address_out"
            required
            label={`${t("address")}`}
            name="address_out"
            type="text"
            placeholder={`${t("address")}`}
            labelProps={{ className: "mb-1" }}
          />
          <Country_city_distract_markets
            countryName="country_id_out"
            countryLabel={`${t("country")}`}
            isSuccessPost={isSuccessPost}
            resetSelect={restData}
            editData={
              editData
                ? {
                    nationalAddress: {
                      country: {
                        id: editData?.country?.id,
                        name: editData?.country?.name,
                      },
                      city: {
                        id: editData?.city?.id,
                        name: editData?.city?.name,
                      },
                      district: {
                        id: editData?.nationalAddress?.district?.id,
                        name: editData?.nationalAddress?.district?.name,
                      },
                    },
                  }
                : undefined
            }
          />
          {!!!editData?.phone && (
            <PhoneInput
              label={`${t("mobile number")}`}
              name="phone"
              placeholder={`${t("mobile number")}`}
              restData={restData}
              isSuccessPost={isSuccessPost}
              required
            />
          )}

          <BaseInputField
            id="email"
            required
            label={`${t("email")}`}
            name="email"
            type="email"
            placeholder={`${t("email")}`}
          />
          {!!!editData?.phone && (
            <BaseInputField
              id="password"
              required
              label={`${t("password")}`}
              name="password"
              type="password"
              placeholder={`${t("password")}`}
            />
          )}
          <BaseInputField
            id="fax"
            required
            label={`${t("fax")}`}
            name="fax"
            type="text"
            placeholder={`${t("fax")}`}
            labelProps={{ className: "mb-1" }}
          />
          <div className="flex flex-col">
            <SelectNationality
              name="nationality_id"
              editData={editData}
              isSuccessPost={isSuccessPost}
              resetSelect={restData}
            />
          </div>
          <BaseInputField
            id="national_number"
            required
            label={`${t("national number")}`}
            name="national_number"
            type="text"
            placeholder={`${t("national number")}`}
            labelProps={{ className: "mb-1" }}
          />
          <DateInputField
            label={`${t("national expire date")}`}
            name="national_expire_date"
            minDate={new Date()}
            required
            labelProps={{ className: "mb-2" }}
          />

          <div className="col-span-4">
            <h2>{`${t("attach the company logo")}`}</h2>
            <DropFile name="logo" />
          </div>
          {/* {updateLogo && (
          <div className="col-span-4">
            <h2>{`${t("attach the company logo")}`}</h2>
            <DropFile name="logo" />
          </div>
        )} */}
        </InnerFormLayout>
        <Documents
          editable={!!editData}
          setDocsFormValues={setDocsFormValues}
          docsFormValues={docsFormValues}
          isSuccessPost={!editData && isSuccessPost}
          restData={!editData && restData}
        />
        {values?.type === "local" && (
          <NationalAddress
            editData={editData}
            isSuccessPost={!editData && isSuccessPost}
            resetSelect={!editData && restData}
          />
        )}
      </OuterFormLayout>
    </>
  );
};
