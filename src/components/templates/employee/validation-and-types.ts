
import { allDocs_TP } from "../reusableComponants/documents/Documents"


// types 
export type Email_TP = `${string}@${string}.${string}`

export type InitialValues_TP = {
  // employee main data types
  id?:string
  name: string
  branch_id: string
  branch_value: string
  role_id: string
  role_value: string
  address: string
  phone: string
  mobile: string
  nationality_id: string
  nationality_value: string
  date_of_birth: Date
  date_of_hiring: Date
  national_expire_date: Date
  email: Email_TP
  national_number: string
  username: string
  password: string
  country_id: string
  country_value: string
  city_id: string
  city_value: string
  district_id: string
  district_value: string
  building_number: string
  street_number: string
  sub_number: string
  national_image: any
  is_active: string
  image: any
  document?:allDocs_TP
  zip_code:string
  nationalAddress?:any
  nationality?:any
  country?:any
  city?:any
  branch?:any
  role?:any
  address_out:string
}

