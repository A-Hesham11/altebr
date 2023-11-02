/////////// IMPORTS
///

import { Formik, useFormikContext } from "formik"
import { t } from "i18next"
import { ChangeEvent, useEffect, useState } from "react"
import { Button } from "../../../components/atoms"
import {
  BaseInputField,
  CheckBoxField,
  Modal,
  TextAreaField
} from "../../../components/molecules"
import { DropFile } from "../../../components/molecules/files/DropFile"
import { SelectCategorySize } from "../../../components/templates/categories-sizes/SelectCategorySize"
import { Country_city_distract_markets } from "../../../components/templates/reusableComponants/Country_city_distract_markets"
import SelectColor from "../../../components/templates/reusableComponants/SelectColor"
import { useFetch, useIsRTL } from "../../../hooks"
import { CategoryMainData_TP, SetState_TP } from "../../../types"
import { prepareItemsToShowInCaseOfTa2m } from "../../../utils/helpers"
import { notify } from "../../../utils/toast"
import {
  DiamondSanadBand_TP,
  GoldCodingSanad_initialValues_TP,
  GoldSanad_TP,
  SizePopup_TP,
  addTa2mSizesSchema
} from "../coding-types-and-helpers"
import { SizesTable } from "../diamond/SizesTable"
///
/////////// Types
///
type ItemCodingFormProps_TP = {
  setItemsToShowInCaseOfTa2m: SetState_TP<CategoryMainData_TP[]>
  itemsToShowInCaseOfTa2m: CategoryMainData_TP[] | undefined
  detailedWeight_total: number | undefined
  setDetailedWeight_total: SetState_TP<number | undefined>
  sizes: SizePopup_TP[]
  setSizes: SetState_TP<SizePopup_TP[]>
  activeBand: DiamondSanadBand_TP
  setActiveBand: SetState_TP<DiamondSanadBand_TP | undefined>
  selectedSanad?: GoldSanad_TP
} 
type ProfitMarginValue_TP = {
  profit: 'factorial' | 'percentage'
  factorial: number | string
  percentage: number | string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AccessoriesItemCodingForm = ({
  setItemsToShowInCaseOfTa2m,
  itemsToShowInCaseOfTa2m,
  detailedWeight_total,
  setDetailedWeight_total,
  sizes,
  setSizes,
  activeBand,
  selectedSanad,
  setActiveBand,
}: ItemCodingFormProps_TP) => {
  /////////// VARIABLES

  const {data}  = useFetch({
    endpoint:'classification/api/v1/profitMargins',
    queryKey: ['profit'],
    select:(data)=>data[0]
  })

  const profitMargin:ProfitMarginValue_TP = data?.profit === 'factorial' ? {profit:'factorial', factorial:data?.value} : {profit:'percentage', percentage:data?.value}
  const profitMarginValue = profitMargin['profit'] === 'factorial' ? profitMargin['factorial'] : profitMargin['percentage'] || 0
  ///
  // const selectedBandLeftWeight =  selectedSanad.items.find((item)=>item?.number === activeBand?.number)?.leftWeight
  const hasSizes = !!sizes.length
  const isMultiCategory =
    activeBand.category?.id > 1 && activeBand.category.type === "multi"
  const hasItemsWithSizes = activeBand.category?.items?.some(
    (item) => item?.has_size
  )
  const [awzanItems, setAwzanItems] = useState(activeBand?.category?.items)

  // const awzanItems = activeBand.category.items
  const awzanItemsFormInitValues = awzanItems?.reduce(
    (acc, { id }) => ({
      ...acc,
      [id]: "",
    }),
    {}
  )
  ///
  /////////// CUSTOM HOOKS
  ///

  const { values, setFieldValue } =
  useFormikContext<GoldCodingSanad_initialValues_TP>()
  console.log(values);
  
  ///
  /////////// STATES
  ///

  const [addSizesModal, setAddSizesModal] = useState(false)
  const [weightItemsModal, setWeightItemsModal] = useState(false)
  const IsRTL = useIsRTL()

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (!!!itemsToShowInCaseOfTa2m?.length) {
      setAddSizesModal(false)
    }
  }, [!!itemsToShowInCaseOfTa2m?.length])

  useEffect(() => {
    if (activeBand && detailedWeight_total) {
      setDetailedWeight_total(undefined)
    }
  }, [activeBand])

  useEffect(() => {
    setAwzanItems(activeBand?.category?.items)
  }, [activeBand])
  
  useEffect(() => {
    // factorial
    setFieldValue('conversion_factor',selectedSanad?.factorial || 1)
  }, [])

  // go to bond that have left weight if previous left weight is 0

  useEffect(() => {
    const index = selectedSanad?.items.findIndex((item) => item.leftWeight)
    if (!activeBand.leftWeight) setActiveBand(selectedSanad?.items[index])
  }, [activeBand.leftWeight])

  useEffect(() => {
    setFieldValue('cost',Number(values?.cost_item) * Number(values?.conversion_factor) * (+values?.masarif_adafia / 100) + Number(values?.cost_item) * Number(values?.conversion_factor))
  }, [JSON.stringify(values)])

  useEffect(() => {
      profitMargin['profit'] === 'factorial' ?
      setFieldValue('selling_price',Number(values.cost)*Number(profitMarginValue))  
      :
      setFieldValue('selling_price',Number(values?.cost)*Number(profitMarginValue) + Number(values.cost))
  }, [values?.cost])
  
  
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const handleFixAllPieceData = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
  }

  const shouldRenderButton = () => {
    const hasItemsWithSizes = activeBand?.category?.items?.some(
      (item) => item?.has_size
    )
    const isSingleCategory = activeBand?.category?.type === "single"

    return (
      !!itemsToShowInCaseOfTa2m?.length &&
      (hasItemsWithSizes || isSingleCategory)
    )
  }

  const shouldRenderSizesTable =
    hasSizes && (!isMultiCategory || hasItemsWithSizes)
  ///

  useEffect(() => {
    const finalSumLeftWeight = +activeBand?.leftWeight 
    if (finalSumLeftWeight == 0)
      notify("info", `تم تغيير سطر الترقيم لان السطر السابق انتهي`)
  }, [activeBand])
  console.log("🚀 ~ file: AccessoriesItemCodingForm.tsx:177 ~ activeBand:", activeBand)
  
  

  // if(!selectedBandLeftWeight) return <h2 className="text-mainRed text-xl text-center" >{t('left weight for this bond is equal to 0')}</h2>

  return (
    <div className="grid items-center grid-cols-4 gap-x-4 gap-y-8 p-4 relative">
      {/* <div className="col-span-4">
        <Checkbox
          onChange={(e) => handleFixAllPieceData(e)}
          name="fixPieceData"
          id="fixPieceData"
          label="تثبيت معلومات القطعة"
        />
      </div> */}
      {/* غير محدد */}
      {/* {loadingCategories && activeBand.category?.id == 1 && <Spinner />} */}
      {activeBand.category?.id == 1 && (
        <SelectCategorySize
          sizes={sizes}
          setItemsToShowInCaseOfTa2m={setItemsToShowInCaseOfTa2m}
          setAwzanItems={setAwzanItems}
          categoryName="category_id"
          sizeTypeName="size_type"
          showNotDefinedType={false}
          theSizeName="size_unit_id"
        />
      )}
      {/* محدد صنف واحد له مقاس*/}
      {activeBand.category?.id > 1 &&
        activeBand.category.type === "single" &&
        !!activeBand.category.has_size && (
          <SelectCategorySize
            initialCategory={activeBand.category}
            categoryName="category_id"
            sizeTypeName="size_type"
            showNotDefinedType={false}
            theSizeName="size_unit_id"
          />
        )}
      {/* محدد صنف واحد ملهوش مقاس*/}
      {activeBand.category?.id > 1 &&
        activeBand.category.type === "single" &&
        !!!activeBand.category.has_size && (
          <div>
            <p>{t("category")}</p>
            <p className="shadows py-1 rounded-md bg-gray-300 h-9 mt-1 px-3 cursor-default">
              {activeBand.category.name}
            </p>
          </div>
        )}

      {/* محدد طقم */}
      {activeBand.category?.id > 1 && activeBand.category.type === "multi" && (
        <div>
          <p>{t("category")}</p>
          <p className="shadows py-1 rounded-md bg-slate-300 h-9 mt-1 px-3 cursor-default">
            {activeBand.category.name}
          </p>
        </div>
      )}

      {/* بتن اضافة المقاسات لو الطقم فيه عناصر ليها مقاسات */}
      {shouldRenderButton() && (
        <Button
          action={() => setAddSizesModal(true)}
          bordered
          className="h-10 mt-7 whitespace-nowrap"
        >
          إضافة مقاسات الطقم
        </Button>
      )}

      {/* رقم الموديل */}
      <BaseInputField
        placeholder={`${t("model number")}`}
        label={`${t("model number")}`}
        id="model_number"
        type="text"
        name="model_number"
      />

      {/* الوزن */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center relative">
          <label htmlFor="wight">{t("mineral weight")}</label>

          <span className="text-sm font-bold text-mainOrange">
            {t("remaining weight")} {activeBand.leftWeight}
          </span>

        </div>
        <BaseInputField
          {...{
            id: "wight",
            type: "number",
            name: "weight",
            // label:`${t('weight')}`,
            placeholder: "الوزن",
            onChange: () => {
              setFieldValue("weightitems", [])
            },
            ...(detailedWeight_total !== 0 &&
              detailedWeight_total && {
              value: detailedWeight_total,
              onChange: (e) => {
                setDetailedWeight_total(+e.target.value)
              },
              disabled: true,
            }),
          }}
          // value={detailedWeight_total !== 0 && detailedWeight_total ? detailedWeight_total : undefined}
          // onChange={(e) => setFieldValue('mezan_weight', e.target.value)}

          // placeholder="الوزن"
          // label="الوزن"
          // id="weight"
          // type="number"
          // name="weight"
          // disabled={selectedBandLeftWeight === 0}
          className={`${detailedWeight_total !== 0 && detailedWeight_total && "bg-gray-300"
            } ${values.weight > values.left_weight && "bg-red-100"}`}
        />
      </div>

      <div>
        <p>{t('mineral type')}</p>
        <p className="shadows py-1 rounded-md bg-gray-300 h-9 mt-1 px-3 cursor-default">
          {activeBand?.mineral_name}
        </p>
      </div>
      <div>
        <p> {t("karats")}</p>
        <p className="shadows py-1 rounded-md bg-gray-300 h-9 mt-1 px-3 cursor-default">
          {activeBand?.accessoryKarat}
        </p>
      </div>

      {/* العيار */}
      {/* <div className="flex flex-col gap-1">
        <h2>العيار</h2>
        <div className="shadows py-1 rounded-md bg-gray-200">
          <p className="px-4  py-[.17rem]">{activeBand.goldKarat}</p>
        </div>
      </div> */}

      {/* المصدر */}

      <Country_city_distract_markets
        countryName="country_id"
        countryFieldKey="id"
      />
      {/* لون الذهب */}
      <SelectColor
        field="id"
        modalTitle="إضافة لون ذهب"
        name="color_id"
        label={t("metal colors")}
      // onChange={(option) => {
      //   setFieldValue("color_value", option.value)
      // }}
      />

      {/* تكلفة الطعه */}
      <div>
        <BaseInputField
          placeholder="000"
          label={`${t("part cost (in supplier currency)")}`}
          id="cost_item"
          type="text"
          name="cost_item"
        />
      </div>
      {/* معامل التحويل*/}
      <div>
        <BaseInputField
          placeholder="3.75"
          label={`${t("conversion factorial")}`}
          id="conversion_factor"
          type="text"
          name="conversion_factor"
        />
      </div>

      {/*  مصاريف اضافية*/}
      <div>
        <BaseInputField
          placeholder="000"
          label={`${t("percentage additional expenses")}`}
          id="masarif_adafia"
          type="text"
          name="masarif_adafia"
        />
      </div>

      {/*   التكلفه*/}
      <div>
        <BaseInputField
          placeholder="000"
          label={t("cost")}
          id="cost"
          type="text"
          name="cost"
          disabled
          className="bg-gray-300"
          value={Number(values?.cost_item) * Number(values?.conversion_factor) * (+values?.masarif_adafia / 100) + Number(values?.cost_item) * Number(values?.conversion_factor)}
        />
      </div>
      {/*   سعر البيع*/}
      <div>
        <BaseInputField
          placeholder="000"
          label={`${t('selling price')}`}
          id="selling_price"
          type="text"
          name="selling_price"
          disabled
          className="bg-gray-300"
          value={
            profitMargin['profit'] === 'factorial' ?
            Number(values.cost)*Number(profitMarginValue)
            :
            Number(values?.cost)*Number(profitMarginValue) + Number(values.cost)
          }
        />
      </div>
      {/* جدول المقاسات */}
      {shouldRenderSizesTable && (
        <div className=" col-span-4">
          <SizesTable sizes={sizes} setSizes={setSizes} />
        </div>
      )}
      {/* صورة القطعة */}
      <div className=" col-span-4 flex flex-col gap-1">
        <label htmlFor="media" className="text-base">{t('widget image')}</label>
        <DropFile name="media" />
        {/* وصف القطعة */}
      </div>
      <div className="col-span-4 ">
        <TextAreaField
          placeholder={t("Widget description")}
          name="details"
          id="details"
          label={t("Widget description")}
        />
      </div>
      {/* يحتوي علي حجر ام لا */}
      <div className={`${IsRTL ? "-right-7" : "-left-7"} col-span-1 flex items-center justify-center absolute -bottom-16`}>
        <CheckBoxField
          name="has_stones"
          label={`${!!!values.has_stones ? "لا" : ""} ${t("contains stones")}`}
        />
        {/* <RadioGroup name="has_stones">
          <RadioGroup.RadioButton
            value={true}
            label="يحتوي علي احجار"
            id="true"
          />
          <RadioGroup.RadioButton
            value={false}
            label="لا يحتوي علي احجار"
            id="false"
          />
        </RadioGroup> */}
      </div>
      {/* /////// */}
      {/* تفاصيل المقاسات */}
      <Modal
        isOpen={addSizesModal && !!itemsToShowInCaseOfTa2m?.length}
        onClose={setAddSizesModal}
        title="إضافة مقاسات الطقم"
      >
        {itemsToShowInCaseOfTa2m?.map((categ) => (
          <Formik
            key={categ.id}
            validationSchema={addTa2mSizesSchema}
            initialValues={{
              sizeIsRequired: true,
              category_id: categ.id,
              size_type: "",
              size_unit_id: "",
            }}
            onSubmit={(values) => {
              if (
                sizes?.some((size) => size.category_id === values.category_id)
              ) {
                notify("error", "هذا المقاس تمت إضافته بالفعل")
                return
              }
              const { sizeIsRequired, ...filteredValues } = values
              setSizes((curr) => [
                ...curr,
                { id: crypto.randomUUID(), ...filteredValues },
              ])

              if (activeBand.category.type === "single") {
                const items = prepareItemsToShowInCaseOfTa2m(categ, sizes)
                items && setItemsToShowInCaseOfTa2m(items)
              }
              notify("success")
            }}
          >
            {({ submitForm }) => (
              <>
                <div className="grid grid-cols-4 gap-x-5">
                  <SelectCategorySize
                    initialCategory={categ}
                    categoryName="category_id"
                    sizeTypeName="size_type"
                    showNotDefinedType={false}
                    theSizeName="size_unit_id"
                  />
                </div>
                <Button
                  type="button"
                  action={submitForm}
                  className="mt-8 mr-auto flex"
                >
                  حفظ
                </Button>
              </>
            )}
          </Formik>
        ))}
      </Modal>

      {/* تفاصيل الاوزان */}
      <Modal
        isOpen={
          !!awzanItems &&
          !!awzanItems.length &&
          weightItemsModal &&
          detailedWeight_total !== 0 &&
          !detailedWeight_total
        }
        onClose={setWeightItemsModal}
        title="الوزن التفصيلي للقطع"
      >
        <>
          <Formik
            initialValues={awzanItemsFormInitValues || {}}
            onSubmit={(vals) => {
              // لو تجميعة الاوزان اكتر من ال leftWeight اريتيرن
              let allWeight = 0
              const weightitems = Object.entries(vals).map(([key, val]) => {
                // @ts-ignore
                allWeight += +val
                return { category_id: key, weight: val }
              })
              if (allWeight > activeBand.leftWeight) {
                notify("error", "تجميعة الأوزان اكثر من الوزن المتبقي")
                return
              }
              if (allWeight <= 0) {
                notify("error", "أدخل اوزان")
                return
              }

              // ALL ✅
              /* 
              - اعمل ابديت للوزن الاجمالي
              - setFieldValue
              - اقفل المودل
              */
              setFieldValue("weightitems", weightitems)
              setFieldValue("weight", allWeight)
              setDetailedWeight_total(allWeight)
              setWeightItemsModal(false)
            }}
          >
            {({ submitForm, values }) => (
              <>
                <div className="grid grid-cols-4 gap-5 py-20">
                  {awzanItems?.map((item, i) => (
                    <BaseInputField
                      key={item.id}
                      label={item.name}
                      id={`${item.name}_${i}`}
                      name={item.id.toString()}
                      type="number"
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  action={submitForm}
                  className="mt-8 mr-auto flex"
                >
                  تأكيد
                </Button>
              </>
            )}
          </Formik>
        </>
      </Modal>
    </div>
  )
}
