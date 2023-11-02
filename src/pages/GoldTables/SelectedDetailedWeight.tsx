/////////// IMPORTS
///
///
/////////// Types
///

import { useQueryClient } from "@tanstack/react-query"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useFetch } from "../../hooks"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectedDetailedWeight = ({ subTableData }: any) => {
    /////////// VARIABLES
    ///
    const selectedRow = subTableData.data.filter(
        (item: any) => item.index === subTableData.index
    )
    ///
    /////////// CUSTOM HOOKS
    ///
    const queryClient = useQueryClient()
    const { data: allCategories, isLoading: categoryLoading, isSuccess } = useFetch({
        endpoint: "/classification/api/v1/categories?type=all",
        queryKey: ['categoriesx'],
    })
    ///
    /////////// STATES
    ///
    const [queryData, setQueryData] = useState<any[] | undefined>()
    //    const DetailedWeightData = 
    ///
    /////////// SIDE EFFECTS
    ///

    useEffect(() => {
        if (queryClient) {
            const allQueries = selectedRow?.map((item: any) => {
                const Categories_ids = item.weightitems.map((item: any) => item.category_id)
                const categoriesWeights = item.weightitems.map((item: any) => item.weight)
                const finaleItem = {
                    categories: allCategories && Categories_ids.map((categoryDetailedId: any, index: number) => {
                        return (
                            {
                                categoriesname: allCategories.filter((category: any) => categoryDetailedId == category.id).flat()[0]?.name,
                                categoriesWeight: categoriesWeights[index] 
                            }
                        )
                    }
                    )
                }
                return finaleItem.categories
            })
            setQueryData(allQueries)
        }
    }, [queryClient])

    /////////// FUNCTIONS | EVENTS | IF CASES
    ///

    ///
    return <div className="p-8">
        <ul className="grid grid-cols-3">
            {
                queryData?.flat()?.map((item:any) => (
                    <div key={crypto.randomUUID()} className="col-span-1  p-2 rounded flex gap-5 mx-2 my-2">
                        <li className="list-disc"><strong>{t('name')}</strong>: {item.categoriesname}  ({t('weight')}:{item.categoriesWeight})</li>
                        {/* <li><strong>{t('weight')}</strong> :{item.categoriesWeight}</li> */}
                    </div>
                ))
            }
        </ul>
    </div>
}
