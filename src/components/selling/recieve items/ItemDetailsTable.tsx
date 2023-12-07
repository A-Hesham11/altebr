// import { t } from "i18next"
// import { Table } from "../../templates/reusableComponants/tantable/Table"
// import { useMemo } from "react"
// import { ItemDetailsStoneTable } from "./itemsDetailsStoneTable"
// import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik"

// export const ItemDetailsTable = ({ selectedItem, selectedRowDetailsId }: { selectedItem: any, selectedRowDetailsId: number }) => {

//     const selectedItemDetails = Array.isArray(selectedItem)
//     ?
//     selectedItem.filter((item: any) => item.id === selectedRowDetailsId)[0]?.detailsItem
//     :
//     selectedItem.items.filter((item: any) => selectedItem.id === selectedRowDetailsId)[0]?.detailsItem
//     const images = selectedItemDetails[0]?.attachment

//     const Cols = useMemo<any>(() => [
//         {
//             cell: (info: any) => info.getValue(),
//             accessorKey: "date",
//             header: () => <span>{t("date")}</span>,
//         },
//         {
//             cell: (info: any) => info.getValue(),
//             accessorKey: "color_id",
//             header: () => <span>{t("color")}</span>,
//         },
//         {
//             cell: (info: any) => info.getValue() || '---',
//             accessorKey: "model_number",
//             header: () => <span>{t("model number")}</span>,
//         },
//         {
//             cell: (info: any) => info.getValue() || '---',
//             accessorKey: "size_unit_id",
//             header: () => <span>{t("size")}</span>,
//         },
//         // {
//         //     cell: (info: any) => info.getValue() !== null ? selectedItemDetails[0]?.sizes?.map(item=>item.size_unit_id).join('_') : '---',
//         //     accessorKey: "sizes",
//         //     header: () => <span>{t("size")}</span>,
//         // },
//         {
//             cell: (info: any) => info.getValue() || '---',
//             accessorKey: "country_id",
//             header: () => <span>{t("country")}</span>,
//         },
//         {
//             cell: (info: any) => info.getValue() || '---',
//             accessorKey: "selling_price",
//             header: () => <span>{t("selling price")}</span>,
//         },
//     ],
//         []
//     )

//     return (
//         <div>
//             <p className="text-center mb-2" >{t('piece details')}</p>
//             <Table
//                 data={selectedItemDetails}
//                 columns={Cols}
//             >
//             </Table>
//             <div className="mt-2 md:mt-8 grid grid-cols-12 items-center">
//                 <div className="col-span-11" >
//                     <ItemDetailsStoneTable selectedItem={selectedItem} selectedRowDetailsId={selectedRowDetailsId} />
//                 </div>
//                 <div className="col-span-1 ms-4">
//                     <FilesPreviewOutFormik
//                         images={images}
//                         pdfs={[]}
//                         preview
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }



import { t } from "i18next"
import { Table } from "../../templates/reusableComponants/tantable/Table"
import { useMemo } from "react"
import { ItemDetailsStoneTable } from "./itemsDetailsStoneTable"
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik"

export const ItemDetailsTable = ({ selectedItem, selectedRowDetailsId }: { selectedItem: any, selectedRowDetailsId: number }) => {

    const selectedItemDetails = Array.isArray(selectedItem)
        ?
        selectedItem.filter((item: any) => item.id === selectedRowDetailsId)[0]?.detailsItem
        :
        selectedItem.items.filter((item: any) => selectedItem.id === selectedRowDetailsId)[0]?.detailsItem
    const detailsWeightOfItem = selectedItem.filter((item: any) => item.id === selectedRowDetailsId)[0]?.weightitems
    const images = selectedItemDetails[0]?.attachment

    const Cols = useMemo<any>(() => [
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "date",
            header: () => <span>{t("date")}</span>,
        },
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "color_id",
            header: () => <span>{t("color")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "model_number",
            header: () => <span>{t("model number")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "size_unit_id",
            header: () => <span>{t("size")}</span>,
        },
        // {
        //     cell: (info: any) => info.getValue() !== null ? selectedItemDetails[0]?.sizes?.map(item=>item.size_unit_id).join('_') : '---',
        //     accessorKey: "sizes",
        //     header: () => <span>{t("size")}</span>,
        // },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "country_id",
            header: () => <span>{t("country")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "selling_price",
            header: () => <span>{t("selling price")}</span>,
        },
    ],
        []
    )

    const Cols2 = useMemo<any>(() => [
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "category_name",
            header: () => <span>{t("category")}</span>,
        },
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "weight",
            header: () => <span>{t("weight")}</span>,
        }
    ],
        []
    )

    return (
        <div>
            <p className="text-center mb-2" >{t('piece details')}</p>
            <Table
                data={selectedItemDetails}
                columns={Cols}
            >
            </Table>
            {
                detailsWeightOfItem?.length ?
                    <div className="my-4">
                        <p className="text-center mb-2" >{t('weight details')}</p>
                        <Table
                            data={detailsWeightOfItem}
                            columns={Cols2}
                        >
                        </Table>
                    </div>
                    : ''
            }
            <div className="mt-2 md:mt-8 grid grid-cols-12 items-center">
                <div className="col-span-11" >
                    <ItemDetailsStoneTable selectedItem={selectedItem} selectedRowDetailsId={selectedRowDetailsId} />
                </div>
                <div className="col-span-1 ms-4">
                    <FilesPreviewOutFormik
                        images={images}
                        pdfs={[]}
                        preview
                    />
                </div>
            </div>
        </div>
    )
}
