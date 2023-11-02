/////////// IMPORTS
///
///
/////////// Types
///

import { t } from "i18next"
import { Button } from "../../atoms"
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
} from "../../molecules"
import { Country_city_distract_markets } from "../reusableComponants/Country_city_distract_markets"
import { useFormikContext } from "formik"
import { useEffect } from "react"

/////////// HELPER VARIABLES & FUNCTIONS
///
type DistrictMainDataaProps_TP = {
  editData: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetSelect?: () => void
}
///
export const DistrictMainData = ({
  editData,
  title,
  isLoading,
  resetSelect,
  isSuccessPost,
}: DistrictMainDataaProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { values, setFieldValue, resetForm } = useFormikContext<any>()

  ///
  /////////// STATES
  ///

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
      resetForm()
      setFieldValue("country_id", "")
    }
  }, [isSuccessPost])

  ///
  return (
    <>
      <OuterFormLayout
        header={title}
        submitComponent={
          <Button type="submit" loading={isLoading} className="ms-auto mt-8">
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          <Country_city_distract_markets
            countryName="country_id"
            cityName="city_id"
            isSuccessPost={isSuccessPost}
            resetSelect={resetSelect}
            editData={editData}
          />
          <BaseInputField
            id="district_name"
            label={`${t("district name arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("district name arabic")}`}
            required
          />
          <BaseInputField
            id="district_name"
            label={`${t("district name english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("district name english")}`}
            required
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
