/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../../../components/atoms"
import { Header } from "../../../components/atoms/Header"
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase"
import { Accordion } from "../../../components/molecules"
import NinjaTable from "../../../components/molecules/NinjaTable"
import RadioGroup from "../../../components/molecules/RadioGroup"
import { Column } from "../../../components/molecules/table/types"
import { Loading } from "../../../components/organisms/Loading"
import { useFetch, useLocalStorage } from "../../../hooks"
import { CategoryMainData_TP, SetState_TP } from "../../../types"
import {
  prepareItemsToShowInCaseOfTa2m
} from "../../../utils/helpers"
import {
  DiamondSanadBand_TP,
  GoldCodingSanad_initialValues_TP,
  GoldSanadBand_TP,
  GoldSanad_TP,
  SizePopup_TP,
  diamondCodingStoneValues_TP
} from "../coding-types-and-helpers"
import { AddStone } from "./AddStone"
import { DiamondItemCodingForm } from "./DiamondItemCodingForm"
///
/////////// Types
///
type DiamondCodingSanadFormHandlerProps_TP = {
  selectedSanad: GoldSanad_TP | undefined
  setSelectedSanad: SetState_TP<GoldSanad_TP | undefined>
  detailedWeight_total: number | undefined
  setDetailedWeight_total: SetState_TP<number | undefined>
  addedPieces: GoldCodingSanad_initialValues_TP[]
  setAddedPieces: SetState_TP<GoldCodingSanad_initialValues_TP[]>
  stones: diamondCodingStoneValues_TP[] | undefined
  setStones: SetState_TP<diamondCodingStoneValues_TP[]>
  sizes: SizePopup_TP[]
  setSizes: SetState_TP<SizePopup_TP[]>
  stage: number
  setStage: SetState_TP<number>
  activeBand: DiamondSanadBand_TP | undefined
  setActiveBand: SetState_TP<DiamondSanadBand_TP | undefined>
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const DiamondCodingSanadFormHandler = ({
  selectedSanad,
  setSelectedSanad,
  detailedWeight_total,
  setDetailedWeight_total,
  setAddedPieces,
  addedPieces,
  stones,
  setStones,
  sizes,
  setSizes,
  stage,
  setStage,
  activeBand,
  setActiveBand,
}: DiamondCodingSanadFormHandlerProps_TP) => {
  const itemsCount = addedPieces.filter(piece => piece?.band_id === activeBand?.id)
  /////////// VARIABLES
  ///
  const { sanadId } = useParams()

  const [selectedSanadLocal, setSelectedSanadLocal] =
    useLocalStorage<GoldSanad_TP>(`selectedSanadLocal_${sanadId}`)
  const columns: Column[] = [
    {
      name: "category",
      label: t("category"),
      Cell: ({ value }) => <span>{value?.name}</span>,
    },
    {
      name: "mineral_name",
      label: t("mineral type"),
    },
    {
      name: "diamond_value",
      label: t("supplier currency value"),
    },
    {
      name: "diamond_value_ryal",
      label: t("diamond value ryal"),
    },
    {
      name: "leftCostItem",
      label: t("left cost"),
    },
    // {
    //   name: "goldWeight",
    //   label: t("mineral weight"),
    // },
    {
      name: "bandTotalWeight",
      label: t("total weight"),
    },
    {
      name: "leftWeight",
      label: t("mineral weight"),
    },
    {
      name: "leftWeightDiamond",
      label: t("diamond stone weight"),
    },
    // {
    //   name: "other_stones_weight",
    //   label: t("other_stones_weight"),
    // },
    {
      name: "leftWeightother",
      label: t("other stones weight"),
    },
    // { 
    //   name: "diamond_number",
    //   label: t("diamond_number"),
    //   Cell: (info)=> info?.value?.toFixed(0)
    // },
    {
      name: "leftDiamondNumber",
      label: t("left items count"),
      Cell: (info) => info?.value?.toFixed(0)
    },
    // {
    //   name: "diamond_stone_weight",
    //   label: t("diamond_stone_weight"),
    // },
  ]

  // TOTALS
  const totalWeight = selectedSanad?.items
    .map((item) => item?.goldWeight)
    ?.reduce((acc, curr) => {
      return acc + curr
    }, 0)

  const totalLeftWeight = selectedSanad?.items
    .map((item) => item?.leftWeight)
    ?.reduce((acc, curr) => {
      return acc + curr
    }, 0)

  const totalWeightDiamond = selectedSanad?.items
    .map((item) => item?.diamond_stone_weight)
    ?.reduce((acc, curr) => {
      return acc + curr
    }, 0)

  const totalLeftWeightDiamond = selectedSanad?.items
    .map((item) => item?.leftWeightDiamond)
    ?.reduce((acc, curr) => {
      return acc + curr
    }, 0)

  const totalOtherStonesWeight = selectedSanad?.items
    .map((item) => item?.other_stones_weight)
    ?.reduce((acc, curr) => {
      return acc + curr
    }, 0)

  const totalLeftOtherStonesWeight = selectedSanad?.items
    .map((item) => item?.leftWeightother)
    ?.reduce((acc, curr) => {
      return acc + curr
    }, 0)


  const totals = [
    {
      name: "إجمالي وزن المعدن",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: totalWeight,
    },
    {
      name: "إجمالي وزن المعدن المتبقي",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: totalLeftWeight,
    },
    {
      name: "إجمالي وزن الالماس",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: totalWeightDiamond,
    },
    {
      name: "إجمالي وزن الالماس المتبقي",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: totalLeftWeightDiamond,
    },
    {
      name: "إجمالي وزن الاحجار",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: totalOtherStonesWeight,
    },
    {
      name: "إجمالي وزن الاحجار المتبقي",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: totalLeftOtherStonesWeight,
    },

  ]

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    values,
    setFieldValue,
    setFieldError,
    submitForm,
    isSubmitting,
    isValid,
  } = useFormikContext<GoldCodingSanad_initialValues_TP>()


  /* FETCH SANAD */
  const {
    data: sanadData,
    failureReason,
    isLoading,
    isRefetching
  } = useFetch<GoldSanad_TP>({
    endpoint: `tarqimDiamond/api/v1/open-bonds/${sanadId}`,
    queryKey: [`DiamondCodingSanads/${sanadId}`],
    enabled: !!sanadId && !!!selectedSanadLocal,
    onSuccess: (sanad) => {
      setSelectedSanadLocal(sanad)
      setSelectedSanad(sanad)
      setFieldValue("bond_date", sanad.bond_date)
      setFieldValue("karat_value", sanad.items[0].goldKarat)
    },
  })
  ///
  /////////// STATES
  ///
  const [itemsToShowInCaseOfTa2m, setItemsToShowInCaseOfTa2m] = useState<
    CategoryMainData_TP[]
  >([])
  ///
  /////////// SIDE EFFECTS
  ///


  useEffect(() => {
    if (!!selectedSanad) {
      setFieldValue("bond_id", selectedSanad.id)
      setSelectedSanadLocal(selectedSanad)
      setFieldValue("bond_date", selectedSanad.bond_date)
    }
  }, [selectedSanad])

  ///-------------------
  useEffect(() => {
    if (!!activeBand) {
      setFieldValue("left_weight", activeBand.leftWeight)
      setFieldValue("band_id", activeBand.id)
      setFieldValue("karat_value", activeBand.goldKarat)
      setFieldValue("wage", activeBand.wage)
      setFieldValue("init_wage", activeBand.wage)
      setFieldValue("validateCostValue", activeBand?.leftCostItem)
      const isStonesHaveDiamond = stones?.find(stone => stone?.stone_id == 70) || false
      if (isStonesHaveDiamond)
        setStones([])

      setItemsToShowInCaseOfTa2m([])
      setSizes([])
    }

    if (!!activeBand && +activeBand.category?.id > 1) {
      const items = prepareItemsToShowInCaseOfTa2m(activeBand.category, sizes)
      items && setItemsToShowInCaseOfTa2m(items)
      // prepareItemsToShowInCaseOfTa2m
      setFieldValue("category_id", activeBand.category.id)
    } else if (!!activeBand && activeBand.category?.id == 1) {
      setFieldValue("category_id", "")
      setFieldValue("weightitems", [])
    }

    // if has size
    if (
      !!activeBand &&
      !!activeBand?.category?.has_size &&
      activeBand.category.type !== "multi"
    ) {
      setFieldValue("sizeIsRequired", true)
    } else {
      setFieldValue("sizeIsRequired", false)
    }
  }, [activeBand, isSubmitting])

  useEffect(() => {
    if (!!activeBand) {
      setSizes([])
    }
  }, [values.category_id])

  useEffect(() => {
    if (activeBand?.category?.type === "multi") {
      const items = prepareItemsToShowInCaseOfTa2m(activeBand?.category, sizes)
      if (items) setItemsToShowInCaseOfTa2m(items)
    }
  }, [sizes])
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      {!!!isLoading && failureReason && (
        <p>{failureReason.response.data.message}</p>
      )}
      {/* {(isLoading) && <Loading mainTitle="تحميل السند" />} */}
      {!!selectedSanad && !!selectedSanad.items.length && (
        // <HandleBackErrors errors={error?.response?.data?.errors}>
        <>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 shadows py-6 px-4 bg-lightGreen rounded-lg bg-opacity-50">
              <h3>{t("coding by weight")}</h3>
              <RadioGroup name="mezan_type">
                <RadioGroup.RadioButton
                  value="manual"
                  label={t("manual weight")}
                  id="manual"
                />
                <RadioGroup.RadioButton
                  value="mezan"
                  label={t("from balance")}
                  id="mezan"
                />
              </RadioGroup>
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-lightGreen rounded-lg bg-opacity-50 p-4 shadows ">
            <div className="flex flex-col gap-3 ">
              <div className=" flex items-center w-full justify-between">
                <Header
                  header={t("diamond supply voucher totals")}
                  className="text-lg"
                />
                <h4>
                  {t("bond number")} {" / "}
                  <span className="text-mainGreen">
                      { selectedSanad.id}
                  </span>
                </h4>
              </div>
              <ul className="grid grid-cols-5 gap-4">
                {selectedSanad.boxes.map(({ account, id, unit, value }) => (
                  <BoxesDataBase key={id}>
                    <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl">{t(account)}</p>
                    <p className="bg-white p-2 text-black h-[35%] rounded-b-xl">
                      {value.toFixed(2)} {t(unit)}
                    </p>
                  </BoxesDataBase>
                ))}
              </ul>
            </div>
            <div className=" flex flex-col gap-1">
              <Header header={t("diamond supply voucher data")} className="mb-1 text-lg " />
              {
                isRefetching ?
                  <Loading mainTitle="تحميل البنود" />
                  :
                  <div className="GlobalTable">
                    <NinjaTable<GoldSanadBand_TP>
                      data={selectedSanad.items}
                      columns={columns}
                      selection="single"
                      selected={activeBand}
                      // @ts-ignore
                      setSelected={setActiveBand}
                      creatable={false}
                    />
                  </div>
              }
            </div>
          </div>
          {/* {sanadData.boxes.map()} */}
          <div className="flex flex-col gap-3 ">
            <Header header={t("coding totals")} className=" text-lg " />
            <ul className="grid grid-cols-6 gap-6">
              {totals.map(({ name, key, unit, value }) => (
                <BoxesDataBase variant="secondary" key={key}>
                  <div className="flex flex-col h-28">
                    <p className="bg-mainOrange px-2 h-[65%] flex items-center justify-center rounded-t-xl">{name}</p>
                    <p className="bg-white py-2 h-[35%] text-black rounded-b-xl">
                      {value} {t(unit)}
                    </p>
                  </div>
                </BoxesDataBase>
              ))}
            </ul>
          </div>
          {totalLeftWeight === 0 ? (
            <h2 className="mt-16 mb-16 text-center text-mainGreen text-2xl font-bold">
              {t("The bond is fully numbered")}
            </h2>
          ) : (
            <>
              {/* بنود الترقيم */}
              <Accordion
                className=" bg-lightGreen"
                isInitiallyOpen={true}
                title={t("coding items")}
              >
                <div className="bg-lightGreen rounded-md p-4 mt-3">
                  <div className=" bg-white shadows mt-6 rounded-md p-4">
                    {!!activeBand && (
                      <DiamondItemCodingForm
                        setItemsToShowInCaseOfTa2m={setItemsToShowInCaseOfTa2m}
                        itemsToShowInCaseOfTa2m={itemsToShowInCaseOfTa2m}
                        detailedWeight_total={detailedWeight_total}
                        setDetailedWeight_total={setDetailedWeight_total}
                        sizes={sizes}
                        setSizes={setSizes}
                        activeBand={activeBand}
                        setActiveBand={setActiveBand}
                        selectedSanad={selectedSanad}
                      />
                    )}
                  </div>
                </div>
              </Accordion>

              {/* الحجر */}
              {!!values.has_stones && values.left_weight ? (
                <AddStone stones={stones} setStones={setStones} activeBand={activeBand} addedPieces={addedPieces} />
              ) : (
                <div></div>
              )}
            </>
          )}
          <div className="flex items-end justify-end gap-x-5">
            {/* submit البند */}
            {!!addedPieces.length && (
              <div className="relative">
                <span className="bg-mainGreen rounded-full  h-6 w-6 text-white text-center mb-2 absolute -top-4 z-50">
                  {addedPieces.length}
                </span>
                <Button bordered={true} action={() => setStage(2)}>
                  {t("preview")}
                </Button>
              </div>
            )}
            {totalLeftWeight !== 0 && (
              <Button
                action={() => {
                  submitForm()
                }}
              >
                {t("save")}
              </Button>
            )}
          </div>
        </>
        // </HandleBackErrors>
      )}

      {!!selectedSanad && !!!selectedSanad.items.length && (
        <h2>لا يوجد بنود في السند</h2>
      )}
    </>
  )
}
