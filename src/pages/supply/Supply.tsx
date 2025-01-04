/////////// IMPORTS
///
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
// import { SecondForm } from "../../components/contracts/SecondForm"
// import { ContractFinalScreen } from "../../components/contracts/ContractFinalScreen"
// import {
//   DeleteImageHandler_TP,
//   FormValues_TP,
//   MediaTypes_TP,
//   Row_TP,
// } from "../../types"
import { t } from "i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { SupplyFinalForm } from "../../components/supply/SupplyFinalForm"
import { SupplyFirstForm } from "../../components/supply/SupplyFirstForm"
import { BoxesTypes, SupplySecondForm, OTableDataTypes } from "../../components/supply/SupplySecondForm"
import { FirstFormInitValues_TP } from "../../components/supply/formInitialValues_types"
import { Loading } from "../../components/organisms/Loading"
import { useFetch } from "../../hooks/useFetch"
import { Back } from "../../utils/utils-components/Back"
import { Box_TP } from "../../components/supply/BoxesView"

/////////// HELPER VARIABLES & FUNCTIONS
///

/////////// TYPES
///
type GoldSupplyProps_TP = {
  title: string
}

export type supplierTax_TP = "no" | "wages" | "gold" | "gold_and_wages"

export type FinalData_TP = {
  table: OTableDataTypes[]
  boxes: BoxesTypes
}

export type Supply_TP = 'gold' | 'diamond' | 'accessories' | undefined
///
export const Supply = ({ title }: GoldSupplyProps_TP) => {

  const navigate = useNavigate()
  const [stage, setStage] = useState(1)
  const [formValues, setFormValues] = useState<FirstFormInitValues_TP>()
  const [supplierTax, setSupplierTax] = useState<supplierTax_TP>('no')
  const [supplierTaxDiamond, setSupplierTaxDiamond] = useState<supplierTax_TP>('no')
  console.log("🚀 ~ Supply ~ supplierTaxDiamond:", supplierTaxDiamond)
  const [finalData, setFinalData] = useState<FinalData_TP>()
  console.log("🚀 ~ Supply ~ finalData:", finalData)
  const [data, setData] = useState<OTableDataTypes[]>([])
  const [boxValues, setBoxValues] = useState<OTableDataTypes[]>([])
  const [editData, setEditData] = useState<OTableDataTypes>({} as OTableDataTypes)
  const [supply, setSupply] = useState<Supply_TP>()
  const [boxesView, setBoxesView] = useState<Box_TP[] | undefined>()
  /////////// SIDE EFFECTS
  const location = useLocation()
  const path = location.pathname
  
  useEffect(() => {
    if (path === '/bonds/gold') setSupply('gold')
    else if (path === '/bonds/diamond') setSupply('diamond') 
    else setSupply('accessories')
  }, [path])

  const {
    data: checkOperations,
    isLoading: checkOperationsLoading,
    refetch: checkOperationsTitles,
    isRefetching: checkOperationRefetching,
    failureReason: checkOperationsErrorReason,
  } = useFetch<{ status: "" }>({
    enabled: false,
    endpoint: supply === 'gold' 
    ? "twredGold/api/v1/check-operations"
    : "twredDiamond/api/v1/check-operations",
    queryKey: ["checkOperations"],
  })
  

  const { 
    data: nextBondNumber, 
    isLoading: isLoadingNextBondNumber,
    refetch: nextBond,
    isRefetching: nextBondRefetching
  } = useFetch<{
    supply_bond_number: string
  }>({
    queryKey: ["nextBondNumber"],
    enabled: false,
    endpoint: supply === 'gold' 
    ? "twredGold/api/v1/nextbond"
    : "twredDiamond/api/v1/nextbond",
  })

  useEffect(() => {
    if (supply) {
      setFormValues(undefined)
      setFinalData(undefined)
      setData([])
      setBoxValues([])
      setEditData({} as OTableDataTypes)
      setBoxesView(undefined)
      setStage(1)
      nextBond()
      checkOperationsTitles()
    }
  }, [supply])
  ///
  if (checkOperationsLoading || isLoadingNextBondNumber || checkOperationRefetching || nextBondRefetching
  ) return <Loading mainTitle={`${t('loading')}`} subTitle={`${t("checking accounts operations")}`} />

  //  should be (!checkOperations?.status) ↓↓↓
  if (!checkOperations?.status) return <div className="h-screen flex justify-center items-center  bg-flatWhite " >
    <h2 className="font-bold text-2xl p-8 rounded-lg bg-mainGreen text-white cursor-pointer" onClick={() => navigate('/system/operations')}>
      {t(`please complete accounts operations first click to complete the operation`)}
    </h2>
  </div>

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {stage !== 3 && !checkOperationsLoading && !isLoadingNextBondNumber && !checkOperationRefetching && !nextBondRefetching && (
        <div className="mb-0 px-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div>
            <Back />
          </div>
        </div>
      )}

      {stage === 1 && !checkOperationsLoading && !isLoadingNextBondNumber && !checkOperationRefetching && !nextBondRefetching && (
        <SupplyFirstForm
          key={supply}
          supply={supply}
          nextBondNumber={nextBondNumber?.supply_bond_number}
          setSupplierTax={setSupplierTax}
          setSupplierTaxDiamond={setSupplierTaxDiamond}
          formValues={formValues}
          setFormValues={setFormValues}
          setStage={setStage}
        />
      )}
      {stage === 2 && (
        <SupplySecondForm 
          supplierTax={supplierTax}
          supplierTaxDiamond={supplierTaxDiamond}
          key={supply}
          setBoxesView={setBoxesView}
          supply={supply}
          formValues={formValues} 
          setStage={setStage} 
          setFormValues={setFormValues} 
          setFinalData={setFinalData} 
          data={data}
          setData={setData}
          boxValues={boxValues}
          setBoxValues={setBoxValues}
          editData={editData}
          setEditData={setEditData}
        />
      )}
      {stage === 3 && (
        <SupplyFinalForm 
          key={supply}
          supply={supply}
          boxesView={boxesView}
          formValues={formValues} 
          setStage={setStage} 
          setFormValues={setFormValues} 
          finalData={finalData} 
        />
      )}
    </>
  )
}
