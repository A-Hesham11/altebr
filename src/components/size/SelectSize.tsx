/////////// IMPORTS
///
//import classes from './SelectSize.module.css'
///
/////////// Types
///

import { t } from "i18next"
import { useEffect, useState } from "react"
import { useFetch } from "../../hooks"
import { CreateSizes } from "../CreateSizes"
import { Select } from "../molecules"

/////////// HELPER VARIABLES & FUNCTIONS
///
type SelectSize_TP = {
    editData?: any
}
///
export const SelectSize = ({ editData }: SelectSize_TP) => {
    console.log("🚀 ~ file: SelectSize.tsx:21 ~ SelectSize ~ editData:", editData)
    /////////// VARIABLES
    ///
    const [newValue, setNewValue] = useState()
    ///
    /////////// CUSTOM HOOKS
    ///
    const {
      data: sizes,
      isLoading,
      isError,
    } = useFetch({
      endpoint: "size/api/v1/sizes?per_page=10000",
      queryKey: ["sizes"],
      select: (sizes) => {
        return sizes.map((item) => ({
          value: item.type,
          label: `${item.type}`,
          id: item.id,
          units: item.units,
        }))
      },
    })


    ///
    /////////// STATES
    ///

    ///
    /////////// SIDE EFFECTS
    ///

    useEffect(() => {
        const best = editData?.category_sizes.map(editItem => {
            return {
                id: editItem.id || "",
                value: editItem.type || "",
                label: editItem.type || "اختر المقاس",
            }
        })
        setNewValue(best)
    }, [])

    ///

    ///
    return (
      <>
        <Select
          id="category_sizes"
          label={`${t("size type")}`}
          name="category_sizes"
          placeholder={`${t("sizes")}`}
          loadingPlaceholder={`${t("loading")}`}
          options={sizes}
          fieldKey="id"
          value={newValue}
          onChange={(option) => {
            //@ts-ignore
              setNewValue(option)
          }}
          loading={isLoading}
          creatable
          //@ts-ignore
          CreateComponent={CreateSizes}
        />
        {/* <Select
              onChange={(option) => {
                // @ts-ignore
                setTheSelectedSize(option)
                // setFieldValue("sizeNumber_value", option!.value)
              }}
            //   isDisabled={!!!selectedSizeTypeOption}
            //   value={theSelectedSize && theSelectedSize}
              fieldKey="id"
              name="size"
              label="المقاس"
              placeholder="المقاس"
              id="select-size-number"
              options={sizeValues}
            /> */}
      </>
    )
}