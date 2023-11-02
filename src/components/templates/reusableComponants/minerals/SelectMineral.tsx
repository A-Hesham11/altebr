/////////// IMPORTS
///
///
/////////// Types
///
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useFetch } from "../../../../hooks"
import { Select } from "../../../molecules"
import AddMinerals from "../../systemEstablishment/minerals/AddMinerals"

/////////// HELPER VARIABLES & FUNCTIONS
///
type SelectMineral_TP = {
    editData?: any
    showLabel?:boolean
}
///
export const SelectMineral = ({ editData , showLabel }: SelectMineral_TP) => {
    /////////// VARIABLES
  
    ///
    const [newValue, setNewValue] = useState()
    ///
    /////////// CUSTOM HOOKS
    ///
    const {
      data: minerals,
      isLoading,
      isError,
    } = useFetch({
      endpoint: "classification/api/v1/minerals?per_page=10000",
      queryKey: ["minerals"],
      select: (minerals) => {
        return minerals.map((item) => ({
          value: item.name_ar,
          label: `${item.name_ar}`,
          id: item.id,
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
    if (editData)
      setNewValue({
        id: editData?.id,
        value: editData?.value,
        label: editData?.mineral || "اختر معدن",
      })
  }, [editData])

    ///

    ///
    return (
      <>
        <Select
          id="mineral"
          label={showLabel ? `${t("mineral type")}` : ''}
          name="mineral_id"
          placeholder={`${t("mineral")}`}
          loadingPlaceholder={`${t("loading")}`}
          options={minerals}
          fieldKey="id"
          value={newValue}
          onChange={(option) => {
            //@ts-ignore
            setNewValue(option)
          }}
          loading={isLoading}
          creatable
          //@ts-ignore
          CreateComponent={AddMinerals}
        />
      </>
    )
}