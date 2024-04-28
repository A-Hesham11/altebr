import React, { useState } from "react";
import SellingInvoiceFirstPage from "./SellingInvoiceFirstPage";
import SellingInvoiceSecondPage from "./SellingInvoiceSecondPage";
import { Form, Formik } from "formik";
import { useFetch } from "../../../../../hooks";

const SellingInvoiceSupplier = (props) => {
  const { stage, setStage } = props;

  // STATE
  const [reserveSellingInvoiceNumber, setReserveSellingInvoiceNumber] =
    useState<number>(1);
  const [sellingItemsData, setSellingItemsData] = useState([]);

  const initialValues = {
    supplier_value: "",
    supplier_id: "",
    supplier_name: "",
    reserve_selling_data: "",
    total_value: "",
    value_added_tax: "",
    value: "",
    piece_per_gram: "",
    karat_id: "",
    weight: "",
    karat_name: "",
  };

  // TODAY GOLD PRICE API
  const { data: goldPrice } = useFetch({
    endpoint: `/buyingUsedGold/api/v1/get-gold-price`,
    queryKey: ["get-gold-price"],
  });

  const { data: bondsList } = useFetch({
    endpoint: `/reserveGold/api/v1/list_reserve_buying_Invoice`,
    queryKey: ["selling-bonds-list"],
    onSuccess: (data: any) => {
      setReserveSellingInvoiceNumber(data?.data?.length + 1);
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
