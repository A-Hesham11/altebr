import { ColumnDef } from '@tanstack/react-table'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useFetch, useIsRTL, useMutate } from '../../../hooks'
import { useNavigate } from 'react-router-dom'
import { CImageFile_TP } from '../../../types'
import { notify } from '../../../utils/toast'
import { mutateData } from '../../../utils/mutateData'
import { useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { Back } from '../../../utils/utils-components/Back'
import { authCtx } from '../../../context/auth-and-perm/auth'
import { EditIcon } from '../../atoms/icons'
import { SvgDelete } from '../../atoms/icons/SvgDelete'
import { AddButton } from '../../molecules/AddButton'
import { Loading } from '../../organisms/Loading'
import { Table } from '../reusableComponants/tantable/Table'
import { Button } from '../../atoms'
import { Modal } from '../../molecules'
import AddSellingPolicies from './AddSellingPolicies'
import { Header } from '../../atoms/Header'

export type Cards_Props_TP = {
  title:string
  main_address: any
  id: string
  address: string
  fax: string
  market_number: string
  name_ar: string
  name_en: string

  number: string
  phone: string
  files: CImageFile_TP[]


}

const ViewSellingPolicies = () => {

  const isRTL = useIsRTL()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const [model, setModel] = useState(false)
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  })
  const [editData, setEditData] = useState<Cards_Props_TP>()
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>()
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([])
  console.log("🚀 ~ ViewSellingPolicies ~ dataSource:", dataSource)
  const [page, setPage] = useState<number>(1)
  const { userData } = useContext(authCtx)


  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("Sequence")} </span>,
        accessorKey: "index",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("job title")} </span>,
        accessorKey: "job_type",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("branch")} </span>,
        accessorKey: "branch_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("minimum sale type")} </span>,
        accessorKey: "min_selling_type",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{`${t("minimum selling")}`}</span>,
        accessorKey: "min_discount_rate" || "min_discount_cash",
        cell: (info) => info.row.original.min_discount_rate ? `${info.row.original.min_discount_rate} %` : info.row.original.min_discount_cash ,
      },
      {
        header: () => <span>{t("number of days response")} </span>,
        accessorKey: "return_days",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("discount upon sale return")} </span>,
        accessorKey: "sales_return",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev)
                  setEditData(info.row.original)
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  })
                  setModel(false)
                }}
                className='fill-mainGreen'
              />
              <SvgDelete
                action={() => {
                  setOpen((prev) => !prev)
                  setDeleteData(info.row.original)
                  setAction({
                    delete: true,
                    view: false,
                    edit: false,
                  })
                  setModel(false)
                }}
                stroke="#ef4444"
              />
            </div>
          )
        },
      },
    ],
    []
  )

  const { data, isSuccess, isLoading, isError, error, isRefetching, refetch, isFetching } =
  useFetch<Cards_Props_TP[]>({
    endpoint:`/selling/api/v1/minimum_selling`,
    queryKey: ["allMinimum_Selling"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data)
    },
    select: (data) => {
      return {
        ...data,
        data: data.data.map((branches, i) => ({
          ...branches,
          index: i + 1,
        })),
      }
    },
  })

  const queryClient = useQueryClient()
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<Cards_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["allMinimum_Selling"])
      setOpen(false)
      notify("success")
    },
  })

  const handleDelete = () => {
    mutate({
      endpointName: `/selling/api/v1/delete_minimum_selling/${deleteData?.id}`,
      method: "delete",
    })
  }

  return (
    <div className=''>
      <div className='flex justify-between items-center mb-8'>
        <p className='font-semibold text-lg'>{t("view selling policies")}</p>
        <div className="flex gap-2">
            <AddButton
              action={() => {
                setEditData(undefined)
                setModel(true)
                setOpen(true)
                setAction({
                  edit: false,
                  delete: false,
                  view: false,
                })
              }}
              addLabel={`${t("add")}`}
            />
            <div className="ms-2">
              <Back />
            </div>
        </div>
      </div>
      {isFetching && (<Loading mainTitle={t("bank accounts")} />)}

      {isSuccess &&
        !isLoading &&
        !isRefetching &&
        dataSource.length ? (
          <Table data={dataSource} columns={columns}>
            <div className="mt-3 flex items-center justify-end gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{data.current_page}</span>
                {t("from")}
                <span className=" text-mainGreen">{data.pages}</span>
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.12rem] "
                  action={() => setPage((prev) => prev - 1)}
                  disabled={page == 1}
                >
                  {isRTL ? (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  )}
                </Button>
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]  "
                  action={() => setPage((prev) => prev + 1)}
                  disabled={page == data.pages}
                >
                  {isRTL ? (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  )}
                </Button>
              </div>
            </div>
          </Table>
        )
        : !isLoading &&
          !isRefetching &&
          !dataSource.length && (
            <div className='flex justify-center items-center mt-32'>
              <p className='text-lg font-bold'>{t("there are no selling policies available yet")}</p>
            </div>
        )
      }

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {action.edit && (
          <AddSellingPolicies
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
            isFetching={isFetching}
            title={`${editData ? t("edit cards") : t("Add cards")}`}
            refetch={refetch}
            isSuccess={isSuccess}
          />
        )}
        {model && (
          <AddSellingPolicies
            editData={editData}
            isFetching={isFetching}
            setDataSource={setDataSource}
            setShow={setOpen}
            title={`${editData ? t("edit cards") : t("Add cards")}`}
            refetch={refetch}
            isSuccess={isSuccess}
          />
        )}
        {action.delete && (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header
              header={` حذف : ${deleteData?.job_type}`}
            />
            <div className="flex gap-4 justify-center items-cent">
              <Button
                action={handleDelete}
                loading={mutateLoading}
                variant="danger"
              >
                {`${t("confirm")}`}
              </Button>
              <Button action={() => setOpen(false)}>{`${t("close")}`}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ViewSellingPolicies