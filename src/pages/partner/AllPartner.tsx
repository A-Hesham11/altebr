/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { BiSearchAlt } from "react-icons/bi"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup'
import { Button } from "../../components/atoms/buttons/Button"
import { Header } from "../../components/atoms/Header"
import { EditIcon, ViewIcon } from "../../components/atoms/icons"
import { SvgDelete } from "../../components/atoms/icons/SvgDelete"
import { BaseInputField, Modal } from "../../components/molecules"
import { AddButton } from "../../components/molecules/AddButton"
import { Loading } from "../../components/organisms/Loading"
import { Table } from "../../components/templates/reusableComponants/tantable/Table"
import { AddPartners } from "../../components/templates/systemEstablishment/partners/AddPartners"
import { useFetch, useIsRTL, useMutate } from "../../hooks"
import { mutateData } from "../../utils/mutateData"
import { notify } from "../../utils/toast"
import { Back } from "../../utils/utils-components/Back"

///
/////////// Types
///
type AllPartnerProps_TP = {
  title: string
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

type partner = {
  id: string
  name: string
  email: string
  phone: string
  end_date: Date
  start_date: Date
  IdNumber: string
  city_id: string
  country_id: string
  nationality_id: string
  national_image: any
  // document type
  docType: string
  docName: string
  docNumber: string
  endDate: Date
  reminder: string
  files: any
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AllPartner = ({ title }: AllPartnerProps_TP) => {
  /////////// VARIABLES
  ///
  const isRTL = useIsRTL()
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [editData, setEditData] = useState<partner>()
  const [deleteData, setDeleteData] = useState<partner>()
  const [dataSource, setDataSource] = useState<partner[]>([])
  const [search, setSearch] = useState('')
  const [permissionError, setPermissionError] = useState()
  const [page, setPage] = useState<number>(1)

  const navigate = useNavigate()
    const columns = useMemo<ColumnDef<partner>[]>(
      () => [
        {
          cell: (info) => info.getValue(),
          accessorKey: "index",
          header: () => <span>{t("Sequence")} </span>,
        },
        {
          header: () => <span>{t("partners")} </span>,
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
                  className="w-4 h-4"
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
                <ViewIcon className="w-4 h-4" action={() => navigate(`${info.row.original.id}`)} />
              </div>
            )
          },
        },
      ],
      []
    )
  ///
  let count = 1

  const {
    data: partners,
    isError,
    isSuccess,
    isFetching,
    error,
    refetch,
    isRefetching,
    isLoading: partnersLoading,
  } = useFetch<partner[]>({
    endpoint: search === '' 
    ? `partner/api/v1/partners?page=${page}?per_page=10000`
    : `partner/api/v1/partners?page=${page}&name[lk]=${search}?per_page=10000`,
    queryKey: ["partner"],
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
    onError: (err) => {setPermissionError(err)},
  })

  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<partner[]>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: partner[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(['partner'])
      setModel(true)
      notify("success")
    },
  })
  const handleSubmit = () => {
    mutate({
      endpointName: `/partner/api/v1/partners/${deleteData?.id}`,
      method: "delete",
    })
  }

  ///
  /////////// STATES
  ///

//     const render = () => {
//         const index = dataSource.findIndex(row => row.id === editData!.id)
//         const updateData = [ ...dataSource ]
//         updateData[index] = { ...editData }
//         setDataSource(updateData)
//   }
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// EVENTS
  ///

  ///
  /////////// FUNCTIONS
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
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="flex items-center justify-between align-middle mb-8">
        <h3 className="font-bold">
          {`${t("system establishment")} / ${t("partners")}`}
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
            header={permissionError?.request.status == "503" ? (t(`you do not have access`)) : (t(`some thing went wrong ${error.message}`))}
          />
        </div>
      )}
      <div className="flex flex-col gap-6 items-center">
        {(partnersLoading || isRefetching) && (
          <Loading mainTitle={t("partners")} />
        )}
        {isSuccess &&
          !partnersLoading &&
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
          !partnersLoading &&
          !isRefetching &&
          !!dataSource.length && (
            <Table data={dataSource} columns={columns}>
              <div className="mt-3 flex items-center justify-end gap-5 p-2">
                <div className="flex items-center gap-2 font-bold">
                  {t("page")}
                  <span className=" text-mainGreen">
                    {partners.current_page}
                  </span>
                  {t("from")}
                  <span className=" text-mainGreen">{partners.pages}</span>
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
                    disabled={page == partners.pages}
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
            <AddPartners
              title={`${editData ? t("edit partner") : t("add Partner")}`}
              dataSource={dataSource}
              editData={editData}
              setModel={setModel}
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