import { t } from "i18next"
import { useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { authCtx } from "../../../context/auth-and-perm/auth"
import { useMutate } from "../../../hooks"
import { formatDate } from "../../../utils/date"
import { mutateData } from "../../../utils/mutateData"
import { Button } from "../../atoms"
import InvoiceTable from "../selling components/InvoiceTable"
import { SellingFinalPreview } from "../selling components/SellingFinalPreview"

type CreateHonestSanadProps_TP = {
    setStage: React.Dispatch<React.SetStateAction<number>>
    selectedItem: never[]
    paymentData: never[]
}
const DeliveryBondPreviewScreen = ({ setStage, selectedItem, paymentData }: CreateHonestSanadProps_TP) => {
    const prepaidAmount = selectedItem.amount
    const totalCommissionRatio = paymentData.reduce((acc, card) => {
        acc += +card.commission_riyals
        return acc
    }, 0)
    const ratioForOneItem = totalCommissionRatio / selectedItem.items.length

    const totalCommissionTaxes = paymentData.reduce((acc, card) => {
        acc += +card.commission_tax
        return acc
    }, 0)
    const ratioForOneItemTaxes = totalCommissionTaxes / selectedItem.items.length

    const totalCost = selectedItem.items.reduce((acc, curr) => {
        acc += +curr.cost
        return acc
    }, 0)
    const totalFinalCost = totalCost + totalCommissionRatio + totalCost * .15 + totalCommissionTaxes

    // gather cost data to pass it to SellingFinalPreview as props 
    const costDataAsProps = {
        totalCommissionRatio,
        ratioForOneItem,
        totalCommissionTaxes,
        totalFinalCost,
        totalCost,
        prepaidAmount
    }

    const Cols = useMemo<any>(() => [
        {
            cell: (info: any) => info.getValue(),
            accessorKey: "category_value",
            header: () => <span>{t("category")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "karat_value",
            header: () => <span>{t("karat")}</span>,
        },

        {
            cell: (info: any) => selectedItem.employee_value,
            accessorKey: "employee_value",
            header: () => <span>{t("employee name")}</span>,
        },
        {
            cell: (info: any) => selectedItem.bond_date,
            accessorKey: "receive_date",
            header: () => <span>{t("receive date")}</span>,
        },
        {
            cell: (info: any) => formatDate(new Date()),
            accessorKey: "deliver_date",
            header: () => <span>{t("deliver date")}</span>,
        },
        {
            cell: (info: any) => info.getValue() || '---',
            accessorKey: "weight",
            header: () => <span>{t("weight")}</span>,
        },
        {
            header: () => <span>{t("cost")}</span>,
            accessorKey: "cost",
            cell: (info: any) => {
                const rowData = +info.row.original.cost + +ratioForOneItem
                return (
                    <div>{rowData.toFixed(3)}</div>
                )
            },
        },
        {
            header: () => <span>{t("VAT")}</span>,
            accessorKey: "VAT",
            cell: (info: any) => {
                const rowData = +info.row.original.cost * .15 + +ratioForOneItemTaxes
                return (
                    <div>{rowData.toFixed(3)}</div>
                )
            },
        },
        {
            header: () => <span>{t("total")}</span>,
            accessorKey: "total",
            cell: (info: any) => {
                const rowData = +info.row.original.cost + ratioForOneItem
                const rowDataTaxes = +info.row.original.cost * .15 + ratioForOneItemTaxes
                return (
                    <div>{(rowData + rowDataTaxes).toFixed(3)}</div>
                )
            },
        },
    ], [])

    const TableComp = () => (<InvoiceTable
        data={selectedItem.items.filter(item => item.return_status === 'not_returned')}
        columns={Cols}
        paymentData={paymentData}
    >
    </InvoiceTable>)

    // 
    const navigate = useNavigate()
    // user data
    const { userData } = useContext(authCtx)
    // api 
    const { mutate, isLoading } = useMutate({
        mutationFn: mutateData,
        onSuccess: (data) => {
            navigate(`/selling/honesty/return-honest/${data.bond_id}`)
        }
    })
    const posHonestDataHandler = () => {
        const bond = {
            client_id: selectedItem.client_id,
            employee_id: selectedItem.employee_id,
            amount: selectedItem.amount,
            branch_id: userData?.branch_id,
            bond_date: selectedItem.bond_date,
            total_inovice: totalFinalCost,
            total_vat: totalCost * .15 + totalCommissionTaxes,
            bond_id: selectedItem.id
        }
        const items = selectedItem.items.filter(item => item.return_status === 'not_returned').map(item => {
            const rowData = +item.cost + ratioForOneItem
            const rowDataTaxes = +item.cost * .15 + ratioForOneItemTaxes
            return ({
                category_id: item.category_id,
                bondsafety_id: selectedItem.id,
                karat_id: item.karat_id,
                mineral_id: item.mineral_id,
                karatmineral_id: item.karatmineral_id,
                weight: item.weight,
                cost: +item.cost + +ratioForOneItem,
                vat: +item.cost * .15 + +ratioForOneItemTaxes,
                total: rowData + rowDataTaxes
            })
        })
        const card = paymentData.reduce((acc, curr) => {
            const addDiscountPercentage = curr.add_commission_ratio === 'yes' ? Number(curr.discount_percentage / 100) : 0
            const addTaxToResult = curr.add_commission_ratio === 'yes' ? Number(curr.commission_riyals) * .15 : 0
            acc[curr.frontKeyAccept] = Number(curr.amount) * addDiscountPercentage + +curr.amount + addTaxToResult;
            return acc
        }, {})
        mutate({
            endpointName: 'branchSafety/api/v1/create-receive',
            values: { bond, items, card }
        })
    }
    return (
        <div>
            <h2 className='mb-4 text-base font-bold mx-8'>{t("honest")}</h2>
            <div className='flex items-center justify-between mx-8'>
                <h2 className='text-base font-bold'>{t("final preview")}</h2>
                <div className='flex gap-3'>
                    <Button className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen" onClick={() => window.print()}>{t("print")}</Button>
                    <Button className='bg-mainOrange px-7 py-[6px]' loading={isLoading} action={posHonestDataHandler}>{t("save")}</Button>
                </div>
            </div>
            <SellingFinalPreview ItemsTableContent={<TableComp />} setStage={setStage} paymentData={paymentData} clientData={selectedItem} costDataAsProps={costDataAsProps} />
        </div>
    )
}

export default DeliveryBondPreviewScreen