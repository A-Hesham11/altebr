/////////// IMPORTS
///
import { useEffect, useMemo, useState } from "react"
import { BaseInputField, Modal } from "../../../../molecules"
import { AddButton } from "../../../../molecules/AddButton"
import { t } from "i18next"
import { useFetch, useIsRTL, useMutate } from "../../../../../hooks"
import { Button } from "../../../../atoms"
import { ColumnDef } from '@tanstack/react-table'
import { Table } from "../../tantable/Table"
import { EditIcon } from "../../../../atoms/icons"
import { SvgDelete } from "../../../../atoms/icons/SvgDelete"
import { Header } from "../../../../atoms/Header"
import { mutateData } from "../../../../../utils/mutateData"
import { notify } from "../../../../../utils/toast"
import { Loading } from "../../../../organisms/Loading"
import CreateStoneType from "../create/CreateStoneType"
import { Form, Formik } from "formik"
import * as Yup from 'yup'
import { BiSearchAlt } from "react-icons/bi"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { Back } from "../../../../../utils/utils-components/Back"
import { useQueryClient } from "@tanstack/react-query"

///
/////////// TYPES
///
export type StonesTypes = {
  id: number
  name: string
  name_ar: string
  name_en: string
}

type Search_TP = {
  search: string
}

const initialValues: Search_TP = {
  search: ''
}

const validationSchema = Yup.object({
  search: Yup.string().trim()
})

export const ViewStoneType = () => {
  ///
  /////////// STATES
  ///
  const [dataSource, setDataSource] = useState<StonesTypes[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [model, setModel] = useState<boolean>(false)
  const [editData, setEditData] = useState<StonesTypes>()
  const [deleteData, setDeleteData] = useState<StonesTypes>()
  const [page, setPage] = useState<number>(1)
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const cols = useMemo<ColumnDef<StonesTypes>[]>(
    () => [
      {
        header: `${t('Sequence')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'index',
      },
      {
        header: `${t('Name')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'name',
      },
      {
        header: `${t('actions')}`,
        cell: (info) => 
        <div className="flex items-center justify-center gap-4">
          <EditIcon
            action={() => {
              setOpen((prev) => !prev)
              setEditData(info.row.original)
              setModel(true)
            }}
          />
          <SvgDelete
            action={() => {
              setOpen((prev) => !prev)
              setDeleteData(info.row.original)
              setModel(false)
            }}
            stroke="#ef4444"
          />
        </div>,
        accessorKey: 'edit',
      },
    ],
    []
  )
  ///
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL()
  const { data: types, isLoading, isSuccess, refetch, isRefetching, error } = useFetch<StonesTypes[]>({
    endpoint: search === '' 
    ? `stones/api/v1/stones?page=${page}`
    : `stones/api/v1/stones?page=${page}&${isRTL ? 'nameAr' : 'nameEn'}[lk]=${search}`,
    queryKey: ['view_stones_types'],
    pagination: true,
    onSuccess(data) {setDataSource(data.data)},
    select(data) {
      return {
        ...data,
        data: data.data.map((item, i) => ({
          ...item,
          index: i + 1,
        })),
      }
    },
  })
  const queryClient = useQueryClient()
  const {
    mutate,
    isLoading: isDeleting,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: StonesTypes[]) => prev.filter(p => p.id !== deleteData?.id))
      queryClient.refetchQueries(['view_stones_types'])
      setOpen(false)
      notify("success")
    }
  })

  const handleSubmit = () => {
    mutate({
      endpointName: `stones/api/v1/stones/${deleteData?.id}`,
      method: "delete",
    })
  }

  useEffect(() => {
    refetch()
  }, [page])

  useEffect(() => {
    if (page == 1) {
      refetch()
    } else {
      setPage(1)
    }
  }, [search])

  return (
    <>
      <div className="flex justify-between mb-8">
        <h3 className="font-bold">
          {`${t("system establishment")} / ${t("stones types")}`}
        </h3>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            setSearch(values.search)
          }}
          validationSchema={validationSchema}
        >
          <Form className="flex gap-2 items-center rounded-md border-2 border-slate-200 p-1">
            <BaseInputField
              id="search"
              name="search"
              type="text"
              placeholder={`${t("search")}`}
              className="placeholder-slate-400 p-[.18rem]!shadow-transparent focus:border-transparent"
            />
            <Button type="submit" disabled={isRefetching}>
              <BiSearchAlt
                className={isRefetching ? "fill-mainGreen" : "fill-white"}
              />
            </Button>
          </Form>
        </Formik>
        <div className="flex">
          <AddButton
            action={() => {
              setEditData(undefined)
              setModel(true)
              setOpen(true)
            }}
            addLabel={`${t("add")}`}
          />
          {!isLoading && (
            <div className="flex justify-end ms-2">
              <Back />
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className=" m-auto">
          <Header
            className="text-center text-2xl font-bold"
            header={t(`some thing went wrong ${error?.message}`)}
          />
        </div>
      )}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {model ? (
          <CreateStoneType
            title={`${
              editData ? t("edit stones types") : t("add stones types")
            }`}
            value={editData?.name}
            item={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
          />
        ) : (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header header={` حذف : ${deleteData?.name}`} />
            <div className="flex gap-4 justify-center items-cent">
              <Button
                action={handleSubmit}
                loading={isDeleting}
                variant="danger"
              >
                {`${t("confirm")}`}
              </Button>
              <Button action={() => setOpen(false)}>{`${t("close")}`}</Button>
            </div>
          </div>
        )}
      </Modal>
      <div className="flex flex-col gap-6 items-center">
        {(isLoading || isRefetching) && (
          <Loading mainTitle={t("stones types")} />
        )}
        {isSuccess &&
          !isLoading &&
          !isRefetching &&
          dataSource.length === 0 && (
            <div className="mb-5 pr-5">
              <Header
                header={t("no items")}
                className="text-center text-2xl font-bold"
              />
            </div>
          )}
        {isSuccess &&
          !!dataSource &&
          !isLoading &&
          !isRefetching &&
          !!dataSource.length && (
            <Table data={dataSource} columns={cols}>
              <div className="mt-3 flex items-center justify-end gap-5 p-2">
                <div className="flex items-center gap-2 font-bold">
                  {t("page")}
                  <span className=" text-mainGreen">{types.current_page}</span>
                  {t("from")}
                  <span className=" text-mainGreen">{types.pages}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <Button
                    className=" rounded bg-mainGreen p-[.18rem] "
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
                    className=" rounded bg-mainGreen p-[.18rem] "
                    action={() => setPage((prev) => prev + 1)}
                    disabled={page == types.pages}
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
          )}
      </div>
    </>
  )
}
