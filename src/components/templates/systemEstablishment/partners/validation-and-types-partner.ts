import { t } from "i18next"

export type InitialValues_TP = {
  [ x: string ]: any
  name: string
  email: string
  phone: string
  end_date: Date
  start_date: Date
  x_city: string
  x_country:string
  // city_id: string
  // country_id: string
  nationality_name: string
  nationality_id: string
  national_image: any
  address: string
  // document type
  docType: string
  docName: string
  docNumber: string
  endDate: Date
  reminder: string
  files: any
  //national address
  building_number: string
  district_id: string
  street_number: string
  sub_number: string
  zip_code: string
}
export const requiredTranslation = () => `${t("required")}`

