import { Dispatch, SetStateAction, useState } from "react";
import { useFetch } from "../../../../../hooks";
import { Form, Formik } from "formik";
import PurchaseInvoiceSecondPage from "./PurchaseInvoiceSecondPage";
import PurchaseInvoiceFirstPage from "./PurchaseInvoiceFirstPage";

interface PurchaseInvoiceSupplier_TP {
  stage: number;
  setStage: Dispatch<SetStateAction<number>>;
}

const PurchaseInvoiceSupplier: React.FC<PurchaseInvoiceSupplier_TP> = (
  props
) => {
  const { stage, setStage } = props;

  // STATE
  const [reserveBuyingInvoiceNumber, setReserveBuyingInvoiceNumber] =
    useState<null>(null);
  const [buyingItemsData, setBuyingItemsData] = useState([]);

  const initialValues = {
    supplier_value: "",
    supplier_id: "",
    supplier_name: "",
    reserve_buying_date: new Date(),
    total_value: "",
    value_added_tax: "",
    value: "",
    piece_per_gram: "",
    karat_id: "",
    weight: "",
    karat_name: "",
    notes: "",
  };

  // TODAY GOLD PRICE API
  const { data: goldPrice } = useFetch({
    endpoint: `/buyingUsedGold/api/v1/get-gold-price`,
    queryKey: ["get-gold-price"],
  });

  const { data: bondsList } = useFetch({
    endpoint: `/reserveGold/api/v1/list_reserve_buying_Invoice?per_page=10000`,
    queryKey: ["buying-bonds-list"],
    onSuccess: (data: any) => {
      setReserveBuyingInvoiceNumber(data?.length + 1);
    },
  });
  console.log("🚀 ~ bondsList:", bondsList);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => {
        return (
          <Form>
            <>
              {stage === 1 && (
                <PurchaseInvoiceFirstPage
                  setStage={setStage}
                  buyingInvoiceNumber={reserveBuyingInvoiceNumber}
                  setBuyingItemsData={setBuyingItemsData}
                  buyingItemsData={buyingItemsData}
                  goldPrice={goldPrice}
                />
              )}
              {stage === 2 && (
                <PurchaseInvoiceSecondPage
                  setStage={setStage}
                  buyingInvoiceNumber={reserveBuyingInvoiceNumber}
                  setBuyingItemsData={setBuyingItemsData}
                  buyingItemsData={buyingItemsData}
                  goldPrice={goldPrice}
                />
              )}
            </>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PurchaseInvoiceSupplier;
