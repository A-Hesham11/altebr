///
/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../../hooks"
import { Category_TP } from "../../../../../types"
import { Select } from "../../../../molecules"
import CreateCategory from "../create/CreateCategory"
///
/////////// Types
///
interface ExtendedCategory_TP extends Category_TP {
  value: string
  label: string
  id: string
}
type SelectCategory_TP = {
  showNotDefinedType?: boolean
  name: string
  label?: string
  noMb?: boolean
  placement?: "top" | "auto" | "bottom"
  onChange?: (option: ExtendedCategory_TP) => void
  field?: "id" | "value"
  value?:{[x:string]:string}
  all?: boolean
  showItems?: boolean
  showItemsDiamond?: boolean
  disabled?: boolean
}

const SelectCategory = ({
  label,
  name,
  field = "id",
  onChange,
  noMb = false,
  placement = "auto",
  showNotDefinedType = true,
  value,
  all = false,
  showItems = false,
  showItemsDiamond = false,
  disabled
}: SelectCategory_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: categories, isLoading: categoryLoading } = useFetch<
  ExtendedCategory_TP[]
  >({
    endpoint: all
    ? "classification/api/v1/categories?per_page=10000"
    : "classification/api/v1/categories?per_page=10000",
    queryKey: ["categories_all"],
    select: (categories) => {
      if(showItems){
        return categories.filter(item=>!item.items).map((category) => ({
          ...category,
          id: category.id,
          label: category.name,
          value: category.name,
        }))
      }
      if(showItemsDiamond){
        return categories.filter(item=>item.type !== "multi" && item.selling_type !== "all" ).map((category) => ({
          ...category,
          id: category.id,
          label: category.name,
          value: category.name,
        }))
      }
      if (showNotDefinedType) {   
        return categories.map((category) => ({
          ...category,
          id: category.id,
          label: category.name,
          value: category.name,
        }))
      }

      
      return categories
      .filter((category) => category.id != "1")
        .map((category) => ({
          ...category,
          id: category.id,
          label: category.name,
          value: category.name,
        }))
      },
    })
    
  return (
    <Select
      id="select_categories"
      label={label}
      name={name}
      noMb={noMb}
      placement={placement}
      placeholder={`${t("categories")}`}
      loadingPlaceholder={`${t("Loading...")}`}
      options={categories}
      creatable
      CreateComponent={CreateCategory}
      loading={categoryLoading}
      isDisabled={disabled}
      fieldKey={field}
      // @ts-ignore
      onChange={onChange}
      {...{...(value && {value})}}
    />
  )
}

export default SelectCategory
