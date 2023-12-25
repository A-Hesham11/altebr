/////////// IMPORTS
///
import { Formik } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Header } from "../../../components/atoms/Header"
import { useFetch, useLocalStorage } from "../../../hooks"
import { useGetQueryData } from "../../../hooks/useGetQueryData"
import { Category_TP, SelectOption_TP, SetState_TP } from "../../../types"
import { notify } from "../../../utils/toast"
import {
  DiamondSanadBand_TP,
  GoldCodingSanad_initialValues_TP,
  GoldSanadBand_TP,
  GoldSanad_TP,
  SizePopup_TP,
  codingDiamondSanad_initialValues,
  codingDiamondSanad_schema,
  diamondCodingStoneValues_TP
} from "../coding-types-and-helpers"
import { AccessoriesCodingSanadFormHandler } from "./AccessoriesCodingSanadFormHandler"
///
/////////// Types
///
type CodingSanadProps_TP = {
  addedPieces: GoldCodingSanad_initialValues_TP[]
  setAddedPieces: SetState_TP<GoldCodingSanad_initialValues_TP[]>
  stage: number
  setStage: SetState_TP<number>
  selectedSanad: GoldSanad_TP | undefined
  setSelectedSanad: SetState_TP<GoldSanad_TP | undefined>
}
/////////// HELPER VARIABLES & FUNCTIONS
///
const maxPiecesNumber = 30
///
export const CodingSanad = ({
  setAddedPieces,
  addedPieces,
  stage,
  setStage,
  selectedSanad,
  setSelectedSanad,
}: CodingSanadProps_TP) => {
  /////////// VARIABLES
  ///
  const { sanadId } = useParams()
  const [addedPiecesLocal, setAddedPiecesLocal] = useLocalStorage<
    GoldCodingSanad_initialValues_TP[]
  >(`addedPiecesLocal_${sanadId}`)

  ///
  /////////// CUSTOM HOOKS
  ///
  const categories = useGetQueryData<Category_TP[]>(["categories"])

  const { data: categoryOptions } = useFetch<SelectOption_TP[]>({
    endpoint: "classification/api/v1/categories",
    queryKey: ["categories"],
    enabled: !!!categories,
    select: (categories) => {
      return categories.map((category: any) => ({
        id: category.id,
        label: category.name,
        name: category.name,
        value: category.id,
      }))
    },
  })
  ///
  /////////// STATES
  ///

  const [sizes, setSizes] = useState<SizePopup_TP[]>([])

  const [stones, setStones] = useState<diamondCodingStoneValues_TP[]>([])

  const [detailedWeight_total, setDetailedWeight_total] = useState<
    number | undefined
  >()

  const [activeBand, setActiveBand] = useState<DiamondSanadBand_TP | undefined>()

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    // const x = OTF(addedPieces)
    // localStorage.setItem(`addedPiecesLocal_${sanadId}`, JSON.stringify(x))

    setAddedPiecesLocal(addedPieces)
  }, [addedPieces])
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const isAbleToCodeMore = () => {
    let goAhead = true

    if (addedPieces.length === maxPiecesNumber - 2) {
      notify(
        "info",
        `قمت بإدخال عدد ${addedPieces.length + 1} قطع وباقي قطعة واحدة`
      )
    }

    if (addedPieces.length === maxPiecesNumber) {
      notify("error", "قمت بإدخال الحد الأقصي للقطع")
      goAhead = false
    }
    return goAhead
  }

  
  const updateBandWithNewWeight = (
    values: GoldCodingSanad_initialValues_TP
    ) => {
      // const otherStoneWeight = stones.reduce((acc , curr)=>{
      //   return +acc + Number(curr.weight)
      // },0)
      // const accessoryStoneWeight = stones.reduce((acc , curr)=>{
      //   return +acc + Number(curr.accessoryWeight)
      // },0)
      if (activeBand) {
      const newBand = () => {
        if (stones.some((stone) => stone.stone_type === "not_added")) {
          const notAddedStones = stones.filter(
            (stone) => stone.stone_type === "not_added"
          )
          const tableWeight = notAddedStones.reduce(
            (acc, curr) => {
              return curr.stone_id == '70' ?  +acc + +curr.accessoryWeight : +acc + +curr.weight
            },
            0
          )

          setAddedPieces((curr) => [
            ...curr,
            {
              ...values,
              front_key: crypto.randomUUID(),
              mezan_weight: values.weight - +tableWeight * 0.2,
              front_key_twred: activeBand.front_key_twred
            },
          ])

          return {
            ...activeBand,
            leftWeight:
              activeBand.leftWeight - (values.weight - +tableWeight * 0.2),
              leftCostItem: +activeBand.leftCostItem - +values.cost_item,
              // leftWeightother: +activeBand?.other_stones_weight - +otherStoneWeight,
              // leftWeightAccessory: +activeBand?.leftWeightAccessory - +accessoryStoneWeight,
              leftAccessoryNumber: activeBand?.leftAccessoryNumber,
              front_key_twred: activeBand.front_key_twred
          }
        } else {
          setAddedPieces((curr) => [
            ...curr,
            {
              ...values,
              front_key: crypto.randomUUID(),
              mezan_weight: values.weight,
              karat_value: activeBand?.accessoryKarat,
              front_key_twred:activeBand.front_key_twred
            },
          ])
          return {
            ...activeBand,
            leftWeight: +activeBand.leftWeight - +values.weight,
            leftCostItem: +activeBand.leftCostItem - +values.cost_item,
            // leftWeightother:  +activeBand?.other_stones_weight - +otherStoneWeight,
            // leftWeightAccessory:  +activeBand?.leftWeightAccessory - +accessoryStoneWeight,
            leftAccessoryNumber: activeBand?.leftAccessoryNumber,
            karat_value: activeBand?.accessoryKarat,
            front_key_twred:activeBand.front_key_twred
          }
        }
      }

      const theBand: GoldSanadBand_TP = newBand()
      setActiveBand(theBand)

      // const activeBandIndex = selectedSanad?.items.findIndex(band => band.id === activeBand.id)

      setSelectedSanad((curr) => ({
        ...curr,
        items: curr?.items.map((band) => {
          if (band.id === activeBand.id) {
            return theBand
          } else {
            return band
          }
        }),
      }))
    }
  }

  function finalSubmit(values: GoldCodingSanad_initialValues_TP) {
    if (!isAbleToCodeMore()) return

    updateBandWithNewWeight(values)
    // setAddedPieces((curr) => [...curr, { ...values, stones }])
    // setAddedPieces((curr) => [
    //   ...curr,
    //   { ...values, front_key: crypto.randomUUID() },
    // ])

    // setActiveBand((curr) => {
    //   return { ...curr, leftWeight: curr?.leftWeight - values.weight }
    // })
  }
  ///
  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Header header={t("accessories coding")} className="text-2xl"/>
        <div className="flex w-full flex-col gap-6">
          <Formik
            validationSchema={codingDiamondSanad_schema}
            initialValues={codingDiamondSanad_initialValues}
            onSubmit={(values) => {
              const isStonesHaveAccessory = stones?.find(stone=> stone?.stone_id == 70) || false
              notify("success", `${t("piece has been added")}`)
              // VARS
              const selectedCateg = categories?.find(
                (categ) => categ.id === values.category_id
              )
              const hasSize = selectedCateg?.has_size
              const isTa2m = selectedCateg?.type === "multi"
              const thereAreSizes = !!sizes.length
              const thereAreWeightItems = !!values.weightitems?.length
              //--------------------------
              let {
                size_type,
                size_unit_id,
                sizeIsRequired,
                left_weight,
                stones: Omitted,
                weightitems,
                init_wage,
                front_key_twred,
                ...baseValues
              } = values

              if (values.has_stones && !!stones?.length) {
                baseValues = { ...baseValues, stones }
              }

              // ---> فير محدد او صنف عادي - صنف له مقاس - تم اضافة المقاس
              if (hasSize && !!values.size_type && !!values.size_unit_id) {
                const vals = {
                  ...baseValues,
                  size_type: values.size_type,
                  size_unit_id: values.size_unit_id,
                  front_key_twred: values.front_key_twred,
                }
                finalSubmit(vals)
                return
              }

              // ---> غير محدد - طقم - يوجد مقاسات مفصلة
              if (isTa2m) {
                const vals = {
                  ...baseValues,
                  ...(thereAreSizes && { sizes }),
                  ...(thereAreWeightItems && {
                    weightitems: values.weightitems,
                  }),
                }
                finalSubmit(vals)
                return
              }
              finalSubmit(baseValues)
            }}
          >
            {({ values, setFieldValue, submitForm, errors }) => (
              <>
                <AccessoriesCodingSanadFormHandler
                  selectedSanad={selectedSanad}
                  setSelectedSanad={setSelectedSanad}
                  detailedWeight_total={detailedWeight_total}
                  setDetailedWeight_total={setDetailedWeight_total}
                  sizes={sizes}
                  setSizes={setSizes}
                  stones={stones}
                  setStones={setStones}
                  addedPieces={addedPieces}
                  setAddedPieces={setAddedPieces}
                  stage={stage}
                  setStage={setStage}
                  activeBand={activeBand}
                  setActiveBand={setActiveBand}
                />
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}
