import { t } from "i18next"
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react"
import { RiArrowGoBackFill, RiErrorWarningFill } from "react-icons/ri"
import { authCtx } from "../../../context/auth-and-perm/auth"
import { useMutate } from "../../../hooks"
import { mutateData } from "../../../utils/mutateData"
import { RecivedItemTP } from "../../../utils/selling"
import { notify } from "../../../utils/toast"
import { Button } from "../../atoms"
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase"
import { ViewIcon } from "../../atoms/icons"
import { Modal } from "../../molecules"
import { Table } from "../../templates/reusableComponants/tantable/Table"
import { ItemDetailsTable } from "./ItemDetailsTable"
import { MdLocalOffer, MdOutlineCancel, MdOutlineLocalOffer } from "react-icons/md"
import { AcceptedItemsAccountingEntry } from "./AcceptedItemsAccountingEntry"
import { Link, useNavigate } from "react-router-dom"
import { FilesUpload } from "../../molecules/files/FileUpload"

type RecieveItemsSecondScreenProps_TP = {
    setStage: Dispatch<SetStateAction<number>>
    selectedItem: RecivedItemTP
    setSanadId?: Dispatch<SetStateAction<number>>
    openModal?: boolean
}
const RecieveItemsSecondScreen = ({ setStage, selectedItem, setSanadId, openModal }: RecieveItemsSecondScreenProps_TP) => {
    const isSanadOpened = selectedItem.bond_status !== 0
    const { userData } = useContext(authCtx)
    const [selectedRows, setSelectedRows] = useState<any>([])
    const [dataSource, setDataSource] = useState({})
    const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [openAcceptModal, setOpenAcceptModal] = useState<boolean>(false)
    const [openRefusedModal, setOpenRefusedModal] = useState<boolean>(false)
    const [isItRefusedAllBtn, setIsItRefusedAllBtn] = useState<boolean>(false)
    const [disableSelectedCheckAfterSendById, setDisableSelectedCheckAfterSendById] = useState([])
    const [files, setFiles] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState('');
    const navigate = useNavigate()
    // side effects
    useEffect(() => {
        setSanadId &&
            setSanadId(selectedItem.id)
    }, [selectedItem])


    const { isLoading: receivedLoading, mutate: mutateReceived, isSuccess: receivedSuccess } = useMutate({
        mutationFn: mutateData,
        onSuccess: () => {
            const uniqueSelectedItems = Array.from(new Set(selectedRows.map(obj => obj.id))).map(id => {
                return selectedRows.find(obj => obj.id === id);
            });
            const filteredArray = selectedItem.items.filter(item => !disableSelectedCheckAfterSendById.includes(item.id) && item.item_status === 'Waiting');
            setOpenAcceptModal(false)
            notify('success')
            setOpenRefusedModal(false)
            if (!isSanadOpened)
                setStage(3)
            if (isSanadOpened && filteredArray.length === uniqueSelectedItems.length) {
                notify('info', `${t('all bond items has been received')}`)
                setStage(1)
            }
            const selectedRowsIds = structuredClone(selectedRows).map(item => item.id)
            setDisableSelectedCheckAfterSendById(prev => [...prev, ...selectedRowsIds])
            setSelectedRows([])
        },
    })
    const { mutate: mutateReject, isLoading: rejectLoading } = useMutate({
        mutationFn: mutateData,
        onSuccess: () => {
            const uniqueSelectedItems = Array.from(new Set(selectedRows.map(obj => obj.id))).map(id => {
                return selectedRows.find(obj => obj.id === id);
            });
            const filteredArray = selectedItem.items.filter(item => !disableSelectedCheckAfterSendById.includes(item.id) && item.item_status === 'Waiting');
            setOpenRefusedModal(false)
            notify('success')
            if (!isSanadOpened)
                setStage(1)
            if (isSanadOpened && filteredArray.length === uniqueSelectedItems.length) {
                notify('info', `${t('all bond items has been reject')}`)
                setStage(1)
            }
            const selectedRowsIds = structuredClone(selectedRows).map(item => item.id)
            setDisableSelectedCheckAfterSendById(prev => [...prev, ...selectedRowsIds])
            setSelectedRows([])
        },
    })

    const handleCheckboxChange = (event: any, selectedRow: any) => {
        const checkboxId = event.target.id;
        if (event.target.checked) {
            setSelectedRows((prevSelectedItems: any) => [...prevSelectedItems, selectedRow.row.original]);
        } else {
            setSelectedRows((prevSelectedItems: any) => prevSelectedItems.filter((item: any) => item.id !== +checkboxId));
        }
    };

    const Cols = useMemo<any>(() => [
        ... (!openModal && isSanadOpened) ? [
            {
                header: () => {
                    const filteredArray = selectedItem.items.filter(item => !disableSelectedCheckAfterSendById.includes(item.id) && item.item_status === 'Waiting');
                    return <input type="checkbox" className="border-mainGreen text-mainGreen rounded" id={crypto.randomUUID()} name="selectedItem"
                     onClick={() => {
                        const allCheckBoxes = document.querySelectorAll('input[type="Checkbox"]')
                        allCheckBoxes.forEach(checkbox => {
                            checkbox.checked = !selectAll;
                        });
                        setSelectAll(!selectAll);
                        setSelectedRows(filteredArray)
                    }} 
                    />
                },
                accessorKey: "action",
                cell: (info: any) => {
                    return (
                        <div className="flex items-center justify-center gap-4">
                            <input type="checkbox" className={`border-mainGreen text-mainGreen rounded ${disableSelectedCheckAfterSendById.includes(info.row.original.id) && 'bg-mainGreen'}`} id={info.row.original.id} name="selectedItem" 
                            onClick={(event) => handleCheckboxChange(event, info)}
                             disabled={disableSelectedCheckAfterSendById.includes(info.row.original.id)}
                             />
                        </div>
                    )
                },
            },
        ] : [],
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "hwya",
            header: () => <span>{t("identification")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "classification",
            header: () => <span>{t("classification")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "category",
            header: () => <span>{t("category")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "mineral",
            header: () => <span>{t("mineral type")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "karat",
            header: () => <span>{t("karat")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "weight",
            header: () => <span>{t("weight")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "wage",
            header: () => <span>{t("wage")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "wage_total",
            header: () => <span>{t("total wages")}</span>,
        },
        {
            cell: (info: any) => info.getValue() == 0 ? '---' : info.getValue(),
            accessorKey: "stones_weight",
            header: () => <span>{t("other stones weight")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "selling_price",
            header: () => <span>{t("selling price")}</span>,
        },
        {
            cell: (info: any) => info.getValue() == 0 ? '---' : info.getValue(),
            accessorKey: "diamond_weight",
            header: () => <span>{t("diamond weight")}</span>,
        },
        {
            cell: (info: any) => <ViewIcon
                size={23}
                action={() => {
                    setModalOpen(true)
                    setSelectedRowDetailsId(info.row.original.id)
                }}
                className="text-mainGreen mx-auto"
            />,
            accessorKey: "view",
            header: () => <span>{t("details")}</span>,
        },
    ],
        [receivedSuccess, disableSelectedCheckAfterSendById]
    )

    useEffect(() => {
        !openModal ?
            setDataSource(selectedItem.items.filter(item => item.item_status === 'Waiting'))
            :
            setDataSource(selectedItem.items)
    }, [disableSelectedCheckAfterSendById, selectedRows])

    // variables 
    // TOTALS
    const total24 = selectedItem.items
        .filter((piece) => piece.karat === "24")
        .reduce((acc, { weight }) => acc + +weight, 0)
    const total22 = selectedItem.items
        .filter((piece) => piece.karat === "22")
        .reduce((acc, { weight }) => acc + +weight, 0)
    const total21 = selectedItem.items
        .filter((piece) => piece.karat === "21")
        .reduce((acc, { weight }) => acc + +weight, 0)
    const total18 = selectedItem.items
        .filter((piece) => piece.karat === "18")
        .reduce((acc, { weight }) => acc + +weight, 0)
    const allItemsCount = selectedItem?.items[0]?.allboxes?.allcounts

    const totals = [
        {
            name: t("عدد القطع"),
            key: crypto.randomUUID(),
            unit: t(""),
            value: allItemsCount,
        },
        {
            name: "إجمالي وزن 24",
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total24,
        },
        {
            name: "إجمالي وزن 22",
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total22,
        },
        {
            name: "إجمالي وزن 21",
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total21,
        },
        {
            name: t("إجمالي وزن 18"),
            key: crypto.randomUUID(),
            unit: t("gram"),
            value: total18,
        },
    ]

    const handleTableSearch = ()=>{
        const matchedHwyaRow = dataSource.filter(item=> item.hwya === searchInputValue)
        setDataSource(matchedHwyaRow)
    }

    return (<>
        <div className="my-8 md:my-16 mx-4 md:mx-16" >
            {
                !openModal &&
                <>
                    <h3 className="font-bold" >{t('receive items in branch')}</h3>
                    <p className="text-sm font-bold mt-2 mb:4 md:mb-8">{t('bonds aggregations')}</p>
                </>
            }
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
            {
                (!dataSource.length && !openModal) ?
                    <>
                        <h2 className="font-bold text-xl mx-auto my-8 text-mainGreen bg-lightGreen p-2 rounded-lg w-fit">{t('bond has been closed')}</h2>
                        <AcceptedItemsAccountingEntry sanadId={selectedItem.id} isInPopup setStage={setStage} isInReceivedComp />
                        {
                            !openModal &&
                            <Button className="mr-auto flex" action={() => setStage(prev => prev - 1)} bordered>{t('back')}</Button>
                        }
                    </>
                    :
                    <>
                        <div className="flex justify-end my-5">
                            {!isSanadOpened && <FilesUpload setFiles={setFiles} files={files} />}
                        </div>
                        {
                            !openModal && <div className="flex justify-between m-4">
                                <div>
                                    <input className="mb-5 shadow-lg rounded p-2" value={searchInputValue} onChange={(e)=>setSearchInputValue(e.target.value)}/>
                                    <Button className="mx-4" disabled={searchInputValue === ''} bordered action={handleTableSearch}>{t('search')}</Button>
                                    <Button className="mx-4" bordered action={()=>{
                                        setDataSource(selectedItem.items.filter(item => item.item_status === 'Waiting'))
                                    }}>{t('empty search')}</Button>
                                </div>
                                <div className="flex flex-col mr-auto items-end justify-end">
                                    <Link to="/selling/payoff/supply-payoff" ><Button bordered>{t('go to payoff')}</Button></Link>
                                    <p className="text-end">{t('selected items count')}:{selectedRows.length}</p>
                                </div>
                            </div>
                        }
                        <Table
                            data={dataSource}
                            columns={Cols}
                        >
                            {/* <div className="mt-3 flex items-center justify-end gap-5 p-2">
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
                </div> */}
                        </Table>
                        <div className="flex justify-between mt-2 md:mt-8" >
                            {
                                (isSanadOpened && !openModal) ?
                                    <div className="flex gap-x-4">
                                        <div className="flex gap-4" >
                                            <Button className="bg-mainOrange text-white" action={() => {
                                                if (selectedRows.length === 0)
                                                    notify('info', `${t('select item at least')}`)
                                                else setOpenAcceptModal(true)

                                            }}>{t('offer selling')}</Button>
                                        </div>
                                        <div className="flex gap-4" >
                                            <Button className="text-mainOrange border-mainOrange" action={() => {
                                                if (selectedRows.length === 0)
                                                    notify('info', `${t('select item at least')}`)
                                                else setOpenRefusedModal(true)

                                            }} bordered >{t('return')}</Button>
                                        </div>
                                    </div>
                                    :
                                    !openModal &&
                                    <div className="flex gap-4" >
                                        <Button className="bg-mainOrange text-white" action={() => {
                                            files.length ?
                                                setOpenAcceptModal(true)
                                                :
                                                notify('info', `${t('attachments is required')}`)
                                        }}>{t('receive all bond')}</Button>
                                        <Button className="border-mainOrange text-mainOrange" action={() => {
                                            setOpenRefusedModal(true)
                                            setSelectedRows(selectedItem.items)
                                            setIsItRefusedAllBtn(true)
                                        }} bordered>{t('refuse all')}</Button>
                                    </div>
                            }
                            {
                                !openModal &&
                                <Button className="mr-auto" action={() => setStage(prev => prev - 1)} bordered>{t('back')}</Button>
                            }
                        </div>
                    </>
            }
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <ItemDetailsTable selectedItem={selectedItem.items} selectedRowDetailsId={selectedRowDetailsId} />
            </Modal>
            <Modal isOpen={openAcceptModal} onClose={() => setOpenAcceptModal(false)} >
                <div className="flex flex-col items-center justify-center gap-y-4" >
                    <RiErrorWarningFill className="text-4xl scale-150 mb-5" fill="#EF432C" />
                    <h3>{t('are you sure to return selected items')}</h3>
                    <div className="flex gap-x-4 mt-5" >
                        <Button
                            loading={receivedLoading}
                            onClick={() => {
                                const selectedItems = selectedRows.map(item => ({
                                    hwya: item.hwya,
                                    item_id: item.item_id,
                                    weight: item.weight,
                                    wage: item.wage,
                                    front: item.front,
                                    id: +selectedItem?.id
                                }));

                                const receivedFinalValue = {
                                    id: selectedItem?.id,
                                    branch_id: userData?.branch_id,
                                    // allItems: selectedItem.items.map(item => item.hwya),
                                    allItems: selectedItem.items.map(item => {
                                            return {
                                                hwya: item.hwya,
                                                front:item.front
                                            }
                                        }),
                                    items: selectedItems,
                                    entity_gold_price: selectedItem?.entity_gold_price,
                                    api_gold_price: selectedItem?.api_gold_price,
                                    type: selectedItem?.type,
                                    // acceptAll: selectedItem.items.length === selectedRows.length ? true : false,
                                    // media: files
                                }
                                console.log("🚀 ~ file: RecieveItemsSecondScreen.tsx:423 ~ RecieveItemsSecondScreen ~ receivedFinalValue:", receivedFinalValue)
                                isSanadOpened ?
                                    mutateReceived({
                                        endpointName: 'branchManage/api/v1/accept-items',
                                        values: receivedFinalValue
                                    })
                                    :
                                    mutateReceived({
                                        endpointName: 'branchManage/api/v1/restriction-items',
                                        values: { ...receivedFinalValue, media: files },
                                        dataType: 'formData'
                                    })


                            }}
                        >{t('confirm')}</Button>
                        <Button
                            bordered
                            onClick={() => {
                                setOpenAcceptModal(false)
                            }}
                        >{t('cancel')}</Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={openRefusedModal} onClose={() => setOpenRefusedModal(false)} >
                <div className="flex flex-col items-center justify-center gap-y-4" >
                    <RiErrorWarningFill className="text-4xl scale-150 mb-5" fill="#EF432C" />
                    <h3>{t('are you sure to reject items')}</h3>
                    <div className="flex gap-x-4 mt-5">
                        <Button
                            loading={rejectLoading}
                            onClick={() => {
                                const selectedItems = selectedRows.map(item => ({
                                    hwya: item.hwya,
                                    item_id: item.item_id,
                                    weight: item.weight,
                                    wage: item.wage,
                                    front: item.front,
                                    id: +selectedItem?.id
                                }));
                                const rejectFinalValue = {
                                    id: selectedItem?.id,
                                    branch_id: userData?.branch_id,
                                    items: selectedItems,
                                    entity_gold_price: selectedItem?.entity_gold_price,
                                    api_gold_price: selectedItem?.api_gold_price,
                                    type: selectedItem?.type,
                                    allRejected: (selectedItem.items.length === selectedRows.length && isItRefusedAllBtn) ? true : false,
                                    ...(isItRefusedAllBtn ? { media: files } : {})
                                }
                                console.log("🚀 ~ file: RecieveItemsSecondScreen.tsx:480 ~ RecieveItemsSecondScreen ~ rejectFinalValue:", rejectFinalValue)
                                setSelectedRows([])
                                mutateReject({
                                    endpointName: 'branchManage/api/v1/reject-items',
                                    values: rejectFinalValue,
                                    dataType: 'formData'
                                })
                            }}
                        >{t('reject')}</Button>
                        <Button
                            bordered
                            onClick={() => {
                                setOpenRefusedModal(false)
                            }}
                        >{t('cancel')}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    </>
    )
}

export default RecieveItemsSecondScreen