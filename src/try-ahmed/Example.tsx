/////////// IMPORTS
///
import { createColumnHelper } from "@tanstack/react-table"
import { useFormikContext } from "formik"
import { useMemo, useState } from "react"
import { BaseInputField } from "../components/molecules/formik-fields/BaseInputField"
import { Select } from "../components/molecules"
import { useFetch } from "../hooks/useFetch"
import { initialValues } from "../pages/System"
import { SelectOption_TP } from "../types"
import { TableWithForm } from "./TableWithForm"
///
/////////// Types
///
type ExampleProps_TP = {}
type Band_TP = {
  // ADD THIS IF I NEED ROW INDEX
  index: string
  type: string
  weight: number
  karat: string
  stock: string
  wage: string
  wageTaxes: string
  goldTaxes: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

const defaultData: Band_TP[] = [
  // EACH OBJECT IS A ROW
  {
    // ADD THIS IF I NEED ROW INDEX
    index: "",
    type: "",
    weight: 0,
    karat: "",
    stock: "",
    wage: "",
    wageTaxes: "",
    goldTaxes: "",
  },
  // {
  //   // ADD THIS IF I NEED ROW INDEX
  //   index: "",
  //   type: "opt1",
  //   weight: 0,
  //   karat: "",
  //   stock: "",
  //   wage: "",
  //   wageTaxes: "",
  //   goldTaxes: "",
  // },
]
const columnHelper = createColumnHelper<Band_TP>()

///
export const Example = () => {
  /////////// VARIABLES
  ///
  const [data, setData] = useState(() => [...defaultData])
  const [selectedTypeOption, setSelectedTypeOption] =
    useState<SelectOption_TP>()
  const [selectedKaratOption, setSelectedKaratOption] =
    useState<SelectOption_TP>()

  // FETCH options
  const { data: typeSelectOptions, isLoading: isLoadingTypeSelectOptions } =
    useFetch<SelectOption_TP[]>({
      endpoint: "options",
      queryKey: ["options"],
    })

  // FETCH karats
  const { data: karatSelectOptions, isLoading: isLoadingKaratSelectOptions } =
    useFetch<SelectOption_TP[]>({
      endpoint: "karats",
      queryKey: ["karats"],
    })

  // FETCH stocks
  const { data: stocks, isLoading: isLoadingStocks } = useFetch<
    { karat: string; value: string }[]
  >({
    endpoint: "stocks",
    queryKey: ["stocks"],
  })

  const { values, errors, touched, setFieldValue } =
    useFormikContext<typeof initialValues>()

  const columns =
    useMemo(() =>
    [
      // ADD THIS IF I NEED ROW INDEX
      columnHelper.accessor((row) => row.index, {
        id: "rowNumber",
        cell: (info) => <i>{info.row.index + 1}</i>,
        header: (XX) => <span>Index</span>,
      }),

      // THE REST
      columnHelper.accessor((row) => row.type, {
        cell: (info) => (
          <Select
            name="type"
            id="type"
            options={typeSelectOptions}
            loading={isLoadingTypeSelectOptions}
            placeholder="select"
            fieldKey="id"
            value={selectedTypeOption}
            onChange={(option) => {
              setSelectedTypeOption(option)
            }}
          />
        ),
        id: "type",
        // If we need footer we will add this to every column object
        // footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.weight, {
        cell: (info) => (
          <BaseInputField
            // onChange={(val) => {
            //   // setWeightVal()
            // }}
            id="weight"
            name="weight"
            type="text"
          />
        ),
        id: "weight",
      }),
      columnHelper.accessor((row) => row.karat, {
        cell: (info) => (
          <Select
            name="karat"
            id="karat"
            options={karatSelectOptions}
            loading={isLoadingKaratSelectOptions || isLoadingStocks}
            placeholder="select"
            fieldKey="id"
            value={selectedKaratOption}
            onChange={(option) => {
              setFieldValue("stock", values.karat)
              setSelectedKaratOption(option)
            }}
          />
        ),
        id: "karat",
      }),
      columnHelper.accessor((row) => row.stock, {
        cell: (info) =>
          isLoadingStocks ? (
            "تحميل الأسهم"
          ) : (
            <BaseInputField
              value={
                stocks?.find(
                  (stock) => stock.karat === selectedKaratOption?.value
                )?.value
              }
              id="stock"
              name="stock"
              type="text"
            />
          ),
        id: "stock",
      }),
      columnHelper.accessor((row) => row.goldTaxes, {
        cell: (info) => (
          <BaseInputField
            value={+values.weight * +values.stock}
            id="goldTaxes"
            name="goldTaxes"
            type="text"
          />
        ),
        id: "goldTaxes",
      }),
    ]
    , [
      isLoadingTypeSelectOptions,
      isLoadingKaratSelectOptions,
      isLoadingStocks,
      selectedKaratOption,
      selectedTypeOption,
      // values.weight,
      values.stock,
    ]
  )
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <TableWithForm<Band_TP> data={data} setData={setData} columns={columns} />
    </>
  )
}
