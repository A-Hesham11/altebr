import { ColumnDef } from "@tanstack/react-table"
import { t } from "i18next"
import { Dispatch, SetStateAction, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { numberContext } from "../../context/settings/number-formatter"
import { useFetch, useMutate } from "../../hooks"
import { FinalData_TP, Supply_TP } from "../../pages/supply/Supply"
import { formatDate } from "../../utils/date"
import { mutateData } from "../../utils/mutateData"
import { notify } from "../../utils/toast"
import { Button } from "../atoms"
import { OuterFormLayout } from "../molecules"
import { KaratValues_TP } from "../templates/reusableComponants/gold-table/GoldTableForm"
import { Table } from "../templates/reusableComponants/tantable/Table"
import { Box_TP, BoxesView } from "./BoxesView"
import { FirstFormView } from "./FirstFormView"
import { OTableDataTypes } from "./SupplySecondForm"
import { FirstFormInitValues_TP } from "./formInitialValues_types"

/////////// HELPER VARIABLES & FUNCTIONS
///
type GoldSupplyFinalFormProps_TP = {
  supply: Supply_TP
  boxesView: Box_TP[] | undefined
  formValues: FirstFormInitValues_TP | undefined
  setStage: Dispatch<SetStateAction<number>>
  setFormValues: Dispatch<
    SetStateAction<FirstFormInitValues_TP | undefined>
  >
  finalData: FinalData_TP | undefined
}
///
export const SupplyFinalForm = ({
  supply,
  boxesView,
  formValues,
  setStage,
  setFormValues,
  finalData,
}: GoldSupplyFinalFormProps_TP) => {
  console.log("🚀 ~ formValues:", formValues)
  /////////// VARIABLES
  ///
  const { formatGram, formatReyal } = numberContext()
  const navigate = useNavigate()
  const cols = supply == 'gold' ? useMemo<ColumnDef<OTableDataTypes>[]>(
    () => [
      {
        header: `${t("index")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "number",
      },
      {
        header: `${t("categories")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "category_value",
      },
      {
        header: `${t("weight")}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: "weight",
      },
      {
        header: `${t("karats")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "karat_value",
      },
      {
        header: `${t("stocks")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "stock",
      },
      {
        header: `${t("wage")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "wage",
      },
      {
        header: `${t("total wages")}`,
        cell: (info: any) => formatReyal(info.renderValue()),
        // formatReyal(info.row.original.weight * info.row.original.wage),
        accessorKey: "total_wages",
      },
      {
        header: `${t("wage tax")}`,
        cell: (info: any) => formatReyal(info.renderValue()),
        //formatReyal(info.row.original.weight * info.row.original.wage * 0.15),
        accessorKey: "wage_tax",
      },
      {
        header: `${t("gold tax")}`,
        cell: (info: any) => formatReyal(info.renderValue()),
        accessorKey: "gold_tax",
      },
    ],
    []
  ) : supply == 'diamond' ? useMemo<ColumnDef<OTableDataTypes>[]>(
    () => [
      {
        header: `${t("#")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "number",
      },
      {
        header: `${t("categories")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "category_value",
      },
      {
        header: `${t("mineral type")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "mineral_value",
      },
      {
        header: `${t("mineral weight")}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: "gold_weight",
      },
      {
        header: `${t("karats")}`,
        cell: (info) => info.renderValue(),
        accessorKey: "karat_value",
      },
      {
        header: `${t("diamond value")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "diamond_value",
      },
      {
        header: `${t("diamond value ryal")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "diamond_value_ryal",
      },
      {
        header: `${t("diamond amount")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "diamond_amount",
      },
      {
        header: `${t("diamond stone weight")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "diamond_stone_weight",
      },
      {
        header: `${t("other stones weight")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "other_stones_weight",
      },
      {
        header: `${t("weight")}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: "weight",
      },
      {
        header: `${t("diamond tax")}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: "diamond_tax",
      },
    ],
    []
  ) :
    useMemo<ColumnDef<OTableDataTypes>[]>(
      () => [
        {
          header: `${t("#")}`,
          cell: (info) => info.renderValue(),
          accessorKey: "number",
        },
        {
          header: `${t("categories")}`,
          cell: (info) => info.renderValue(),
          accessorKey: "category_value",
        },
        {
          header: `${t("mineral type")}`,
          cell: (info) => info.renderValue(),
          accessorKey: "mineral_value",
        },
        {
          header: `${t("mineral weight")}`,
          cell: (info) => formatGram(Number(info.renderValue())),
          accessorKey: "gold_weight",
        },
        {
          header: `${t("karats")}`,
          cell: (info) => info.renderValue(),
          accessorKey: "karat_value",
        },
        {
          header: `${t("accessory value")}`,
          cell: (info) => formatReyal(Number(info.renderValue())),
          accessorKey: "accessory_value",
        },
        {
          header: `${t("accessory value ryal")}`,
          cell: (info) => formatReyal(Number(info.renderValue())),
          accessorKey: "accessory_value_ryal",
        },
        {
          header: `${t("accessory amount")}`,
          cell: (info) => formatReyal(Number(info.renderValue())),
          accessorKey: "accessory_amount",
        },
        // {
        //   header: `${t("accessory weight")}`,
        //   cell: (info) => formatReyal(Number(info.renderValue())),
        //   accessorKey: "accessory_weight",
        // },
        {
          header: `${t("other stones weight")}`,
          cell: (info) => formatReyal(Number(info.renderValue())),
          accessorKey: "other_stones_weight",
        },
        {
          header: `${t("weight")}`,
          cell: (info) => formatGram(Number(info.renderValue())),
          accessorKey: "weight",
        },
        {
          header: `${t("accessory tax")}`,
          cell: (info) => formatReyal(Number(info.renderValue())),
          accessorKey: "accessory_tax",
        },
      ],
      []
    )

  ///
  /////////// CUSTOM HOOKS
  ///
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess(data: { id: number } | undefined) {
      notify("success")
      navigate(supply === 'gold' ? `/gold-bonds/${data!.id}` : supply === 'diamond' ? `/diamond-bonds/${data!.id}` : `/accessory-bonds/${data!.id}`)
    },
  })
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///
  const { data: karatValues } = useFetch<KaratValues_TP[]>({
    endpoint: 'classification/api/v1/allkarats',
    queryKey: ['karat_bond_select'],
  })
  const { data: boxesResponse, isLoading: boxesLoading } = useFetch<any>({
    endpoint: supply === 'gold'
      ? `twredGold/api/v1/boxes/${formValues?.supplier_id}`
      : supply === 'diamond' ? `twredDiamond/api/v1/boxes/${formValues?.supplier_id}`
        : `twredAccessory/api/v1/boxes/${formValues?.supplier_id}`,
    queryKey: supply === 'gold' ? ["gold_boxes_response"] : supply === 'diamond' ? ["diamond_boxes_response"] : ["accessory_boxes_response"],
  })
  console.log("🚀 ~ boxesResponse:", boxesResponse)


  const getMyKarat = (value: string) => {
    const myKarat = karatValues!.find(item => item.karat === value)
    return myKarat!.value
  }

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const getTotalWages = () => {
    let prev = 0
    finalData?.table.forEach((row) => {
      prev = Number(prev) + Number(row.total_wages)
    })
    return prev
  }

  const mapBox = supply == 'gold' ? (item: any) => {
  console.log("🚀 ~ mapBox ~ item:", item)
    switch (item.front_key) {
      case "gold_18":
        return {
          ...item,
          value: finalData?.boxes.karat_18_aggregate,
        }
      case "gold_21":
        return {
          ...item,
          value: finalData?.boxes.karat_21_aggregate,
        }
      case "gold_22":
        return {
          ...item,
          value: finalData?.boxes.karat_22_aggregate,
        }
      case "gold_24":
        return {
          ...item,
          value: finalData?.boxes.karat_24_aggregate,
        }
      case "total_tax":
        return {
          ...item,
          value: finalData?.boxes.total_tax,
        }
      case "total_wages":
        return {
          ...item,
          value: getTotalWages(),
        }
      case "goldpurities":
        let total_24_gold_by_stock = 0
        finalData!.table.forEach((row) => {
          total_24_gold_by_stock =
            total_24_gold_by_stock + Number(row.weight) * Number(row.stock)
        })
        let total_24_gold_by_karat = 0
        finalData!.table.forEach((row) => {
          total_24_gold_by_karat =
            total_24_gold_by_karat +
            Number(row.weight) * Number(getMyKarat(row.karat_value))
        })
        let val = total_24_gold_by_stock - total_24_gold_by_karat
        if (val < 0) {
          val = val * -1
          const computational_movement =
            item.nature === "debtor" ? "creditor" : "debtor"
          return {
            ...item,
            value: val,
            computational_movement,
          }
        } else {
          return {
            ...item,
            value: val,
          }
        }
      case "gold3yar":
        let total_24_gold_by_karat2 = 0
        finalData!.table.forEach((row) => {
          total_24_gold_by_karat2 =
            total_24_gold_by_karat2 +
            Number(row.weight) * Number(getMyKarat(row.karat_value))
        })
        let value = finalData!.boxes.total_weight - total_24_gold_by_karat2
        if (value < 0) {
          value = value * -1
          const computational_movement =
            item.nature === "debtor" ? "creditor" : "debtor"
          return {
            ...item,
            value,
            computational_movement,
          }
        } else {
          return {
            ...item,
            value, 
          }
        }
      case "supplier_money":
        return {
          ...item,
          value: finalData!.boxes.total_tax + getTotalWages(),
        }
      case "supplier_gold":
        return {
          ...item,
          value: finalData!.boxes.total_24_gold_by_stock,
        }
      default:
        return item
    }
  } : supply == 'diamond' ? (item: any) => {
    switch (item.front_key) {
      case "diamondtwred_box":
        return {
          ...item,
          value: finalData?.boxes.total_diamond_value,
        }
      case "diamondtwred_tax":
        return {
          ...item,
          value: finalData?.boxes.total_tax,
        }
      case "supplier_money":
        return {
          ...item,
          value: finalData!.boxes.total_tax + finalData!.boxes.total_diamond_value
        }
      default:
        return item
    }
  } : (item: any) => {
    switch (item.front_key) {
      case "accessorytwred_box":
        return {
          ...item,
          value: finalData?.boxes.total_accessories_value,
        }
      case "accessorytwred_tax":
        return {
          ...item,
          value: finalData?.boxes.total_tax,
        }
      case "supplier_money":
        return {
          ...item,
          value: finalData!.boxes.total_tax + finalData!.boxes.total_accessories_value
        }
      default:
        return item
    }
  }


  function sendForm() {
    const boxes = boxesResponse.map(mapBox)
    console.log("🚀 ~ sendForm ~ boxesResponse:", boxesResponse)
    console.log("🚀 ~ sendForm ~ boxes:", boxes)
    const localBond = supply === 'gold' ? {
      twred_type: formValues?.twred_type,
      bond_date: formatDate(formValues!.bond_date),
      employee_id: formValues?.employee_id,
      supplier_id: formValues?.supplier_id,
      bond_number: formValues?.bond_number,
      notes: formValues?.notes,
      api_gold_price: formValues?.api_gold_price,
      entity_gold_price: formValues?.api_gold_price,
      total_gold_by_24: finalData?.boxes.total_24_gold_by_stock,
      total_wages: finalData?.boxes.total_wages,
      total_tax: finalData?.boxes.total_tax,
      total_weight: finalData?.boxes.total_weight,
      total_gold_18: finalData?.boxes.karat_18_aggregate,
      total_gold_21: finalData?.boxes.karat_21_aggregate,
      total_gold_22: finalData?.boxes.karat_22_aggregate,
      total_gold_24: finalData?.boxes.karat_24_aggregate,
    } : supply === 'diamond' ? {
      twred_type: formValues?.twred_type,
      bond_date: formatDate(formValues!.bond_date),
      employee_id: formValues?.employee_id,
      supplier_id: formValues?.supplier_id,
      bond_number: formValues?.bond_number,
      notes: formValues?.notes,
      api_gold_price: 0,
      entity_gold_price: 0,
      total_diamond_value: finalData?.boxes.total_diamond_value,
      total_tax: finalData?.boxes.total_tax,
      total_weight: finalData?.boxes.total_weight,
      total_other_stones_weight: finalData?.boxes.total_other_stones_weight / 5,
      total_diamond_number: finalData?.boxes.total_diamond_amount,
      total_diamond_stone_weight: finalData?.boxes.total_diamond_stone_weight / 5,
    } :
      {
        twred_type: formValues?.twred_type,
        bond_date: formatDate(formValues!.bond_date),
        employee_id: formValues?.employee_id,
        supplier_id: formValues?.supplier_id,
        bond_number: formValues?.bond_number,
        notes: formValues?.notes,
        api_gold_price: 0,
        entity_gold_price: 0,
        total_accessory_value: finalData?.boxes.total_accessories_value,
        total_tax: finalData?.boxes.total_tax,
        total_weight: finalData?.boxes.total_weight,
        total_other_stones_weight: finalData?.boxes.total_other_stones_weight / 5,
        total_accessory_number: finalData?.boxes.total_accessory_amount,
        total_accessory_weight: finalData?.boxes.total_accessory_weight / 5,
      }

    const globalBond = supply === 'gold' ? {
      twred_type: formValues?.twred_type,
      bond_date: formatDate(formValues!.bond_date),
      out_goods_value: formValues?.out_goods_value,
      employee_id: formValues?.employee_id,
      supplier_id: formValues?.supplier_id,
      notes: formValues?.notes,
      bond_number: formValues?.bond_number,
      api_gold_price: formValues?.api_gold_price,
      entity_gold_price: formValues?.api_gold_price,
      total_gold_by_24: finalData?.boxes.total_24_gold_by_stock,
      total_wages: finalData?.boxes.total_wages,
      total_tax: finalData?.boxes.total_tax,
      total_weight: finalData?.boxes.total_weight,
      total_gold_18: finalData?.boxes.karat_18_aggregate,
      total_gold_21: finalData?.boxes.karat_21_aggregate,
      total_gold_22: finalData?.boxes.karat_22_aggregate,
      total_gold_24: finalData?.boxes.karat_24_aggregate,
    } : supply === 'diamond' ? {
      twred_type: formValues?.twred_type,
      bond_date: formatDate(formValues!.bond_date),
      out_goods_value: formValues?.out_goods_value,
      employee_id: formValues?.employee_id,
      supplier_id: formValues?.supplier_id,
      notes: formValues?.notes,
      api_gold_price: 0,
      entity_gold_price: 0,
      bond_number: formValues?.bond_number,
      total_diamond_value: finalData?.boxes.total_diamond_value,
      total_tax: finalData?.boxes.total_tax,
      total_weight: finalData?.boxes.total_weight,
      total_other_stones_weight: finalData?.boxes.total_other_stones_weight / 5,
      total_diamond_number: finalData?.boxes.total_diamond_amount,
      total_diamond_stone_weight: finalData?.boxes.total_diamond_stone_weight / 5,
    } :
      {
        twred_type: formValues?.twred_type,
        bond_date: formatDate(formValues!.bond_date),
        out_goods_value: formValues?.out_goods_value,
        employee_id: formValues?.employee_id,
        supplier_id: formValues?.supplier_id,
        notes: formValues?.notes,
        api_gold_price: 0,
        entity_gold_price: 0,
        bond_number: formValues?.bond_number,
        total_accessory_value: finalData?.boxes.total_accessories_value,
        total_tax: finalData?.boxes.total_tax,
        total_weight: finalData?.boxes.total_weight,
        total_other_stones_weight: finalData?.boxes.total_other_stones_weight / 5,
        total_accessory_number: finalData?.boxes.total_accessory_amount,
        total_accessory_weight: finalData?.boxes.total_accessory_weight / 5,
      }
    const { currency, factorial } = formValues
    const factorialValue = currency === "other_currency" ? +factorial : 1
    const sendData = {
      operation_name: supply == 'gold' ? "goldtwred" : supply == 'diamond' ? "diamondtwred" : "accessorytwred",
      bian: "test",
      classification: supply == 'gold' ? "gold" : supply == 'diamond' ? "diamond" : "accessory",
      bond: formValues?.twred_type === "global" ? { ...globalBond, factorial: formValues?.factorial || 1, classification: supply == 'gold' ? "gold" : supply == 'diamond' ? "diamond" : "accessory", } : { ...localBond, factorial: formValues?.factorial || 1, classification: supply == 'gold' ? "gold" : supply == 'diamond' ? "diamond" : "accessory" },
      items: finalData?.table.map((item) => {

        return supply == 'gold' ? {
          number: item.number,
          category_id: item.category_id,
          weight: item.weight,
          karat_id: item.karat_id,
          stocks: item.stock,
          wage: item.wage,
          total_wage: item.total_wages,
          wage_tax: item.wage_tax,
          gold_tax: item.gold_tax,
          front_key_twred : item.id,
        } : supply == 'diamond' ? {
          number: item.number,
          category_id: item.category_id,
          total_weight: item.weight,
          gold_weight: item.gold_weight,
          karatmineral_id: item.karatmineral_id,
          mineral_id: item.mineral_id,
          diamond_value: item.diamond_value,
          diamond_number: item.diamond_amount,
          diamond_stone_weight: item.diamond_stone_weight,
          other_stones_weight: item.other_stones_weight,
          diamond_tax: item.diamond_tax,
          front_key_twred : item.id,
          diamond_value_ryal: item.diamond_value * factorialValue,
          classification: 'diamond'
        } : {
          number: item.number,
          category_id: item.category_id,
          total_weight: item.weight,
          gold_weight: item.gold_weight,
          karatmineral_id: item.karatmineral_id,
          mineral_id: item.mineral_id,
          accessory_value: item.accessory_value,
          other_stones_weight: item.other_stones_weight,
          accessory_tax: item.accessory_tax,
          accessory_number: item.accessory_amount,
          accessory_weight: item.accessory_weight,
          front_key_twred : item.id,
          accessory_value_ryal: item.accessory_value * factorialValue,
          classification: 'accessories'
        }
      }),
      boxes,
      media: formValues?.twred_type === "global"
        ? [...formValues?.media, ...formValues?.goods_media]
        : formValues?.media,
    }

    mutate({
      endpointName: supply == 'gold'
        ? "twredGold/api/v1/create"
        : supply == 'diamond' ?
          "twredDiamond/api/v1/create"
          :
          "twredAccessory/api/v1/create",
      values: sendData,
      method: "post",
      dataType: "formData",
    })
  }

  return (
    <>
      <OuterFormLayout>
        <FirstFormView
          supply={supply}
          formValues={formValues}
          setStage={setStage}
          setFormValues={setFormValues}
        />
      </OuterFormLayout>
      <div className="px-4">
        <h1 className="text-2xl mb-5 mt-10">{`${t('bond total')}`}</h1>
        {boxesView &&
          <BoxesView
            boxes={boxesView!}
          />
        }
        <h1 className="text-2xl mb-5 mt-10">{`${t("bond items")}`}</h1>
        <div className="flex flex-col gap-6 items-center">
          <Table data={finalData!.table} showNavigation columns={cols} />
          <div className="flex justify-end gap-4 w-full">
            <Button
              action={() => setStage(2)}
              disabled={boxesLoading}
              className="bg-mainGray border-mainGreen text-mainGreen"
            >
              {t("back")}
            </Button>
            <Button
              action={() => sendForm()}
              loading={isLoading}
              disabled={boxesLoading}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
