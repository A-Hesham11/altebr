/////////// IMPORTS
///
///
/////////// Types
///

import { FormikSharedConfig, useFormikContext } from "formik"
import { t } from "i18next"
import {
  BaseInputField,
  DateInputField,
  InnerFormLayout,
  OuterFormLayout,
  PhoneInput,
} from "../../../molecules"
import { DropFile } from "../../../molecules/files/DropFile"
import { Country_city_distract_markets } from "../../reusableComponants/Country_city_distract_markets"
import { SelectNationality } from "../SelectNationality"
import { useEffect } from "react"
import { Button } from "../../../atoms"
import { Documents } from "../../reusableComponants/documents/Documents"
import { NationalAddress } from "../../NationalAddress"

/////////// HELPER VARIABLES & FUNCTIONS
///
type PartnerMainDataProps_TP = {
  editData?: any
  isSuccessPost?: boolean
  restData?: any
  title?: string
  isLoading?: boolean
  setDocsFormValues?: any
  docsFormValues?: any
}

///
export const PartnerMainData = ({
  editData,
  isSuccessPost,
  restData,
  title,
  isLoading,
  setDocsFormValues,
  docsFormValues,
}: PartnerMainDataProps_TP) => {

  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const { resetForm, setFieldValue , values } = useFormikContext<FormikSharedConfig>()
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///
  useEffect(() => {
    if (isSuccessPost) {
      if (!editData) {
        resetForm()
        restData()
        setFieldValue("end_date", new Date())
        setFieldValue("start_date", new Date())
        setDocsFormValues([])
      }
    }
  }, [isSuccessPost])

  ///
  return (
    <>
      <OuterFormLayout
        header={title}
        submitComponent={
          <Button type="submit" className="mr-auto mt-8" loading={isLoading}>
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          {/* اسم الشريك */}
          <BaseInputField
            id="partner_name"
            label={`${t("partner name")}`}
            name="name"
            type="text"
            placeholder={`${t("partner name")}`}
            labelProps={{ className: "mb-1" }}
            required
          />
          {/* ايميل الشريك */}
          <BaseInputField
            id="partner_email"
            label={`${t("partner email")}`}
            name="email"
            type="email"
            placeholder={`${t("partner email")}`}
            labelProps={{ className: "mb-1" }}
            required
          />

          {/* رقم الجوال */}
          {!!!editData && (
            <PhoneInput
              label={`${t("mobile number")}`}
              name="phone"
              placeholder={`${t("mobile number")}`}
              restData={restData}
              isSuccessPost={isSuccessPost}
              required
              
            />
          )}

          {/* <Country_city_distract_markets
            cityName="city_id"
            countryName="country_id"
            isSuccessPost={!editData && isSuccessPost}
            resetSelect={!editData && restData}
            editData={{
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
            }}
          /> */}

        <Country_city_distract_markets
          cityName="city_id"
          countryName="country_id"
          editData={editData}
          isSuccessPost={!editData && isSuccessPost}
          resetSelect={!editData && restData}
        />

          <SelectNationality
            name="nationality_id"
            editData={editData}
            isSuccessPost={!editData && isSuccessPost}
            resetSelect={!editData && restData}
          />
          {/* تاريخ انتهاء الهوية */}
          <DateInputField
            label={`${t("End IdNumber")}`}
            labelProps={{ className: "mb-1" }}
            name="end_date"
            required
          />

          {/* تاريخ بدء الشراكة */}
          <DateInputField
            label={`${t("start Date Partner")}`}
            labelProps={{ className: "mb-1" }}
            name="start_date"
            required
          />
          <div className="col-span-4">
            <h2> {`${t("national image")}`}</h2>
            <DropFile name="national_image" />
          </div>
        </InnerFormLayout>
        <Documents
          setDocsFormValues={setDocsFormValues}
          docsFormValues={docsFormValues}
          editable={!!editData}
          isSuccessPost={!editData && isSuccessPost}
          restData={!editData && restData}
        />
        <NationalAddress
          editData={editData}
          isSuccessPost={!editData && isSuccessPost}
          resetSelect={!editData && restData}
        />
      </OuterFormLayout>
          
    </>
  )
}
