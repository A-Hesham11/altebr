/////////// IMPORTS
///
//import classes from './Districts.module.css'
///
/////////// Types

import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { AiFillDelete, AiFillEdit } from "react-icons/ai"
import { useFetch, useIsRTL, useMutate } from "../../../../hooks"
import { ColumnTP } from "../../../molecules/table/types"
import { Loading } from "../../../organisms/Loading"
import { Header } from "../../../atoms/Header"
import { BaseInput, Button, Label } from "../../../atoms"
import { useQueryClient } from "@tanstack/react-query"
import { Table } from "../../reusableComponants/tantable/Table"
import { ColumnDef } from "@tanstack/react-table"
import { EditIcon, ViewIcon } from "../../../atoms/icons"
import { SvgDelete } from "../../../atoms/icons/SvgDelete"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { BaseInputField, Modal } from "../../../molecules"
import { AddDistrict } from "../AddDistrict"
import { EmptyDataView } from "../../reusableComponants/EmptyDataView"
import { Back } from "../../../../utils/utils-components/Back"
import * as Yup from 'yup'
import { Form, Formik } from "formik"
import { BiSearchAlt } from "react-icons/bi"
import { AddButton } from "../../../molecules/AddButton"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
///
export type ViewDistricts_TP = {
  city_id: string
  city_name: string
  country_name: string
  country_id: string
  id: string
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

/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const ViewDistricts = () => {
  /////////// CUSTOM HOOKS
  ///
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [editData, setEditData] = useState<ViewDistricts_TP>()
  const [deleteData, setDeleteData] = useState<ViewDistricts_TP>()
  const [dataSource, setDataSource] = useState<ViewDistricts_TP[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<number>(1)

  const columns = useMemo<ColumnDef<ViewDistricts_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("Sequence")} </span>,
      },
      {
        header: () => <span>{t("districts")} </span>,
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("cities")} </span>,
        accessorKey: "city_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("countries")} </span>,
        accessorKey: "country_name",
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
            </div>
          )
        },
      },
    ],
    []
  )
  const isRTL = useIsRTL()
  let count = 1
  const { data, isLoading, isError, error, refetch, isRefetching, isSuccess } = useFetch<
    ViewDistricts_TP[]
  >({
    endpoint: search === '' 
    ? `governorate/api/v1/districts?page=${page}`
    : `governorate/api/v1/districts?page=${page}&${isRTL ? 'nameAr' : 'nameEn'}[lk]=${search}`,
    queryKey: [`AllDistricts`],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data)
    },
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
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<ViewDistricts_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: ViewDistricts_TP[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(['AllDistricts'])
      setOpen(false)
      notify("success")
    },
  })

  const handleSubmit = () => {
    mutate({
      endpointName: `/governorate/api/v1/districts/${deleteData?.id}`,
      method: "delete",
    })
  }
  /////////// VARIABLES
  ///

  ///
  ///
  /////////// STATES
  ///
  ///
  /////////// SIDE EFFECTS
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
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
  ///
  return (
    <>
      <div className="flex justify-between align-middle mb-8">
        <h3 className="font-bold">
          {`${t("system establishment")} / ${t("districts")}`}
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
              className="placeholder-slate-400 p-[.18rem] !shadow-transparent focus:border-transparent"
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
          <div className="ms-2">
            <Back />
          </div>
        </div>
      </div>
      {isError && (
        <div className=" m-auto">
          <Header
            className="text-center text-2xl font-bold"
            header={t(`some thing went wrong ${error.message}`)}
          />
        </div>
      )}
      <div className="flex flex-col gap-6 items-center">
        {(isLoading || isRefetching) && <Loading mainTitle={t("districts")} />}
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
                    className=" rounded bg-mainGreen p-[.18rem] !border-none"
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
          )}
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false)
          }}
        >
          {model ? (
            <AddDistrict
              title={`${editData ? t("edit district") : t("add district")}`}
              editData={editData}
              setDataSource={setDataSource}
              setShow={setOpen}
            />
          ) : (
            <div className="flex flex-col gap-8 justify-center items-center">
              <Header header={`${t("delete")} : ${deleteData?.name}`} />
              <div className="flex gap-4 justify-center items-cent">
                <Button
                  action={handleSubmit}
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
    </>
  )
}
