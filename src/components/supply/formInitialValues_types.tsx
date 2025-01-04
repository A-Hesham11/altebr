import { t } from "i18next";
import * as Yup from "yup";

export type GoldSupplyFirstForm = {
  twred_type: "global" | "local";
  bond_date: Date;
  employee_id: string;
  supplier_id: string;
  employee_value: string;
  supplier_value: string;
  bond_number: string;
  api_gold_price: number;
  entity_gold_price: string;
  notes: string;
  out_goods_value?: string;
  media: any;
  goods_media?: any;
  currency?: "other_currency" | "ryal";
  factorial?: number;
};

export type DiamondSupplyFirstForm = {
  twred_type: "global" | "local";
  bond_date: Date;
  employee_id: string;
  currency?: "other_currency" | "ryal";
  factorial?: number;
  supplier_id: string;
  employee_value: string;
  supplier_value: string;
  bond_number: string;
  notes: string;
  out_goods_value?: string;
  media: any;
  goods_media?: any;
  tax?: any;
};

export type FirstFormInitValues_TP =
  | GoldSupplyFirstForm
  | DiamondSupplyFirstForm;

const requiredTranslation = () => `${t("required")}`;

export const goldValidatingSchema = Yup.object({
  twred_type: Yup.string().trim().required(requiredTranslation),
  bond_date: Yup.date()
    .max(new Date())
    .required(requiredTranslation)
    .typeError(requiredTranslation),
  employee_id: Yup.string().trim().required(requiredTranslation),
  supplier_id: Yup.string().trim().required(requiredTranslation),
  bond_number: Yup.string().trim().required(requiredTranslation),
  entity_gold_price: Yup.string()
    .trim()
    .required(requiredTranslation)
    .typeError(requiredTranslation),
  out_goods_value: Yup.string()
    .trim()
    .when("twred_type", {
      is: "global",
      then: (schema) => schema.trim().required(requiredTranslation),
    }),
  api_gold_price: Yup.number()
    // .required(requiredTranslation)
    .min(1, requiredTranslation),
  media: Yup.array().required().min(1, requiredTranslation),
  goods_media: Yup.array().when("twred_type", {
    is: "global",
    then: (schema) => schema.required().min(1, requiredTranslation),
  }),
});

export const diamondValidatingSchema = Yup.object({
  twred_type: Yup.string().trim().required(requiredTranslation),
  bond_date: Yup.date()
    .max(new Date())
    .required(requiredTranslation)
    .typeError(requiredTranslation),
  employee_id: Yup.string().trim().required(requiredTranslation),
  supplier_id: Yup.string().trim().required(requiredTranslation),
  bond_number: Yup.string().trim().required(requiredTranslation),
  out_goods_value: Yup.string()
    .trim()
    .when("twred_type", {
      is: "global",
      then: (schema) => schema.trim().required(requiredTranslation),
    }),
  media: Yup.array().required().min(1, requiredTranslation),
  goods_media: Yup.array().when("twred_type", {
    is: "global",
    then: (schema) => schema.required().min(1, requiredTranslation),
  }),
});
