/////////// IMPORTS
///
//import classes from './Categories.module.css'
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
import { useFetch, useIsRTL, useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { Back } from "../../../../utils/utils-components/Back"
import { Button } from "../../../atoms"
import { Header } from "../../../atoms/Header"
import { EditIcon, ViewIcon } from "../../../atoms/icons"
import { SvgDelete } from "../../../atoms/icons/SvgDelete"
import {
  BaseInputField,
  InnerFormLayout,
  Modal,
  OuterFormLayout,
} from "../../../molecules"
import { AddButton } from "../../../molecules/AddButton"
import { Loading } from "../../../organisms/Loading"
import { TextLine } from "../../employee/TextLine"
import CreateCategory from "../../reusableComponants/categories/create/CreateCategory"
import { Table } from "../../reusableComponants/tantable/Table"

///
type ViewCategories_TP = {
  id: string
  name: string
}
type ViewSingleCategories_TP = {
  id: string
  name: string
  name_en: string
  selling_type: string
  type: string
  has_size: string
  has_selsal: string
  items: {
    id: string
    name: string
  }[]
  sizes: { type: string }[]
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

///
export const ViewCategories = () => {
  /////////// CUSTOM HOOKS
  ///
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  })
  const [viewSingleCategory, setViewSingleCategory] =
    useState<ViewSingleCategories_TP>()
  const [search, setSearch] = useState("")
  const [editData, setEditData] = useState<ViewCategories_TP>()
  const [deleteData, setDeleteData] = useState<ViewCategories_TP>()
  const [dataSource, setDataSource] = useState<ViewCategories_TP[]>([])
  const [page, setPage] = useState<number>(1)
  const columns = useMemo<ColumnDef<ViewCategories_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("Sequence ")} </span>,
      },
      {
        header: () => <span>{t("categories")} </span>,
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("category type")} </span>,
        accessorKey: "type",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("Selling policy")} </span>,
        accessorKey: "selling_type",
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
                  setViewSingleCategory(info.row.original)
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
  const isRTL = useIsRTL()
  let count = 1
  const {
    data: categories,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
    isRefetching,
  } = useFetch<ViewCategories_TP[]>({
    endpoint:
      search === ""
        ? `classification/api/v1/categories?page=${page}`
        : `classification/api/v1/categories?page=${page}&${
            isRTL ? "nameAr" : "nameEn"
          }[lk]=${search}`,
    queryKey: [`AllCategory`],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data)
    },
    select: (data) => {
      return {
        ...data,
        data: data.data.map((category, i) => ({
          ...category,
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
  } = useMutate<ViewCategories_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: ViewCategories_TP[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(["AllCategory"])
      setOpen(false)
      notify("success")
    },
  })
  const handleSubmit = () => {
    mutate({
      endpointName: `/classification/api/v1/categories/${deleteData?.id}`,
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
  // if (isSuccess && dataSource?.length === 0)
  //   return (
  //     <EmptyDataView>
  //       <CreateCategory />
  //     </EmptyDataView>
  //   )

  ///

  return (
    <div className="p-4">
      <div className="flex justify-between mb-8">
        <h3 className="font-bold">
          {`${t("system establishment")} / ${t("categories")}`}
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
              id="category_search"
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
          {!isLoading && (
            <div className="flex justify-end ms-2">
              <Back />
            </div>
          )}
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
      {(isLoading || isRefetching) && <Loading mainTitle={t("categories")} />}

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
                  {categories.current_page}
                </span>
                {t("from")}
                <span className=" text-mainGreen">{categories.pages}</span>
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
                  disabled={page == categories.pages}
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
        {action.edit && (
          <CreateCategory
            title={`${editData ? t("edit category") : t("add category")}`}
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
          />
        )}
        {model && (
          <CreateCategory
            title={`${editData ? t("edit category") : t("add category")}`}
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
          />
        )}
        {action.delete && (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header header={` حذف : ${deleteData?.name}`} />
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
        {action.view && (
          <OuterFormLayout header={`${t("view details")}`}>
            <InnerFormLayout>
              {/* <div className=" col-span-4 border border-dashed"></div> */}
              <TextLine
                boldText={t("arabic name")}
                lightString={viewSingleCategory?.name}
              />
              <TextLine
                boldText={t("english name")}
                lightString={viewSingleCategory?.name_en}
              />
              <TextLine
                boldText={t("Selling policy")}
                lightString={viewSingleCategory?.selling_type}
              />
              {/* نوع الصنف */}
              {viewSingleCategory?.type === "single" && (
                <TextLine
                  boldText={t("category type")}
                  lightString={viewSingleCategory?.type}
                />
              )}
              {viewSingleCategory?.type === "multi" && (
                <>
                  <TextLine
                    boldText={t("category type")}
                    lightString={viewSingleCategory?.type}
                  />
                  {viewSingleCategory?.items?.map((item, i) => (
                    <div key={item.id}>
                      <TextLine
                        boldText={`${t("category")} ${i + 1}`}
                        lightString={item?.name
                        }
                      />
                    </div>
                  ))}
                </>
              )}
              <div className="col-span-2">
                <TextLine
                  containerClasses="!w-full"
                  boldText={t("category policy")}
                  lightString={
                    viewSingleCategory?.has_selsal ? (
                      <>{`${t("accepts the addition of a chain")}`}</>
                    ) : (
                      <>{`${t("does't accepts additional chain")}`}</>
                    )
                  }
                />
              </div>
              {/* سياسه الصنف */}
              {viewSingleCategory?.has_size && (
                <>
                  <TextLine
                    boldText={t("size policy")}
                    lightString={`${t("got size")}`}
                  />
                  {viewSingleCategory?.sizes?.map((size) => (
                    <TextLine
                      boldText={t("size type")}
                      lightString={size.type}
                    />
                  ))}
                </>
              )}
            </InnerFormLayout>{" "}
          </OuterFormLayout>
        )}
      </Modal>
    </div>
  )
}
