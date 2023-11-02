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
type SelectBankProps_TP = {
  id: number
  name: string
  editData?: any
  resetSelect?:any
  isSuccessPost?:any
  disabled?:Boolean
  setBankId?: string
  newValue?:SelectOption_TP
  name_ar?: string
  name_en?:string

  
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectBanks = ({
  name,
  resetSelect,
  editData,
  isSuccessPost,
  disabled,
  setBankId,
  newValue,
  setNewValue,
}: SelectBankProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  const isRTL = useIsRTL()

  const {
    data: banksOptions,
    isLoading: BanksLoading,
    refetch: refetchNationality,
    failureReason: nationalityErrorReason,
  } = useFetch<SelectBankProps_TP[]>({
    endpoint: "/selling/api/v1/banks",
    queryKey: ["banksName"],
    select: (banks) =>
        banks.map((bank) => {
          return {
            id: bank.id,
            value: isRTL ? bank.name_ar : bank.name_en,
            label: isRTL ? bank.name_ar : bank.name_en,
            name: isRTL ? bank.name_ar : bank.name_en,
          }
      }),
  })


  useEffect(() => {
    setNewValue({
      id: editData?.id,
      value: editData?.bank_name,
      label: editData?.bank_name || "إختر إسم البنك",
    })
  }, [])

  // useEffect(() => {
  //   setBankId(newValue?.id)
  // }, [newValue?.id])
  ///
  /////////// IF CASES
  ///
  useEffect(() => {
    if (!!!editData) {
      setNewValue({
        id: "",
        value: "",
        label: "إختر إسم البنك",
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
        label={`${t("bank name")}`}
        name={name}
        placeholder={`${t("bank name")}`}
        loadingPlaceholder={`${t("loading")}`}
        options={banksOptions}
        loading={BanksLoading}
        creatable
        modalTitle={`${t("bank name")}`}
        required
        fieldKey="id"
        value={newValue}
        isDisabled={disabled || !BanksLoading && !!nationalityErrorReason}
        onChange={(option) => {
          setNewValue(option)
        }}
      />
      <RefetchErrorHandler
        failureReason={nationalityErrorReason}
        isLoading={BanksLoading}
        refetch={refetchNationality}
      />
    </div>
  )
}