import { useMutation } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import { useLocalStorage } from "../../hooks";
import { MutateDataParameters_TP } from "../../types";

// type digits_count_TP = {reyal: number, gram: number}

// type numberFormatter_TP = {
//   digits_count: digits_count_TP
//   changeDigitsCount: (digit: digits_count_TP) => void
//   formatReyal: (digit: number | string) => string
//   formatGram: (digit: number | string) => string
//   digits_countLoading: boolean
// }

// type ResponseData_TP = {
//   id: number
//   value: number
// }

// type Setting_TP = {
//   value: number
// }

export const GlobalDataCtx = createContext<any>({
  gold_price: {},
  invoice_logo: {},
});

export const GlobalDataContext = () => useContext(GlobalDataCtx);

export const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
  /////////// VARIABLES
  const [goldPriceToday, setGoldPriceToday] = useState(null);
  const [invoiceInfo, setInvoiceInfo] = useState(null);

  const { data } = useFetch<any>({
    endpoint: "/attachment/api/v1/goldPrice",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      console.log("🚀 ~ GoldPriceProvider ~ data:", data);
      setGoldPriceToday(data);
    },
  });

  const { data: invoiceInformation } = useFetch<any>({
    endpoint: `/companySettings/api/v1/InvoiceData`,
    queryKey: ["InvoiceHeader_Data"],
    pagination: true,
    onSuccess(data) {
      const returnData = data?.data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setInvoiceInfo(returnData);
    },
  });

  return (
    <GlobalDataCtx.Provider
      value={{
        gold_price: goldPriceToday!,
        invoice_logo: invoiceInfo!,
      }}
    >
      {children}
    </GlobalDataCtx.Provider>
  );
};
