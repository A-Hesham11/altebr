///
/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../../hooks"
import { SelectOption_TP } from "../../../../../types"
import { Select } from "../../../../molecules"
import CreateStonePurity from "../create/CreateStonePurity"

///
/////////// Types
///
type SelectStonePurityProps_TP = {
  name: string,
  label: string,
  field: "id" | "value"
  onChange?: (option:any) => void,
  value?:any
}

const SelectStonePurity = ({ name, field, label, onChange , value }: SelectStonePurityProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: purities,
    isLoading: purityLoading
  } = useFetch<SelectOption_TP[]>({ 
    endpoint: "stones/api/v1/purities",
    queryKey: ["stone_purity"],
    select: (purities) => {
      return purities.map((purity: any) => ({
        id: purity.id,
        label: purity.name,
        name: purity.name,
        value: purity.name,
      }))
    }
  })

  return (
    <Select
      id="select_purity"
      label={label}
      name={name}
      placeholder={`${t('stones purities')}`}
      loadingPlaceholder={`${t('Loading...')}`}
      options={purities}
      creatable
      fieldKey={field}
      CreateComponent={CreateStonePurity}
      loading={purityLoading}onChange={onChange}
      {...{...(value && {value})}}
    />
  )
}

export default SelectStonePurity