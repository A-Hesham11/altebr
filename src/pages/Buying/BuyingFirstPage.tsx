import { t } from "i18next";
import { Button } from "../../components/atoms";
import { Back } from "../../utils/utils-components/Back";
import { notify } from "../../utils/toast";
import { Form, useFormikContext } from "formik";
import { ClientData_TP, Selling_TP } from "./PaymentSellingPage";
import { BuyingTable } from "./BuyingTable";
import { useFetch } from "../../hooks";
import BuyingHeader from "../../components/atoms/UI/BuyingHeader";
import BillInputs from "../../components/selling/selling components/bill/BillInputs";
import { numberContext } from "../../context/settings/number-formatter";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useContext, useEffect, useState } from "react";
import BuyingBillInput from "./BuyingBillInput";

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
};

const BuyingFirstPage = ({
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
  setOdwyaTypeValue,
  odwyaTypeValue,
}: SellingFirstPage_TP) => {
  const { formatGram, formatReyal } = numberContext();
  const { values } = useFormikContext();
  const { userData } = useContext(authCtx);

  // FORMULA FOR RESULT
  const totalValues = sellingItemsData.reduce(
    (acc: number, curr: any) => Number(acc) + Number(curr?.value),
    0
  );

  const valueAddedTax = sellingItemsData.reduce(
    (acc: number, curr: any) => Number(acc) + Number(curr?.value_added_tax),
    0
  );

  const totalGrossWeight = sellingItemsData.reduce(
    (acc: number, curr: any) => Number(acc) + Number(curr?.weight),
    0
  );

  const totalNetWeight = sellingItemsData.reduce((acc: number, curr: any) => {
    return Number(acc) + (Number(curr?.weight) * Number(curr?.karat_name)) / 24;
  }, 0);

  // BOXES IN BUYING FIRST BAGE
  const tarqimBoxes = [
    {
      account: "value",
      id: 0,
      value: formatReyal(totalValues),
      unit: "ryal",
    },
    {
      account: "total gross weight",
      id: 1,
      value: formatGram(totalGrossWeight),
      unit: "gram",
    },
    {
      account: "total net weight",
      id: 2,
      value: formatGram(totalNetWeight.toFixed(2)),
      unit: "gram",
    },
    {
      account: "karat difference",
      id: 3,
      value: formatGram(totalGrossWeight - totalNetWeight.toFixed(2)),
      unit: "gram",
    },
  ];

  if (odwyaTypeValue === "supplier")
    tarqimBoxes.push({
      account: "value added tax",
      id: 0,
      value: formatReyal(valueAddedTax),
      unit: "ryal",
    });

  // TODAY GOLD PRICE API
  const { data: goldPrice } = useFetch<ClientData_TP>({
    endpoint: `/buyingUsedGold/api/v1/get-gold-price`,
    queryKey: ["get-gold-price"],
  });

  // CASH VALUE API
  const { data: naqdya } = useFetch<ClientData_TP>({
    endpoint: `/buyingUsedGold/api/v1/get-nadya-box/${userData?.branch_id}`,
    queryKey: ["naqdya"],
    onError: (error) => {
      notify("info", error?.response?.data?.msg);
    },
  });
  console.log("🚀 ~ naqdya:", naqdya);

  // CLIENT OPTIONS
  const { data: clientsAndSuppliers, isLoading: loadingClients } = useFetch({
    endpoint: `/buyingUsedGold/api/v1/clients_with_suppliers/${userData?.branch_id}?per_page=10000`,
    queryKey: ["client-supplier"],
    select: (clients: any) =>
      clients.map((item: any) => ({
        id: item.id,
        value: item.id,
        label: item.name,
        type: item.type,
      })),
    onError: (err) => console.log(err),
  });

  const odwyaFind = clientsAndSuppliers?.find(
    (item: any) => item?.id === values?.client_id
  );

  useEffect(() => {
    setOdwyaTypeValue(odwyaFind?.type);
  }, [values?.client_id]);

  return (
    <Form className="overflow-hidden">
      <div className="relative h-full p-10">
        <h2 className="mb-4 text-base font-bold">{t("purchase")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <div className="mb-8">
              <BuyingHeader invoiceNumber={invoiceNumber} />
            </div>
            <div>
              <BuyingBillInput
                dateFieldName="bond_date"
                clientsNameOptions={clientsAndSuppliers}
                isLoading={loadingClients}
              />
            </div>
          </div>

          <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
            <h2 className="mb-4 text-base font-bold">
              {t("purchase voucher data")}
            </h2>
            <>
              <BuyingTable
                odwyaTypeValue={odwyaTypeValue}
                dataSource={dataSource}
                setDataSource={setDataSource}
                sellingItemsData={sellingItemsData}
                setSellingItemsData={setSellingItemsData}
                setClientData={setClientData}
                selectedItemDetails={selectedItemDetails}
                setSelectedItemDetails={setSelectedItemDetails}
                goldPrice={goldPrice}
                defaultTax={naqdya?.tax_rate}
              />
              <div className="border-t-2 border-mainGray pt-12 py-5">
                <h2 className="mb-4 text-base font-bold">
                  {t("total invoice")}
                </h2>
                <div>
                  <div
                    className={`grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
                      odwyaTypeValue === "supplier"
                        ? "xl:grid-cols-5"
                        : "xl:grid-cols-4"
                    }  gap-8`}
                  >
                    {tarqimBoxes?.map((data: any) => (
                      <li
                        key={data.id}
                        className="flex flex-col h-28 rounded-xl text-center text-sm font-bold shadow-md"
                      >
                        <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                          {t(`${data.account}`)}
                        </p>
                        <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                          {data.value} <span>{t(`${data.unit}`)}</span>
                        </p>
                      </li>
                    ))}
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-12 pb-8">
          <Back />
          <Button
            type="submit"
            loading={false}
            action={() => {
              setClientData({
                client_value: values.client_name,
                client_id: values.client_id,
                bond_date: values.bond_date,
              });

              if (sellingItemsData.length === 0) {
                notify("info", `${t("please add data first")}`);
                return;
              }

              if (!values?.client_id) {
                notify("info", `${t("choose client's name first")}`);
                return;
              }

              if (+totalValues.toFixed(2) > naqdya?.nadya_box.toFixed(2)) {
                notify(
                  "error",
                  `${t(
                    `total values is greater than the value in the cash / available =`
                  )}  ${formatReyal(naqdya?.nadya_box.toFixed(2))}`
                );
                return;
              }

              setStage(2);
            }}
          >
            {t("purchase")}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default BuyingFirstPage;
