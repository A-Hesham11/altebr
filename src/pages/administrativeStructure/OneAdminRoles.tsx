import { ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import { useMemo } from 'react'
import { BsCheck } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import { Loading } from '../../components/organisms/Loading'
import { useFetch } from '../../hooks'
import { PermissionGroup_TP } from './types-and-schemas'
import { Button } from '../../components/atoms'

export const OneAdminRoles = ({ title }: { title: string }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isSuccess, isLoading } = useFetch<PermissionGroup_TP>({
        endpoint: `administrative/api/v1/roles/${id}`,
        queryKey: [`oneRole/${id}`],
    })

    const cols = useMemo<ColumnDef<PermissionGroup_TP>[]>(
        () => [
            {
                header: t("Name").toString(),
                cell: (info) => info.renderValue(),
                accessorKey: "name"
            }
        ],
        []
    )
    if (isLoading) return <Loading mainTitle={`${t('roles are loading')}`} />
    return (<>
            <div className='flex justify-center items-center w-full' >
                <Button bordered onClick={() => navigate(-1)} className='mr-auto'>{t('Back')}</Button>
            </div>
        <div className='flex flex-col justify-center items-between'>
             <h2 className='text-2xl mb-10 border-b-2 border-mainOrange font-bold text-mainGreen mx-auto' >{data?.name}</h2>
        <ul className='columns-3 ms-24'>
            {
                data?.permissions.map(perm => (
                    <li className='flex items-center m-2 gap-x-2'><BsCheck className='text-mainGreen' /> {perm.name}</li>
                ))
            }
        </ul>
        </div>
    </>
    )

}

