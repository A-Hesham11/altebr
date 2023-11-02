///
/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../../hooks"
import { SelectOption_TP } from "../../../../../types"
import { Select } from "../../../../molecules"
import CreateStoneQuality from "../create/CreateStoneQuality"

///
/////////// Types
///
type SelectStoneQualityProps_TP = {
  name: string,
  label: string,
  field: "id" | "value"
}

const SelectStoneQuality = ({ name, field, label }: SelectStoneQualityProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: qualities,
    isLoading: qualityLoading
  } = useFetch<SelectOption_TP[]>({ 
    endpoint: "stones/api/v1/qualities",
    queryKey: ["stone_quality"],
    select: (qualities) => {
      return qualities.map((quality: any) => ({
        id: quality.id,
        label: quality.name,
        name: quality.name,
        value: quality.name,
      }))
    }
  })

  return (
    <Select
      id="select_quality"
      label={label}
      name={name}
      placeholder={`${t('stones qualities')}`}
      loadingPlaceholder={`${t('Loading...')}`}
      options={qualities}
      creatable
      fieldKey={field}
      CreateComponent={CreateStoneQuality}
      loading={qualityLoading}
    />
  )
}

export default SelectStoneQuality