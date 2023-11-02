/////////// IMPORTS
///
///
/////////// Types
///

import { t } from "i18next"

import { useFormikContext } from "formik"
import { useEffect } from "react"
import { BaseInputField, InnerFormLayout, OuterFormLayout } from "../../molecules"
import { Button } from "../../atoms"


/////////// HELPER VARIABLES & FUNCTIONS
///
type CountryMainDataProps_TP = {
  editData: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData: () => void
}
///
export const CountryMainData = ({
  editData,
  title,
  isLoading,
  isSuccessPost,
  resetData,
}: CountryMainDataProps_TP) => {
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
          <Button type="submit" loading={isLoading} className="mr-auto mt-8">
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={`${t("main data")}`}>
          <BaseInputField
            id="Country_name"
            label={`${t("Country name arabic")}`}
            name="name_ar"
            type="text"
            placeholder={`${t("Country name arabic")}`}
            labelProps={{ className: "mb-1" }}
            required
          />
          <BaseInputField
            id="Country_name"
            label={`${t("Country name english")}`}
            name="name_en"
            type="text"
            placeholder={`${t("Country name english")}`}
            labelProps={{ className: "mb-1" }}
            required
          />
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
