/////////// Types
///

import { t } from "i18next"
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { RiErrorWarningFill } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { authCtx } from "../../../context/auth-and-perm/auth"
import { useFetch, useIsRTL, useMutate } from "../../../hooks"
import { mutateData } from "../../../utils/mutateData"
import { notify } from "../../../utils/toast"
import { Button } from "../../atoms"
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase"
import { ViewIcon } from "../../atoms/icons"
import { Modal } from "../../molecules"
import { Loading } from "../../organisms/Loading"
import { Table } from "../../templates/reusableComponants/tantable/Table"
import { ItemDetailsTable } from "../recieve items/ItemDetailsTable"

/////////// HELPER VARIABLES & FUNCTIONS
///
type PayOffSecondScreen_TP = {
  setStage: Dispatch<SetStateAction<number>>
  selectedItem: any
  setSanadId: Dispatch<SetStateAction<number>>
}
///
export const PayOffSecondScreen = ({ setStage, selectedItem, setSanadId }: PayOffSecondScreen_TP) => {
  console.log("🚀 ~ file: PayOffSecondScreen.tsx:30 ~ PayOffSecondScreen ~ selectedItem:", selectedItem)
  /////////// VARIABLES
  ///
  const [openModal, setOpenModal] = useState(false)
  const [retrieveOpenModal, setRetrieveOpenModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const navigate = useNavigate()
  const [page, setPage] = useState<number>(1)
  const { userData } = useContext(authCtx)

  ///
  /////////// CUSTOM HOOKS
  ///
  const [dataSource, setDataSource] = useState([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [disableSelectedCheckAfterSendById, setDisableSelectedCheckAfterSendById] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0)
  console.log("🚀 ~ file: PayOffSecondScreen.tsx:48 ~ PayOffSecondScreen ~ selectedRowDetailsId:", selectedRowDetailsId)

  const isRTL = useIsRTL()
  const { data, isLoading, isSuccess, isRefetching, refetch } = useFetch({
    endpoint: `/branchManage/api/v1/rejected-per-sanad/${selectedItem?.id}?page=${page}`,
    queryKey: ['rejected-per-sanad'],
    pagination: true,
    onSuccess: (data) => {
      setDataSource(data.data)
    }
  })
  const {mutate, isLoading: isMutateLoading, issuccess} = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      setOpenModal(false)
      notify('success')
      setStage(3)
    },
    onError:(error)=>{
      error &&
      notify('info', error?.response?.data.errors.status)
    }
  })
  const {mutate: mutateRetrieve , isLoading: retrieveIsLoading} = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      setRetrieveOpenModal(false)
      notify('success')
      const selectedRowsIds = structuredClone(selectedRows).map(item => item.id)
      setDisableSelectedCheckAfterSendById(prev => [...prev, ...selectedRowsIds])
      refetch()
    },
    onError:(error)=>{
      throw new Error(error)
    }
  })
  const handleCheckboxChange = (event: any, selectedRow: any) => {
    const checkboxId = event.target.id;
    if (event.target.checked) {
      setSelectedRows((prevSelectedItems: any) => [...prevSelectedItems, selectedRow.row.original]);
    } else {
      setSelectedRows((prevSelectedItems: any) => prevSelectedItems.filter((item: any) => item.id !== +checkboxId));
    }
  };

  const goldCols = useMemo<any>(() => [
    {
      header: () => {
        const filteredArray = selectedItem.items.filter(item => !disableSelectedCheckAfterSendById.includes(item.id) && item.item_status === 'Rejected');
        return <input type="checkbox" className="border-mainGreen text-mainGreen rounded" id={crypto.randomUUID()} name="selectedItem" onClick={() => {
          const allCheckBoxes = document.querySelectorAll('input[type="Checkbox"]')
          allCheckBoxes.forEach(checkbox => {
            checkbox.checked = !selectAll;
          });
          setSelectAll(!selectAll);
          setSelectedRows(filteredArray)
        }} />
      },
      accessorKey: "action",
      cell: (info: any) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <input type="checkbox" className={`border-mainGreen text-mainGreen rounded ${disableSelectedCheckAfterSendById.includes(info.row.original.id) && 'bg-mainGreen'}`} id={info.row.original.id} name="selectedItem" onClick={(event) => handleCheckboxChange(event, info)} disabled={disableSelectedCheckAfterSendById.includes(info.row.original.id)} />
          </div>
        )
      },
    },
    {
      cell: (info: any) => info.getValue(),
      accessorKey: "hwya",
      header: () => <span>{t("identification")}</span>,
  },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "classification_id",
      header: () => <span>{t("classification")}</span>,
    },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "karat_id",
      header: () => <span>{t("karat")}</span>,
    },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "wage",
      header: () => <span>{t("wage")} {t('ryal/gram')}</span>,
    },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "stones_weight",
      header: () => <span>{t("stones weight")}</span>,
    },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "diamond_weight",
      header: () => <span>{t("diamond weight")}</span>,
    },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "diamond_value",
      header: () => <span>{t("diamond value")}</span>,
    },
    {
      cell: (info: any) => info.getValue() || "---",
      accessorKey: "thwelbond_id",
      header: () => <span>{t("bond number")}</span>,
    },
    {
      cell: (info: any) => <ViewIcon
        size={23}
        action={() => {
          setOpenDetailsModal(true)
          setSelectedRowDetailsId(info.row.original.id)
          console.log("🚀 ~ file: PayOffSecondScreen.tsx:154 ~ PayOffSecondScreen ~ info.row.original.id:", info.row.original.id)
        }}
        className="text-mainGreen mx-auto"
      />,
      accessorKey: "view",
      header: () => <span>{t("details")}</span>,
    },
  ],
    [disableSelectedCheckAfterSendById, issuccess]
  )
  ///
  const allcounts = dataSource && dataSource[0]?.allboxes.allcounts
  const total24 = dataSource && dataSource[0]?.allboxes.karat24
  const allOgour = dataSource && dataSource[0]?.allboxes.allOgour
  const diamondStone = dataSource && dataSource[0]?.allboxes.diamondAllweight
  const otherStone = dataSource && dataSource[0]?.allboxes.allMotafareqatCount
  ///
  const totals = [
    {
      name: t("total items count"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: allcounts,
    },
    {
      name: t("total net weight 24"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total24,
    },
    {
      name: t("total wages"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: allOgour,
    },
    {
      name: t("total diamond stone weight"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: diamondStone,
    },
    {
      name: t("total other stone weight"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: otherStone,
    },
  ]

  useEffect(() => {
    refetch()
  }, [page])


  useEffect(() => {
    setSanadId &&
      setSanadId(selectedItem.id)
  }, [selectedItem])
  ///
  if (isLoading || isRefetching) return <Loading mainTitle={t("loading")} />
  if (!dataSource?.length) return <div className="flex items-center justify-center py-16 flex-col" >
    <h2 className="bg-mainGray text-mainGreen p-4 rounded font-bold text-xl mb-16">{t('there are no rejected items')}</h2>
    <Button
      bordered
      onClick={() => setStage(1)}
    >{t('back')}</Button>
  </div>
  return <>
    {isSuccess &&
      !!dataSource &&
      !isLoading &&
      !isRefetching &&
      !!dataSource.length && (
        <div className="px-4 md:px-16 py-16">
          <ul className="grid grid-cols-4 gap-6 mb-5">
            {totals.map(({ name, key, unit, value }) => (
              <BoxesDataBase variant="secondary" key={key}>

                <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl" >{name}</p>
                <p className="bg-white px-2 py-[7px] text-black rounded-b-xl" >
                  {value} {t(unit)}
                </p>

              </BoxesDataBase>
            ))}
          </ul>
          <Table
            data={dataSource}
            columns={goldCols}
          >
            <div className="mt-3 flex items-center justify-end gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{data.current_page}</span>
                {t("from")}
                <span className=" text-mainGreen">{data.pages}</span>
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]"
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
                  className="rounded bg-mainGreen p-[.18rem]"
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
          <div className="flex gap-x-4 mt-5" >
            <Button
              onClick={() => {
                setOpenModal(true)
              }
              }
            >{t('return all items to management')}</Button>
            <Button
              bordered
              onClick={() => {
                selectedRows.length ?
                  setRetrieveOpenModal(true)
                  :
                  notify('info', `${t('choose item at least')}`)
              }}
            >{t('retrieving the piece')}</Button>
          </div>
        </div>
      )
    }

    <Modal isOpen={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
      <ItemDetailsTable selectedItem={selectedItem.items} selectedRowDetailsId={selectedRowDetailsId} />
    </Modal>
    <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
      <div className="flex flex-col items-center justify-center gap-y-4" >
        <RiErrorWarningFill className="text-4xl scale-150 mb-5" fill="#EF432C" />
        <h3>{t('confirm return items to management')}</h3>
        <div className="flex gap-x-4 mt-5" >
          <Button
            onClick={() => {
              const allRows = selectedItem.items.filter(item => item.item_status === "Rejected").map(item => item.hwya)
              const receivedFinalValue = {
                id: selectedItem?.id,
                branch_id: userData?.branch_id,
                allItems: selectedItem.items.map(item => item.hwya),
                items: allRows,
                entity_gold_price: selectedItem?.entity_gold_price,
                api_gold_price: selectedItem?.api_gold_price,
                type: selectedItem?.type,
              }
              mutate({
                endpointName: "branchManage/api/v1/restriction-items-rejected",
                values: receivedFinalValue
              })
            }}
            loading={isMutateLoading}
          >{t('confirm')}</Button>
          <Button
            bordered
            onClick={() => setOpenModal(false)}
          >{t('cancel')}</Button>
        </div>
      </div>
    </Modal>

    <Modal isOpen={retrieveOpenModal} onClose={() => setRetrieveOpenModal(false)}>
    <div className="flex flex-col items-center justify-center gap-y-4" >
        <RiErrorWarningFill className="text-4xl scale-150 mb-5" fill="#EF432C" />
        <h3>{t('confirm retrieve items')}</h3>
        <div className="flex gap-x-4 mt-5" >
          <Button
            onClick={() => {
              const retrieveFinalValue = {
                items: selectedRows.map(item => item.hwya),
              }
              mutateRetrieve({
                endpointName: "branchManage/api/v1/change-status-after-mardod",
                values: retrieveFinalValue
              })
            }}
            loading={retrieveIsLoading}
          >{t('confirm')}</Button>
          <Button
            bordered
            onClick={() => setOpenModal(false)}
          >{t('cancel')}</Button>
        </div>
      </div>
    </Modal>
  </>
}