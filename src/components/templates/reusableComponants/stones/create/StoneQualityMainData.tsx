/////////// IMPORTS
///
///
/////////// Types
///

import { t } from "i18next"

import { useFormikContext } from "formik"
import { useEffect } from "react"
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
} from "../../../../molecules"
import { Button } from "../../../../atoms"
import { Country_city_distract_markets } from "../../Country_city_distract_markets"

/////////// HELPER VARIABLES & FUNCTIONS
///
type StoneQualityMainDataProps_TP = {
  editData: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData: () => void
}
///
export const StoneQualityMainData = ({
  editData,
  title,
  isLoading,
  isSuccessPost,
  resetData,
}: StoneQualityMainDataProps_TP) => {
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
      resetData()
    }
  }, [isSuccessPost])

  ///
  return (
    <>
      <OuterFormLayout
        header={title}
        submitComponent={
          <Button loading={isLoading} type="submit" className="ms-auto mt-8">
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          <BaseInputField
            id="stone_quality_ar"
            label={`${t("stones qualities in arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("stones qualities in arabic")}`}
          />
          <BaseInputField
            id="stone_quality_en"
            label={`${t("stones qualities in english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("stones qualities in english")}`}
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
