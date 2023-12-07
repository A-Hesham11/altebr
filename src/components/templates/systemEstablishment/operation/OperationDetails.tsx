/////////// IMPORTS
///
//import classes from './Operation.module.css'
import { t } from "i18next"
import { useMemo, useState } from "react"
import { SingleValue } from "react-select"
import { useFetch, useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { LineCheck } from "../../../atoms/icons/LineCheck"
import { SelectInput } from "../../../molecules/SelectInput"
import { Loading } from "../../../organisms/Loading"
///
/////////// Types
///

type OperationDetails_TP = { 
  lock?: "yes" | "no"
  operationId: number | null 
}
type RowData_TP = { id: number; numeric_system: number }
type SelectedOption_TP = {
  id: number
  name: string
  numeric_system: number
}
type DetailedOperationAccount_TP = {
  id: number
  operation_id: number
  nature: string
  front_key: string
  name: string
  description: string
  account: SelectedOption_TP
}
type DetailedOperation_TP = {
  id: number
  name: string
  description: string
  front_key: string
  accounts: DetailedOperationAccount_TP[]
}
export type Sub_AccountSelectOption_TP = {
  name: string
  numeric_system: number
  value: string
  label: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OperationDetails = ({ operationId, lock }: OperationDetails_TP) => {
  /////////// VARIABLES
  ///
  const [rowData, setRowData] = useState<RowData_TP | null>()

  ///
  /////////// CUSTOM HOOKS
  ///
  // post
  const { mutate, isLoading: mutateLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success")
      setRowData(null)
    },
  })
  const { data: operation, isLoading: dynamicOperationLoading } =
  useFetch<DetailedOperation_TP>({
    queryKey: [`operation ${operationId}`],
    endpoint: `/accounting/api/v1/operations/${operationId}`,
    enabled: !!operationId,
  })
  
  const { data: selectOptions, isLoading } = useFetch<
  Sub_AccountSelectOption_TP[]
  >({
    queryKey: [`sub_accounts`],
    endpoint: `/accounting/api/v1/all_tree_account`,
    enabled: !!operationId,
    select: (accounts) =>
      accounts.map(({ label, name, value, numeric_system }) => ({
        label: name,
        name,
        value: name,
        numeric_system,
      })),
    })

  const debtorList = useMemo(
    () => operation?.accounts?.filter((acc) => acc.nature === "debtor"),
    [JSON.stringify(operation)]
  )
  
  const creditorList = useMemo(
    () => operation?.accounts?.filter((acc) => acc.nature === "creditor"),
    [JSON.stringify(operation)]
  )
  
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
      {isLoading && <Loading mainTitle="" subTitle="جاري التحميل" />}
      {dynamicOperationLoading && !isLoading && (
        <Loading mainTitle="" subTitle="جاري التحميل" />
      )}
      {operation && (
        <div className="p-4">
          <div className="mb-5 flex justify-start ">
            <h3 className="text-xl font-bold">{operation.name}</h3>
          </div>

          <div className="flex w-full justify-center border-b-2">
            {selectOptions &&
              !!!debtorList?.length &&
              !!!creditorList?.length && (
                <div className="mb-5 pr-5">
                  <h1 className="text-center text-2xl font-bold">لا يوجد </h1>
                </div>
              )}
            {selectOptions && !!debtorList?.length && (
              <div className="mb-4 w-full  border-l-2">
                <div className=" rounded-t-md  bg-mainGreen p-3 text-center text-white">
                  <h3>{t('debtor')}</h3>
                </div>
                {debtorList?.map(
                  ({ id, nature, description, front_key, account }) => (
                    <div
                      key={id}
                      className="ml-10 mt-4 grid grid-cols-2 items-center gap-6 border-b-2 pb-2  last:border-0"
                    >
                      <h4 className=" col-span-1">{description}</h4>
                      <div className="col-span-1 flex items-center justify-center ">
                        <SelectInput
                          isDisabled={isLoading || lock === "yes"}
                          options={selectOptions}
                          //@ts-ignore
                          defaultValue={selectOptions?.find(
                            (option) =>
                              option.numeric_system === account?.numeric_system
                          )}
                          onChange={(
                            option: SingleValue<Sub_AccountSelectOption_TP>
                          ) => {
                            setRowData(() => {
                              if (option?.numeric_system) {
                                return {
                                  id,
                                  numeric_system: option.numeric_system,
                                }
                              }
                            })
                          }}
                        />
                        {rowData && rowData.id === id && (
                          <div
                            className=" group mr-2 cursor-pointer rounded  border bg-mainGreen p-2 hover:border hover:border-mainGreen hover:bg-mainGreen  hover:bg-opacity-10"
                            onClick={() => {
                              mutate({
                                endpointName: `/accounting/api/v1/set/${id}`,
                                values: rowData,
                              })
                            }}
                          >
                            {mutateLoading ? (
                              <div className="border-gree h-4 w-4 animate-spin rounded-full border-b-2"></div>
                            ) : (
                              <LineCheck className=" fill-white group-hover:fill-mainGreen"/>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            {selectOptions && !!creditorList?.length && (
              <div className=" mb-4 w-full">
                <div className=" rounded-t-md  bg-mainGreen p-3 text-center text-white">
                  <h3>{t('creditor')}</h3>{" "}
                </div>
                {creditorList?.map(
                  ({ id, nature, description, front_key, account }) => (
                    <div
                      key={id}
                      className="mr-8 mt-4 grid grid-cols-2 items-center gap-6 border-b-2 pb-2  last:border-0"
                    >
                      <h4 className=" col-span-1">{description}</h4>
                      <div className="col-span-1 flex items-center justify-center ">
                        <SelectInput
                          isDisabled={isLoading || lock === "yes"}
                          loading={isLoading}
                          options={selectOptions}
                          //@ts-ignore
                          defaultValue={selectOptions?.find(
                            (option) =>
                              option.numeric_system === account?.numeric_system
                          )}
                          onChange={(
                            option: SingleValue<Sub_AccountSelectOption_TP>
                          ) => {
                            setRowData(() => {
                              if (option?.numeric_system) {
                                return {
                                  id,
                                  numeric_system: option.numeric_system,
                                }
                              }
                            })
                          }}
                        />
                        {rowData && rowData.id === id && (
                          <div
                            className=" group mr-2 cursor-pointer rounded  border bg-mainGreen p-2 hover:border hover:border-mainGreen hover:bg-mainGreen  hover:bg-opacity-10"
                            onClick={() => {
                              mutate({
                                endpointName: `/accounting/api/v1/set/${id}`,
                                values: rowData,
                              })
                            }}
                          >
                            {mutateLoading ? (
                              <div className="border-gree h-4 w-4 animate-spin rounded-full border-b-2"></div>
                            ) : (
                              <LineCheck className=" fill-white  group-hover:fill-mainGreen" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
