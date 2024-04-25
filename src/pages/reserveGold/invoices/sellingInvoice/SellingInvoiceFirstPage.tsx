import { t } from "i18next";
import React, { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import ReserveSellingHeader from "./ReserveSellingHeader";
import { Button } from "../../../../components/atoms";
import { useFetch } from "../../../../hooks";
import ReserveSellingBillInputs from "./ReserveSellingBillInputs";
import ReserveSellingTable from "./ReserveSellingTable";
import { numberContext } from "../../../../context/settings/number-formatter";

interface purchaseInvoicesFirstPage_TP {
  setStage?: Dispatch<SetStateAction<number>>;
  sellingInvoiceNumber: number;
  setSellingItemsData: Dispatch<SetStateAction<any>>;
  sellingItemsData: any;
  goldPrice: number;
}

const SellingInvoiceFirstPage: React.FC<purchaseInvoicesFirstPage_TP> = (
  props
) => {
  const {
    setStage,
    sellingInvoiceNumber,
    setSellingItemsData,
    sellingItemsData,
    goldPrice,
  } = props;
  const navigate = useNavigate();
  const { formatReyal, formatGram } = numberContext();

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
    {
      account: "value added tax",
      id: 5,
      value: formatReyal(valueAddedTax),
      unit: "ryal",
    },
  ];

  // CLIENT OPTIONS
  const { data: suppliersOption, isLoading: loadingSuppliers } = useFetch({
    endpoint: `/supplier/api/v1/suppliers?per_page=10000`,
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

  return (
    <div className="relative h-full p-10">
      <h2 className="mb-4 text-xl font-bold">
        {t("gold reservation selling invoice")}
      </h2>
      <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5">
        <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
          <div className="mb-8">
            <ReserveSellingHeader sellingInvoiceNumber={sellingInvoiceNumber} />
          </div>
          <div>
            <ReserveSellingBillInputs
              supplierNameOptions={suppliersOption}
              isLoading={loadingSuppliers}
            />
          </div>
        </div>

        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
          <h2 className="mb-4 text-base font-bold">
            {t("selling voucher data")}
          </h2>
          <>
            <ReserveSellingTable
              sellingItemsData={sellingItemsData}
              setSellingItemsData={setSellingItemsData}
              goldPrice={goldPrice}
            />
            <div className="border-t-2 border-mainGray pt-12 py-5">
              <h2 className="mb-4 text-base font-bold">{t("total invoice")}</h2>
              <div>
                <div
                  className={`grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}
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
        <Button
          type="submit"
          loading={false}
          action={() => {
            setStage(2);
          }}
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
};

export default SellingInvoiceFirstPage;
