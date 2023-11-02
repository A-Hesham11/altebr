/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { SingleValue } from "react-select"
import { useFetch, useIsRTL } from "../../../hooks"
import { SelectOption_TP } from "../../../types"
import { Select } from "../../molecules"
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler"
///
/////////// Types
type SelectNationalityProps_TP = {
  name: string
  editData?: any
  resetSelect?:any
  isSuccessPost?:any
  disabled?:Boolean
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectMembership = ({
  name,
  resetSelect,
  editData,
  isSuccessPost,
  disabled
}: SelectNationalityProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  const isRTL = useIsRTL()

  const {
    data: membershipOptions,
    isLoading: membershipLoading,
    refetch: refetchNationality,
    failureReason: nationalityErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "/selling/api/v1/odwyas",
    queryKey: ["odwyas"],
    select: (odwyas) =>
        odwyas.map((odwya) => {
          return {
            id: odwya.id,
            value: isRTL ? odwya.name_ar : odwya.name_en,
            label: isRTL ? odwya.name_ar : odwya.name_en,
            name: isRTL ? odwya.name_ar : odwya.name_en,
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
      id: editData?.odwya.id,
      value: editData?.odwya.name_ar,
      label: editData?.odwya.name_ar || "إختر نوع العضوية",
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
        label: "إختر نوع العضوية",
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
        id="1"
        label={`${t("membership type")}`}
        name={name}
        placeholder={`${t("membership type")}`}
        loadingPlaceholder={`${t("loading")}`}
        options={membershipOptions}
        loading={membershipLoading}
        creatable
        modalTitle={`${t("membership type")}`}
        required
        fieldKey="id"
        value={newValue}
        isDisabled={disabled || !membershipLoading && !!nationalityErrorReason}
        onChange={(option) => {
          setNewValue(option)
        }}
      />
      <RefetchErrorHandler
        failureReason={nationalityErrorReason}
        isLoading={membershipLoading}
        refetch={refetchNationality}
      />
    </div>
  )
}