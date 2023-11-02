import { Form, Formik } from "formik"
import { t } from "i18next"
import * as Yup from "yup"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../atoms"
import SelectColor from "../../reusableComponants/SelectColor"
import SelectCategory from "../../reusableComponants/categories/select/SelectCategory"
import SelectStoneNature from "../../reusableComponants/stones/select/SelectStoneNature"
import SelectClassification from "../../reusableComponants/classifications/select/SelectClassification"
import SelectKarat from "../../reusableComponants/karats/select/SelectKarat"
import SelectStonePurity from "../../reusableComponants/stones/select/SelectStonePurity"
import SelectStoneType from "../../reusableComponants/stones/select/SelectStoneType"
import SelectStoneQuality from "../../reusableComponants/stones/select/SelectStoneQuality"
import SelectStoneShape from "../../reusableComponants/stones/select/SelectStoneShape"
///
/////////// Types
///
type InitialValues_TP = {
  classification: number
  karat: number
  category: number
  stone_purity: number
  stone_nature: number
  stone_type: number
  stone_shape: number
  stone_color: number
  stone_quality: number
}

///
/////////// HELPER VARIABLES & FUNCTIONS
///
const InitialValues: InitialValues_TP = {
  classification: 0,
  karat: 0,
  category: 0,
  stone_purity: 0,
  stone_nature: 0,
  stone_type: 0,
  stone_shape: 0,
  stone_color: 0,
  stone_quality: 0,
}
const requiredTranslation = () => `${t("required")}`
const validatingSchema = Yup.object({
  classification: Yup.number()
    .min(1, requiredTranslation),
  karat: Yup.number()
    .min(1, requiredTranslation),
  category: Yup.number()
    .min(1, requiredTranslation),
  stone_purity: Yup.number()
    .min(1, requiredTranslation),
  stone_nature: Yup.number()
    .min(1, requiredTranslation),
  stone_type: Yup.number()
    .min(1, requiredTranslation),
  stone_shape: Yup.number()
    .min(1, requiredTranslation),
  stone_color: Yup.number()
    .min(1, requiredTranslation),
  stone_quality: Yup.number()
    .min(1, requiredTranslation),
})

const Select_test = () => {
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const add = (values: InitialValues_TP) => {
    console.log(values)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={InitialValues}
      onSubmit={values => add(values)}
      validationSchema={validatingSchema}
    >
      <Form>
        <HandleBackErrors>
          <div>
            <SelectClassification label={`${t("classifications")}`} name="classification" field="id" />
            <SelectKarat label={`${t("karats")}`} name="karat" field="id" />
            <SelectCategory label={`${t("categories")}`} name="category" field="id" />
            <SelectStonePurity label={`${t("stones purities")}`} name="stone_purity" field="id" />
            <SelectStoneNature label={`${t("stones natures")}`} name="stone_nature" field="id" />
            <SelectStoneType label={`${t("stones types")}`} name="stone_type" field="id" />
            <SelectStoneShape label={`${t("stones shapes")}`} multi={true} name="stone_shape" field="id" />
            <SelectColor multi label={`${t("color name")}`} name="stone_color" field="id" modalTitle="s" />
            <SelectStoneQuality label={`${t("stones purities")}`} name="stone_quality" field="id" />
            <Button
              type="submit"
              className="self-end"
            >
              {t('add')}
            </Button>
          </div>
        </HandleBackErrors>
      </Form>
    </Formik>
  )
}

export default Select_test