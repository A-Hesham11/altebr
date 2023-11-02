import { useQueryClient } from "@tanstack/react-query"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"
import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik"
import { Loading } from "../../components/organisms/Loading"
import { useFetch } from "../../hooks"
import { Query_TP } from "../coding/gold/AddStone"
import { ExpandableTable } from "./ExapndableTable"
import { StoneTable } from "./StoneTable"
/////////// HELPER VARIABLES & FUNCTIONS
///

///
const columnHelper = createColumnHelper<any>()

export const SubTables = ({ subTableData  , addedPieces}: any) => {
  /// variables
  const selectedRow = subTableData.data.filter(
    (item:any) => item.index === subTableData.index
  )
  const columns = useMemo<any>(
    () => [
      columnHelper.accessor("bond_date", {
        header: `${t("supply date")}`,
      }),
      columnHelper.accessor("karat_value", {
        header: `${t("karat value")}`,
      }),
      columnHelper.accessor("size_type", {
        header: `${t("size type")}`,
      }),
      columnHelper.accessor("size_unit_id", {
        header: `${t("size number")}`,
      }),
      columnHelper.accessor("color", {
        header: `${t("color")}`,
      }),
      columnHelper.accessor("country", {
        header: `${t("country")}`,
      }),
      columnHelper.accessor("sellingPrice", {
        header: `${t("selling price")}`,
      }),
    ],
    []
  )
  ////////// STATES
  const [queryData, setQueryData] = useState<any[] | undefined>()

  const queryClient = useQueryClient()

  //@ts-ignore
  const modifiedData = selectedRow.map((item) => ({
    ...item,
    size_type: !!item?.size_type ? item?.size_type : "",
    size_number: !!item?.size_unit_id ? item?.size_unit_id : "",
  }))

  const {data:allCategories , isLoading:categoryLoading , isSuccess} = useFetch({
    endpoint:"/classification/api/v1/categories?type=all",
    queryKey:['categoriesx'],
   })

  useEffect(() => {
    if (queryClient) {
      const categories = allCategories
      const colors = queryClient.getQueryData<Query_TP[]>(["colors"])
      const countries = queryClient.getQueryData<Query_TP[]>(["countries"])

      const allQueries = modifiedData?.map((item:any) => {
        const sizes_types_ids = item.sizes.map((size:any)=>size.size_type)
        const category_sizes =  categories?.map(category=>category?.category_sizes).flat()
        const units_ids = item.sizes.map((size:any)=>size.size_unit_id)
        const category_sizes_units =  categories?.map(category=>category?.category_sizes.map(item=>item.units)).flat(Infinity)

        const finaleItem = {
          categories: !!item?.sizes.length ? category_sizes?.filter(size=> {
            return sizes_types_ids.some((id:any)=> id == size.id)
          }).map(item=>item.type).join(' & ')
          :  categories?.filter(type=>type.category_sizes.length)?.find(type=>type?.id === item?.category_id )?.sizes[0]?.type,

          country: countries?.find((country) => country?.id == item?.country_id)
            ?.name,

          color: colors?.find((color) => color?.id == item?.color_id)?.name,

          size_number: !!item?.sizes.length ?  category_sizes_units?.filter(size=> {
            return units_ids.some(id=> id == size.id)
          }).map(item=>item.value).join(' & ')
          :  category_sizes_units?.filter(unit=> unit.id == item.size_unit_id )[0]?.value ,
        }
        return finaleItem
      })
      setQueryData(allQueries)
    }
  }, [queryClient])

  ///
  //@ts-ignore

  const [data, setData] = useState([])

  useEffect(() => {
    if (queryData) {
      setData(
        modifiedData.map((item,index) => ({
          ...item,
          country: queryData[index]?.country,
          color: queryData[index]?.color,
          size_type:queryData[index]?.categories,
          size_unit_id:queryData[index]?.size_number,
          karat_value: item.karat_value,
          bond_date: item.bond_date,
        }))
      )
    }
  }, [queryData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  ///
  if(categoryLoading && !!queryData && !isSuccess) return <Loading mainTitle={t('loading')} />
  return (
    <>
    <div className="text-center" >
     <ExpandableTable addedPieces={[addedPieces[selectedRow[0].index-1]]} showDetails={false}/>
    </div>
      <div className="flex justify-center items-center">
        <span className="text-center font-bold text-2xl mb-12">
          {t('piece details')}
        </span>
      </div>
      <p className="text-center mx-auto bg-lightGreen p-2 rounded-lg w-[150px] text-mainGreen">
        {t("piece details")}
      </p>
      <div className="p-2 flex justify-center ms-10 w-full ">
        <table className="border-mainGreen shadow-lg mb-7 text-center text-sm font-light w-full">
          <thead className="bg-mainGreen text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-4 border-l-2 border-l-lightGreen first:rounded-r-lg last:rounded-l-lg last:rounded-b-none first:rounded-b-none "
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="border-l-2 border-l-flatWhite text-center h-[40px]"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={`border-l-[#b9b7b7]-500 border  ${
                          !!!cell.getContext().getValue() &&
                          "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {!!cell.getContext().getValue()
                          ? flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          : "---"}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
          <tfoot className="h-[40px]">
            {table
              .getRowModel()
              .rows.map((row) => {
                return (
                  <td colSpan={10} className="text-start px-4" key={row.id}>
                    <span>{selectedRow[0].details} :</span>{" "}
                    <span className="text-l font-bold">
                      {t("piece description")}{" "}
                    </span>
                  </td>
                )
              })
              .slice(0, 1)}
          </tfoot>
        </table>
        <div />

        <div className="p-2 flex flex-col justify-center items-center gap-x-4">
          {!!selectedRow[0].media && selectedRow[0].media.length >= 0 && (
            <FilesPreviewOutFormik
              images={selectedRow[0].media}
              pdfs={[]}
              preview
            />
          )}
        </div>
      </div>
      <StoneTable subTableData={subTableData} />
    </>
  )
}
