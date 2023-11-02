///
/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../../hooks"
import { SelectOption_TP } from "../../../../../types"
import { Select } from "../../../../molecules"
import CreateStoneType from "../create/CreateStoneType"
import { useEffect, useState } from "react"
import { useFormikContext } from "formik"

///
/////////// Types
///
type SelectStoneTypeProps_TP = {
  name: string,
  label?: string,
  field: "id" | "value"
  onChange?: (option: any) => void
  value?: any
  showDiamond?: boolean
}

const SelectStoneType = ({ name, field, label, onChange, value, showDiamond }: SelectStoneTypeProps_TP) => {
  
  ///
  const initVal = {
    id: value?.id || '',
    label: value?.stone_name || t('stone type'),
    value: value?.stone_name ||  "",
    name:value?.name || "",
  }

  const [purityValue, setPurityValue] = useState<any>(initVal)
     const {setFieldValue} = useFormikContext()
     useEffect(() => {
      setFieldValue(name,value?.stone_id)
     }, [])
     
  /////////// CUSTOM HOOKS
  ///
  const {
    data: types,
    isLoading: typeLoading
  } = useFetch<SelectOption_TP[]>({
    endpoint: "stones/api/v1/stones?per_page=10000",
    queryKey: ["stone_type"],
    select: (types) => {
      return (
        showDiamond 
        ? types.filter((item) => item.id !== 70).map((type: any) => ({
            id: type.id,
            label: type.name,
            name: type.name,
            value: type.name,
          }))
        :
         types.map((type: any) => ({
          id: type.id,
          label: type.name,
          name: type.name,
          value: type.name,
        }))
      )
    }
  })
  
  
  return (
    <Select
      id="select_type"
      label={label}
      name={name}
      placeholder={`${t("stones types")}`}
      loadingPlaceholder={`${t('Loading...')}`}
      options={types}
      creatable
      fieldKey={field}
      CreateComponent={CreateStoneType}
      loading={typeLoading}
      onChange={(option) => {
        setPurityValue(option)
        // setFieldValue('diamondWeight',0)
        // setFieldValue('Weight',0)
      }
      }
      value={purityValue}
    />
  )
}

export default SelectStoneType