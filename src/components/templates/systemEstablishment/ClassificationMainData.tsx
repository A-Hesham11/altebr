/////////// IMPORTS
///
///
/////////// Types
///

import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import { Button } from "../../atoms"
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
} from "../../molecules"

/////////// HELPER VARIABLES & FUNCTIONS
///
type ClassificationMainDataProps_TP = {
  editData?: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData?:()=>void
}
///
export const ClassificationMainData = ({
  editData,
  title,
  isLoading,
  isSuccessPost,
  resetData,
}: ClassificationMainDataProps_TP) => {
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
      resetForm()
      if(resetData)resetData()
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
          <BaseInputField
            id="classification_ar"
            label={`${t("classifications in arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("classifications in arabic")}`}
            defaultValue={editData ? editData.name : ""}
            required
          />
          <BaseInputField
            id="classification_en"
            label={`${t("classifications in english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("classifications in english")}`}
            required
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
