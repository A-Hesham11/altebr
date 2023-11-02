/////////// IMPORTS
///
///
/////////// Types
///

import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import { Button } from "../../../atoms"
import { BaseInputField, InnerFormLayout, OuterFormLayout } from "../../../molecules"
import { SelectMineral } from "../../reusableComponants/minerals/SelectMineral"


/////////// HELPER VARIABLES & FUNCTIONS
///
type MineralsKaratsMainDataProps_TP = {
  editData?: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData?: () => void
}
///
export const MineralsKaratsMainData = ({
  resetData,
  editData,
  title,
  isLoading,
  isSuccessPost,
}: MineralsKaratsMainDataProps_TP) => {
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
          <SelectMineral showLabel={true}/>
          <BaseInputField
            id="karats_name"
            label={`${t("metal karat")}`}
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
