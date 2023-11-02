import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { useFetch, useIsRTL, useMutate } from '../../../hooks'
import { useNavigate } from 'react-router-dom'
import { CImageFile_TP } from '../../../types'
import { notify } from '../../../utils/toast'
import { mutateData } from '../../../utils/mutateData'
import { useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Table } from '../reusableComponants/tantable/Table'
import { t } from 'i18next'
import { Button } from '../../atoms'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { EditIcon, ViewIcon, ViewSvgIcon } from '../../atoms/icons'
import { SvgDelete } from '../../atoms/icons/SvgDelete'
import { AddButton } from '../../molecules/AddButton'
import { Back } from '../../../utils/utils-components/Back'
import { Modal } from '../../molecules'
import { Header } from '../../atoms/Header'
import { Loading } from '../../organisms/Loading'
import { CLightbox } from '../../molecules/files/CLightbox'
import { FilesUpload } from '../../molecules/files/FileUpload'
import { FilesPreviewOutFormik } from '../../molecules/files/FilesPreviewOutFormik'
import AddInvoiceData from './AddInvoiceData'

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

const ViewInvoiceData = () => {

  const isRTL = useIsRTL()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const [model, setModel] = useState(false)
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  })
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([])
  console.log("🚀 ~ file: ViewBanks.tsx:55 ~ ViewBanks ~ dataSource:", dataSource)
  const [editData, setEditData] = useState<Cards_Props_TP>()
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>()
  const [page, setPage] = useState<number>(1)
  const [files, setFiles] = useState([]);


  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("Sequence")} </span>,
      },
      {
        header: () => <span>{t("congratulatory sentence")} </span>,
        accessorKey: "sentence",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("congratulation start date")} </span>,
        accessorKey: "start_date",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("congratulation end date")} </span>,
        accessorKey: "expire_date",
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
    endpoint:`/selling/api/v1/congratulations`,
    queryKey: ["congratulatory_sentence"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data?.data)
    },
    select: (data) => {
      return {
        ...data,
        data: data?.data.map((branches, i) => ({
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
      queryClient.refetchQueries(["congratulatory_sentence"])
      setOpen(false)
      notify("success")
    },
  })

  const handleDelete = () => {
    mutate({
      endpointName: `/selling/api/v1/delete_sentence/${deleteData?.id}`,
      method: "delete",
    })
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <p className='font-semibold text-lg'>{t("view sentence congratulatory")}</p>
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
      {isFetching && (<Loading mainTitle={t("congratulatory")} />)}

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
              <p className='text-lg font-bold'>{t("there are no congratulations available yet")}</p>
            </div>
        )
      }

        {/* {!isLoading &&
          !isRefetching &&
          !dataSource?.length && (
            <div>
              <p>{t("there is no available cards yet")}</p>
              kmk
            </div>
        )} */}

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {action.edit && (
          <AddInvoiceData
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
          <AddInvoiceData
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
              header={` حذف : ${
                isRTL ? deleteData?.sentence : deleteData?.sentence
              }`}
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

export default ViewInvoiceData