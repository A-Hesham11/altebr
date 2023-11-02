/////////// IMPORTS
///
import { FormikSharedConfig, useFormikContext } from "formik"
import { t } from "i18next"
import { InnerFormLayout } from "../molecules/InnerFormLayout"
import { BaseInputField } from "../molecules/formik-fields/BaseInputField"
import { Country_city_distract_markets } from "./reusableComponants/Country_city_distract_markets"
import { useEffect } from "react"

///
/////////// Types
///
type NationalAddress_TP = {
  editData?: any
  isSuccessPost?: any
  resetSelect?:any
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const NationalAddress = ({
  editData,
  isSuccessPost,
  resetSelect,
}: NationalAddress_TP) => {
  /////////// VARIABLES
  ///

  ///
  ///
  /////////// STATES
  ///
  ///
  /////////// CUSTOM HOOKS
  const { setFieldValue, resetForm } = useFormikContext<FormikSharedConfig>()

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    if (isSuccessPost) {
      resetForm()
     resetSelect && resetSelect()
    }
  }, [isSuccessPost])
  ///
  return (
    <>
      <InnerFormLayout title={`${t("national address")}`}>
        <Country_city_distract_markets
          cityName="city_id"
          countryName="country_id"
          distractName="district_id"
          editData={editData}
          isSuccessPost={isSuccessPost}
          resetSelect={resetSelect}
        />
        {/* short address start */}
        <BaseInputField
          id="address"
          label={`${t("short address")}`}
          name="address"
          type="text"
          placeholder={`${t("short address")}`}
          required
        />
        {/* short address end */}

        {/* street number start */}
        <BaseInputField
          id="streetNumber"
          label={`${t("street number")}`}
          name="street_number"
          type="text"
          placeholder={`${t("street number")}`}
          required
        />
        {/* street number end */}

        {/* building number start */}
        <BaseInputField
          id="buildingNumber"
          label={`${t("building number")}`}
          name="building_number"
          type="text"
          placeholder={`${t("building number")}`}
          required
        />
        {/* building number end */}

        {/* sub number start */}
        <BaseInputField
          id="subNumber"
          label={`${t("sub number")}`}
          name="sub_number"
          type="text"
          placeholder={`${t("sub number")}`}
          required
        />
        {/* sub number end */}

        {/* zip number start */}
        <BaseInputField
          id="zip_code"
          label={`${t("zip code")}`}
          name="zip_code"
          type="text"
          placeholder={`${t("zip code")}`}
          required
        />
        {/* zip number end */}
      </InnerFormLayout>
    </>
  )
}
