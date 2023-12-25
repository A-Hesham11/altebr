/////////// IMPORTS
///
//import classes from './ViewSizes.module.css'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import { t } from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { BiSearchAlt } from 'react-icons/bi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup"
import { useFetch, useIsRTL, useMutate } from '../../../../hooks'
import { mutateData } from '../../../../utils/mutateData'
import { notify } from '../../../../utils/toast'
import { Back } from '../../../../utils/utils-components/Back'
import { Button } from '../../../atoms'
import { Header } from '../../../atoms/Header'
import { EditIcon, ViewIcon } from '../../../atoms/icons'
import { SvgDelete } from '../../../atoms/icons/SvgDelete'
import { CreateSizes } from '../../../CreateSizes'
import { BaseInputField, Modal } from '../../../molecules'
import { AddButton } from '../../../molecules/AddButton'
import { Loading } from '../../../organisms/Loading'
import { Table } from '../../reusableComponants/tantable/Table'
///
///
/////////// Types
///
type AllSizesProps_TP = {
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
  
  type size = {
   size:sting
  }
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  
  ///
  export const ViewSizes = ({ title }: AllSizesProps_TP) => {
    /////////// VARIABLES
    ///
    const isRTL = useIsRTL()
    const [open, setOpen] = useState(false)
    const [model, setModel] = useState(false)
    const [editData, setEditData] = useState<any>()
    const [deleteData, setDeleteData] = useState<any>()
    const [dataSource, setDataSource] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState<number>(1)
  
    const navigate = useNavigate()
      const columns = useMemo<ColumnDef<any>[]>(
        () => [
          {
            cell: (info) => info.getValue(),
            accessorKey: "index",
            header: () => <span>{t("Sequence")} </span>,
          },
          {
            header: () => <span>{t("sizes")} </span>,
            accessorKey: "type",
            cell: (info) => info.getValue(),
          },
          {
            header: () => <span>{t("start")} </span>,
            accessorKey: "start",
            cell: (info) => info.getValue(),
          },
          {
            header: () => <span>{t("end")} </span>,
            accessorKey: "end",
            cell: (info) => info.getValue(),
          },
          {
            header: () => <span>{t("increase")} </span>,
            accessorKey: "increase",
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
    ///
    let count = 1
  
    const {
      data: sizes,
      isError,
      isSuccess,
      isFetching,
      error,
      refetch,
      isRefetching,
      isLoading: sizesLoading,
    } = useFetch<any[]>({
      endpoint: search === '' 
      ? `size/api/v1/sizes?page=${page}`
      : `size/api/v1/sizes?page=${page}&type[lk]=${search}`,
      queryKey: ["sizes"],
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
      onError: (err) => console.log(err),
    })
  
  
  
    /////////// CUSTOM HOOKS
    ///
    const queryClient = useQueryClient()
    const {
      mutate,
      error: mutateError,
      isLoading: mutateLoading,
    } = useMutate<any[]>({
      mutationFn: mutateData,
      onSuccess: () => {
        queryClient.refetchQueries(['sizes'])
        setModel(true)
        notify("success")
      },
    })
    const handleSubmit = () => {
      mutate({
        endpointName: `/size/api/v1/sizes/${deleteData?.id}`,
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
        <div className="flex justify-between align-middle mb-8">
          <h3 className="font-bold">
            {`${t("system establishment")} / ${t("sizes")}`}
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
          {(sizesLoading || isRefetching) && <Loading mainTitle={t("sizes")} />}
          {isSuccess &&
            !sizesLoading &&
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
            !sizesLoading &&
            !isRefetching &&
            !!dataSource.length && (
              <Table data={dataSource} columns={columns}>
                <div className="mt-3 flex items-center justify-end gap-5 p-2">
                  <div className="flex items-center gap-2 font-bold">
                    {t("page")}
                    <span className=" text-mainGreen">
                      {sizes.current_page}
                    </span>
                    {t("from")}
                    <span className=" text-mainGreen">{sizes.pages}</span>
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
                      disabled={page == sizes.pages}
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
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false)
          }}
        >
          {model ? (
            <CreateSizes
              editData={editData}
              setModel={setModel}
              title={`${editData ? t("edit size") : t("add size")}`}
            />
          ) : (
            <div className="flex flex-col gap-8 justify-center items-center">
              <Header header={`${t("delete")} : ${deleteData?.size}`} />
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
      </>
    )
  }