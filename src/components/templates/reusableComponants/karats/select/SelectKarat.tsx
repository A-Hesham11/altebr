///
/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { sortKarats } from "../../../../../api/sortKarats"
import { useFetch } from "../../../../../hooks"
import { SelectOption_TP } from "../../../../../types"
import { Select } from "../../../../molecules"
import CreateKarat from "../../../reusableComponants/karats/create/CreateKarat"

///
/////////// Types
///
type SelectKaratProps_TP = {
  name: string,
  label?: string,
  field: "id" | "value",
  noMb?: boolean
  placement?: "top" | "auto" | "bottom"
  onChange?: (option:any) => void,
  stateValue?: any
  value?:{[x:string]:string}
  disabled?:boolean
}

const SelectKarat = ({ 
  name, 
  field, 
  label, 
  onChange, 
  noMb = false, 
  placement = "auto", 
  disabled,
  value
}: SelectKaratProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const {isSubmitting} = useFormikContext<any>()
  const {
    data: karats,
    isLoading: karatsLoading
  } = useFetch<SelectOption_TP[]>({
    endpoint: "classification/api/v1/karats",
    queryKey: ["karats"],
    select: (karats) => {
      return sortKarats(karats.map((karat: any) => ({
        id: karat.id,
        label: karat.name,
        name: karat.name,
        value: karat.name,
      })))
    }
  })

  return (
    <Select
      id="select_karats"
      label={label}
      name={name}
      noMb={noMb}
      placement={placement}
      placeholder={`${t('karats')}`}
      loadingPlaceholder={`${t('Loading...')}`}
      options={karats}
      isDisabled={disabled}
      // creatable
      fieldKey={field}
      CreateComponent={CreateKarat}
      loading={karatsLoading}
      onChange={onChange}
      {...{...(value && {value})}}
    />
  )
}

export default SelectKarat