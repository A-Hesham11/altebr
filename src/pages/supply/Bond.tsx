import { ColumnDef } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useLocation, useParams } from "react-router-dom"
import { Loading } from "../../components/organisms/Loading"
import { BondTotals } from "../../components/supply/BondTotals"
import { Table } from "../../components/templates/reusableComponants/tantable/Table"
import { numberContext } from "../../context/settings/number-formatter"
import { useFetch } from "../../hooks"

type BondProps_TP = {
  title: string
}

export type Box_TP = {
  id: number
  accountable_type: string
  accountable_id: number
  account: string
  value: number
  unit_id: "reyal and gram" | "gram" | "reyal"
  computational_movement: "creditor" | "debtor"
  text: "test"
}

type TableRow_TP = {
  itemType: string
  goldWeight: number
  entity_gold_price: number
  itemStock: number
  payoffTaxes: number
  wage: number
  totalWage: number
  goldTaxes: number
  goldKarat: string
  itemTaxes: number
}

type Contract_TP = {
  id: number
  bond_number: number
  bond_date: string
  classification: "gold"
  supplier_name: string
  entity_gold_price: number
  items: {
    category: {
      name: string
      name_ar: string
      name_en: string
    }
    goldWeight: number
    stocks: number
    id: string
    gold_wage: number
    gold_tax: number
    wage_tax: number
    total_tax: number
    payoffTaxes: number
    wage: number
    totalWage: number
    goldKarat: {
      name: string
    }
  }[]
  boxes: Box_TP[]
}

type Entry_TP = {
  bian: string
  debtor_gram: number
  debtor_SRA: number
  creditor_gram: number
  creditor_SRA: number
}

export const Bond = ({ title }: BondProps_TP) => {
  const { bondID } = useParams()
  const [factorialValue , setFactorialValue] = useState(1)
  const { formatGram, formatReyal } = numberContext()
  const location = useLocation()
  const path = location.pathname

  const { 
    data: contract, 
    isError,
    isLoading,
    isSuccess,
    isFetching,
    failureReason
  } = useFetch<Contract_TP>({
    endpoint: path == `/gold-bonds/${bondID}`
    ? `twredGold/api/v1/bond/${bondID}`
    : path == `/diamond-bonds/${bondID}` ? `twredDiamond/api/v1/diamondBonds/${bondID}` : `twredAccessory/api/v1/accessoryBonds/${bondID}`,
    queryKey: path == `/gold-bonds/${bondID}` ? ['one_gold_bond'] : path ==  `/diamond-bonds/${bondID}` ? ['one_diamond_bond'] : ['one_accessory_bond'],
    onSuccess(data) {
      setFactorialValue(data.factorial)
    },
    select: (contract) => (path == `/gold-bonds/${bondID}` ? {
      id: contract.id,
      bond_number: contract.bond_number,
      bond_date: contract.bond_date,
      classification: contract.classification,
      supplier_name: contract.supplier_name,
      items: contract.items.map(item => {
        return {
          itemType: item?.category?.name,
          itemStock: item?.stocks,
          itemTaxes: item?.totalWage,
          payoffTaxes: item?.totalWage,
          entity_gold_price: contract.entity_gold_price,
          gold_tax: item?.gold_tax,
          wage_tax: item?.wage_tax,
          total_tax: item?.total_tax,
          id: item?.id,
          goldKarat: item?.goldKarat.name,
          goldWeight: item?.goldWeight,
          wage: item?.wage,
          totalWage: item?.totalWage,
        }
      }),
      boxes: contract.boxes.map(box => {
        return {
          id: box.id,
          account: box.account,
          value: box.value,
          unit_id: box.unit_id,
          computational_movement: box.computational_movement
        }
      }) 
    } : path ==  `/diamond-bonds/${bondID}` ? {
      id: contract.id,
      bond_number: contract.bond_number,
      bond_date: contract.bond_date,
      factorial: contract?.factorial,
      classification: contract.classification,
      supplier_name: contract.supplier_name,
      items: contract.items.map(item => {
        return {
          itemType: item?.category_name,
          karatmineral: item?.karatmineral_name,
          id: item?.id,
          weight: item?.total_weight,
          goldKarat: item?.goldKarat?.name,
          gold_weight: item?.gold_weight,
          total_weight: item?.total_weight,
          diamond_value: item?.diamond_value,
          diamond_amount: item?.diamond_number,
          diamond_stone_weight: item?.diamond_stone_weight,
          other_stones_weight: item?.other_stones_weight,
          diamond_tax: item?.diamond_tax,
          mineral_name: item?.mineral_name,
        }
      }),
      boxes: contract.boxes.map(box => {
        return {
          id: box.id,
          account: box.account,
          value: box.value,
          unit_id: box.unit_id,
          computational_movement: box.computational_movement
        }
      }) 
    } 
    : 
    {
      id: contract.id,
      bond_number: contract.bond_number,
      bond_date: contract.bond_date,
      factorial: contract?.factorial,
      classification: contract.classification,
      supplier_name: contract.supplier_name,
      items: contract.items.map(item => {
        return {
          itemType: item?.category_name,
          karatmineral: item?.karatmineral_name,
          id: item?.id,
          weight: item?.total_weight,
          goldKarat: item?.goldKarat?.name,
          gold_weight: item?.gold_weight,
          total_weight: item?.total_weight,
          accessory_value: item?.accessory_value,
          accessory_value_ryal: item?.accessory_value_ryal,
          accessory_amount: contract?.item_count,
          other_stones_weight: item?.other_stones_weight,
          accessory_tax: item?.accessory_tax,
          mineral_name: item?.mineral_name,
        }
      }),
      boxes: contract.boxes.map(box => {
        return {
          id: box.id,
          account: box.account,
          value: box.value,
          unit_id: box.unit_id,
          computational_movement: box.computational_movement
        }
      }) 
    }
    
    ),
  })
  const cols1 = path == `/gold-bonds/${bondID}` ? useMemo<ColumnDef<TableRow_TP>[]>(
    () => [
      {
        header: `${t('category')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'itemType',
      },
      {
        header: `${t('weight')}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: 'goldWeight',
      },
      {
        header: `${t('karat')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'goldKarat',
      },
      {
        header: `${t('stocks')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'itemStock',
      },
      {
        header: `${t('wage')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'wage',
      },
      {
        header: `${t('gold price')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'entity_gold_price',
      },
      {
        header: `${t('total wages')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'totalWage',
      },
      {
        header: `${t('wage tax')}`,
        cell: (info) => info.renderValue() == 0 ? t('no tax') : formatReyal(Number(info.renderValue())),
        accessorKey: 'wage_tax',
      },
      {
        header: `${t('gold tax')}`,
        cell: (info) => info.renderValue() == 0 ? t('no tax') : formatReyal(Number(info.renderValue())),
        accessorKey: 'gold_tax',
      },
      {
        header: `${t('total tax')}`,
        cell: (info) => info.renderValue() == 0 ? t('no tax') : formatReyal(Number(info.renderValue())),
        accessorKey: 'total_tax',
      },
    ],
    []
  ) : path == `/diamond-bonds/${bondID}` ? useMemo<ColumnDef<TableRow_TP>[]>(
    () => [
      {
        header: `${t('category')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'itemType',
      },
      {
        header: `${t('weight')}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: 'total_weight',
      },
      {
        header: `${t('mineral weight')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'gold_weight',
      },
      {
        header: `${t('mineral type')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'mineral_name',
      },
      {
        header: `${t('karat')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'karatmineral',
      },
      {
        header: `${t('diamond value')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'diamond_value',
      },
      {
        header: `${t('diamond value ryal')}`,
        cell: (info) =>info.row.original.diamond_value*factorialValue,
        accessorKey: 'diamond_value_ryal',
      },
      {
        header: `${t('diamond amount')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'diamond_amount',
      },
      {
        header: `${t('diamond stone weight')}`,
        cell: (info) => formatReyal((Number(info.renderValue()))),
        accessorKey: 'diamond_stone_weight',
      },
      {
        header: `${t('other stones weight')}`,
        cell: (info) => formatReyal((Number(info.renderValue()))),
        accessorKey: 'other_stones_weight',
      },
      {
        header: `${t('diamond tax')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'diamond_tax',
      },
    ],
    [factorialValue]
  ) :
  useMemo<ColumnDef<TableRow_TP>[]>(
    () => [
      {
        header: `${t('category')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'itemType',
      },
      {
        header: `${t('weight')}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: 'total_weight',
      },
      {
        header: `${t('mineral weight')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'gold_weight',
      },
      {
        header: `${t('mineral type')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'mineral_name',
      },
      {
        header: `${t('karat')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'karatmineral',
      },
      {
        header: `${t('accessory value')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'accessory_value',
      },
      {
        header: `${t('accessory value ryal')}`,
        cell: (info) =>info.row.original.accessory_value*factorialValue,
        accessorKey: 'accessory_value_ryal',
      },
      {
        header: `${t('accessory amount')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'accessory_amount',
      },
      {
        header: `${t('other stones weight')}`,
        cell: (info) => formatReyal((Number(info.renderValue()))),
        accessorKey: 'other_stones_weight',
      },
      {
        header: `${t('accessory tax')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'accessory_tax',
      },
    ],
    [factorialValue]
  )


  const cols2 = path == `/gold-bonds/${bondID}` ? useMemo<ColumnDef<Entry_TP>[]>(
    () => [
      {
        header: `${t('description')}`,
        cell: (info) => info.renderValue(),
        accessorKey: 'bian',
      },
      {
        header: `${t('gram (debtor)')}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: 'debtor_gram',
      },
      {
        header: `${t('reyal (debtor)')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'debtor_SRA',
      },      
      {
        header: `${t('gram (creditor)')}`,
        cell: (info) => formatGram(Number(info.renderValue())),
        accessorKey: 'creditor_gram',
      },
      {
        header: `${t('reyal (creditor)')}`,
        cell: (info) => formatReyal(Number(info.renderValue())),
        accessorKey: 'creditor_SRA',
      }
    ],
    []
  ) : useMemo<ColumnDef<Entry_TP>[]>(
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
    ],
    []
  )

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

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {isError && <h2 className="text-mainRed">{failureReason?.response.data.message}</h2>}
      {(isLoading || isFetching) && <Loading mainTitle={t('bond total')} />}
      {!(isLoading || isFetching) && isSuccess && !!contract?.boxes?.length && (
        <BondTotals boxesData={contract?.boxes} />
      )}
      {isSuccess && !!!contract?.boxes?.length && !isLoading && !isFetching && (
        <h2 className="text-center">{t('no items')}</h2>
      )}
      {!(isLoading || isFetching) && isSuccess && !!contract?.items?.length && (
        <div className="my-9">
          <Table data={contract.items} showNavigation columns={cols1} />
        </div>
      )}
      {isSuccess && !!!contract?.items?.length && !isLoading && !isFetching && (
        <h2 className="text-center">{t('no bonds')}</h2>
      )}
      {!(isLoading || isFetching) && isSuccess && !!restrictions?.length && (
        <>
          <h2 className="text-xl mb-5 font-bold">{t('accounting entry')}</h2>
          <Table data={restrictions} footered showNavigation columns={cols2} />
        </>
      )}
    </>
  )
}
