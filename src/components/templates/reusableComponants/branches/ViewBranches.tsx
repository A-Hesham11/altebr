/////////// IMPORTS
///
//import classes from './ViewBranches.module.css'
import { t } from "i18next"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useFetch, useIsRTL, useMutate } from "../../../../hooks"
import { Button } from "../../../atoms"
import { Header } from "../../../atoms/Header"
import { Loading } from "../../../organisms/Loading"
import { DeleteIcon, EditIcon, ViewIcon } from "../../../atoms/icons"
import { useEffect, useMemo, useState } from "react"

import { BaseInputField, Modal } from "../../../molecules"
import { CreateBranch } from "./CreateBranch"
import { CImageFile_TP } from "../../../../types"
import { Form, Formik } from "formik"
import { BiSearchAlt } from "react-icons/bi"
import * as Yup from "yup"
import { AddButton } from "../../../molecules/AddButton"
import { Back } from "../../../../utils/utils-components/Back"
import { ColumnDef } from "@tanstack/react-table"
import { SvgDelete } from "../../../atoms/icons/SvgDelete"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { Table } from "../tantable/Table"
import { OneBranches } from "./OneBranches"
import { useQueryClient } from "@tanstack/react-query"
import { notify } from "../../../../utils/toast"
import { mutateData } from "../../../../utils/mutateData"

///
/////////// Types
///
type ViewBranches_Props_TP = {
  title: string
}
export type Branch_Props_TP = {
  main_address: any
  id: string
  address: string
  fax: string
  market_number: string
  name_ar: string
  name_en: string

  number: string
  phone: string
  country: {
    name: string
    id: string
    name_ar: string
    name_en: string
  }
  city: {
    name: string
    id: string
    name_ar: string
    name_en: string
    country: {
      id: string
      name_ar: string
      name_en: string
    }
  }
  district: {
    name: string
    id: string
    name_ar: string
    name_en: string
  }
  market: {
    name: string
    id: string
    name_ar: string
    name_en: string
  }
  nationalAddress: {
    id: string
    address: string
    building_number: string
    city: { id: string; name_ar: string; name_en: string }
    country: { id: string; name_ar: string; name_en: string }
    district: { id: string; name_ar: string; name_en: string }
    street_number: string
    sub_number: string
    zip_code: string
  }
  document: {
    id: string
    data: {
      docName: string
      docNumber: string
      docType: {
        id: string
        label: string
        value: string
      }
      endDate: string
      id: string
      reminder: string
    }
    files: CImageFile_TP[]
  }[]
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
export const ViewBranches = ({ title }: ViewBranches_Props_TP) => {
  /////////// VARIABLES
  ///
  const isRTL = useIsRTL()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const [model, setModel] = useState(false)
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  })
  const [viewSingleBranch, setViewSingleBranch] = useState<Branch_Props_TP>()
  const [search, setSearch] = useState("")
  const [editData, setEditData] = useState<Branch_Props_TP>()
  const [deleteData, setDeleteData] = useState<Branch_Props_TP>()
  const [dataSource, setDataSource] = useState<Branch_Props_TP[]>([])
  const [page, setPage] = useState<number>(1)

  const columns = useMemo<ColumnDef<Branch_Props_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("Sequence ")} </span>,
      },
      {
        header: () => <span>{t("branch")} </span>,
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("address")} </span>,
        accessorKey: "address",
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
              <ViewIcon
                action={() => {
                  navigate(`${info.row.original.id}`)
                  setViewSingleBranch(info.row.original)
                  setOpen((prev) => !prev)
                  setAction({
                    view: true,
                    delete: false,
                    edit: false,
                  })
                  setModel(false)
                }}
              />
            </div>
          )
        },
      },
    ],
    []
  )
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const { data, isSuccess, isLoading, isError, error, isRefetching, refetch } =
    useFetch<Branch_Props_TP[]>({
      endpoint:
        search === `/branch/api/v1/branches?page=${page}`
          ? `/branch/api/v1/branches?page=${page}`
          : `/branch/api/v1/branches?page=${page}&${
              isRTL ? "nameAr" : "nameEn"
            }[lk]=${search}`,
      queryKey: ["AllBranches"],
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
  console.log("data", data)

  const queryClient = useQueryClient()
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<Branch_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: ViewCategories_TP[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(["AllBranches"])
      setOpen(false)
      notify("success")
    },
  })
  const handleSubmit = () => {
    mutate({
      endpointName: `/branch/api/v1/branches/${deleteData?.id}`,
      method: "delete",
    })
  }
  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="flex justify-between mb-5">
        <h2 className="font-bold text-2xl">
          {`${t("system establishment")} / ${t("view branches")}`}
        </h2>

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
      {isSuccess && !isLoading && !isRefetching && dataSource.length === 0 && (
        <div className="mb-5 pr-5">
          <Header
            header={t("no items")}
            className="text-center text-2xl font-bold"
          />
        </div>
      )}
      {isError && (
        <div className=" m-auto">
          <Header
            className="text-center text-2xl font-bold"
            header={t(`some thing went wrong ${error.response.data.message}`)}
          />
        </div>
      )}
      {(isLoading || isRefetching) && (
        <Loading
          subTitle={`${t("loading")}`}
          mainTitle={`${t("branches data are loading")}`}
        />
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
        )}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {action.edit && (
          <CreateBranch
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
            title={`${editData ? t("edit Branch") : t("Add Branch")}`}
          />
        )}
        {model && (
          <CreateBranch
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
            title={`${editData ? t("edit Branch") : t("Add Branch")}`}
          />
        )}
        {action.delete && (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header
              header={` حذف : ${
                isRTL ? deleteData?.name_ar : deleteData?.name_en
              }`}
            />
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
      {action.view && <OneBranches title="كل الفروع" />}
    </>
  )
}
