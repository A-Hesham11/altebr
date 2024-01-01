import { useMutation } from "@tanstack/react-query"
import { createContext, ReactNode, useContext } from "react"
import { useFetch } from "../../hooks/useFetch"
import { mutateData } from "../../utils/mutateData"
import { notify } from "../../utils/toast"
import { useLocalStorage } from "../../hooks"
import { MutateDataParameters_TP } from "../../types"

type digits_count_TP = {reyal: number, gram: number}

type numberFormatter_TP = {
  digits_count: digits_count_TP
  changeDigitsCount: (digit: digits_count_TP) => void
  formatReyal: (digit: number | string) => string
  formatGram: (digit: number | string) => string
  digits_countLoading: boolean
}

type ResponseData_TP = {
  id: number
  value: number
}

type Setting_TP = {
  value: number
}

export const numberFormatterCtx = createContext<numberFormatter_TP>({
  digits_count: {reyal: 2, gram: 2},
  changeDigitsCount: (digit: digits_count_TP) => {},
  formatReyal: (digit: number | string) => "",
  formatGram: (digit: number | string) => "",
  digits_countLoading: false,
})

export const numberContext = () => useContext(numberFormatterCtx)

export const NumberFormatterProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  /////////// VARIABLES
  const [storedDigitsCount, setStoredDigitsCount] = useLocalStorage(
    "digits_count",
    {reyal: 2, gram: 2}
  )

  const {
    refetch,
  } = useFetch<Setting_TP>({
    // enabled: false, // >>>> Remove this
    endpoint: "companySettings/api/v1/companysettings/key/before_init",
    queryKey: ["digits_count"],
    select: (digits_countObj) => ({ value: digits_countObj?.value }),
    onSuccess: (digits_count) => {
      setStoredDigitsCount(JSON.parse(`${digits_count.value}`))
    },
  })

  

  const {
    mutate,
    isLoading: digits_countLoading,
  } = useMutation({
    mutationFn: (data: MutateDataParameters_TP) =>
      mutateData<ResponseData_TP>(data),
    onError: (err) => console.log(err),
    onSuccess: (data) => {
      refetch()
      notify()
    },
  })

  const changeDigitsCount = (digit: digits_count_TP) => {
    mutate({
      endpointName: "companySettings/api/v1/companysettings/key/before_init",
      values: {
        key: "before_init",
        value: JSON.stringify(digit),
        _method: 'put'
      }
    })
    setStoredDigitsCount(digit)
  }

  // Number formatter
  // const formatNumber = (num: number | string) => {
  //   const fixedNum = (+num).toFixed(storedDigitsCount)
  //   const formattedNum = new Intl.NumberFormat("en-EG", {
  //     style: "decimal",
  //     notation: "standard",
  //     minimumFractionDigits: storedDigitsCount,
  //   }).format(+fixedNum)
  //   const trimmedNum = formattedNum.replace(/\.?0+$/, '')
  //   return trimmedNum
  // }

  const formatReyal = (num: number | string) => {
    const fixedNum = (+num).toFixed(storedDigitsCount?.reyal)
    const formattedNum = new Intl.NumberFormat("en-EG", {
      style: "decimal",
      notation: "standard",
      minimumFractionDigits: storedDigitsCount?.reyal,
    }).format(+fixedNum)
    const trimmedNum = formattedNum.replace(/\.?0+$/, '')
    return trimmedNum
  }

  const formatGram = (num: number | string) => {
    const fixedNum = (+num).toFixed(storedDigitsCount?.gram)
    const formattedNum = new Intl.NumberFormat("en-EG", {
      style: "decimal",
      notation: "standard",
      minimumFractionDigits: storedDigitsCount?.gram,
    }).format(+fixedNum)
    const trimmedNum = formattedNum.replace(/\.?0+$/, '')
    return trimmedNum
  }

  return (
    <numberFormatterCtx.Provider
      value={{
        digits_count: storedDigitsCount!,
        changeDigitsCount,
        digits_countLoading,
        formatReyal,
        formatGram
      }}
    >
      {children}
    </numberFormatterCtx.Provider>
  )
}
