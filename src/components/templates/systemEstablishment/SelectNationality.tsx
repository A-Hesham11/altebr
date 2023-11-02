/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { SingleValue } from "react-select"
import { useFetch } from "../../../hooks"
import { SelectOption_TP } from "../../../types"
import { Select } from "../../molecules"
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler"
import { CreateNationalities } from "../CreateNationalities"
///
/////////// Types
type SelectNationalityProps_TP = {
  name: string
  editData?: any
  resetSelect?:any
  isSuccessPost?:any
  disabled?:boolean
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectNationality = ({
  name,
  editData,
  resetSelect,
  isSuccessPost,
  disabled
}: SelectNationalityProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: nationalityOptions,
    isLoading: nationalityLoading,
    refetch: refetchNationality,
    failureReason: nationalityErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "governorate/api/v1/nationalities?per_page=10000",
    queryKey: ["nationalities"],
    select: (nationalities) =>
      nationalities.map((nationality) => {
        return {
          id: nationality.id,
          value: nationality.name!,
          label: nationality.name!,
          name: nationality.name!,
        }
      }),
  })

  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
  useState<SingleValue<SelectOption_TP> | null>()
  const { setFieldValue, values } = useFormikContext()
  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setNewValue({
      id: editData?.nationality.id,
      value: editData?.nationality.name_ar,
      label: editData?.nationality.name_ar || "اختر جنسية",
    })
  }, [])

  ///
  /////////// IF CASES
  ///
  useEffect(() => {
    if (!!!editData) {
      setNewValue({
        id: "",
        value: "",
        label: "اختر جنسية",
      })
      if (resetSelect) resetSelect()
    }
  }, [isSuccessPost])
  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <div className="flex flex-col">
      <Select
        id="nationality"
        label={`${t("nationality")}`}
        name={name}
        placeholder={`${t("nationality")}`}
        loadingPlaceholder={`${t("loading")}`}
        options={nationalityOptions}
        loading={nationalityLoading}
        creatable
        modalTitle={`${t("add nationality")}`}
        CreateComponent={CreateNationalities}
        required
        fieldKey="id"
        value={newValue}
        isDisabled={disabled || !nationalityLoading && !!nationalityErrorReason}
        onChange={(option) => {
          setNewValue(option)
        }}
      />
      <RefetchErrorHandler
        failureReason={nationalityErrorReason}
        isLoading={nationalityLoading}
        refetch={refetchNationality}
      />
    </div>
  )
}
