import { t } from 'i18next';
import { useContext } from 'react';
import { authCtx } from '../../../../context/auth-and-perm/auth';
import { useFetch } from '../../../../hooks';
import { formatDate } from '../../../../utils/date';
import billLogo from "../../../../assets/bill-logo.png";

type Client_TP = {
  clientData?: {
    amount: number
    bond_date: string
    client_id: number
    client_value: string
    employee_id: number
    employee_value: string
    id: number
    invoiceNumber: number
  }
  mobile: number
  identity: number
}

const FinalPreviewBillData = ({ clientData, invoiceNumber }: Client_TP) => {  
  const {  client_id, client_value } = clientData

  const { data } = useFetch<Client_TP>({
    endpoint: `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, client_id]
  })
  
  const { userData } = useContext(authCtx)

  return (
    <div className='flex justify-between'>
      <div className='flex flex-col gap-1 mt-6'>
        <p className='text-xs font-bold'>{t("bill no")} : <span className='font-medium'>{invoiceNumber?.length + 1}</span> </p>
        <p className='text-xs font-bold'>{t("bill date")} : <span className='font-medium'>{formatDate(new Date)}</span> </p>
      </div>
      <div className='flex flex-col gap-1 items-center'>
        <img src={billLogo} alt='bill' />
        <p className='text-xs font-medium'>{userData?.branch?.country?.name} , {userData?.branch?.city?.name}</p>
        <p className='text-xs font-medium'><span className='font-bold'>{t('district')}:</span>{userData?.branch?.district?.name}</p>
      </div>
      <div className='flex flex-col gap-1 mt-6'>
        <p className='text-xs font-bold'>{t("client name")} : <span className='font-medium'>{client_value}</span> </p>
        <p className='text-xs font-bold'>{t("mobile number")} : <span className='font-medium'>{data?.phone}</span> </p>
        <p className='text-xs font-bold'>{t("Id number")} : <span className='font-medium'>{data?.identity}</span> </p>
      </div>
    </div>
  )
}

export default FinalPreviewBillData