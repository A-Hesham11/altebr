/////////// IMPORTS
///
import { ColumnDef } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { numberContext } from "../../../context/settings/number-formatter"
import { useFetch } from "../../../hooks"
import { notify } from "../../../utils/toast"
import { Back } from "../../../utils/utils-components/Back"
import { Loading } from "../../organisms/Loading"
import { Table } from "../../templates/reusableComponants/tantable/Table"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const ReturnHonestRestriction = ({ sanadId }: { sanadId?: number }) => {
    /////////// VARIABLES
    ///
    const { bondId } = useParams()
    ///
    /////////// CUSTOM HOOKS
    ///
    const { formatReyal } = numberContext()

    const cols1 = useMemo<any>(() => [
        {
            header: () => <span>{t("category")}</span>,
            accessorKey: "category",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("weight")}</span>,
            accessorKey: "weight",
            cell: (info: any) => info.getValue(),
        },
        {
            header: () => <span>{t("karat")}</span>,
            accessorKey: "karat",
            cell: (info: any) => info.getValue() || '---',
        }
    ],
        []
    )
    const cols2 = useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: `${t('description')}`,
                cell: (info) => info.renderValue(),
                accessorKey: 'bian',
            },
            {
                header: `${t('reyal (debtor)')}`,
                cell: (info) => formatReyal(Number(info.renderValue())),
                accessorKey: 'debtor_SRA',
            },
            {
                header: `${t('reyal (creditor)')}`,
                cell: (info) => formatReyal(Number(info.renderValue())),
                accessorKey: 'creditor_SRA',
            }
        ], []
    )
    ///
    /////////// STATES
    ///
    const [dataSource, setDataSource] = useState([])

    ///
    /////////// SIDE EFFECTS
    ///
    const {
        data: contract,
        isLoading: contractIsLoading,
        isFetching: contractIsFetching,
        isSuccess: contractIsSuccess,
    } = useFetch({
        endpoint: `branchSafety/api/v1/receive-bond-boxes/${sanadId ? sanadId : bondId}`,
        queryKey: [`return-honest-restrict-${sanadId ? sanadId : bondId}`],
        pagination: true,
        select: (contract: any) => {
            return {
                boxes: contract.data.boxes.map(box => {
                    return {
                        id: box.id,
                        account: box.account,
                        value: box.value,
                        unit_id: box.unit_id,
                        computational_movement: box.computational_movement
                    }
                }),
                // allboxes: contract.data[0].rejected_allboxes,
                items: contract.data.items.map(item => ({
                    weight: item.weight,
                    category: item.category_id,
                    karat: item.karat_id,
                    // mineral: item.mineral_id,
                    // karatmineral: item.karatmineral_id,

                })),
                userRestrictionData: {
                    bond_date: contract.data.bond_date,
                    client_id: contract.data.client_id,
                    count_items: contract.data.count_items,
                    employee_id: contract.data.employee_id,
                }
            }
        },
        onSuccess(data) {
            setDataSource(data.items)
        },
        onError: (error) => {
            error &&
                notify('info', error?.response?.data.errors.status)
        }
    })
    // restriction start
    let restrictions = contract?.boxes?.map(
        ({ account, computational_movement, unit_id, value }) => ({
            bian: account,
            debtor_gram:
                computational_movement === "debtor" && unit_id === "gram" ? value : 0,
            debtor_SRA:
                computational_movement === "debtor" && unit_id === "reyal" ? value : 0,
            creditor_gram:
                computational_movement === "creditor" && unit_id === "gram" ? value : 0,
            creditor_SRA:
                computational_movement === "creditor" && unit_id === "reyal" ? value : 0,
        })
    );

    // group by account
    const restrictionsWithoutTotals = restrictions?.reduce((prev, curr) => {
        const index = prev.findIndex((item) => item.bian === curr.bian);
        if (index === -1) {
            prev.push(curr);
        } else {
            prev[index].debtor_gram += curr.debtor_gram;
            prev[index].debtor_SRA += curr.debtor_SRA;
            prev[index].creditor_gram += curr.creditor_gram;
            prev[index].creditor_SRA += curr.creditor_SRA;
        }
        return prev;
    }, [] as typeof restrictions);

    restrictions = restrictionsWithoutTotals;

    let restrictionsTotals;
    if (restrictions && !!restrictions.length) {
        restrictionsTotals = restrictions?.reduce((prev, curr) => ({
            bian: `${t('totals')}`,
            debtor_gram: prev.debtor_gram + curr.debtor_gram,
            debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
            creditor_gram: prev.creditor_gram + curr.creditor_gram,
            creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
        }));
    }

    if (restrictionsTotals) restrictions?.push(restrictionsTotals!);

    /////////// FUNCTIONS | EVENTS | IF CASES
    ///
    if (contractIsLoading || contractIsFetching) return <Loading
        mainTitle={`${t("loading items")}`}
    />
    ///
    return <div className="px-16 mt-8">
        {
            sanadId ? "" :
                <div className="flex justify-end my-8">
                    <Back />
                </div>
        }
        {contractIsSuccess &&
            !contractIsLoading && (
                <>
                    <div className="p-8 rounded bg-white shadow-lg mb-4">
                        <ul className="columns-3 list-disc">
                            <li><span className="font-bold">{t('client name')}: </span>{contract.userRestrictionData.client_id}</li>
                            <li><span className="font-bold">{t('employee name')}: </span>{contract.userRestrictionData.employee_id}</li>
                            <li><span className="font-bold">{t('items count')}: </span>{contract.userRestrictionData.count_items}</li>
                            <li><span className="font-bold">{t('date')}: </span>{new Date(contract.userRestrictionData.bond_date).toISOString().slice(0, 10)}</li>
                        </ul>
                    </div>
                    <Table
                        data={dataSource}
                        columns={cols1}
                    >
                        {!(contractIsLoading || contractIsFetching) && contractIsSuccess && !!restrictions?.length && (
                            <>
                                <h2 className="text-xl mb-5 font-bold">{t('accounting entry')}</h2>
                                <Table data={restrictions} footered showNavigation columns={cols2} />
                            </>
                        )}
                    </Table>
                    {
                        !contract?.boxes.length ?
                            <p className="font-bold text-center mt-16 text-xl">{t('there are no restriction to this bond')}</p>
                            : ''
                    }
                </>
            )}
    </div>
}