import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClientData_TP, Selling_TP } from "./PaymentSellingPage";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { Button } from "../../components/atoms";
import { SellingFinalPreview } from "../../components/selling/selling components/SellingFinalPreview";
import { numberContext } from "../../context/settings/number-formatter";
import BuyingInvoiceTable from "./BuyingInvoiceTable";
import { BuyingFinalPreview } from "./BuyingFinalPreview";

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  sellingItemsData: never[];
  paymentData: never[];
  clientData: ClientData_TP;
  invoiceNumber: any;
  selectedItemDetails: any;
};
const BuyingInvoiceData = ({
  setStage,
  sellingItemsData,
  paymentData,
  clientData,
  invoiceNumber,
  selectedItemDetails,
}: CreateHonestSanadProps_TP) => {
  const { formatGram, formatReyal } = numberContext();

  const totalCost = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalCost,
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stones")} </span>,
        accessorKey: "stones_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("price per gram")} </span>,
        accessorKey: "piece_per_gram",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) => info.getValue() || "---",
      },
      // FIXING 
      // {
      //   header: () => <span>{t("value added tax")} </span>,
      //   accessorKey: "value_added_tax",
      //   cell: (info) => formatReyal(Number(info.getValue())) || "---",
      // },
      // {
      //   header: () => <span>{t("total value")} </span>,
      //   accessorKey: "total_value",
      //   cell: (info) => formatReyal(Number(info.getValue())) || "---",
      // },
    ],
    []
  );

  const BuyingTableComp = () => (
    <BuyingInvoiceTable
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
    ></BuyingInvoiceTable>
  );

  //
  const navigate = useNavigate();
  // user data
  const { userData } = useContext(authCtx);
  // api
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      // navigate(`/selling/honesty/return-honest/${data.bond_id}`)
      navigate(`/buying/purchaseBonds`);
    },
  });

  const posSellingDataHandler = () => {
    const invoice = {
      employee_id: userData?.id,
      branch_id: userData?.branch_id,
      client_id: clientData.client_id,
      invoice_date: clientData.bond_date,
      invoice_number: invoiceNumber.length + 1,
      count: sellingItemsData.length,
    };

    const items = sellingItemsData.map((item) => {
      return {
        category_id: item.category_id,
        karat_id: item.karat_id,
        edited: "0",
        branch_id: userData?.branch_id,
        gram_price: item.piece_per_gram,
        value_added_tax: item.value_added_tax,
        total_value: item.total_value,
        weight: item.weight,
        value: item.value,
        has_stones: `${item.stones_id}`,
      };
    });

    mutate({
        endpointName: '/buyingUsedGold/api/v1/add_buying_Invoice',
        values: { invoice, items }
    })
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-8 mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={() => window.print()}
          >
            {t("print")}
          </Button>
          <Button
            className="bg-mainOrange px-7 py-[6px]"
            loading={isLoading}
            action={posSellingDataHandler}
          >
            {t("save")}
          </Button>
        </div>
      </div>
      <BuyingFinalPreview
        ItemsTableContent={<BuyingTableComp />}
        setStage={setStage}
        paymentData={paymentData}
        clientData={clientData}
        sellingItemsData={sellingItemsData}
        costDataAsProps={costDataAsProps}
        invoiceNumber={invoiceNumber}
      />
    </div>
  );
};

export default BuyingInvoiceData;
