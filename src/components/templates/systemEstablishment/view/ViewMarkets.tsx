/////////// IMPORTS
///
//import classes from './Markets.module.css'
///
/////////// Types

import { useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import * as Yup from 'yup'
import { useFetch, useIsRTL, useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { Back } from "../../../../utils/utils-components/Back"
import { Button } from "../../../atoms"
import { Header } from "../../../atoms/Header"
import { EditIcon, ViewIcon } from "../../../atoms/icons"
import { SvgDelete } from "../../../atoms/icons/SvgDelete"
import { BaseInputField, Modal } from "../../../molecules"
import { AddButton } from "../../../molecules/AddButton"
import { Loading } from "../../../organisms/Loading"
import { Table } from "../../reusableComponants/tantable/Table"
import { AddMarket } from "../markets/AddMarket"

///
export type ViewMarkets_TP = {
  district_id: string
  district_name: string
  city_name: string
  country_name: string
  name_ar: string
  name_en: string
  id: string
  name: string
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
export const ViewMarkets = () => {
  /////////// CUSTOM HOOKS
  ///
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [editData, setEditData] = useState<ViewMarkets_TP>()
  const [deleteData, setDeleteData] = useState<ViewMarkets_TP>()
  const [dataSource, setDataSource] = useState<ViewMarkets_TP[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<number>(1)
  const columns = useMemo<ColumnDef<ViewMarkets_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("Sequence ")} </span>,
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
        header: () => <span>{t("district")} </span>,
        accessorKey: "district_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("markets")} </span>,
        accessorKey: "name",
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
  const {
    data: markets,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    isSuccess,
  } = useFetch<ViewMarkets_TP[]>({
    endpoint: search === '' 
    ? `governorate/api/v1/markets?page=${page}`
    : `governorate/api/v1/markets?page=${page}&${isRTL ? 'nameAr' : 'nameEn'}[lk]=${search}`,
    queryKey: [`AllMarkets`],
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
  } = useMutate<ViewMarkets_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: ViewMarkets_TP[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(['AllMarkets'])
      setOpen(false)
      notify("success")
    },
  })
  const handleSubmit = () => {
    mutate({
      endpointName: `/governorate/api/v1/markets/${deleteData?.id}`,
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
          {`${t("system establishment")} / ${t("markets")}`}
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
        {(isLoading || isRefetching) && <Loading mainTitle={t("markets")} />}
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
                  <span className=" text-mainGreen">
                    {markets.current_page}
                  </span>
                  {t("from")}
                  <span className=" text-mainGreen">{markets.pages}</span>
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
                    disabled={page == markets.pages}
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
            <AddMarket
              title={`${editData ? t("edit market") : t("add market")}`}
              editData={editData}
              setEditData={setEditData}
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
