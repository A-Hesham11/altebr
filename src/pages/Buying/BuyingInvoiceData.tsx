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
  console.log(
    "🚀 ~ file: BuyingInvoiceData.tsx:31 ~ sellingItemsData:",
    sellingItemsData
  );
  console.log(
    "🚀 ~ file: BuyingInvoiceData.tsx:31 ~ selectedItemDetails:",
    selectedItemDetails
  );

  const { formatGram, formatReyal } = numberContext();

  const totalCost = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.value;
    return acc;
  }, 0);
  console.log("🚀 ~ file: BuyingInvoiceData.tsx:51 ~ totalCost ~ totalCost:", totalCost)



  // // gather cost data to pass it to SellingFinalPreview as props

  const costDataAsProps = {
    totalCost,
  };

  // const xx = selectedItemDetailsData.map((item) => {
  //     return item
  // })

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
      // {
      //   header: () => <span>{t("category")} </span>,
      //   accessorKey: "category_name",
      //   cell: (info) => {
      //     // const selectedItemDetailsData = sellingItemsData.find(
      //     //   (item) => info.row.original.hwya === item.hwya
      //     // ).weightitems;
      //     // const selectedCategoriesData = selectedItemDetailsData.filter(
      //     //   (item) =>
      //     //     selectedItemDetails.some(
      //     //       (detail) => detail.category_id === item.category_id
      //     //     )
      //     // );
      //     // const finalCategoriesNames = info.row.original.itemDetails?.map((category) => category.category_name).join("-");
      //     // return  info.row.original.itemDetails.length ? finalCategoriesNames : info.getValue();
      //   },
      // },
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
      // {
      //   header: () => <span>{t("totals")} </span>,
      //   accessorKey: "totals",
      //   cell: (info) => info.getValue() || "---",
      // },

      // {
      //   header: () => <span>{t("cost")} </span>,
      //   accessorKey: "cost",
      //   cell: (info: any) => {
      //     const rowData = +info.row.original.taklfa + +ratioForOneItem;
      //     return <div>{formatReyal(Number(rowData.toFixed(2)))}</div>;
      //   },
      // },
      // {
      //   header: () => <span>{t("VAT")} </span>,
      //   accessorKey: "VAT",
      //   cell: (info: any) => {
      //     const rowData =
      //       +info.row.original.taklfa * 0.15 + +ratioForOneItemTaxes;
      //     return <div>{formatReyal(Number(rowData.toFixed(2)))}</div>;
      //   },
      // },
      // {
      //   header: () => <span>{t("total")} </span>,
      //   accessorKey: "total",
      //   cell: (info: any) => {
      //     const rowData = +info.row.original.taklfa + ratioForOneItem;
      //     const rowDataTaxes =
      //       +info.row.original.taklfa * 0.15 + ratioForOneItemTaxes;
      //     return (
      //       <div>
      //         {formatReyal(Number((rowData + rowDataTaxes).toFixed(2)))}
      //       </div>
      //     );
      //   },
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
      navigate(`/selling/invoice-restrictions`);
    },
  });

  const posSellingDataHandler = () => {
    const invoice = {
      // employee_name: userData?.name,
      employee_id: userData?.id,
      branch_id: userData?.branch_id,
      client_id: clientData.client_id,
      // client_value: clientData.client_value,
      invoice_date: clientData.bond_date,
      invoice_number: invoiceNumber.length + 1,
      count: sellingItemsData.length,
      // total_vat: totalItemsTax,
      // karat_price: sellingItemsData[0].gold_price,
    };

    const items = sellingItemsData.map((item) => {
    //   // const costItem = (+item.taklfa + +ratioForOneItem).toFixed(2);
    //   // const costTaxes = (+item.taklfa * 0.15 + +ratioForOneItemTaxes).toFixed(
    //   //   2
    //   // );

      return {
        category_id: item.category_id,
        // category_name: item.category_name,
        // classification_id: item.classification_id,
        // classification_name: item.classification_name,
        // hwya: item.hwya,
        // branch_id: userData?.branch_id,
        // item_id: item.item_id,
        karat_id: item.karat_id,
        edited: "0",
        branch_id: userData?.branch_id,
        // karat_name: item.karat_name,
        gram_price: item.piece_per_gram,
        // wage: item.wage,
        // wage_total: item.wage_total,
        weight: item.weight,
        // cost: costItem,
        // vat: costTaxes,
        value: item.value,
        has_stones: `${item.stones_id}`,
        // kitSellingItems: item.itemDetails,
      };
    });

    mutate({
        endpointName: '/buyingUsedGold/api/v1/add_buying_Invoice',
        values: { invoice, items }
    })
    console.log("🚀 ~ file: BuyingInvoiceData.tsx:237 ~ posSellingDataHandler ~ { invoice, items, card }:", { invoice, items })
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
      />
    </div>
  );
};

export default BuyingInvoiceData;
