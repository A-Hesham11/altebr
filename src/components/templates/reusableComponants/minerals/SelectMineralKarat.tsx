/////////// IMPORTS
///
///
/////////// Types
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useFetch } from "../../../../hooks"
import { Select } from "../../../molecules"
import AddMinerals from "../../systemEstablishment/minerals/AddMinerals"

/////////// HELPER VARIABLES & FUNCTIONS
///
type SelectMineralKarat_TP = {
  editData?: any
  showLabel?: boolean
  showMineral?: boolean
  showMineralKarat?: boolean
}
///
export const SelectMineralKarat = ({ editData, showLabel, showMineral = true, showMineralKarat = true }: SelectMineralKarat_TP) => {
  /////////// VARIABLES
  ///
  const [newValue, setNewValue] = useState<undefined | null>()
  const [mineralKaratValue, setMineralKaratValue] = useState<undefined | null>()
  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, isSubmitting , values  } = useFormikContext<{
    [key: string]: any
  }>()
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
  const {
    data: karats,
    isLoading: karatLoading,
    isError: karatError,
    isFetching,
    refetch
  } = useFetch({
    endpoint: `classification/api/v1/karat_minerals/${newValue?.id}`,
    queryKey: ["minerals_karat"],
    select: (karats) => {
      return karats.map((item) => ({
        value: item.karatmineral,
        label: `${item.karatmineral}`,
        equivalent: item.value,
        name: item?.mineral,
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
    refetch()
  }, [newValue])
  
  useEffect(() => {
    setNewValue(null)
    setMineralKaratValue(null)
  }, [isSubmitting])
  

  ///
  return (
    <div className="col-span-1 relative">
      <div className="flex items-center justify-center gap-x-4">
        {
          showMineral &&
          <Select
            id="mineral"
            label={showLabel ? `${t("mineral type")}` : ''}
            name="mineral_id"
            placeholder={`${t("المعدن")}`}
            loadingPlaceholder={`${t("loading")}`}
            options={minerals}
            fieldKey="id"
            value={newValue}
            onChange={(option) => {
              //@ts-ignore
              setNewValue(option)
              setFieldValue('mineral_value', option.label)
            }}
            loading={isLoading}
            creatable
            //@ts-ignore
            CreateComponent={AddMinerals}
          />
        }
        {
          showMineralKarat &&
          <Select
            fieldKey="id"
            name="karatmineral_id"
            label={showLabel ? "عيار المعدن" : ''}
            placeholder="العيار"
            id="karat_minerals"
            options={karats}
            loadingPlaceholder={`${t("loading")}`}
            loading={isFetching}
            isDisabled={karats?.length === 0}
            value={mineralKaratValue}
            onChange={(option) => {
              setFieldValue('karat_value', option.label)
              setMineralKaratValue(option)
            }}
          />
        }
      </div>

    </div>
  )
}