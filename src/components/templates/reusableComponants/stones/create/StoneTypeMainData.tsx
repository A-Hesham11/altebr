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
type StoneTypeMainDataProps_TP = {
  editData: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData?: () => void
}
///
export const StoneTypeMainData = ({
  editData,
  title,
  isLoading,
  isSuccessPost,
  resetData,
}: StoneTypeMainDataProps_TP) => {
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
          <Button loading={isLoading} type="submit" className="ms-auto mt-8">
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          <BaseInputField
            id="stone_type_ar"
            label={`${t("stones types in arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("stones types in arabic")}`}
          />
          <BaseInputField
            id="stone_type_en"
            label={`${t("stones types in english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("stones types in english")}`}
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
