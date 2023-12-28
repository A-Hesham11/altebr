import { t } from "i18next"
import { Table } from "../../templates/reusableComponants/tantable/Table"
import { useMemo } from "react"

export const ItemDetailsStoneTable = ({selectedItem,selectedRowDetailsId}:{selectedItem:any,selectedRowDetailsId:number}) => {
  const selectedItemDetails = Array.isArray(selectedItem) ? 
   selectedItem?.filter((item:any)=> item.id === selectedRowDetailsId)[0]?.detailsItem?.map(stone=>stone?.stonesDetails)[0]
   : 
   selectedItem?.items?.filter((item:any)=> selectedItem?.id === selectedRowDetailsId)[0]?.detailsItem?.map(stone=>stone?.stonesDetails)[0]

  const Cols = useMemo<any>(() => [
    {
        cell: (info: any) => info.getValue() === "added" ? t('added') : t('not added'),
        accessorKey: "stone_type",
        header: () => <span>{t("stone type")}</span>,
    },
    {
        cell: (info: any) => info.getValue(),
        accessorKey: "color_id",
        header: () => <span>{t("color")}</span>,
    },
    {
        cell: (info: any) => info.getValue() || '---',
        accessorKey: "shape_id",
        header: () => <span>{t("stone shape")}</span>,
    },
    {
        cell: (info: any) => info.getValue() || '---',
        accessorKey: "count",
        header: () => <span>{t("stone count")}</span>,
    },
    {
        cell: (info: any) => info.getValue() || '---',
        accessorKey: "purity_id",
        header: () => <span>{t("stone purity")}</span>,
    },
    {
        cell: (info: any) => info.getValue(),
        accessorKey: "nature_id",
        header: () => <span>{t("stone nature")}</span>,
    },
    {
        cell: (info: any) => info.getValue(),
        accessorKey: "certificate_number",
        header: () => <span>{t("certificate number")}</span>,
    },
    {
        cell: (info: any) => info.getValue(),
        accessorKey: "certificate_source",
        header: () => <span>{t("certificate source")}</span>,
    },
    {
        cell: (info: any) =><span className="cursor-pointer" onClick={()=> window.open(info.getValue(), '_blank', 'noopener,noreferrer')}>url</span>,
        accessorKey: "certificate_url",
        header: () => <span>{t("url")}</span>,
    },
],
    []
)
    if (!selectedItemDetails?.length) return <h2 className="text-center font-bold text-xl mt-16 text-mainGreen" >{t('there are no stones in this item')}</h2>
  return (
    <div>
        <p className="text-center mb-2 bg-green-200" >{t('stone details')}</p>
        <Table
                data={selectedItemDetails}
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
    </div>
  )
}

