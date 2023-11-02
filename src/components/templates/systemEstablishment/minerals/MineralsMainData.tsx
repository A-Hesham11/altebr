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
import { useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"

/////////// HELPER VARIABLES & FUNCTIONS
///
type MineralsMainDataProps_TP = {
  editData?: any
  title?: string
  isSuccessPost?: boolean
  resetData?: () => void
  isLoading?: boolean
}
///
export const MineralsMainData = ({
  resetData,
  title,
  isSuccessPost,
  editData,
  setEditData,
  isLoading,
}: MineralsMainDataProps_TP) => {
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
          <BaseInputField
            id="name_ar"
            label={`${t("minerals in arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("minerals in arabic")}`}
          />

          <BaseInputField
            id="name_en"
            label={`${t("minerals in english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("minerals in english")}`}
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
