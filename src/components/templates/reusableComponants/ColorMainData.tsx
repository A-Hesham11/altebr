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
type ColorMainDataProps_TP = {
  editData?: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData:any
}
///
export const ColorMainData = ({
  editData,
  title,
  isLoading,
  isSuccessPost,
  resetData,
}: ColorMainDataProps_TP) => {
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
    resetData()
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
        <>
          <InnerFormLayout title={`${t("main data")}`}>
            {/* nationality ar  start */}
            <BaseInputField
              id="name_ar"
              label={`${t("name colors in arabic")}`}
              name="name_ar"
              type="text"
              placeholder={`${t("name colors in arabic")}`}
              defaultValue={editData ? editData.name : ""}
              required
              // value={value}
            />
            {/* nationality ar  end */}

            {/* nationality en  start */}
            <BaseInputField
              id="name_en"
              label={`${t("name colors in english")}`}
              name="name_en"
              type="text"
              placeholder={`${t("name colors in english")}`}
              required
              // value={value}
            />
            {/* nationality en  end */}
          </InnerFormLayout>
        </>
      </OuterFormLayout>
    </>
  )
}
