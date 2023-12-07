/////////// IMPORTS
///
///
/////////// Types
///

import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import { BaseInputField, InnerFormLayout, OuterFormLayout } from "../../../../molecules"
import { Button } from "../../../../atoms"


/////////// HELPER VARIABLES & FUNCTIONS
///
type KaratMainDataProps_TP = {
  editData?: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData?:()=>void
}
///
export const KaratMainData = ({
  resetData,
  title,
  isLoading,
  isSuccessPost,
}: KaratMainDataProps_TP) => {
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
      if(resetData) resetData()
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
            id="karats_number"
            label={`${t("karats number")}`}
            name="name"
            type="text"
            placeholder={`${t("karats number")}`}
          />
          <BaseInputField
            id="karats_equivalent"
            label={`${t("karats rate")}`}
            name="equivalent"
            type="number"
            placeholder={`${t("karats rate")}`}
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
