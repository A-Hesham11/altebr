/////////// IMPORTS
///
//import classes from './Colors.module.css'
///
/////////// Types

import { ColumnDef } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo, useState } from "react"
import { useFetch, useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { Back } from "../../../../utils/utils-components/Back"
import { Button } from "../../../atoms"
import { Header } from "../../../atoms/Header"
import { EditIcon, ViewIcon } from "../../../atoms/icons"
import { SvgDelete } from "../../../atoms/icons/SvgDelete"
import { Modal } from "../../../molecules"
import { Loading } from "../../../organisms/Loading"
import { EmptyDataView } from "../../reusableComponants/EmptyDataView"
import { Table } from "../../reusableComponants/tantable/Table"
import StonesColors from "../hashim/StonesColors"

///
export type ViewColors_TP = {
  id: string
  name: string
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const ViewColors = () => {
  /////////// CUSTOM HOOKS
  ///
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(false)
  const [editData, setEditData] = useState<ViewColors_TP>()
  const [deleteData, setDeleteData] = useState<ViewColors_TP>()
  const [dataSource, setDataSource] = useState<ViewColors_TP[]>([])
  const columns = useMemo<ColumnDef<ViewColors_TP>[]>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("Sequence")} </span>,
      },
      {
        header: () => <span>{t("colors")} </span>,
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
  let count = 1
  const {
    data: colors,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useFetch<ViewColors_TP[]>({
    endpoint: `/stones/api/v1/colors`,
    queryKey: [`AllColors`],
    onSuccess(data) {
      setDataSource(data)
    },
    select: (colors) =>
      colors.map((colors) => ({
        ...colors,
        index: count++,
      })),
  })
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<ViewColors_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      setDataSource((prev: ViewColors_TP[]) =>
        prev.filter((p) => p.id !== deleteData?.id)
      )
      setOpen(false)
      notify("success")
    },
  })
  const handleSubmit = () => {
    mutate({
      endpointName: `/governorate/api/v1/cities/${deleteData?.id}`,
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

  ///
  return (
    <div className="p-4">
      {isError && (
        <div className=" m-auto">
          <Header
            className="text-center text-2xl font-bold"
            header={t(`some thing went wrong ${error.response.data.message}`)}
          />
        </div>
      )}
    
      {isSuccess && !!!dataSource?.length && (
        <EmptyDataView>
          <StonesColors />
        </EmptyDataView>
      )}
      {!isLoading && (
        <div className="flex justify-end mb-2">
          <Back />
        </div>
      )}
      {isSuccess && !!dataSource && !!dataSource.length && (
        <Table data={dataSource} showNavigation columns={columns} />
      )}
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        {model ? (
          <StonesColors
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
          />
        ) : (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header header={` حذف : ${deleteData?.name}`} />
            <div className="flex gap-4 justify-center items-cent">
              <Button action={handleSubmit} variant="danger">
                تاكيد
              </Button>
              <Button>اغلاق</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
