/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useContext, useEffect, useState } from "react"
import { SingleValue } from "react-select"
import { Select } from "../../molecules"
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler"
import { SelectOption_TP } from "../../../types"
import { useFetch, useIsRTL } from "../../../hooks"
import { authCtx } from "../../../context/auth-and-perm/auth"
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
export const SelectBanksAccount = ({
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

  const {userData} = useContext(authCtx)

  const {
    data: banksOptions,
    isLoading: BanksLoading,
    refetch: refetchNationality,
    failureReason: nationalityErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: `/selling/api/v1/get_bank_accounts/${userData?.branch_id}`,
    queryKey: ["banksBranchName"],
    select: (banks) =>
        banks.map((bank) => {
          return {
            id: bank.id,
            value: bank.bank_name,
            label: bank.bank_name,
            name: bank.bank_name,
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
      id: editData?.id,
      value: editData?.bank_name,
      label: editData?.bank_name || "إختر إسم البنك",
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