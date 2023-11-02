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
type CitiesMainDataProps_TP = {
  editData: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetSelect?: () => void
}
///
export const CitiesMainData = ({
  editData,
  title,
  isLoading,
  isSuccessPost,
  resetSelect,
}: CitiesMainDataProps_TP) => {

  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { resetForm } = useFormikContext<any>()

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
            isSuccessPost={isSuccessPost}
            countryName="country_id"
            resetSelect={resetSelect}
            editData={editData}
          />
          <BaseInputField
            id="name_ar"
            label={`${t("city name arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("city name arabic")}`}
            required
          />
          <BaseInputField
            id="name_en"
            label={`${t("city name english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("city name english")}`}
            labelProps={{ className: "mb-1" }}
            required
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
