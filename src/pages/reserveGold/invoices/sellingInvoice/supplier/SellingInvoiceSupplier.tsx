import React, { Dispatch, SetStateAction, useState } from "react";
import SellingInvoiceFirstPage from "./SellingInvoiceFirstPage";
import SellingInvoiceSecondPage from "./SellingInvoiceSecondPage";
import { Form, Formik } from "formik";
import { useFetch } from "../../../../../hooks";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";

interface SellingInvoiceSupplier_TP {
  stage: number;
  setStage: Dispatch<SetStateAction<number>>;
}

const SellingInvoiceSupplier: React.FC<SellingInvoiceSupplier_TP> = (props) => {
  const { stage, setStage } = props;

  // STATE
  const [reserveSellingInvoiceNumber, setReserveSellingInvoiceNumber] =
    useState<null>(null);
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const { gold_price } = GlobalDataContext();

  const goldPrice = {
    18: gold_price?.price_gram_18k,
    21: gold_price?.price_gram_21k,
    22: gold_price?.price_gram_22k,
    24: gold_price?.price_gram_24k,
  };
  console.log("🚀 ~ goldPrice:", goldPrice);

  const initialValues = {
    supplier_value: "",
    supplier_id: "",
    supplier_name: "",
    reserve_selling_data: new Date(),
    total_value: "",
    value_added_tax: "",
    value: "",
    piece_per_gram: "",
    karat_id: "",
    weight: "",
    karat_name: "",
    notes: "",
  };

  const { data: bondsList } = useFetch({
    endpoint: `/reserveGold/api/v1/list_reserve_selling_Invoice?per_page=10000`,
    queryKey: ["selling-bonds-list"],
    onSuccess: (data: any) => {
      setReserveSellingInvoiceNumber(data?.length + 1);
    },
  });

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
                <SellingInvoiceFirstPage
                  setStage={setStage}
                  sellingInvoiceNumber={reserveSellingInvoiceNumber}
                  setSellingItemsData={setSellingItemsData}
                  sellingItemsData={sellingItemsData}
                  goldPrice={goldPrice}
                />
              )}
              {stage === 2 && (
                <SellingInvoiceSecondPage
                  setStage={setStage}
                  sellingInvoiceNumber={reserveSellingInvoiceNumber}
                  setSellingItemsData={setSellingItemsData}
                  sellingItemsData={sellingItemsData}
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

export default SellingInvoiceSupplier;
