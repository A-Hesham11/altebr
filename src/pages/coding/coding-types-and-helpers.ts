import { t } from "i18next"
import * as yup from "yup"
import { Category_TP, KaratValues_TP } from "../../types"
import { requiredTranslation } from "../../utils/helpers"

// فورم الترقيم
export type GoldCodingSanad_initialValues_TP = {
  front_key?: string
  mezan_type: "manual" | "mezan"
  category_id: string
  model_number: string
  weight: number
  country_id: string
  color_id: string
  wage: number
  media: []
  has_stones: boolean
  details: string
  size_type?: string
  size_unit_id?: string
  sizeIsRequired?: boolean
  front_key_twred?: string
  // city_id?: string
  // district_id?: string
  left_weight?: number
  weightitems?: { category_id: string; weight: string }[]
  stones?: GoldCodingStoneValues_TP[]
  band_id?: string
  karat_value?: KaratValues_TP
  bond_date?: string
  init_wage?: number
  mezan_weight?: number
}
export type DiamondCodingSanad_initialValues_TP = {
  front_key?: string
  mezan_type: "manual" | "mezan"
  category_id: string
  model_number: string
  weight: number
  country_id: string
  color_id: string
  wage: number
  media: []
  has_stones: boolean
  details: string
  size_type?: string
  size_unit_id?: string
  sizeIsRequired?: boolean
  left_weight?: number
  weightitems?: { category_id: string; weight: string }[]
  stones?: GoldCodingStoneValues_TP[]
  band_id?: string
  karat_value?: KaratValues_TP
  bond_date?: string
  init_wage?: number
  mezan_weight?: number
  selling_price?: string
  mineral_id?: string
  cost_item?: string
  conversion_factor?: string
  masarif_adafia?: string | number
  cost?: string
  karatmineral_id?: string
}
export const codingSanad_initialValues: GoldCodingSanad_initialValues_TP = {
  mezan_type: "manual",
  model_number: "",
  category_id: "",
  country_id: "",
  color_id: "",
  weight: 0,
  wage: 0,
  has_stones: true,
  details: "",
  size_type: "",
  size_unit_id: "",
  front_key_twred: "",
  media: [],
}
export const codingDiamondSanad_initialValues: DiamondCodingSanad_initialValues_TP =
  {
    mezan_type: "manual",
    model_number: "",
    category_id: "",
    country_id: "",
    color_id: "",
    weight: 0,
    wage: 0,
    has_stones: true,
    details: "",
    size_type: "",
    size_unit_id: "",
    media: [],
    selling_price: "",
    mineral_id: "",
    cost_item: "",
    conversion_factor: "" || 1,
    masarif_adafia: "" || 0,
    cost: "",
    karatmineral_id: "",
  }
const validate = () => `${t("color_id field must have at least 1 items")}`
const weightValidate = () => `${t("weight must be greater than or equal to 0")}`
const costItemValidate = () => `${t("cost must be less than left cost")}`
const countValidate = () => `${t("count must be greater than or equal to 1")}`
const shape_idValidate = () =>
  `${t("shape_id field must have at least 1 items")}`

export const codingSanad_schema = yup.object().shape({
  bond_id: yup.string().trim().required(requiredTranslation),
  mezan_type: yup
    .string()
    .trim()
    .oneOf(["manual", "mezan"])
    .required(requiredTranslation),
  color_id: yup.string().trim().required(requiredTranslation),
  country_id: yup.string().trim().required(requiredTranslation),
  model_number: yup.string().trim().required(requiredTranslation),
  weight: yup
    .number()
    .required()
    .min(0, weightValidate)
    .max(yup.ref("left_weight")),
  wage: yup.number().required().min(yup.ref("init_wage")),
  has_stones: yup.boolean(),
  // media: yup.array().required().min(1),
  category_id: yup.string().trim().required(requiredTranslation),
  // size_type: yup.string()
  //     .trim()
  //     .when("sizeIsRequired", {
  //         is: (val: boolean) => val === true,
  //         then: (schema) => schema.required(),
  //     }),
  // size_unit_id: yup.string()
  //     .trim()
  //     .when("sizeIsRequired", {
  //         is: (val: boolean) => val === true,
  //         then: (schema) => schema.required(),
  //     }),
})

export const codingDiamondSanad_schema = yup.object().shape({
  bond_id: yup.string().trim().required(requiredTranslation),
  mezan_type: yup
    .string()
    .trim()
    .oneOf(["manual", "mezan"])
    .required(requiredTranslation),
  color_id: yup.string().trim().required(requiredTranslation),
  country_id: yup.string().trim().required(requiredTranslation),
  model_number: yup.string().trim().required(requiredTranslation),
  cost_item: yup
  .number()
  .required(requiredTranslation)
  .min(1)
  .max(yup.ref("validateCostValue"),costItemValidate),
  weight: yup
    .number()
    .required(requiredTranslation)
    .min(1, weightValidate)
    .max(yup.ref("left_weight")),
  has_stones: yup.boolean(),
  category_id: yup.string().trim().required(requiredTranslation),
})

export const addTa2mSizesSchema = yup.object().shape({
  size_type: yup
    .string()
    .trim()
    .when("sizeIsRequired", {
      is: (val: boolean) => val === true,
      then: (schema) => schema.required(),
    }),
  size_unit_id: yup
    .string()
    .trim()
    .when("sizeIsRequired", {
      is: (val: boolean) => val === true,
      then: (schema) => schema.required(),
    }),
})

/* 
TYPES
*/
type GoldSanadBox_TP = {
  id: string
  account: string
  value: number
  unit: "SAR" | "GRAM"
}

export type GoldSanadBand_TP = {
  category: Category_TP
  goldKarat: number
  goldWeight: number
  payoff: number
  itemStock: number
  id: string
  discount: number
  itemTaxes: number
  payoffTaxes: number
  payoffTotal: number
  leftWeight: number
  wage: number
}
export type DiamondSanadBand_TP = {
  category: Category_TP
  goldKarat: number
  goldWeight: number
  payoff: number
  itemStock: number
  other_stones_weight: number
  leftWeightDiamond: number 
  id: string
  discount: number
  itemTaxes: number
  payoffTaxes: number
  payoffTotal: number
  leftWeight: number
  wage: number
}
export type GoldSanad_TP = {
  id: string
  classification: string
  supplier_name: string
  bond_date: string
  total_gold_by_24: string
  total_money: string
  item_count: string
  bond_id: string
  boxes: GoldSanadBox_TP[]
  items: GoldSanadBand_TP[]
  trqem_status : 'open' | 'closed'
}

export type GoldAddedPiece_TP = {
  id: string
  model_number: string
  stones: GoldCodingStoneValues_TP[]
}

// فورم الحجر
export type GoldCodingStoneValues_TP = {
  stone_id: string
  color_id: string[]
  attachments:string[]
  shape_id: string[]
  purity_id: string
  weight: number
  count: number
  nature_id: string
  certificate_number: string
  certificate_source: string
  certificate_url: string
  certificate_files: []
  stone_type: "added" | "not_added"
  details: string
}
// فورم الحجر
export type diamondCodingStoneValues_TP = {
  stone_id: string
  color_id: string[]
  shape_id: string[]
  purity_id: string
  weight: number | string
  count: number
  diamondWeight: number | string
  nature_id: string
  certificate_number: string
  certificate_source: string
  certificate_url: string
  certificate_files: []
  stone_type: "added" | "not_added"
  details: string
}

export const goldCodingStoneValues: GoldCodingStoneValues_TP = {
  stone_id: "",
  color_id: [],
  shape_id: [],
  attachments: [],
  purity_id: "",
  weight: 0,
  count: 0,
  nature_id: "",
  certificate_number: "",
  certificate_source: "",
  certificate_url: "",
  certificate_files: [],
  stone_type: "added",
  details: "",
}
export const diamondCodingStoneValues: diamondCodingStoneValues_TP = {
  stone_id: "",
  color_id: [],
  shape_id: [],
  purity_id: "",
  weight: "",
  count: 0,
  diamondWeight: "",
  nature_id: "",
  certificate_number: "",
  certificate_source: "",
  certificate_url: "",
  certificate_files: [],
  stone_type: "added",
  details: "",
}

export const goldCodingStoneSchema = yup.object().shape({
  stone_id: yup.string().trim().required(requiredTranslation),
  not_added_stone: yup.boolean(),
  stone_type: yup.string().matches(/^(added|not_added)$/),
  //   color_id: yup.array().required(requiredTranslation).min(1, validate),
  //   shape_id: yup.array().required().min(1, shape_idValidate),
  //   purity_id: yup.string().trim().required(requiredTranslation),
  //   weight: yup.number().min(1, weightValidate).required(),
  //   count: yup.number().min(1, countValidate).required(),
  //   nature_id: yup.string().trim().required(requiredTranslation),
  //   certificate_number: yup.string().trim().required(requiredTranslation),
  //   certificate_source: yup.string().trim().required(requiredTranslation),
  //   certificate_url: yup.string().trim().required(requiredTranslation),
  // certificate_files: yup.array().required().min(1),
})
export const diamondCodingStoneSchema = yup.object().shape({
  stone_id: yup.string().trim().required(requiredTranslation),
  not_added_stone: yup.boolean(),
  stone_type: yup.string().matches(/^(added|not_added)$/),
})
// .test(
//     'myCustomTest',
//     'null',
//     (obj) => {
//         if (!!obj.not_added_stone || !!obj.added_stone) {
//             return true; // everything is fine
//         }

//         return new yup.ValidationError(
//             'Please check one checkbox',
//             null,
//             'at_least_one'
//         );
//     }
// );

export type SizePopup_TP = {
  id: string
  category_id: string | number
  size_type: string
  size_unit_id: string
}
