/////////// IMPORTS
///
//import classes from './Operation.module.css'
import { useMutation } from "@tanstack/react-query"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Button } from "../../components/atoms"
import { Lock } from "../../components/atoms/icons/Lock"
import { Unlock } from "../../components/atoms/icons/Unlock"
import { Modal } from "../../components/molecules"
import { ShowButton } from "../../components/molecules/ViewButton"
import { Loading } from "../../components/organisms/Loading"
import { OperationDetails } from "../../components/templates/systemEstablishment/operation/OperationDetails"
import { useFetch } from "../../hooks"
import { MutateDataParameters_TP } from "../../types"
import { mutateData } from "../../utils/mutateData"
import { notify } from "../../utils/toast"
import { Back } from "../../utils/utils-components/Back"
///
/////////// Types
///
type Operation_Props_TP = {
  title: string
}
type Operation__TP = {
  description: string
  front_key: string
  id: number | null
  name: string
}

type lockStatus_TP = {
  value: "yes" | "no"
}

/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const Operation = ({ title }: Operation_Props_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: operations,
    isError,
    isSuccess,
    isLoading,
    error,
  } = useFetch<Operation__TP[]>({
    queryKey: ["operations"],
    endpoint: `/accounting/api/v1/operations?per_page=10000`,
  })
  ///
  /////////// STATES
  ///
  const [operationId, setOperationId] = useState<number | null>(null)
  ///
  /////////// SIDE EFFECTS
  ///
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const {
    refetch,
    isLoading: lockLoading,
    isRefetching: lockRefetch,
    isSuccess: lockSuccess,
    data: lock
  } = useFetch<lockStatus_TP>({
    endpoint: "companySettings/api/v1/companysettings/key/lock",
    queryKey: ["lock_status"],
  })

  const {
    mutate,
    isLoading: lockChange,
  } = useMutation({
    mutationFn: (data: MutateDataParameters_TP) =>
      mutateData<lockStatus_TP>(data),
    onSuccess() {
      refetch()
      notify('success', `${t('lock status switched successfully')}`)
    },
  })

  const changeLockStatus = () => {
    const value = lock!.value === "yes" ? "no" : "yes"
    mutate({
      endpointName: "companySettings/api/v1/companysettings/key/lock",
      values: {
        key: "lock",
        value,
        _method: 'put'
      }
    })
  }

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {isError && (
        <div className="mb-5 pr-5">
          <h1 className="text-center text-2xl font-bold">{error.message} </h1>
        </div>
      )}
      {(isLoading || lockLoading || lockRefetch || lockChange) && <Loading mainTitle={`${t('operations')}`} subTitle={`${t('loading')}`} />}
      {(isSuccess && lockSuccess && !isLoading && !lockChange && !lockRefetch) && (
        <div className="p-4">
          <div className="mb-5 pr-5 flex items-center align-middle justify-between">
            <h1 className="text-2xl font-bold">{t('operations')}</h1>
            <div className="flex align-middle gap-3">
              <Button action={() => changeLockStatus()} disabled={lockChange || lockRefetch}>
                {(lock.value === "yes" ? <Lock /> : <Unlock />)}
              </Button>
              <Back />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 gap-y-6">
            {operations?.map((operation) => {
              return (
                  <div className="col-span-1 w-full" key={operation.id}>
                    <ShowButton
                      action={() => setOperationId(operation.id)}
                      viewLabel={operation.name}
                      variant="secondary"
                    />
                  </div>
              )
            })}
          </div>
          <Modal
            isOpen={!!operationId}
            onClose={() => {
              setOperationId(null)
            }}
          >
            <OperationDetails lock={lock.value} operationId={operationId} />
          </Modal>
        </div>
      )}
    </>
  )
}
