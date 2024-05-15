import React, { useEffect } from "react";
import { t } from "i18next";
import SellingBoxes from "../../components/selling/selling components/data/SellingBoxes";
import { Button } from "../../components/atoms";
import { notify } from "../../utils/toast";
import { Form, Formik, useFormikContext } from "formik";
import BillHeader from "../../components/selling/selling components/bill/BillHeader";
import BillInputs from "../../components/selling/selling components/bill/BillInputs";
import { ClientData_TP, Selling_TP } from "../selling/PaymentSellingPage";
import { SupplyPayoffTableInputData } from "./SupplyPayoffTableInputData";
import { useFetch, useMutate } from "../../hooks";
import { SelectOption_TP } from "../../types";
import { Supplier_TP } from "../../components/templates/systemEstablishment/supplier/supplier-types";
import { numberContext } from "../../context/settings/number-formatter";
import { mutateData } from "../../utils/mutateData";
import { useNavigate } from "react-router-dom";

type SellingFirstPage_TP = {
  sellingItemsData: Selling_TP;
  setSellingItemsData: any;
  setStage: any;
  dataSource: Selling_TP;
  setDataSource: any;
  clientData: ClientData_TP;
  setClientData: any;
  invoiceNumber: any;
  selectedItemDetails: any;
  setSelectedItemDetails: any;
  sellingItemsOfWeigth: any;
  setSellingItemsOfWeight: any;
  supplierId: any;
  setSupplierId: any;
  mardodItemsId: any;
  setMardodItemsId: any;
};
const SupplyPayoffFirstPage = ({
  invoiceNumber,
  setStage,
  sellingItemsData,
  setSellingItemsData,
  dataSource,
  setDataSource,
  selectedItemDetails,
  setSelectedItemDetails,
  clientData,
  setClientData,
  sellingItemsOfWeigth,
  setSellingItemsOfWeight,
  supplierId,
  setSupplierId,
  mardodItemsId,
  setMardodItemsId,
}: SellingFirstPage_TP) => {
  const { values } = useFormikContext();

  const { formatGram, formatReyal } = numberContext();

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    failureReason: suppliersErrorReason,
    refetch: refetchSupplier,
  } = useFetch<SelectOption_TP[], Supplier_TP[]>({
    endpoint: "/supplier/api/v1/suppliers?per_page=10000",
    queryKey: ["suppliers-return"],
    onSuccess(data) {},
    select: (suppliers) =>
      suppliers.map((supplier) => {
        return {
          //@ts-ignore
          id: supplier.id,
          value: supplier.name,
          label: supplier.name,
          name: supplier.name,
        };
      }),
  });

  const { data, refetch: supplierGetCount } = useFetch({
    endpoint: `/sadadSupplier/api/v1/get-count/${supplierId ? supplierId : 0}`,
    queryKey: ["supplier-return-data"],
    onSuccess(data) {
      return data.data;
    },
  });

  const locationPath = location.pathname === "/supply-return";

  const suppliersData = {
    suppliers: suppliers,
    suppliersLoading: suppliersLoading,
    suppliersErrorReason: suppliersErrorReason,
    refetchSupplier: refetchSupplier,
    supplierId: supplierId,
    setSupplierId: setSupplierId,
    locationPath: locationPath,
  };

  const paymentDataToManagement = [
    {
      name: t("Supplier current account (GRAM)"),
      key: 1,
      unit: t("gram"),
      value: data ? data[0]?.account_edara_gram : 0,
    },
    {
      name: t("Supplier current account (SAR)"),
      key: 2,
      unit: t("ر.س"),
      value: data ? data[0]?.account_edara_reyal : 0,
    },
  ];

  useEffect(() => {
    supplierGetCount();
  }, [supplierId]);

  const { mutate, isLoading: thwelLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["thwel-api"],
    onSuccess: (data) => {
      notify("success");
    },
    onError: (error) => {
      notify("error", error.response.data.msg);
    },
  });

  useEffect(() => {
    sellingItemsData?.map((operation: any) => {
      console.log("🚀 ~ sellingItemsData?.map ~ operation:", operation);
      if (!mardodItemsId.includes(`${operation.id}`)) {
        setMardodItemsId((prev) => [...prev, `${operation.id}`]);
      }
    });
  }, [sellingItemsData]);

  return (
    <Form>
      <div className="relative h-full p-4">
        <h2 className="mb-4 text-base font-bold">{t("supply payoff")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <div className="mb-8">
              <BillHeader
                invoiceNumber={invoiceNumber}
                locationPath={locationPath}
              />
            </div>
            <div>
              <BillInputs
                dateFieldName="bond_date"
                suppliersData={suppliersData}
              />
            </div>
            <ul className="flex justify-around py-1 w-full mt-8 mb-2">
              {paymentDataToManagement.map(({ name, key, unit, value }) => (
                <li
                  key={key}
                  className="flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md bg-transparent w-4/12"
                >
                  <p className="bg-mainOrange  p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                    {name}
                  </p>
                  <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                    {formatGram(Number(value))} {t(unit)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
            <h2 className="mb-4 text-base font-bold">
              {t("search by part number")}
            </h2>
            <>
              <SupplyPayoffTableInputData
                dataSource={dataSource}
                setDataSource={setDataSource}
                sellingItemsData={sellingItemsData}
                setSellingItemsData={setSellingItemsData}
                selectedItemDetails={selectedItemDetails}
                setSelectedItemDetails={setSelectedItemDetails}
                sellingItemsOfWeigth={sellingItemsOfWeigth}
                setSellingItemsOfWeight={setSellingItemsOfWeight}
                supplierId={supplierId}
              />
              <div className="border-t-2 border-mainGray pt-12 py-5">
                <h2 className="mb-4 text-base font-bold">{t("total bill")}</h2>
                <SellingBoxes
                  dataSource={dataSource}
                  sellingItemsData={sellingItemsData}
                />
              </div>
            </>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-12 pb-8">
          <Button
            type="submit"
            loading={false}
            action={() => {
              setClientData({
                client_value: values.supplier_name,
                client_id: values.supplier_id,
                supplier_id: values.supplier_id,
                bond_date: values.bond_date,
              });

              if (sellingItemsData.length === 0) {
                notify("info", `${t("please add data first")}`);
                return;
              }
              if (!supplierId) {
                notify("info", `${t("The supplier must be chosen first")}`);
                return;
              }

              setStage(2)
            }}
          >
            {t("confirm")}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SupplyPayoffFirstPage;
