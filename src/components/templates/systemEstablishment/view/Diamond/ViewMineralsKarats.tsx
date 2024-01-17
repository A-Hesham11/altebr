/////////// IMPORTS
///
//import classes from './Karats.module.css'
///
/////////// Types

import { useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { BiSearchAlt } from "react-icons/bi"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import * as Yup from "yup"
import { useFetch, useIsRTL, useMutate } from "../../../../../hooks"
import { mutateData } from "../../../../../utils/mutateData"
import { notify } from "../../../../../utils/toast"
import { Back } from "../../../../../utils/utils-components/Back"
import { Button } from "../../../../atoms"
import { Header } from "../../../../atoms/Header"
import { EditIcon } from "../../../../atoms/icons"
import { SvgDelete } from "../../../../atoms/icons/SvgDelete"
import { BaseInputField, Modal } from "../../../../molecules"
import { AddButton } from "../../../../molecules/AddButton"
import { Loading } from "../../../../organisms/Loading"
import { Table } from "../../../reusableComponants/tantable/Table"
import AddMineralsKarats from "../../minerals karats/AddMaineralsKarat"

///
export type ViewMineralsKarats_TP = {
  id: string
  name: string
  karatmineral: string
}

type Search_TP = {
  search: string
}

const initialValues: Search_TP = {
  search: "",
}

const validationSchema = Yup.object({
  search: Yup.string().trim(),
})

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const ViewMineralsKarats = () => {
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL()
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [editData, setEditData] = useState<ViewMineralsKarats_TP>()
  const [deleteData, setDeleteData] = useState<ViewMineralsKarats_TP>()
  const [dataSource, setDataSource] = useState<ViewMineralsKarats_TP[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState<number>(1)
  const columns = useMemo<ColumnDef<ViewMineralsKarats_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("Sequence")} </span>,
      },
      {
        header: () => <span>{t("mineral type")} </span>,
        accessorKey: "mineral",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("mineral karat")} </span>,
        accessorKey: "karatmineral",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("karat ratio")} </span>,
        accessorKey: "value",
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
  let count = 1
  const {
    data: karats,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching, 
    isSuccess,
  } = useFetch<ViewMineralsKarats_TP[]>({
    endpoint:
      search === ""
        ? `classification/api/v1/karatminerals?page=${page}`
        : `classification/api/v1/karatminerals?page=${page}&${
         "name"
        }[lk]=${search}`,
    queryKey: [`karatminerals`],
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
  console.log("🚀 ~ file: ViewMineralsKarats.tsx:116 ~ ViewMineralsKarats ~ karats:", karats)


  const queryClient = useQueryClient()
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<ViewMineralsKarats_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: ViewMineralsKarats_TP[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(["karatminerals"])
      setOpen(false)
      notify("success")
    },
  })
  const handleSubmit = () => {
    mutate({
      endpointName: `/classification/api/v1/karatminerals/${deleteData?.id}`,
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
          {`${t("system establishment")} / ${t("minerals karats")}`}
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
        {(isLoading || isRefetching) && (
          <Loading mainTitle={t("minerals karats")} />
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
            <Table data={dataSource} columns={columns}>
              <div className="mt-3 flex items-center justify-end gap-5 p-2">
                <div className="flex items-center gap-2 font-bold">
                  {t("page")}
                  <span className=" text-mainGreen">{karats.current_page}</span>
                  {t("from")}
                  <span className=" text-mainGreen">{karats.pages}</span>
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
                    disabled={page == karats.pages}
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
            <AddMineralsKarats
              title={`${editData ? t("edit karat") : t("add karat")}`}
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
