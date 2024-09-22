import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientData_TP, Selling_TP } from "./PaymentSellingPage";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useMutate, useIsRTL } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { Button } from "../../components/atoms";
import { SellingFinalPreview } from "../../components/selling/selling components/SellingFinalPreview";
import { numberContext } from "../../context/settings/number-formatter";
import { Modal } from "../../components/molecules";
import { Zatca } from "./Zatca";
import { notify } from "../../utils/toast";
import { useReactToPrint } from "react-to-print";
import { DownloadAsPDF } from "../../utils/DownloadAsPDF";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";

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
  console.log("🚀 ~ paymentData:", paymentData);
  console.log("🚀 ~ clientData:", clientData);
  const { formatGram, formatReyal } = numberContext();
  const contentRef = useRef();

  const [responseSellingData, SetResponseSellingData] = useState(null);
  console.log("🚀 ~ responseSellingData:", responseSellingData);

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);
  const isRTL = useIsRTL();

  const totalCommissionRatio = paymentData.reduce((acc, card) => {
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_riyals;
    }
    return acc;
  }, 0);

  const totalWeight = sellingItemsData?.reduce((acc, curr) => {
    acc += +curr.weight;
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
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_tax;
    }
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

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      cost: formatReyal(Number(totalCost)),
      vat: formatReyal(Number(totalItemsTaxes)),
      total: formatReyal(Number(totalFinalCost)),
    },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalFinalCost))
  );

  const costDataAsProps = {
    totalCommissionRatio,
    ratioForOneItem,
    totalCommissionTaxes,
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
    totalFinalCostIntoArabic,
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

          const checkedKaratName =
            info.row.original.selsal && finalKaratNamesOfSelsal
              ? `مع سلسال (${finalKaratNamesOfSelsal})`
              : "";

          return info.row.original.itemDetails?.length
            ? info.row.original.has_selsal === 0
              ? finalCategoriesNames
              : `${finalCategoriesNames} ${checkedKaratName}`
            : info.row.original.selsal.length === 0
            ? info.getValue()
            : `${info.getValue()} ${checkedKaratName}`;
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

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const chunkedItems = chunkArray(sellingItemsData, 10);
  console.log("🚀 ~ SellingInvoiceTablePreview ~ chunkedItems:", chunkedItems);

  const SellingTableComp = () => (
    <InvoiceTable
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
      resultTable={resultTable}
    ></InvoiceTable>
  );

  //
  const navigate = useNavigate();
  // user data
  // api
  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      SetResponseSellingData(data);
      // navigate(`/selling/viewInvoice/`);
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
      count: sellingItemsData.length,
      total_vat: totalItemsTax,
      karat_price: sellingItemsData[0].gold_price,
    };
    const items = sellingItemsData.map((item) => {
      const rowTaxEquation = Number(item.tax_rate) / 100 + 1;
      const taklfaFromOneItem =
        Number(item.taklfa_after_tax) +
        Number(ratioForOneItem) +
        Number(ratioForOneItemTaxes);

      const totalCostFromOneItem =
        Number(item.taklfa_after_tax) / Number(rowTaxEquation) +
        Number(ratioForOneItem);

      const totalTaxFromOneRow = +taklfaFromOneItem - +totalCostFromOneItem;

      const weightOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.weight;
        return acc;
      }, 0);

      const costOfSelsal = item.selsal?.reduce((acc, item) => {
        acc += +item.cost;
        return acc;
      }, 0);

      const isSelsal =
        item.selsal && item.selsal?.length > 0 ? Number(weightOfSelsal) : 0;

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
        tax_rate: item.tax_rate,
        commission_oneItem: ratioForOneItem,
        commissionTax_oneItem: ratioForOneItemTaxes,
      };
    });
    const card = paymentData.reduce((acc, curr) => {
      const maxDiscountOrNOt =
        curr.max_discount_limit && curr.amount >= curr.max_discount_limit
          ? curr.add_commission_ratio === "yes"
            ? Number(curr.amount) + Number(curr?.max_discount_limit_value)
            : Number(curr.amount)
          : curr.add_commission_ratio === "yes"
          ? Number(curr.amount) + Number(curr.commission_riyals)
          : Number(curr.amount);

      acc[curr.sellingFrontKey] =
        curr.add_commission_ratio === "yes"
          ? Number(maxDiscountOrNOt) + Number(curr.commission_tax)
          : Number(maxDiscountOrNOt);
      return acc;
    }, {});

    const paymentCommission = paymentData.reduce((acc, curr) => {
      const commissionReyals = Number(curr.commission_riyals);
      const commissionVat =
        Number(curr.commission_riyals) * Number(userData?.tax_rate / 100);

      acc[curr.sellingFrontKey] = {
        commission: commissionReyals,
        vat: commissionVat,
      };
      return acc;
    }, {});

    mutate({
      endpointName: "/selling/api/v1/add_Invoice",
      values: { invoice, items, card, paymentCommission },
    });

    console.log(
      "🚀 ~ file: SellingInvoiceData.tsx:227 ~ posSellingDataHandler ~ { invoice, items, card }:",
      { invoice, items, card, paymentCommission }
    );
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
      }
    `,
  });

  return (
    <div>
      <div className="flex items-center justify-between mx-8 mt-8 relative">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          {isSuccess ? (
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              action={handlePrint}
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

      <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
        <SellingFinalPreview
          ItemsTableContent={<SellingTableComp />}
          setStage={setStage}
          paymentData={paymentData}
          clientData={clientData}
          sellingItemsData={sellingItemsData}
          costDataAsProps={costDataAsProps}
          invoiceNumber={invoiceNumber}
          isSuccess={isSuccess}
          responseSellingData={responseSellingData}
        />
      </div>

      {!isSuccess ? (
        <div className="flex gap-3 justify-end mx-12 mb-8">
          <Button bordered action={() => setStage(2)}>
            {t("back")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end items-center mx-12 mb-8">
          <Button action={() => navigate(-1)} bordered>
            {t("back")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellingInvoiceData;
