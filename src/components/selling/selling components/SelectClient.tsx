import React, { useContext } from 'react'
import { Select } from '../../molecules'
import { t } from 'i18next'
import { useFetch } from '../../../hooks'
import { authCtx } from '../../../context/auth-and-perm/auth'
import { useFormikContext } from 'formik'
import { FormikError } from '../../atoms'

const SelectClient = () => {
    const { userData } = useContext(authCtx)

    const {
        data: clientData,
        isLoading,
    } = useFetch({
        endpoint: `/branchManage/api/v1/all-clients/${userData?.branch_id}`,
        queryKey: ["all-client"],
        select: (clients: any) =>
            clients.map((item: any) => ({
                id: item.id,
                value: item.id,
                label: item.name,
            })),
        onError: (err) => console.log(err),
    })
        const {setFieldValue} = useFormikContext()
    return (
        <div>
            <Select
                id="client"
                label={`${t("client")}`}
                name="client_id"
                placeholder={`${t("client")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={clientData}
                fieldKey="id"
                loading={isLoading}
                onChange={(option) => {
                    setFieldValue('clientName', option!.label)
                }}
            />
            <FormikError name='client_id' className="whitespace-nowrap absolute" />
        </div>
    )
}

export default SelectClient