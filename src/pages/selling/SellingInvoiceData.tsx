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

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  sellingItemsData: never[];
  paymentData: never[];
  clientData: ClientData_TP;
  invoiceNumber: any;
  selectedItemDetails: any;
  sellingItemsOfWeigth: any;
};
const SellingInvoiceData = ({
  setStage,
  sellingItemsData,
  paymentData,
  clientData,
  invoiceNumber,
  selectedItemDetails,
  sellingItemsOfWeigth
}: CreateHonestSanadProps_TP) => {
  console.log("🚀 ~ file: SellingInvoiceData.tsx:31 ~ sellingItemsData:",sellingItemsData );

  const { formatGram, formatReyal } = numberContext();

  const { userData } = useContext(authCtx)

  const TaxRateOfBranch = userData?.tax_rate / 100 ;

  const totalCommissionRatio = paymentData.reduce((acc, card) => {
    acc += +card.commission_riyals;
    return acc;
  }, 0);

  // const totalCostNotIncludeTax = sellingItemsData.reduce((acc, curr) => {
  //   acc += +curr.taklfa;
  //   return acc;
  // }, 0);

  const totalCostAfterTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax;
    return acc;
  }, 0);

  
  const totalCommissionTaxes = paymentData.reduce((acc, card) => {
    acc += +card.commission_tax;
    return acc;
  }, 0);

  const ratioForOneItem = totalCommissionRatio / sellingItemsData.length;

  const ratioForOneItemTaxes = totalCommissionTaxes / sellingItemsData.length;

  // const totalCost = userData?.include_tax === "0" ? +totalCostNotIncludeTax.toFixed(2) : ((totalCostAfterTax + totalCommissionRatio + totalCommissionTaxes) / 1.15).toFixed(2)

  // const totalFinalCostBeforeTax = totalCost + totalCommissionRatio + totalCost * +TaxRateOfBranch + totalCommissionTaxes;
  // const totalFinalCostAfterTax = totalCostAfterTax + totalCommissionRatio + totalCommissionTaxes;
  // const totalFinalCost = userData?.include_tax === "0" ? +totalFinalCostBeforeTax.toFixed(2) : +totalFinalCostAfterTax.toFixed(2)

  // const totalItemsTaxes = userData?.include_tax === "0" ? (+totalCostNotIncludeTax * +TaxRateOfBranch).toFixed(2) : (+totalFinalCost - +totalCost).toFixed(2)

  const totalCost =  ((totalCostAfterTax + totalCommissionRatio + totalCommissionTaxes) / 1.15).toFixed(2)

  // const totalFinalCostBeforeTax = totalCost + totalCommissionRatio + totalCost * +TaxRateOfBranch + totalCommissionTaxes;
  
  const totalFinalCostAfterTax = totalCostAfterTax + totalCommissionRatio + totalCommissionTaxes;

  const totalFinalCost = +totalFinalCostAfterTax.toFixed(2)

  const totalItemsTaxes = (+totalFinalCost - +totalCost).toFixed(2)

  const totalItemsTax = (+totalItemsTaxes+ +totalCommissionTaxes).toFixed(2);

  const costDataAsProps = {
    totalCommissionRatio,
    ratioForOneItem,
    totalCommissionTaxes,
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
  };
  console.log("🚀 ~ file: SellingInvoiceData.tsx:85 ~ costDataAsProps:", costDataAsProps)

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "hwya",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "classification_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("category")} </span>,
        accessorKey: "category_name",
        cell: (info) => {
          const finalCategoriesNames = info.row.original.itemDetails?.map((category) => category.category_name).join("-");
          return  info.row.original.itemDetails.length ? (info.row.original.has_selsal === 0 ? finalCategoriesNames : `${finalCategoriesNames} مع سلسال`) : (info.row.original.has_selsal === 0 ? info.getValue() : `${info.getValue()} مع سلسال`);
        },
      },
      {
        header: () => <span>{t("stone weight")} </span>,
        accessorKey: "stone_weight",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.row.original.classification_id === 1 ?  formatReyal(Number(info.getValue())) : formatGram(Number(info.row.original.karatmineral_name)),
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      // {
      //   header: () => <span>{t("cost")} </span>,
      //   accessorKey: "cost",
      //   cell: (info: any) => {
      //     const rowData = +info.row.original.taklfa + +ratioForOneItem;
      //     return <div>{formatReyal(Number(rowData.toFixed(2)))}</div>;
      //   },
      // },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => {
          const rowData = +info.row.original.taklfa + +ratioForOneItem;
          const rowDataWithTax = +info.row.original.taklfa_after_tax + +ratioForOneItem;
          // const costFromIncludePriceTax = userData?.include_tax === "0" ? rowData : ( rowDataWithTax + +ratioForOneItemTaxes) / 1.15
          const costFromIncludePriceTax = ((+rowDataWithTax + +ratioForOneItemTaxes) / 1.15).toFixed(2)


          return <div>{formatReyal(Number(costFromIncludePriceTax))}</div>;
        },
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "VAT",
        cell: (info: any) => {
          const rowDataWithTax = +info.row.original.taklfa_after_tax + +ratioForOneItem;
          const rowData = (+rowDataWithTax + +ratioForOneItemTaxes ) - ((+rowDataWithTax + +ratioForOneItemTaxes) / 1.15);

          return <div>{formatReyal(Number(rowData.toFixed(2)))}</div>;
        },
      },
      // {
      //   header: () => <span>{t("total")} </span>,
      //   accessorKey: "total", 
      //   cell: (info: any) => {
      //     const rowData = +info.row.original.taklfa + ratioForOneItem;
      //     const rowDataTaxes = +info.row.original.taklfa * +TaxRateOfBranch + ratioForOneItemTaxes;
      //     return (
      //       <div>
      //         {formatReyal(Number((rowData + rowDataTaxes).toFixed(2)))}
      //       </div>
      //     );
      //   },
      // },

      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info: any) => {
          const rowData = +info.row.original.taklfa + ratioForOneItem;
          const rowDataWithTax = +info.row.original.taklfa_after_tax + ratioForOneItem;
          const rowDataTaxes = +info.row.original.taklfa * +TaxRateOfBranch + ratioForOneItemTaxes;

          const costFromIncludePriceTax = (+rowDataWithTax + +ratioForOneItemTaxes).toFixed(2)
          return (
            <div>
              {formatReyal(Number((costFromIncludePriceTax)))}
            </div>
          );
        },
      },
    ],
    []
  );

  const SellingTableComp = () => (
    <InvoiceTable
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
    ></InvoiceTable>
  );

  //
  const navigate = useNavigate();
  // user data
  // api
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      navigate(`/selling/invoice-restrictions`);
    },
  });

  const posSellingDataHandler = () => {
    const invoice = {
      employee_name: userData?.name,
      employee_id: userData?.id,
      branch_id: userData?.branch_id,
      client_id: clientData.client_id,
      client_value: clientData.client_value,
      invoice_date: clientData.bond_date,
      invoice_number: invoiceNumber.length + 1,
      count: sellingItemsData.length,
      total_vat: totalItemsTax,
      karat_price: sellingItemsData[0].gold_price,
    };
    const items = sellingItemsData.map((item) => {

      const rowDataWithTax = +item.taklfa_after_tax + ratioForOneItem + +ratioForOneItemTaxes;
      // const costItem = userData?.include_tax === "0" ? (+item.taklfa + +ratioForOneItem).toFixed(2) : (+rowDataWithTax / 1.15).toFixed(2);
      // const costTaxes = userData?.include_tax === "0" ? (+item.taklfa * +TaxRateOfBranch + +ratioForOneItemTaxes).toFixed(2) : (+rowDataWithTax - +costItem).toFixed(2);
      // const costItemTotal = userData?.include_tax === "0" ? (+item.taklfa + +ratioForOneItem + +costTaxes).toFixed(2) : (+rowDataWithTax).toFixed(2);

      const costItem = (+rowDataWithTax / 1.15).toFixed(2);
      const costTaxes = (+rowDataWithTax - +costItem).toFixed(2);
      const costItemTotal = (+rowDataWithTax).toFixed(2);

      return {
        category_id: item.category_id,
        category_name: item.category_name,
        classification_id: item.classification_id,
        classification_name: item.classification_name,
        hwya: item.hwya,
        branch_id: userData?.branch_id,
        item_id: item.item_id,
        karat_id: item.karat_id,
        karat_name: item.karat_name,
        wage: item.wage,
        wage_total: item.wage_total,
        weight: item.weight,
        cost: +costItem,
        vat: +costTaxes,
        total: +costItemTotal ,
        kitSellingItems: item.itemDetails,
        selsal: item.selsal,
        has_selsal: item.has_selsal,
      };
    });
    const card = paymentData.reduce((acc, curr) => {
      acc[curr.sellingFrontKey] =
        Number(curr.amount) * Number(curr.discount_percentage / 100) +
        +curr.amount +
        Number(curr.commission_tax);
      return acc;
    }, {});
    mutate({
        endpointName: '/selling/api/v1/add_Invoice',
        values: { invoice, items, card }
    })
    console.log("🚀 ~ file: SellingInvoiceData.tsx:237 ~ posSellingDataHandler ~ { invoice, items, card }:", { invoice, items, card })
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
      <SellingFinalPreview
        ItemsTableContent={<SellingTableComp />}
        setStage={setStage}
        paymentData={paymentData}
        clientData={clientData}
        sellingItemsData={sellingItemsData}
        costDataAsProps={costDataAsProps}
      />
    </div>
  );
};

export default SellingInvoiceData;
