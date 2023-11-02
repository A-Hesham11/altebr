/////////// IMPORTS
///
///
/////////// Types
///

import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import { Button } from "../../../atoms"
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
  Select,
} from "../../../molecules"
import { SingleValue } from "react-select"
import { SelectOption_TP } from "../../../../types"
import { Country_city_distract_markets } from "../../reusableComponants/Country_city_distract_markets"

/////////// HELPER VARIABLES & FUNCTIONS
///
type MarketMainDataProps_TP = {
  editData?: any
  title?: string
  isSuccessPost?: boolean
  resetData?: () => void
  isLoading?: boolean
}
///
export const MarketMainData = ({
  resetData,
  title,
  isSuccessPost,
  editData,
  setEditData,
  isLoading,
}: MarketMainDataProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { resetForm, values } = useFormikContext<any>()

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
    resetForm()
    if (resetData) resetData()
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
            distractName="district_id"
            editData={editData}
            isSuccessPost={isSuccessPost}
            resetSelect={resetData}
            setEditData={setEditData}
          />
          <BaseInputField
            id="name_ar"
            label={`${t("market in arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("market in arabic")}`}
          />

          <BaseInputField
            id="name_en"
            label={`${t("market in english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("market in english")}`}
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
