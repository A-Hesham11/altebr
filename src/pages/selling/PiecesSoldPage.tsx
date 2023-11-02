import { Form, Formik } from "formik"
import { t } from "i18next"
import { useContext, useEffect, useMemo, useState } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { Button } from "../../components/atoms"
import { BoxesDataBase } from "../../components/atoms/card/BoxesDataBase"
import { ViewIcon } from "../../components/atoms/icons"
import { BaseInputField, Modal } from "../../components/molecules"
import { Loading } from "../../components/organisms/Loading"
import { ItemDetailsTable } from "../../components/selling/recieve items/ItemDetailsTable"
import { SelectMineralKarat } from "../../components/templates/reusableComponants/minerals/SelectMineralKarat"
import { Table } from "../../components/templates/reusableComponants/tantable/Table"
import { authCtx } from "../../context/auth-and-perm/auth"
import { useFetch, useIsRTL } from "../../hooks"
import SelectClassification from "../../components/templates/reusableComponants/classifications/select/SelectClassification"
import { useNavigate } from "react-router-dom"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const PiecesSoldPage = () => {
    /////////// VARIABLES
    ///
    const { userData } = useContext(authCtx)
    const [dataSource, setDataSource] = useState({})
    const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState('')
    const isRTL = useIsRTL()
    const navigate = useNavigate();

    const searchValues = {
        id: '',
        hwya: '',
        classification_id: '',
        weight: '',
        wage: '',
    }
    const Cols = useMemo<any>(() => [
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "id",
            header: () => <span>{t("#")}</span>,
        },
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "hwya",
            header: () => <span>{t("identification")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "classification_name",
            header: () => <span>{t("classification")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "category_name",
            header: () => <span>{t("category")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "weight",
            header: () => <span>{t("weight")}</span>,
        },
        {
            header: () => <span>{t("remaining weight")} </span>,
            accessorKey: "remaining_weight",
            cell: (info: any) => info.getValue() || "---",
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "karat_name",
            header: () => <span>{t("gold karat")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "mineral",
            header: () => <span>{t("mineral")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "karatmineral_id",
            header: () => <span>{t("mineral karat")}</span>,
        },
        {
            cell: (info: any) => (+info.getValue()).toFixed(3) || '---',
            accessorKey: "wage",
            header: () => <span>{t("wage")}</span>,
        },
        {
            cell: (info: any) => (info.row.original.weight * info.row.original.wage).toFixed(3),
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
        []
    )
    ///
    /////////// CUSTOM HOOKS
    ///
    const { data, refetch, isSuccess, isRefetching, isLoading } = useFetch({
        queryKey: ['branch-all-accepted-items'],
        pagination: true,
        endpoint: search === '' ? `/selling/api/v1/selling-items/${userData?.branch_id}?page=${page}` : `${search}`,
        onSuccess: (data) => {
            setDataSource(data.data)
        }
    })
    //
    const total24 = data && data?.data[0]?.allboxes.karat24 || 0
    const total22 = data && data?.data[0]?.allboxes.karat22 || 0
    const total21 = data && data?.data[0]?.allboxes.karat21 || 0
    const total18 = data && data?.data[0]?.allboxes.karat18 || 0
    const allItemsCount = data && data?.data[0]?.allboxes.allcounts || 0

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

    useEffect(() => {
        if (page == 1) {
            refetch()
        } else {
            setPage(1)
        }
    }, [search])
    //
    // functions
    const getSearchResults = async (req: any) => {
        let uri = `/selling/api/v1/selling-items/${userData?.branch_id}`
        let first = false
        Object.keys(req).forEach(key => {
            if (req[key] !== '') {
                if (first) {
                    uri += `&${key}[eq]=${req[key]}`
                    first = false
                } else {
                    uri += `?${key}[eq]=${req[key]}`
                }
            }
        })
        setSearch(uri)
    }

    const isLocation = location.pathname;

    ///
    if (isLoading || isRefetching) return <Loading mainTitle={t("loading items")} />
    return <div className="px-8 md:px-16">
        <div>
            <Formik initialValues={searchValues} onSubmit={values => {
                getSearchResults({
                    ...values,
                })
            }}>
                {
                    ({ setFieldValue }) => (
                        <Form className="my-8">
                            <div className="flex items-center justify-between my-8">
                                <p className="font-bold mb-2 text-lg">{t('branch identity management')}</p>
                                <div className="flex items-center gap-4">
                                    <Button 
                                        action={() => {
                                            navigate("/selling/branch-identity")
                                        }}
                                        className={`${isLocation === "/selling/branch-identity" ? "bg-mainOrange text-white" : "bg-transparent border-2 border-mainOrange text-mainOrange"} h-12`}
                                    >
                                        {t("Pieces in the branch")}
                                    </Button>
                                    <Button 
                                        action={() => {
                                            navigate("/selling/Pieces-Sold")
                                        }}
                                        className={`${isLocation === "/selling/Pieces-Sold" ? "bg-mainOrange text-white" : "bg-transparent border-2 border-mainOrange text-mainOrange"} h-12`}
                                    >
                                        {t("Pieces sold")}
                                    </Button>
                                </div>
                            </div>
                            <p className="font-bold mb-2">{t('filter')}</p>
                            <div className="grid grid-cols-4 gap-x-4">
                                <BaseInputField
                                    id="hwya"
                                    name="hwya"
                                    label={`${t('identification')}`}
                                    placeholder={`${t('identification')}`}
                                    className="shadow-xs"
                                    type="text"
                                />
                                <BaseInputField
                                    id="weight"
                                    name="weight"
                                    label={`${t('weight')}`}
                                    placeholder={`${t('weight')}`}
                                    className="shadow-xs"
                                    type="text"
                                />
                                <BaseInputField
                                    id="wage"
                                    name="wage"
                                    label={`${t('wage')}`}
                                    placeholder={`${t('wage')}`}
                                    className="shadow-xs"
                                    type="text"
                                />
                                <SelectMineralKarat showLabel showMineralKarat={false} />
                                <SelectClassification
                                    name="classification_id"
                                    field="id"
                                    label={`${t('classification')}`}
                                />
                            </div>
                            <Button type="submit" disabled={isRefetching} className="flex h-[38px] mr-auto">
                                {t('search')}
                            </Button>
                        </Form>

                    )
                }
            </Formik>
        </div>
        <p className="text-sm font-bold mt-2 mb:4 md:mb-8">{t('bonds aggregations')}</p>
        <ul className="grid grid-cols-4 gap-6 mb-5">
            {totals.map(({ name, key, unit, value }) => (
                <BoxesDataBase variant="secondary" key={key}>

                    <p className="bg-mainGreen px-2 py-4 flex items-center justify-center rounded-t-xl" >{name}</p>
                    <p className="bg-white px-2 py-[7px] text-black rounded-b-xl" >
                        {value} {t(unit)}
                    </p>

                </BoxesDataBase>
            ))}
        </ul>
        {isSuccess &&
            !!dataSource &&
            !isLoading &&
            !isRefetching &&
            !!dataSource.length && (
                <Table data={dataSource}
                    columns={Cols}
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
            )}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <ItemDetailsTable selectedItem={data?.data} selectedRowDetailsId={selectedRowDetailsId} />
        </Modal>
    </div>
}