/////////// IMPORTS
///
//import classes from './ClearableSelect.module.css'
///
/////////// Types
///
import { AiOutlineClose } from "react-icons/ai"
import { Select } from "./formik-fields"
import { useFormikContext } from "formik"
import { useState } from "react"
import { CError_TP, SelectOption_TP } from "../../types"
import { SingleValue } from "react-select"
import { useFetch } from "../../hooks"
import { t } from "i18next"
import { RefetchErrorHandler } from "./RefetchErrorHandler"
/////////// HELPER VARIABLES & FUNCTIONS
type ClearableSelect_TP = {
  options: SelectOption_TP[] | undefined
  name: string
  label: string
  id: string
  placeholder?: string
  fieldKey?: "id" | "value" | undefined
  isDisabled: boolean
  loading: boolean
  refetch: () => void
  failureReason: CError_TP
}
///
type ClearableSelect_TP = {
  options: SelectOption_TP[] | undefined
  name: string
  label: string
  id: string
  placeholder?: string
  fieldKey?: "id" | "value" | undefined
  isDisabled: boolean
  loading: boolean
  refetch: () => void
  failureReason: CError_TP
}
///
export const ClearableSelect = ({
  options,
  name,
  label,
  id,
  placeholder,
  fieldKey = "id",
  isDisabled,
  loading,
  refetch,
  failureReason,
}: ClearableSelect_TP) => {
  /////////// VARIABLES
  ///
  const { setFieldValue, values } = useFormikContext()

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const { setFieldValue, values } = useFormikContext()
  ///
  /////////// SIDE EFFECTS
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>()

  const [clear, setClear] = useState(false)

  const { data: countriesOptions, isLoading: countriesLoading } = useFetch({
    queryKey: ["countries"],
    endpoint: "governorate/api/v1/countries?per_page=10000",
    select: (data) =>
      data.map((country) => ({
        ...country,
        label: country.name,
      })),
  })

  ///
  /////////// FUNCTIONS & EVENTS
  ///
  ///
  const ClearValue = () => {
    setNewValue({
      id: "",
      value: "",
      label: ".....",
    })
    setClear(true)
    setFieldValue(name, "")
  }

  return (
    <div className="relative">
      <Select
        id={id}
        label={t(`${label}`).toString()}
        name={name}
        placeholder={t(`${label}`).toString()}
        isDisabled={isDisabled && !!failureReason}
        loadingPlaceholder={`${t("loading")}`}
        loading={loading}
        options={options}
        fieldKey={fieldKey}
        value={newValue}
        onChange={(option) => {
          setFieldValue(name, option!.id)
          if (clear) {
            setNewValue({
              id: option!.id,
              value: option!.value,
              label: option!.label,
            })
          }
        }}
      />
      {loading ? (
        ""
      ) : (
        <AiOutlineClose
          onClick={() => ClearValue()}
          className="fill-red-500 p-0  bg-transparent w-4 h-4 text-gray-300  absolute top-10 left-12"
        />
      )}
      <RefetchErrorHandler
        failureReason={failureReason}
        isLoading={loading}
        refetch={refetch}
      />
    </div>
  )
}
