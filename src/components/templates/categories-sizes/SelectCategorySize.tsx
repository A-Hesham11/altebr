// NOTE: 👁️👁️👁️ /// To use this comp, u need to validate the inputs like this:
/* 
const validatingSchema = Yup.object({
    category_id: Yup.string().trim().required(),
    size_type: Yup.string()
      .trim()
      .when("sizeIsRequired", {
        is: (val: boolean) => val === true,
        then: (schema) => schema.required(),
      }),
    size_unit_id: Yup.string()
      .trim()
      .when("sizeIsRequired", {
        is: (val: boolean) => val === true,
        then: (schema) => schema.required(),
      }),
  })
*/

/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { t } from "i18next"
import { SizePopup_TP } from "../../../pages/coding/coding-types-and-helpers"
import {
  CategoryMainData_TP,
  CategorySize_TP,
  Category_TP,
  SetState_TP,
  Units_TP,
} from "../../../types"
import { prepareItemsToShowInCaseOfTa2m } from "../../../utils/helpers"
import { Select } from "../../molecules"
import SelectCategory from "../reusableComponants/categories/select/SelectCategory"
///
/////////// Types
///
type SelectCategorySizeProps_TP = {
  initialCategory?: Category_TP
  showNotDefinedType?: boolean
  categoryName: string
  sizeTypeName: string
  theSizeName: string
  sizeTypeFieldKey?: "id" | "value"
  theSizeFieldKey?: "id" | "value"
  setItemsToShowInCaseOfTa2m?: SetState_TP<CategoryMainData_TP[]>
  setAwzanItems?: SetState_TP<CategoryMainData_TP[] | undefined>
  sizes?: SizePopup_TP[]
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectCategorySize = ({
  initialCategory,
  categoryName,
  sizeTypeName,
  theSizeName,
  showNotDefinedType = false,
  sizeTypeFieldKey = "id",
  theSizeFieldKey = "id",
  setItemsToShowInCaseOfTa2m,
  setAwzanItems,
  sizes,
}: SelectCategorySizeProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { values, setFieldError, setFieldTouched, setFieldValue } =
    useFormikContext<{ sizeIsRequired: boolean;[key: string]: any }>()
  ///
  /////////// STATES
  ///
  const [selectedCategory, setSelectedCategory] = useState<
    Category_TP | undefined
  >(initialCategory)
  const [selectedSizeTypeOption, setSelectedSizeTypeOption] =
    useState<CategorySize_TP | null>()

  const [theSelectedSize, setTheSelectedSize] = useState<Units_TP | null>()

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (initialCategory) {
      if (initialCategory.has_size) setFieldValue("sizeIsRequired", true)
    }
  }, [JSON.stringify(initialCategory)])
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      {initialCategory ? (
        <div className="">
          <h2>{t("category")}</h2>
          <p className="px-4 h-9 py-[.17rem] bg-gray-200 shadows rounded-md mt-1">
            {initialCategory.name}
          </p>
        </div>
      ) : (
        <SelectCategory
          label={t("category")}
          showNotDefinedType={showNotDefinedType}
          name={categoryName}
          all={true}
          onChange={(option) => {
            if (sizes && setItemsToShowInCaseOfTa2m) {
              if (option.type === "multi") {
                const items = prepareItemsToShowInCaseOfTa2m(option, sizes)
                items && setItemsToShowInCaseOfTa2m(items)
              } else {
                setItemsToShowInCaseOfTa2m([])
              }
            }

            if (setAwzanItems) {
              if (option.type === "multi") {
                setAwzanItems(option.items)
              } else {
                setAwzanItems(undefined)
              }
            }
            if (selectedCategory?.id !== option.id) {
              setSelectedSizeTypeOption(null)
              setFieldValue(sizeTypeName, "")
              setTheSelectedSize(null)
              setFieldValue(theSizeName, "")
              // setFieldValue("category_value", option.value)
              setSelectedCategory(option)
            }
            if (!!option.has_size) {
              setFieldValue("sizeIsRequired", true)
              // setFieldValue("category_value", option.value)
            } else {
              setFieldValue("sizeIsRequired", false)
              // setFieldValue("category_value", option.value)
            }
          }}
        />
      )}

      {/* ---------------------------------- */}
      {!!values.sizeIsRequired &&
        !!selectedCategory &&
        !!selectedCategory.category_sizes?.length && (
          <>
            <Select
              onChange={(option) => {
                // @ts-ignore
                if (selectedSizeTypeOption?.id !== option?.id) {
                  setTheSelectedSize(null)
                  setFieldValue(theSizeName, "")
                  // setFieldValue("sizeType_value", option!.value)
                  // @ts-ignore
                  setSelectedSizeTypeOption(option)
                }
              }}
              value={selectedSizeTypeOption && selectedSizeTypeOption}
              fieldKey={sizeTypeFieldKey}
              name={sizeTypeName}
              label="نوع المقاس"
              placeholder="نوع المقاس"
              id="select-size-type"
              options={selectedCategory.category_sizes?.map((size) => ({
                ...size,
                value: size.type,
                label: size.type,
              }))}
            />

            <Select
              onChange={(option) => {
                // @ts-ignore
                setTheSelectedSize(option)
                // setFieldValue("sizeNumber_value", option!.value)
              }}
              isDisabled={!!!selectedSizeTypeOption}
              value={theSelectedSize && theSelectedSize}
              fieldKey={theSizeFieldKey}
              name={theSizeName}
              label="المقاس"
              placeholder="المقاس"
              id="select-size-number"
              options={selectedCategory.category_sizes
                ?.find((size) => size.id === selectedSizeTypeOption?.id)
                ?.units.map((unit) => ({
                  ...unit,
                  value: unit.value,
                  label: unit.value,
                }))}
            />
          </>
        )}
    </>
  )
}
