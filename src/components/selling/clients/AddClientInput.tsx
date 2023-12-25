import { Form, Formik, FormikSharedConfig, useFormikContext } from 'formik'
import React, { useContext, useEffect } from 'react'
import { t } from "i18next"
import { SingleValue } from 'react-select'
import { BaseInputField, PhoneInput, Select } from '../../molecules'
import { SelectNationality } from '../../templates/systemEstablishment/SelectNationality'
import { Country_city_distract_markets } from '../../templates/reusableComponants/Country_city_distract_markets'
import { Cities } from '../../templates/reusableComponants/Cities'
import { NationalitiesMainData } from '../../templates/systemEstablishment/NationalitiesMainData'
import { SelectMembership } from './SelectMembership'
import { authCtx } from '../../../context/auth-and-perm/auth'
import RadioGroup from '../../molecules/RadioGroup'


const AddClientInputs = ({editClientsData, showClientsData, initialValues, dataSource, resetData, isSuccessPost}) => {

    const { setFieldValue, values, resetForm } = useFormikContext();

    const {userData} = useContext(authCtx)
    console.log("🚀 ~ file: AddClientInput.tsx:20 ~ AddClientInputs ~ userData:", userData)

    useEffect(() => {
        resetForm()
        if (resetData) resetData()
      }, [isSuccessPost])
    

  return (
    <>
        <div className='grid grid-cols-4 gap-8 items-end justify-center'>
            <BaseInputField
                id="name"
                label={`${t("client name")}`}
                name="name"
                type="text"
                placeholder={`${t("client name")}`}
                labelProps={{ className: "mb-1" }}
                required
                value={initialValues?.name}
                onChange={(e) => {
                    setFieldValue("name", e.target.name)
                }}
                disabled={showClientsData}
                className={showClientsData && "bg-mainDisabled"}
            />

            <Country_city_distract_markets
                countryName="country_id"
                countryFieldKey="id" 
                cityName='city_id'
                cityFieldKey='id'
                editData={{
                    country_id: editClientsData?.country.id || showClientsData?.country.id,
                    country_name:editClientsData?.country.name_ar || showClientsData?.country.name_ar,
                    city_id:editClientsData?.city.id || showClientsData?.city.id,
                    city_name:editClientsData?.city.name_ar || showClientsData?.city.name_ar
                }}
                disabled={showClientsData}
                // className={showClientsData && "bg-mainDisabled"}
            />


            <BaseInputField
                id="identity"
                label={`${t("national number")}`}
                name="identity"
                type="text"
                placeholder={`${t("national number")}`}
                required
                value={initialValues?.identity}
                onChange={(e) => {
                    setFieldValue("identity", e.target.identity)
                }}
                disabled={showClientsData}
                className={showClientsData && "bg-mainDisabled"}
            />

            <div className="flex flex-col">
                <SelectNationality
                    name="nationality_id"
                    editData={ editClientsData || showClientsData }
                    onChange={(e) => {
                        setFieldValue("nationality_id", e.target.nationality_id)
                    }}
                    disabled={showClientsData}
                    // className={showClientsData && "bg-mainGray"}
                />
            </div>

            {editClientsData || showClientsData ? (
                <PhoneInput
                    label={`${t("phone number")}`}
                    name="phone"
                    placeholder={`${t("phone number")}`}
                    required
                    value={editClientsData ? editClientsData?.phone : showClientsData?.phone }
                    onChange={(e) => {
                        setFieldValue("phone", e.target.phone)
                    }}
                    disabled={showClientsData}
                />
            )
            : (
                <PhoneInput
                    label={`${t("phone number")}`}
                    name="phone"
                    placeholder={`${t("phone number")}`}
                    required
                    value={initialValues?.phone}
                    onChange={(e) => {
                        setFieldValue("phone", e.target.phone)
                    }}
                />
            )}

            {editClientsData || showClientsData ? (
                <PhoneInput
                    label={`${t("mobile number")}`}
                    name="mobile"
                    placeholder={`${t("mobile number")}`}
                    required
                    value={editClientsData ? editClientsData?.mobile : showClientsData?.mobile }
                    onChange={(e) => {
                        setFieldValue("mobile", e.target.mobile)
                    }}
                    disabled={showClientsData}
                />
            )
            : (
                <PhoneInput
                    label={`${t("mobile number")}`}
                    name="mobile"
                    placeholder={`${t("mobile number")}`}
                    required
                    value={initialValues?.mobile}
                    onChange={(e) => {
                        setFieldValue("mobile", e.target.mobile)
                    }}
                />
            )}

            {/* <BaseInputField
                id="gender"
                label={`${t("gender")}`}
                name="gender"
                placeholder={`${t("gender")}`}
                type="text"
                required
                value={initialValues?.gender}
                onChange={(e) => {
                    setFieldValue("gender", e.target.gender)
                }}
                disabled={showClientsData}
                className={showClientsData && "bg-mainDisabled"}
            /> */}

            <BaseInputField
                id="branch_name"
                label={`${t("branch")}`}
                name="branch_name"
                placeholder={`${t("branch")}`}
                type="text"
                required
                value={userData?.branch_name}
                disabled
                className="bg-mainDisabled"

            />

            <BaseInputField
                id="mehna"
                label={`${t("occupation")}`}
                name="mehna"
                placeholder={`${t("occupation")}`}
                type="text"
                required
                value={initialValues?.mehna}
                onChange={(e) => {
                    setFieldValue("mehna", e.target.mehna)
                }}
                disabled={showClientsData}
                className={showClientsData && "bg-mainDisabled"}
            />

            <BaseInputField
                id="geha"
                label={`${t("entity")}`}
                name="geha"
                placeholder={`${t("entity")}`}
                type="text"
                required
                value={initialValues?.geha}
                onChange={(e) => {
                    setFieldValue("geha", e.target.geha)
                }}
                disabled={showClientsData}
                className={showClientsData && "bg-mainDisabled"}
            />

            <SelectMembership
                name="odwya_id"
                // value={initialValues?.geha}
                onChange={(e) => {
                    setFieldValue("odwya_id", e.target.odwya_id)
                }}
                disabled={showClientsData}
                editData={ editClientsData || showClientsData }
                // className={showClientsData && "bg-mainGray"}
                // isDisabled={showClientsData}
            />

            <RadioGroup name="sales_return">
              <div className="flex gap-x-2">
                <RadioGroup.RadioButton
                  value="male"
                  label={`${t("male")}`}
                  id="male"
                />
                <RadioGroup.RadioButton
                  value="female"
                  label={`${t("female")}`}
                  id="female"
                />
              </div>
            </RadioGroup>

        </div>
    </>
  )
}

export default AddClientInputs