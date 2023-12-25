import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { t } from "i18next"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { BiSearchAlt } from "react-icons/bi"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import SellingClientForm, { ClientData_TP } from '../SellingClientForm'
import { authCtx } from '../../../context/auth-and-perm/auth'
import { useFetch, useIsRTL, useMutate } from '../../../hooks'
import { EditIcon, ViewIcon } from '../../atoms/icons'
import { SvgDelete } from '../../atoms/icons/SvgDelete'
import { notify } from '../../../utils/toast'
import { Loading } from '../../organisms/Loading'
import { mutateData } from '../../../utils/mutateData'
import { BaseInputField, Modal } from '../../molecules'
import { Button } from '../../atoms'
import { AddButton } from '../../molecules/AddButton'
import { Back } from '../../../utils/utils-components/Back'
import { Header } from '../../atoms/Header'
import { Table } from '../../templates/reusableComponants/tantable/Table'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { TbBox } from 'react-icons/tb'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { AddClients } from './AddClients'
import { InitialValues_TP } from '../../templates/employee/validation-and-types'
import { IoMdCloseCircleOutline } from 'react-icons/io'

type Search_TP = {
  search: string
}

const initialValues: Search_TP = {
  search: "",
}

const validationSchema = Yup.object({
  search: Yup.string().trim(),
})

const ClientsData = () => {

  const isRTL = useIsRTL()
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [editClientsData, setEditClientsData] = useState<InitialValues_TP>()
  const [showClientsData, setShowClientsData] = useState<InitialValues_TP>()
  const [deleteData, setDeleteData] = useState<ClientData_TP>()
  const [dataSource, setDataSource] = useState<ClientData_TP[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState<number>(1)
  const navigate = useNavigate()
  const {userData} = useContext(authCtx)
  
  const columns = useMemo<ColumnDef<ClientData_TP>[]>(
    () => [
      {
          header: () => <span>{t("Sequence")} </span>,
          cell: (info) => info.getValue(),
          accessorKey: "index",
      },
      {
        header: () => <span>{t("client name")} </span>,
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
          header: () => <span>{t("phone")} </span>,
          accessorKey: "phone",
          cell: (info) => info.getValue(),
      },
      {
          header: () => <span>{t("identity")} </span>,
          accessorKey: "identity",
          cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("action")}</span>,
        accessorKey: "action",
        cell: (info) => {
          
          return (
            <div className="flex items-center justify-center gap-4">
              <ViewIcon 
                size={19}
                className='text-mainGreen'
                action={() => {
                  setOpen((prev) => !prev)
                  setModel(true)
                  setShowClientsData(info.row.original)
                }} 
              />
              <EditIcon
                size={15}
                className='text-mainGreen'
                action={() => {
                  setOpen((prev) => !prev)
                  setModel(true)
                  setEditClientsData(info.row.original)
                }}
              />
              <SvgDelete
                action={() => {
                  setOpen((prev) => !prev)
                  setModel(false)
                  setDeleteData(info.row.original)
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
    data: clients,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    isRefetching,
    isFetching,
  } = useFetch({
    endpoint: search === ""
    ? `/branchManage/api/v1/all-clients/${userData?.branch_id}`
    : `/branchManage/api/v1/all-clients/${userData?.branch_id}?name[eq]=${search}`,
    queryKey: ["all-clients"],
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
    onError: (err) => {
      console.log(err)
    }
      
  })

  

  useEffect(() => {
    refetch()
  }, [])

  /////////// FUNCTIONS & EVENTS
  ///
  const queryClient = useQueryClient()
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["all-clients"])
      // refetch()
      setOpen(false)
      notify("success")
    },
  })

  const handleSubmit = () => {
    mutate({
      endpointName: `/branchManage/api/v1/clients/${deleteData?.id}`,
      method: "delete",
    })
  }

  useEffect(() => {
    refetch()
  }, [page])

  useEffect(() => {
    if (open === false) {
      setShowClientsData()
      setEditClientsData()
    }
  }, [open])

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

  // {isFetching && isLoading && isRefetching && <Loading mainTitle={t("clients")} />}

return (
  <div className="m-10">
    <div className="flex justify-between items-center align-middle mb-8">
      <h3 className="font-bold">
        {`${t("clients")}`}
      </h3>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          
          setSearch(values.search)
        }}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex gap-2 items-center rounded-md border-2 border-slate-200 p-1">
            <BaseInputField
              id="search"
              name="search"
              type="text"
              placeholder={`${t("search")}`}
              className="placeholder-slate-400 p-[.18rem] !shadow-transparent focus:border-transparent"
            />
            {search && (
              <Button 
                type="button" 
                action={() => {
                  setSearch("")
                }}
                disabled={isRefetching} 
                className='bg-transparent border-0 w-fit px-1 py-0'
              >
                <IoMdCloseCircleOutline
                  size={26}
                  className="fill-mainRed "
                />
              </Button>
            )}
            <Button type="submit" disabled={isRefetching}>
              <BiSearchAlt
                className={isRefetching ? "fill-mainGreen" : "fill-white"}
              />
            </Button>
          </Form>
        )}
      </Formik>

      <div className="flex">
        <Button className='flex gap-2 items-center '>
            <TbBox size={22}/>
            <span>{`${t("piece quantity")}`}</span>
        </Button>
        <div className="ms-2">
          <Button className='bg-mainOrange flex gap-2 items-center'
            action={() => {
              setModel(true)
              setOpen(true)
            }}
          >
              <HiOutlineUserAdd size={20}/>
              <span>{`${t("add customer")}`}</span>
          </Button>
        </div>
      </div>
    </div>
    {isError && (
      <div className=" m-auto">
        <Header
          className="text-center text-2xl font-bold"
          header={t(`${error?.response?.data?.errors?.msg}`)}
        />
      </div>
    )}
    <div className="flex flex-col gap-6 items-center">
      {isSuccess &&
        !isFetching &&
        !isLoading &&
        !isRefetching &&
        dataSource.length === 0 && (
          <div className="mb-5 pr-5">
            <Header
              header={t("no items")}
              className="text-center text-2xl font-bold"
            />
          </div>
        )
      }
      {/* {!isSuccess &&
        isFetching &&
        isLoading &&
        isRefetching &&
        dataSource.length === 0 && (
          <Loading mainTitle={t("clients")} />
        )
      } */}
      {/* {!dataSource.length && !isFetching   && <Loading mainTitle={t("جاري التحميل")} />} */}
      {isFetching && (<Loading mainTitle={t("clients")} />)}
      {isSuccess &&
        !isFetching &&
        !isLoading &&
        !isRefetching &&
        dataSource.length && (
          <Table data={dataSource} columns={columns}>
            <div className="mt-3 flex items-center justify-end gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">
                  {clients.current_page}
                </span>
                {t("from")}
                <span className=" text-mainGreen">{clients.pages}</span>
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
                  disabled={page == clients.pages}
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
          <AddClients
            editClientsData={editClientsData}
            setEditClientsData={setEditClientsData}
            showClientsData={showClientsData}
            setShowClientsData={setShowClientsData}
            setDataSource={setDataSource}
            dataSource={dataSource}
            setShow={setOpen}
            isSuccess={isSuccess}
            refetch={refetch}
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
  </div>
)
}

export default ClientsData