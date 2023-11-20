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
  console.log(
    "🚀 ~ file: SellingInvoiceData.tsx:31 ~ sellingItemsData:",
    sellingItemsData
  );
  console.log(
    "🚀 ~ file: SellingInvoiceData.tsx:31 ~ selectedItemDetails:",
    selectedItemDetails
  );

  const { formatGram, formatReyal } = numberContext();

  const totalCommissionRatio = paymentData.reduce((acc, card) => {
    acc += +card.commission_riyals;
    return acc;
  }, 0);

  const totalCost = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa;
    return acc;
  }, 0);

  const totalItemsTaxes = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa * 0.15;
    return acc;
  }, 0);

  const ratioForOneItem = totalCommissionRatio / sellingItemsData.length;

  const totalCommissionTaxes = paymentData.reduce((acc, card) => {
    acc += +card.commission_tax;
    return acc;
  }, 0);

  const ratioForOneItemTaxes = totalCommissionTaxes / sellingItemsData.length;

  const totalFinalCost =
    totalCost + totalCommissionRatio + totalCost * 0.15 + totalCommissionTaxes;

  const totalItemsTax = +totalItemsTaxes?.toFixed(2) + totalCommissionTaxes;

  // // gather cost data to pass it to SellingFinalPreview as props

  const costDataAsProps = {
    totalCommissionRatio,
    ratioForOneItem,
    totalCommissionTaxes,
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
  };

  // const xx = selectedItemDetailsData.map((item) => {
  //     return item
  // })

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
          // const selectedItemDetailsData = sellingItemsData.find(
          //   (item) => info.row.original.hwya === item.hwya
          // ).weightitems;
          // const selectedCategoriesData = selectedItemDetailsData.filter(
          //   (item) =>
          //     selectedItemDetails.some(
          //       (detail) => detail.category_id === item.category_id
          //     )
          // );
          const finalCategoriesNames = info.row.original.itemDetails?.map((category) => category.category_name).join("-");
          return  info.row.original.itemDetails.length ? (info.row.original.has_selsal === 0 ? finalCategoriesNames : `${finalCategoriesNames} مع سلسال`) : (info.row.original.has_selsal === 0 ? info.getValue() : `${info.getValue()} مع سلسال`);
        },
      },
      {
        header: () => <span>{t("stone weight")} </span>,
        accessorKey: "supplier_name",
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
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info: any) => {
          const rowData = +info.row.original.taklfa + +ratioForOneItem;
          return <div>{formatReyal(Number(rowData.toFixed(2)))}</div>;
        },
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "VAT",
        cell: (info: any) => {
          const rowData =
            +info.row.original.taklfa * 0.15 + +ratioForOneItemTaxes;
          return <div>{formatReyal(Number(rowData.toFixed(2)))}</div>;
        },
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info: any) => {
          const rowData = +info.row.original.taklfa + ratioForOneItem;
          const rowDataTaxes =
            +info.row.original.taklfa * 0.15 + ratioForOneItemTaxes;
          return (
            <div>
              {formatReyal(Number((rowData + rowDataTaxes).toFixed(2)))}
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
      const costItem = (+item.taklfa + +ratioForOneItem).toFixed(2);
      const costTaxes = (+item.taklfa * 0.15 + +ratioForOneItemTaxes).toFixed(
        2
      );

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
        cost: costItem,
        vat: costTaxes,
        total: +costItem + +costTaxes,
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
