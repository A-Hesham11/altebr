/////////// IMPORTS
///

import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { DeleteIcon } from "../../../components/atoms/icons"
import { Table } from "../../../components/templates/reusableComponants/tantable/Table"
import { useFetch } from "../../../hooks"
import { SetState_TP } from "../../../types"
import { SizePopup_TP } from "../coding-types-and-helpers"

///
/////////// Types
///
type SizesTableProps_TP = {
  sizes: SizePopup_TP[]
  setSizes: SetState_TP<SizePopup_TP[]>
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SizesTable = ({ sizes, setSizes }: SizesTableProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  // const categories = useGetQueryData<Category_TP[]>(["categories"])
    const {data:categories} = useFetch({
      endpoint:"classification/api/v1/categories?type=all",
      queryKey:['all_categories']
    })


  const data = useMemo(
    () =>
      sizes.map((size) => ({
        id: size.id,
        category: categories?.find((categ) => categ.id === size.category_id)
          ?.name,
        size_type: categories
          ?.find((categ) => categ.id === size.category_id)
          ?.sizes?.find((oneSize) => oneSize.id === size.size_type)?.type,
        size_number: categories
          ?.find((categ) => categ.id === size.category_id)
          ?.sizes?.find((oneSize) => oneSize.id === size.size_type)
          ?.units?.find((unit) => unit.id === size.size_unit_id)?.value,
      })),
    [JSON.stringify(sizes), JSON.stringify(categories) , categories]
  )

  const columns: ColumnDef<typeof data>[] = [
    {
      header: "نوع الصنف",
      accessorKey: "category",
    },
    {
      header: "نوع المقاس",
      accessorKey: "size_type",
    },
    {
      header: "المقاس",
      accessorKey: "size_number",
    },
    {
      header: "الفعاليات",
      cell: (info) => (
        <DeleteIcon
          action={() => {
            const row = info.row.original as unknown as SizePopup_TP
            setSizes((curr) => curr.filter((size) => size.id !== row.id))
          }}
          className="mx-auto"
        />
      ),
    },
  ]
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  //   @ts-ignore
  return <Table<typeof data> columns={columns} data={data} />
}
