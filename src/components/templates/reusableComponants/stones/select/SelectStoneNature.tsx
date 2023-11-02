///
/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../../hooks"
import { SelectOption_TP } from "../../../../../types"
import { Select } from "../../../../molecules"
import CreateStoneNature from "../create/CreateStoneNature"

///
/////////// Types
///
type SelectStoneNatureProps_TP = {
  name: string,
  label: string,
  field: "id" | "value"
  onChange?: (option:any) => void,
  value?:any
}

const SelectStoneNature = ({ name, field, label , onChange , value}: SelectStoneNatureProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: natures,
    isLoading: natureLoading
  } = useFetch<SelectOption_TP[]>({ 
    endpoint: "stones/api/v1/natures",
    queryKey: ["stone_nature"],
    select: (natures) => {
      return natures.map((nature: any) => ({
        id: nature.id,
        label: nature.name,
        name: nature.name,
        value: nature.name,
      }))
    }
  })

  return (
    <Select
      id="select_nature"
      label={label}
      name={name}
      placeholder={`${t('stones natures')}`}
      loadingPlaceholder={`${t('Loading...')}`}
      options={natures}
      creatable
      fieldKey={field}
      CreateComponent={CreateStoneNature}
      loading={natureLoading}
      onChange={onChange}
      {...{...(value && {value})}}
    />
  )
}

export default SelectStoneNature