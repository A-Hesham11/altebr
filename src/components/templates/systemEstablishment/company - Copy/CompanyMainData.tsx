/////////// IMPORTS
import { t } from "i18next"
import {
  BaseInputField,
  DateInputField,
  InnerFormLayout,
  PhoneInput
} from "../../../molecules"
import { DropFile } from "../../../molecules/files/DropFile"
import { Country_city_distract_markets } from "../../reusableComponants/Country_city_distract_markets"
///
///
/////////// Types
///
type CompanyMainData_TP ={
  valuesData:any
}


/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const CompanyMainData = ({valuesData}:CompanyMainData_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <>
      <InnerFormLayout title={"البياينات الاساسية"}>
        {/* اسم الشركة */}
        <BaseInputField
          id="company_name_ar"
          label={`${t("company name arabic")}`}
          name="name_ar"
          type="text"
          placeholder={`${t("company name_ar")}`}
          labelProps={{ className: "mb-1" }}
          required
        />
        <BaseInputField
          id="company_name_er"
          label={`${t("company name english")}`}
          name="name_en"
          type="text"
          placeholder={`${t("company name_er")}`}
          labelProps={{ className: "mb-1" }}
          required
        />
        <Country_city_distract_markets
          countryName="country_id_out"
          countryLabel={`${t("country")}`}
          cityName="city_id_out"
          cityLabel={`${t("city")}`}
          distractName="district_id_out"
          distractLabel={`${t("district")}`}
          editData={valuesData}
        />

        {/* {"عنوان الشركة"} */}

        <BaseInputField
          id="company_address"
          label={`${t("company address")}`}
          name="address_out"
          type="text"
          placeholder={`${t("company address")}`}
          labelProps={{ className: "mb-1" }}
          required
        />
        {/* ايميل الشريك */}
        <BaseInputField
          id="company_email"
          label={`${t("company email")}`}
          name="email"
          type="email"
          placeholder={`${t("company email")}`}
          labelProps={{ className: "mb-1" }}
          required
        />
        {/* رقم الجوال */}
        {!!!valuesData && (
          <PhoneInput
            label={`${t("mobile number")}`}
            name="phone"
            placeholder={`${t("mobile number")}`}
          />
        )}

        {/* الفاكس */}

        <BaseInputField
          id="fax"
          label={`${t("fax")}`}
          name="fax"
          type="text"
          placeholder={`${t("fax")}`}
          labelProps={{ className: "mb-1" }}
          required
        />
        {/* الرقم الضريبي */}

        <BaseInputField
          id="tax_number"
          label={`${t("tax_number")}`}
          name="tax_number"
          type="text"
          placeholder={`${t("tax_number")}`}
          labelProps={{ className: "mb-1" }}
          required
        />
        {/* تاريخ  التاسيس */}
        <DateInputField
          label={`${t("establishment date")}`}
          name="establishment_date"
        />
        <div className="col-span-4">
          <h2> {`${t("upload company logo")}`}</h2>
          <DropFile name="logo" />
        </div>
      </InnerFormLayout>
    </>
  )
}
