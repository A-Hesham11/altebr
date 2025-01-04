import { createContext, ReactNode, useContext, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import Cookies from "js-cookie";

export const GlobalDataCtx = createContext<any>({
  gold_price: {},
  invoice_logo: {},
});

export const GlobalDataContext = () => useContext(GlobalDataCtx);

export const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
  const [goldPriceToday, setGoldPriceToday] = useState(null);
  const token = Cookies.get("token");
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  console.log("🚀 ~ GlobalDataProvider ~ invoiceInfo:", invoiceInfo)

  const { data } = useFetch<any>({
    endpoint: "/attachment/api/v1/goldPrice",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data);
    },
    refetchInterval: 30000,
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
    enabled: !!token,
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
