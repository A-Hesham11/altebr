import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { Button } from "../../components/atoms";
import { SellingFinalPreview } from "../../components/selling/selling components/SellingFinalPreview";
import { numberContext } from "../../context/settings/number-formatter";
import { ClientData_TP, Selling_TP } from "../Buying/BuyingPage";
import { notify } from "../../utils/toast";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";
import InvoiceTableData from "../../components/selling/selling components/InvoiceTableData";

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  sellingItemsData: any;
  paymentData: any;
  clientData: ClientData_TP;
  invoiceNumber: any;
  selectedItemDetails: any;
  sellingItemsOfWeigth: any;
  invoiceHeaderData: any;
};
const SalesReturnInvoiceData = ({
  setStage,
  sellingItemsData,
  paymentData,
  clientData,
  invoiceNumber,
  invoiceHeaderData,
}: CreateHonestSanadProps_TP) => {
  console.log("🚀 ~ paymentData:", paymentData);
  const { formatGram, formatReyal } = numberContext();
  const [responseSellingData, SetResponseSellingData] = useState(null);

  const { userData } = useContext(authCtx);

  const isCheckedCommission = paymentData.some(
    (item) => item.add_commission_ratio === true
  );

  const totalCommissionRatio = sellingItemsData.reduce((acc, card) => {
    acc += +card.commission_oneItem;
    return acc;
  }, 0);

  const totalCommissionRatioTax = sellingItemsData.reduce((acc, card) => {
    acc += +card.commissionTax_oneItem;
    return acc;
  }, 0);

  const totalCommissionTaxes = paymentData.reduce((acc, card) => {
    acc += +card.commission_tax;
    return acc;
  }, 0);

  const ratioForOneItem = totalCommissionRatio / sellingItemsData.length;

  const ratioForOneItemTaxes = totalCommissionTaxes / sellingItemsData.length;

  const totalWeight = sellingItemsData?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalWeightOfSelsal = sellingItemsData?.reduce((acc, item) => {
    return (
      acc + item?.selsal?.reduce((subAcc, curr) => subAcc + +curr.weight, 0)
    );
  }, 0);

  const totalOfCost = sellingItemsData.reduce((acc, card) => {
    acc += +card.cost;
    return acc;
  }, 0);

  const totalCost = isCheckedCommission
    ? totalOfCost
    : totalOfCost - totalCommissionRatio;

  const totalItemsOfTaxes = sellingItemsData.reduce((acc, card) => {
    acc += +card.vat;
    return acc;
  }, 0);

  const totalItemsTaxes = isCheckedCommission
    ? totalItemsOfTaxes
    : totalItemsOfTaxes - totalCommissionRatioTax;

  const totalFinalCost = Number(totalCost) + Number(totalItemsTaxes);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );

  // const costDataAsProps = {
  //   totalCommissionRatio,
  //   ratioForOneItem,
  //   totalCommissionTaxes,
  //   totalCost,
  //   totalItemsTaxes,
  //   totalFinalCost,
  //   totalFinalCostIntoArabic,
  // };

  const costDataAsProps = {
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
    finalArabicData: [
      {
        title: t("total"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        weight: formatGram(Number(totalWeight) + Number(totalWeightOfSelsal)),
        cost: formatReyal(Number(totalCost)),
        vat: formatReyal(Number(totalItemsTaxes)),
        total: formatReyal(Number(totalFinalCost)),
      },
    ],
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
          const finalKaratNamesOfSelsal = info.row.original.selsal
            ?.map((karat) => karat.karat_name)
            .join("-");
          return info.row.original.itemDetails?.length
            ? info.row.original.has_selsal === 0
              ? finalCategoriesNames
              : `${finalCategoriesNames} مع سلسال (${
                  info.row.original.selsal && finalKaratNamesOfSelsal
                })`
            : info.row.original.selsal.length === 0
            ? info.getValue()
            : `${info.getValue()} مع سلسال (${
                info.row.original.selsal && finalKaratNamesOfSelsal
              })`;
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
        cell: (info) =>
          formatGram(
            Number(info.getValue()) +
              (info.row.original.sel_weight &&
                Number(info.row.original.sel_weight))
          ) || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info) =>
          isCheckedCommission
            ? formatReyal(Number(info.getValue()))
            : formatReyal(
                Number(info.getValue()) -
                  Number(info.row.original.commission_oneItem)
              ) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info) =>
          isCheckedCommission
            ? formatReyal(Number(info.getValue()))
            : formatReyal(
                Number(info.getValue()) -
                  Number(info.row.original.commissionTax_oneItem)
              ) || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info) =>
          isCheckedCommission
            ? formatReyal(Number(info.getValue()))
            : formatReyal(
                Number(info.row.original.cost) -
                  Number(info.row.original.commission_oneItem) +
                  (Number(info.row.original.vat) -
                    Number(info.row.original.commissionTax_oneItem))
              ) || "---",
      },
    ],
    []
  );

  const SellingTableComp = () => (
    <InvoiceTableData
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
    ></InvoiceTableData>
  );

  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      SetResponseSellingData(data);
      // navigate(`/selling/return-entry`);
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
      invoice_number: invoiceNumber + 1,
      base_invoice: sellingItemsData[0]?.invoice_id,
      count: sellingItemsData.length,
    };
    const items = sellingItemsData.map((item) => {
      console.log("🚀 ~ items ~ item:", item);
      const rowTaxEquation = Number(item.tax_rate) / 100 + 1;

      const weightOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.weight;
        return acc;
      }, 0);

      const costOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.cost;
        return acc;
      }, 0);

      const taklfaOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.taklfa;
        return acc;
      }, 0);

      const costWithoutCommission =
        Number(item.cost) - Number(item.commission_oneItem);
      const vatWithoutCommission =
        Number(item.vat) - Number(item.commissionTax_oneItem);

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
        weight: item.weight,
        cost: isCheckedCommission ? Number(item.cost) : costWithoutCommission,
        vat: isCheckedCommission ? Number(item.vat) : vatWithoutCommission,
        total: isCheckedCommission
          ? Number(item.cost) + Number(item.vat)
          : costWithoutCommission + vatWithoutCommission,
        kitItems: item.kitItem,
        sel_cost: costOfSelsal || 0,
        sel_taklfa: taklfaOfSelsal || 0,
        sel_weight: weightOfSelsal || 0,
        selsal: item.selsal,
        has_selsal: item.has_selsal,
        base_invoice_id: item.invoice_id,
        commission_oneItem: item.commission_oneItem,
        total_commission_ratio: totalCommissionRatio,
        commissionTax_oneItem: item.commissionTax_oneItem,
        total_commission_ratio_tax: totalCommissionRatioTax,
        add_commission_ratio: isCheckedCommission,
        tax_rate: userData?.tax_rate,
      };
    });

    const card = paymentData.reduce((acc, curr) => {
      acc[curr.salesReturnFrontKey] = Number(curr.amount);
      return acc;
    }, {});

    const paymentCard = paymentData?.map((item) => ({
      card_id: item.frontkey === "cash" ? "cash" : item.paymentCardId,
      bank_id: item.paymentBankId,
      amount: item.amount,
    }));

    mutate({
      endpointName: "/sellingReturn/api/v1/add_selling_return",
      values: { invoice, items, card, paymentCard },
    });
    console.log(
      "🚀 ~ file: SellingInvoiceData.tsx:227 ~ posSellingDataHandler ~ { invoice, items, card }:",
      { invoice, items, card, paymentCard }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-8 mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          {isSuccess ? (
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              action={() => window.print()}
            >
              {t("print")}
            </Button>
          ) : (
            <Button
              className="bg-mainOrange px-7 py-[6px]"
              loading={isLoading}
              action={posSellingDataHandler}
            >
              {t("save")}
            </Button>
          )}
        </div>
      </div>

      <SellingFinalPreview
        ItemsTableContent={<SellingTableComp />}
        setStage={setStage}
        paymentData={paymentData}
        clientData={clientData}
        isSuccess={isSuccess}
        sellingItemsData={sellingItemsData}
        costDataAsProps={costDataAsProps}
        invoiceNumber={invoiceNumber}
        responseSellingData={responseSellingData}
        invoiceHeaderData={invoiceHeaderData}
      />
    </div>
  );
};

export default SalesReturnInvoiceData;
