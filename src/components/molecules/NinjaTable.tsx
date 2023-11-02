// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CreateRow from "./table/CreateRow"
import TableHeader from "./table/Header"
import { default as TRow } from "./table/Row"
import TableContext from "./table/context"
import {
  type ComputedColumn,
  type ComputedValues,
  type RowsTP,
  type TableProps,
} from "./table/types"

const NinjaTable = <T extends {}>({
  columns,
  data: tableData,
  setData: setTableData,
  selection = "none",
  selected,
  setSelected,
  classNames = {
    table: "table-auto text-center border-black border-1 w-full",
    header: "bg-mainGreen text-white rounded-lg",
    body: "bg-white",
    row: "hover:bg-gray-100 border",
    cell: "p-2",
  },
  creatable = true,
  onAddRow,
  PKey = "id",
  expandable = false,
  getExpandedData,
  collapseLabel = "Collapse",
  expandLabel = "Expand",
}: TableProps<T>) => {

  const actions = useMemo(() => {
    return columns.filter((col) => col.name === "actions")[0]
  }, [columns])

  if (!setTableData) {
    creatable = false
  }
  useEffect(() => {
    setSelected && selection === "single"
      ? setSelected(tableData[0])
      : setSelected && setSelected([tableData[0]])
  }, [])
  // }, [tableData, selection, setSelected])
  // recompute values.
  const [rowAdded, setRowAdded] = useState(false)

  const getCellValueRef =
    useRef<(rowIndex: number, columnName: string) => any>()

  const computedColumns = useMemo(() => {
    return columns.filter((col) => col.compute) as ComputedColumn[]
  }, [columns])

  const computedValues = useMemo(() => {
    const values: ComputedValues = {}

    getCellValueRef.current = (rowIndex: number, columnName: string) => {
      const computedValue = values[rowIndex]?.[columnName]

      if (computedValue !== undefined) {
        return computedValue
      }

      return tableData[rowIndex][columnName]
    }

    computedColumns.forEach((col) => {
      tableData.forEach((_, rowIndex) => {
        if (!values[rowIndex]) {
          values[rowIndex] = {}
        }

        const dependencies = col.compute?.dependencies || []

        const valuesForDependencies = dependencies.reduce(
          (acc, dep) => ({
            ...acc,
            [dep]:
              getCellValueRef.current && getCellValueRef.current(rowIndex, dep),
          }),
          {}
        )

        values[rowIndex][col.name] = col.compute?.formula(valuesForDependencies)
      })
    })

    return values
  }, [computedColumns, tableData])

  const getCellValue = useCallback(
    (rowIndex: number, columnName: string) => {
      const computedValue = computedValues[rowIndex]?.[columnName]

      if (computedValue !== undefined) {
        return computedValue
      }

      return tableData[rowIndex][columnName]
    },
    [tableData, computedValues]
  )

  useEffect(() => {
    if (computedColumns.length > 0) {
      setTableData &&
        setTableData((prevData) => {
          const newData: RowsTP<T> = [...prevData]
          newData.forEach((row, rowIndex) => {
            computedColumns.forEach((col) => {
              const dependencies = col.compute?.dependencies || []

              const valuesForDependencies = dependencies.reduce(
                (acc, dep) => ({
                  ...acc,
                  [dep]: getCellValue(rowIndex, dep),
                }),
                {}
              )

              newData[rowIndex][col.name] = col.compute?.formula(
                valuesForDependencies
              )
            })
          })
          return newData
        })
    }
  }, [rowAdded])
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number
    columnName: string
  } | null>(null)

  const handleCellClick = (rowIndex: number, columnName: string) => {
    setEditingCell({ rowIndex, columnName })
  }

  const handleCellChange = (
    rowIndex: number,
    columnName: string,
    value: any
  ) => {
    const newData: RowsTP<T> = [...tableData]
    if (!newData[rowIndex]) newData[rowIndex] = {}
    newData[rowIndex][columnName] = value

    setTableData &&
      setTableData(newData)
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const addRow = (row: T) => {
    setTableData &&
      setTableData((prevData) => {
        const newData = [...prevData]
        newData.push(row)
        return newData
      })
    setRowAdded((prev) => !prev)
  }

  return (
    <TableContext.Provider
      value={{
        columns,
        rows: tableData,
        getCellValue,
        handleCellChange,
        handleCellBlur,
        editingCell,
        handleCellClick,
        selected,
        setSelected,
        selection,
        classNames,
        addRow,
        onAddRow,
        key: PKey,
        expandable,
        getExpandedData,
        collapseLabel,
        expandLabel,
      }}
    >
      <>
        {/* filters */}
        {/* 
        
        */}
        <table className={classNames.table}>
          <TableHeader />

          <tbody>
            {(tableData as unknown as []).map((_, index) => (
              // Row with T
              <TRow
                key={index}
                rowIndex={index}
                selection={selection}
                selected={selected}
                actions={actions}
                {...(setSelected ? { setSelected } : {})}
              />
            ))}
            {creatable && <CreateRow />}
          </tbody>
        </table>
        {/* Pagination */}
      </>
    </TableContext.Provider>
  )
}

export default NinjaTable
