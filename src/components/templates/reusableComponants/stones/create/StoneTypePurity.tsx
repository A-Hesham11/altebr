/////////// IMPORTS
///
///
/////////// Types
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useFetch } from "../../../../../hooks"
import { Select } from "../../../../molecules"
import SelectStoneType from "../select/SelectStoneType"

/////////// HELPER VARIABLES & FUNCTIONS
///
type SelectStoneyType_TPPurity = {
  editData?: any
  showLabel?: boolean
  showDiamond?: boolean
  isClearable?: boolean
}
///
export const SelectStoneyTypePurity = ({ editData, showLabel, showDiamond , isClearable }: SelectStoneyType_TPPurity) => {  
  /////////// VARIABLES
  ///
  const [newValue, setNewValue] = useState()
  const [purityValue, setPurityValue] = useState()
  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, values } = useFormikContext<{
    [key: string]: any
  }>()

  const {
    data: purities,
    isLoading: karatLoading,
    isError: karatError,
    isFetching,
    refetch
  } = useFetch({
    endpoint: `stones/api/v1/stone_purity/${values?.stone_id}`,
    queryKey: [`stone_purity/${values?.stone_id}`],
    select: (purities) => {
      return purities.map((item) => ({
        value: item.name,
        label: `${item.name}`,
        name: item?.name,
        id: item.id,
      }))
    },
    enabled: !!values?.stone_id,
  })
  const {
    data,
  } = useFetch({
    endpoint: `stones/api/v1/purities`,
    queryKey: [`stone_purity`]
  })


  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  useEffect(() => {
    refetch()
  }, [values?.stone_id])

  useEffect(() => {
    setNewValue(null)
    setPurityValue(null)
  }, [isFetching])


  ///
  return (
    <>
      <SelectStoneType
        label={`${t("stones types")}`}
        name="stone_id"
        field="id"
        showDiamond={showDiamond}
      />
      <Select
        fieldKey="id"
        name="purity_id"
        label={`${t("stone purity")}`}
        placeholder={`${t("purity")}`}
        id="purity_id"
        options={purities}
        loadingPlaceholder={`${t("loading")}`}
        loading={isFetching}
        isDisabled={!purities?.length}
        value={purityValue}
        onChange={(option) => {
          // setFieldValue('purity_value', option.label)
          setPurityValue(option)
        }}
        isClearable={isClearable}
      />

    </>
  )
}