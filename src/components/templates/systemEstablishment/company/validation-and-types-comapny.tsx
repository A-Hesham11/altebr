import { t } from "i18next"
import { isValidPhoneNumber } from "react-phone-number-input"
import * as Yup from "yup"

export type InitialValues_TP = {
  name_ar: string
  name_en: string
  country_id: string
  country_id_out: string
  city_id_out: string
  district_id_out: string
  city_id: string
  district_id: string
  address: string
  establishment_date: Date
  phone: string
  email: string
  fax: string
  tax_number: string
  logo: any
  address_out:string
  // document type

  docType?: string
  docName?: string
  docNumber?: string
  endDate?: Date
  reminder?: string
  files?: any
  //national Address
  building_number?: string
  street_number?: string
  sub_number?: string
  postal_number?: string
  zip_code?: string
}
const requiredTranslation = () => `${t("required")}`

export const companyValidatingSchema = () =>
  Yup.object({
    name_ar: Yup.string().trim().required(requiredTranslation),
    name_en: Yup.string().trim().required(requiredTranslation),
    country_id_out: Yup.string().trim().required(requiredTranslation),
    city_id: Yup.string().trim().required(requiredTranslation),
    district_id: Yup.string().trim().required(requiredTranslation),
    country_id: Yup.string().trim().required(requiredTranslation),
    city_id_out: Yup.string().trim().required(requiredTranslation),
    district_id_out: Yup.string().trim().required(requiredTranslation),
    address: Yup.string().trim().required(requiredTranslation),
    address_out: Yup.string().trim().required(requiredTranslation),
    establishment_date: Yup.date().required(requiredTranslation),
    phone: Yup.string()
      .trim()
      .required(requiredTranslation)
      .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
        return isValidPhoneNumber(value || "")
      }),
    email: Yup.string().email().trim().required(requiredTranslation),
    fax: Yup.string().trim().required(requiredTranslation),
    tax_number: Yup.string().trim().required(requiredTranslation),
    logo: Yup.string().trim().required(requiredTranslation),
  })
