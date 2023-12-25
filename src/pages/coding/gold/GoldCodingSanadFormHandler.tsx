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
import { useFetch, useIsRTL, useLocalStorage } from "../../../hooks"
import { CategoryMainData_TP, SetState_TP } from "../../../types"
import {
  karatStocks,
  prepareItemsToShowInCaseOfTa2m,
} from "../../../utils/helpers"
import {
  GoldCodingSanad_initialValues_TP,
  GoldCodingStoneValues_TP,
  GoldSanadBand_TP,
  GoldSanad_TP,
  SizePopup_TP,
} from "../coding-types-and-helpers"
import { AddStone } from "./AddStone"
import { GoldItemCodingForm } from "./GoldItemCodingForm"
///
/////////// Types
///
type GoldCodingSanadFormHandlerProps_TP = {
  selectedSanad: GoldSanad_TP | undefined
  setSelectedSanad: SetState_TP<GoldSanad_TP | undefined>
  detailedWeight_total: number | undefined
  setDetailedWeight_total: SetState_TP<number | undefined>
  addedPieces: GoldCodingSanad_initialValues_TP[]
  setAddedPieces: SetState_TP<GoldCodingSanad_initialValues_TP[]>
  stones: GoldCodingStoneValues_TP[] | undefined
  setStones: SetState_TP<GoldCodingStoneValues_TP[]>
  sizes: SizePopup_TP[]
  setSizes: SetState_TP<SizePopup_TP[]>
  stage: number
  setStage: SetState_TP<number>
  activeBand: GoldSanadBand_TP | undefined
  setActiveBand: SetState_TP<GoldSanadBand_TP | undefined>
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const GoldCodingSanadFormHandler = ({
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
}: GoldCodingSanadFormHandlerProps_TP) => {

  /////////// VARIABLES
  ///
  const { sanadId } = useParams()

  const [editWage, setEditWage] = useState("")

  const [selectedSanadLocal, setSelectedSanadLocal] =
  useLocalStorage<GoldSanad_TP>(`selectedSanadLocal_${sanadId}`)
  
  const totalLeftWeight = selectedSanad?.items?.map(item => item?.leftWeight)?.reduce((acc, curr) => {
    return acc + curr
  }, 0)

  const columns: Column[] = [
    {
      name: "category",
      label: t("classification"),
      Cell: ({ value }) => <span>{value?.name}</span>,
    },
    {
      name: "goldWeight",
      label: t("goldWeight"),
    },
    {
      name: "goldKarat",
      label: t("goldKarat"),
    },
    {
      name: "wage",
      label: t("wage"),
    },
    {
      name: "leftWeight",
      label: t("leftWeight"),
    },
  ]

  // TOTALS
  const total24 = addedPieces
    .filter((piece) => piece.karat_value === "24")
    .reduce((acc, { weight }) => acc + +weight, 0)
  const total22 = addedPieces
    .filter((piece) => piece.karat_value === "22")
    .reduce((acc, { weight }) => acc + +weight, 0)
  const total21 = addedPieces
    .filter((piece) => piece.karat_value === "21")
    .reduce((acc, { weight }) => acc + +weight, 0)
  const total18 = addedPieces
    .filter((piece) => piece.karat_value === "18")
    .reduce((acc, { weight }) => acc + +weight, 0)
  const totalWages = addedPieces?.reduce(
    (acc, { wage, weight }) => acc + +wage * +weight,
    0
  )

  const totals = [
    {
      name: "إجمالي محول 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value:
        total24 +
        total22 * +karatStocks.find((item) => item.karat === "22")?.value! +
        total21 * +karatStocks.find((item) => item.karat === "21")?.value! +
        total18 * +karatStocks.find((item) => item.karat === "18")?.value!,
    },
    {
      name: "إجمالي وزن 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total24,
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total22,
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total21,
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total18,
    },
    {
      name: "إجمالي الأجور",
      key: crypto.randomUUID(),
      unit: t("SRA"),
      value: totalWages,
    },
  ]

  ///
  /////////// CUSTOM HOOKS
  ///
  const { values, setFieldValue, setFieldError, submitForm, isSubmitting, isValid } =
  useFormikContext<GoldCodingSanad_initialValues_TP>()
  const isRTL = useIsRTL()

  /* FETCH SANAD */
  const {
    data: sanadData,
    isSuccess: sanadDataSuccess,
    failureReason,
    isLoading,
  } = useFetch<GoldSanad_TP>({
    endpoint: `tarqimGold/api/v1/open-bonds/${sanadId}`,
    queryKey: ["goldCodingSanads", sanadId!],
    enabled: !!sanadId && !!!selectedSanadLocal,
    onSuccess: (sanad) => {
      setSelectedSanadLocal(sanad)
      setSelectedSanad(sanad)
      // setActiveBand(sanad.items[0])
      //////------------------------------------
      // setFieldValue("bond_id", sanad.id)
      // setFieldValue("band_id", sanad.items[0].id)
      // setFieldValue("category_id", sanad.items[0].category.id)
      // setFieldValue("left_weight", sanad.items[0].leftWeight)
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
  // useEffect(() => {
  //   if (selectedSanadLocal) {
  //     const updatedSanadItems = selectedSanadLocal?.items.filter(
  //       (band) => +band.leftWeight >= 1
  //     )
  //     const updatedSanad = { ...selectedSanadLocal, items: updatedSanadItems }
  //     setSelectedSanad(updatedSanad)
  //   }
  // }, []) 

  useEffect(() => {
    if (!!selectedSanad) {
      setFieldValue("bond_id", selectedSanad.id)
      // const updatedSanadItems = selectedSanad?.items.filter(
      //   (band) => +band.leftWeight >= 1
      // )
      // const updatedSanad = { ...selectedSanad, items: updatedSanadItems }
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
      setFieldValue("init_wage", activeBand.wage)
      setFieldValue("wage", editWage ? +editWage : +activeBand.wage)
      setStones([])

      setItemsToShowInCaseOfTa2m([])
      setSizes([])
    }

    if (!!activeBand && activeBand.category.id > 1) {
      const items = prepareItemsToShowInCaseOfTa2m(activeBand.category, sizes)
      items && setItemsToShowInCaseOfTa2m(items)
      // prepareItemsToShowInCaseOfTa2m
      setFieldValue("category_id", activeBand.category.id)
    } else if (!!activeBand && activeBand.category.id == 1) {
      setFieldValue("category_id", "")
      setFieldValue("weightitems", [])
    }

    // if has size
    if (
      !!activeBand &&
      !!activeBand.category.has_size &&
      activeBand.category.type !== "multi"
    ) {
      setFieldValue("sizeIsRequired", true)
    } else {
      setFieldValue("sizeIsRequired", false)
    }
  }, [activeBand, isSubmitting])

 

  useEffect(() => {
    if (!!activeBand) {
      // setItemsToShowInCaseOfTa2m([])
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
      {isLoading && <Loading mainTitle="تحميل السند" />}
      {!!selectedSanad && !!selectedSanad?.items?.length && (
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
          <div className="flex flex-col gap-4 bg-lightGreen rounded-lg bg-opacity-50 p-4 shadows">
            <div className="flex flex-col gap-3">
              <div className=" flex items-center w-full justify-between">
                <Header
                  header={t("gold supply voucher totals")}
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
            <div className="flex flex-col gap-1">
              <Header header={t("gold supply voucher data")} className="mb-1 text-lg" />

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
            </div>
          </div>
          {/* {sanadData.boxes.map()} */}
          <div className="flex flex-col gap-3">
            <Header header={t("coding totals")} className=" text-lg" />
            <ul className="grid grid-cols-6 gap-6">
              {totals.map(({ name, key, unit, value }) => (
                <BoxesDataBase variant="secondary" key={key}>

                    <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl" >{name}</p>
                    <p className="bg-white px-2 py-[7px] text-black rounded-b-xl" >
                      {value} {t(unit)}
                    </p>

                </BoxesDataBase>
              ))}
            </ul>
          </div>
          {
          totalLeftWeight === 0 ?
              <h2 className="mt-16 mb-16 text-center text-mainGreen text-2xl font-bold">{t('The bond is fully numbered')}</h2>
              :
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
                        <GoldItemCodingForm
                          setItemsToShowInCaseOfTa2m={setItemsToShowInCaseOfTa2m}
                          itemsToShowInCaseOfTa2m={itemsToShowInCaseOfTa2m}
                          detailedWeight_total={detailedWeight_total}
                          setDetailedWeight_total={setDetailedWeight_total}
                          sizes={sizes}
                          setSizes={setSizes}
                          activeBand={activeBand}
                          setActiveBand={setActiveBand}
                          selectedSanad={selectedSanad}
                          setEditWage={setEditWage}
                        />
                      )}
                    </div>
                  </div>
                </Accordion>

                {/* الحجر */}
                {(!!values.has_stones && values.left_weight) ? (
                  <AddStone stones={stones} setStones={setStones} />
                ) : (<div></div>)}
              </>
          }
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
            {
              totalLeftWeight !== 0 &&
              <Button action={() => {
                submitForm()
                // if(isValid) setFieldValue("left_weight", activeBand?.leftWeight - values.weight)
              }}>{t("save")}</Button>
            }
          </div>

        </>
        // </HandleBackErrors>
      )}

      {!!selectedSanad && !!!selectedSanad?.items?.length && (
        <h2>لا يوجد بنود في السند</h2>
      )}
    </>
  )
}
