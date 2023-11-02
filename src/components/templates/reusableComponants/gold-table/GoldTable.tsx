import { useQueryClient } from "@tanstack/react-query"
import { Formik } from "formik"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  GoldTableProperties_TP,
  OTableDataTypes,
  TableHelperValues_TP,
} from "../../../supply/SupplySecondForm"
import { FirstFormInitValues_TP } from "../../../supply/formInitialValues_types"
import { GoldTableForm } from "./GoldTableForm"
import * as Yup from "yup"
import { t } from "i18next"
import { supplierTax_TP } from "../../../../pages/supply/Supply"

type OTableProps_TP = {
  supplierTax: supplierTax_TP,
  dirty: boolean,
  setDirty: Dispatch<SetStateAction<boolean>>
  data: OTableDataTypes[]
  setData: Dispatch<SetStateAction<OTableDataTypes[]>>
  defaultValues: GoldTableProperties_TP & TableHelperValues_TP
  setEditData: Dispatch<SetStateAction<OTableDataTypes>>
  editData: OTableDataTypes
  formValues: FirstFormInitValues_TP | undefined
  setBoxValues: Dispatch<SetStateAction<OTableDataTypes[]>>
}

const requiredTranslation = () => `${t("required")}`
const wageError = () => `${t('please enter a valid wage')}`
const stockError = () => `${t('please enter a valid stock')}`
const stockRatioError = () => `${t('top stock value is 1')}`
const weightError = () => `${t('please enter a valid weight')}`

const validationSchema = Yup.object({
  category_id: Yup.string().trim().required(requiredTranslation),
  weight: Yup.number().positive(weightError).required(requiredTranslation),
  karat_id: Yup.string().trim().required(requiredTranslation),
  stock: Yup.number().positive(stockError).max(1, stockRatioError).required(requiredTranslation),
  wage: Yup.number().positive(wageError).required(requiredTranslation),
})

export function GoldTable({
  supplierTax,
  dirty,
  setDirty,
  data,
  setData,
  defaultValues,
  setEditData,
  editData,
  formValues,
  setBoxValues,
}: OTableProps_TP) {
  // states
  const [editRow, setEditRow] = useState(false)
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [karatsOptions, setKaratsOptions] = useState([])

  // query client
  const queryClient = useQueryClient()
  const categories = queryClient.getQueryData(["categories"])
  const karats = queryClient.getQueryData(["karats"])

  // side effects
  useEffect(() => {
    if (categories) {
      //@ts-ignore
      const categoriesArray = categories.map((category: any) => ({
        value: category.name,
        label: category.name,
        id: category.id,
      }))
      setCategoriesOptions(categoriesArray)
    }
  }, [categories])

  useEffect(() => {
    if (karats) {
      //@ts-ignore
      const karatsArray = karats.map((karat: any) => ({
        value: karat.name,
        label: karat.name,
        id: karat.id,
      }))
      setKaratsOptions(karatsArray)
    }
  }, [karats])

  return (
    <div>
      <Formik
        initialValues={defaultValues}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          const uniqueID = crypto.randomUUID() // because i need the same id for both data of row and boxes
          setData((prev) => [...Array.from(prev), { ...values, id: uniqueID }])
          setEditRow(false)
          resetForm()
          setBoxValues((prev) => [
            ...Array.from(prev),
            { ...values, id: uniqueID },
          ])
          console.log("🚀 ~ file: OTable.tsx:96 ~ OTable ~ values:", values)
        }}
        validationSchema={validationSchema}
      >
        {({}) => (
          <GoldTableForm
            supplierTax={supplierTax}
            dirty={dirty}
            setDirty={setDirty}
            editRow={editRow}
            categoriesOptions={categoriesOptions}
            karatsOptions={karatsOptions}
            data={data}
            setBoxValues={setBoxValues}
            setData={setData}
            formValues={formValues}
            editData={editData}
            setEditRow={setEditRow}
            setEditData={setEditData}
          />
        )}
      </Formik>
    </div>
  )
}
