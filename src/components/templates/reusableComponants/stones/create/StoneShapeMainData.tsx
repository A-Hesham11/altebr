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
type StoneShapeMainDataProps_TP = {
  editData: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData: () => void
}
///
export const StoneShapeMainData = ({
  editData,
  title,
    isLoading,
  isSuccessPost,
  resetData,
}: StoneShapeMainDataProps_TP) => {
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
            id="stone_shape_ar"
            label={`${t("stones shapes in arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("stones shapes in arabic")}`}
          />
          <BaseInputField
            id="stone_shape_en"
            label={`${t("stones shapes in english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("stones shapes in english")}`}
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
