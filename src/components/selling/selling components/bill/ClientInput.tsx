import { Form, Formik, FormikSharedConfig, useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { BaseInputField, PhoneInput } from '../../../molecules'
import { t } from "i18next"
import { SelectOption_TP } from '../../../../types'
import { SingleValue } from 'react-select'


const ClientInput = ({editData}) => {

    const { setFieldValue } = useFormikContext()

    useEffect(() => {
        setFieldValue('phone',editData?.phone || '')
    }, [])
    
  return (
    <>
        <div className='flex flex-col gap-6 w-3/4 mx-auto my-8'>
            <BaseInputField
            id="name"
            label={`${t("name")}`}
            name="name"
            type="text"
            placeholder={`${t("name")}`}
            labelProps={{ className: "mb-1" }}
            required
            />

            {!!editData ? (
                <PhoneInput
                    label={`${t("mobile number")}`}
                    name="phone"
                    placeholder={`${t("mobile number")}`}
                    required
                    value={editData.phone}
                />
            )
            : (
                <PhoneInput
                    label={`${t("mobile number")}`}
                    name="phone"
                    placeholder={`${t("mobile number")}`}
                    required
                />
            )}

            <BaseInputField
                id="identity"
                label={`${t("national number")}`}
                name="identity"
                type="text"
                placeholder={`${t("national number")}`}
                required
            />

            
        </div>
    </>
  )
}

export default ClientInput