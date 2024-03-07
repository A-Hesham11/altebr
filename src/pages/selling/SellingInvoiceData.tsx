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
  sellingItemsData: any;
  paymentData: any;
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
  sellingItemsOfWeigth,
}: CreateHonestSanadProps_TP) => {
  console.log("🚀 ~ sellingItemsData:", sellingItemsData)
  const { formatGram, formatReyal } = numberContext();

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const TaxRateOfBranch =
    sellingItemsData && sellingItemsData[0]?.tax_rate / 100;

  const taxEquation = +TaxRateOfBranch + 1;

  const totalCommissionRatio = paymentData.reduce((acc, card) => {
    acc += +card.commission_riyals;
    return acc;
  }, 0);

  const totalCostAfterTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax;
    return acc;
  }, 0);

  const totalCostBeforeTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax / (curr.tax_rate / 100 + 1);
    return acc;
  }, 0);

  const totalCommissionTaxes = paymentData.reduce((acc, card) => {
    acc += +card.commission_tax;
    return acc;
  }, 0);

  const ratioForOneItem = totalCommissionRatio / sellingItemsData.length;

  const ratioForOneItemTaxes = totalCommissionTaxes / sellingItemsData.length;

  const totalFinalCost = (
    +totalCostAfterTax +
    +totalCommissionRatio +
    +totalCommissionTaxes
  ).toFixed(2);

  const totalCost = (totalCostBeforeTax + totalCommissionRatio).toFixed(2);

  const totalItemsTaxes = (+totalFinalCost - +totalCost).toFixed(2);

  const totalItemsTax = (+totalItemsTaxes + +totalCommissionTaxes).toFixed(2);

  const costDataAsProps = {
    totalCommissionRatio,
    ratioForOneItem,
    totalCommissionTaxes,
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
  };

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
          const finalCategoriesNames = info.row.original.itemDetails
            ?.map((category) => category.category_name)
            .join("-");
          return info.row.original.itemDetails.length
            ? info.row.original.has_selsal === 0
              ? finalCategoriesNames
              : `${finalCategoriesNames} مع سلسال`
            : info.row.original.selsal.length === 0
            ? info.getValue()
            : `${info.getValue()} مع سلسال`;
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
        cell: (info: any) =>
          info.row.original.classification_id === 1
            ? formatReyal(Number(info.getValue()))
            : formatGram(Number(info.row.original.karatmineral_name)),
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => {
          const rowTaxEquation = +info.row.original.tax_rate / 100 + 1;
          const totalCostFromRow =
            +info.row.original.taklfa_after_tax / +rowTaxEquation +
            +ratioForOneItem;
          return <div>{formatReyal(Number(totalCostFromRow))}</div>;
        },
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "VAT",
        cell: (info: any) => {
          const rowTaxEquation = +info.row.original.tax_rate / 100 + 1;
          const totalCostFromRow =
            +info.row.original.taklfa_after_tax / +rowTaxEquation +
            +ratioForOneItem;
          const totaltaklfaFromRow =
            +info.row.original.taklfa_after_tax +
            ratioForOneItem +
            ratioForOneItemTaxes;
          const totalTaxFromRow = +totaltaklfaFromRow - +totalCostFromRow;

          return <div>{formatReyal(Number(totalTaxFromRow))}</div>;
        },
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info: any) => {
          const totaltaklfaFromRow =
            +info.row.original.taklfa_after_tax +
            ratioForOneItem +
            ratioForOneItemTaxes;

          return <div>{formatReyal(Number(totaltaklfaFromRow))}</div>;
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
      navigate(`/selling/viewInvoice/`);
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
      console.log("🚀 ~ items ~ item:", item);

      const rowTaxEquation = +item.tax_rate / 100 + 1;
      const taklfaFromOneItem =
        +item.taklfa_after_tax + +ratioForOneItem + +ratioForOneItemTaxes;
      const totalCostFromOneItem =
        +item.taklfa_after_tax / +rowTaxEquation + +ratioForOneItem;
      const totalTaxFromOneRow = +taklfaFromOneItem - +totalCostFromOneItem;

      const weightOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.weight;
        return acc;
      }, 0);
      console.log("🚀 ~ weightOfSelsal ~ weightOfSelsal:", weightOfSelsal)


      const costOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.cost;
        return acc;
      }, 0);
      console.log("🚀 ~ costOfSelsal ~ costOfSelsal:", costOfSelsal)

      const isSelsal = (item.selsal && item.selsal?.length > 0) ? Number(weightOfSelsal) : 0
      console.log("🚀 ~ items ~ isSelsal:", isSelsal)

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
        mineral_id: item.mineral_id,
        karatmineral_id: item.karatmineral_id,
        karatmineral_name: item.karatmineral_name,
        wage: item.wage,
        wage_total: item.wage_total,
        weight: item.weight - isSelsal,
        selling_price: item.selling_price,
        cost: +totalCostFromOneItem,
        cost_value: item.cost,
        taklfa: item.taklfa,
        taklfa_after_tax: item.taklfa_after_tax,
        vat: +totalTaxFromOneRow,
        total: +taklfaFromOneItem,
        kitSellingItems: item.itemDetails,
        sel_cost: costOfSelsal || 0,
        sel_weight: weightOfSelsal || 0,
        selsal: item.selsal,
        has_selsal: item.has_selsal,
      };
    });
    const card = paymentData.reduce((acc, curr) => {
      console.log("🚀 ~ card ~ curr:", curr);

      const maxDiscountOrNOt =
        curr.amount >= curr.max_discount_limit
          ? Number(curr.amount) + Number(curr?.max_discount_limit_value)
          : Number(curr.amount) + Number(curr.commission_riyals);

      acc[curr.sellingFrontKey] =
        +maxDiscountOrNOt + Number(curr.commission_tax);

      return acc;
    }, {});
    mutate({
        endpointName: '/selling/api/v1/add_Invoice',
        values: { invoice, items, card }
    })
    console.log(
      "🚀 ~ file: SellingInvoiceData.tsx:227 ~ posSellingDataHandler ~ { invoice, items, card }:",
      { invoice, items, card }
    );
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
        invoiceNumber={invoiceNumber}
      />
    </div>
  );
};

export default SellingInvoiceData;
