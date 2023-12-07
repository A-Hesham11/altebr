/////////// IMPORTS
///
///
/////////// Types
///

import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import {
  BaseInputField,
  CheckBoxField,
  InnerFormLayout,
  OuterFormLayout,
  Select,
} from "../../../../molecules"
import { Button } from "../../../../atoms"
import RadioGroup from "../../../../molecules/RadioGroup"
import { SelectSize } from "../../../../size/SelectSize"
import { notify } from "../../../../../utils/toast"

/////////// HELPER VARIABLES & FUNCTIONS
///
type CategoryMainDataProps_TP = {
  editData?: any
  title?: string
  isLoading: boolean
  isSuccessPost?: boolean
  resetData?: () => void
  categoryRefetch: () => void
  props?: any
  categoryOptions: any
  handleEditedItems: any
  categoryLoading: any
}
///
export const CategoryMainData = ({
  resetData,
  title,
  isLoading,
  isSuccessPost,
  handleEditedItems,
  categoryRefetch,
  editData,
  categoryOptions,
  props,
  categoryLoading,
}: CategoryMainDataProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { resetForm , values } = useFormikContext<any>()

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///
  useEffect(() => {
    resetForm()
    if (resetData) resetData()
  }, [isSuccessPost])

  ///
  return (
    <>
      <OuterFormLayout header={title}>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-5">{t("categories")}</h2>
          <div className="flex justify-between">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-bold">{t("category type")}:</span>
              <RadioGroup
                name="type"
                onChange={(val) => {
                  if (val === "multi") {
                    categoryRefetch()
                    props.values.has_size = false
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <RadioGroup.RadioButton
                    value="single"
                    label={`${t("single category")}`}
                    id="single_category"
                  />
                  <RadioGroup.RadioButton
                    value="multi"
                    label={`${t("multiple categories")}`}
                    id="multiple_categories"
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-bold">{t("Selling policy")}:</span>
              <RadioGroup name="selling_type">
                <div className="flex items-center gap-3">
                  <RadioGroup.RadioButton
                    value="part"
                    label={`${t("sell by piece")}`}
                    id="sell_by_piece"
                  />
                  <RadioGroup.RadioButton
                    value="all"
                    label={`${
                      props.values.type !== "multi"
                        ? t("Selling by weight")
                        : t("Selling by total")
                    }`}
                    id="sell_in_bulks"
                  />
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="grid grid-cols-4 mb-5 gap-3 text-start">
            <BaseInputField
              id="category_name_ar"
              label={`${t("category name in arabic")}`}
              name="name_ar"
              type="text"
              placeholder={`${t("category name in arabic")}`}
              defaultValue={editData ? editData.name : ""}
              required
            />
            <BaseInputField
              id="category_name_en"
              label={`${t("category name in english")}`}
              name="name_en"
              type="text"
              placeholder={`${t("category name in english")}`}
              required
            />
            <div className="col-span-2">
              {props.values.type == "multi" && (
                <Select
                  label={`${t("choose categories")}`}
                  name="items"
                  id="items"
                  isMulti={true}
                  required={true}
                  defaultValue={handleEditedItems(props.values.items)}
                  placeholder={`${t("choose categories")}`}
                  loadingPlaceholder="Loading..."
                  options={categoryOptions}
                  loading={categoryLoading}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center font-bold ">
                {t("category policy")}:
              </span>
              <CheckBoxField
                label={`${t("accepts the addition of a chain")}`}
                name="has_selsal"
                id="has_selsal"
              />
            </div>
            {props.values.type == "single" && (
              <div className="flex items-center gap-3">
                <span className="flex items-center font-bold ">
                  {t("size policy")}:
                </span>
                <CheckBoxField
                  label={`${t("got size")}`}
                  type="checkbox"
                  id="has_size"
                  name="has_size"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2">
            {props.values.has_size == true &&
              props.values.type === "single" && (
                <SelectSize editData={editData} />
              )}
          </div>
          {/* {sizes.length > 0 && props.values.has_size && (
                  <div className="grid grid-cols-6 gap-5 mb-5 text-center">
                    {sizes.map((size: SizeProps_TP2, index) => (
                      <div key={index} className="bg-white p-3 text-mainGreen shadow-md grid grid-cols-12 rounded-xl hover:bg-mainGreen hover:text-white">
                        <div className="col-span-9 flex flex-col">
                          <div className="flex justify-around mb-2 align-middle gap-x-4">
                            <div className="truncate">
                              <span className="">{`${t("start")}`}: </span>
                              <span className="mx-1 text-mainOrange">
                                {size.start}
                              </span>
                            </div>
                            <div className="truncate">
                              <span className="">{`${t("end")}`}: </span>
                              <span className="mx-1 text-mainOrange">
                                {size.end}
                              </span>
                            </div>
                          </div>
                          <div className="truncate">
                            <span className="">
                              {`${t("increase rate")}`}:{" "}
                            </span>
                            <span className="mx-1 text-mainOrange">
                              {size.increase}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="w-0.5 mx-auto bg-gray-300 h-full"></div>
                        </div>
                        <div className="col-span-2 flex justify-center items-center">
                          <SvgDelete
                            stroke="#ef4444"
                            action={() => deleteSize(index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )} */}
          <Button
            type="button"
            action={() => {
              if (
                props.values.has_size &&
                props.values.category_sizes.length <= 0 &&
                props.isValid
              )
                notify("error", `${t("category_sizes is required")}`)
              else props.submitForm()
            }}
            className="self-end"
            loading={isLoading}
          >
            {t("add")}
          </Button>
        </div>
      </OuterFormLayout>
    </>
  )
}
