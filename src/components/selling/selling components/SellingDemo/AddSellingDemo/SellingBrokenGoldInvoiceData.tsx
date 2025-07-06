import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { ClientData_TP } from "../../../SellingClientForm";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { useIsRTL, useMutate } from "../../../../../hooks";
import { convertNumToArWord } from "../../../../../utils/number to arabic words/convertNumToArWord";
import { Selling_TP } from "../../../../../pages/selling/PaymentSellingPage";
import { mutateData } from "../../../../../utils/mutateData";
import InvoiceTable from "../../InvoiceTable";
import { notify } from "../../../../../utils/toast";
import { Button } from "../../../../atoms";
import { SellingFinalPreview } from "../../SellingFinalPreview";
import InvoiceTableData from "../../InvoiceTableData";

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
const SellingBrokenGoldInvoiceData = ({
  setStage,
  sellingItemsData,
  paymentData,
  invoiceHeaderData,
}: CreateHonestSanadProps_TP) => {
  const { formatGram, formatReyal } = numberContext();
  const contentRef = useRef();

  const [responseSellingData, SetResponseSellingData] = useState(null);

  const { userData } = useContext(authCtx);

  const isRTL = useIsRTL();

  const totalWeight = sellingItemsData?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  // const totalCost = sellingItemsData.reduce((acc, curr) => {
  //   acc += +curr.taklfa;
  //   return acc;
  // }, 0);

  const totalCostAfterTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax;
    return acc;
  }, 0);

  const totalCostBeforeTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax / (curr.tax_rate + 1);
    return acc;
  }, 0);

  const totalCommissionRatio = paymentData.reduce((acc, card) => {
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_riyals;
    }
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
    Number(totalCostAfterTax) +
    Number(totalCommissionRatio) +
    Number(totalCommissionTaxes)
  ).toFixed(2);

  const totalCost = (totalCostBeforeTax + totalCommissionRatio).toFixed(2);

  const totalItemsTaxes = (+totalFinalCost - +totalCost).toFixed(2);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalFinalCost))
  );

  // const totalFinalCostIntoArabic = convertNumToArWord(
  //   Math.floor(Number(totalFinalCost))
  // );
  // const decimalPart = totalFinalCost?.toString().split(".")[1];

  const costDataAsProps = {
    totalFinalCost,
    totalCost,
    finalArabicData: [
      {
        title: t("total"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        // decimalPart: decimalPart,
        type: t("reyal"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        weight: formatGram(Number(totalWeight)),
        cost: formatReyal(Number(totalCost)),
        vat: formatReyal(Number(totalItemsTaxes)),
        total: formatReyal(Number(totalFinalCost)),
      },
    ],
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("Price per gram")} </span>,
        accessorKey: "price_gram",
        cell: (info: any) => {
          return formatReyal(+info.getValue());
        },
      },
      {
        header: () => <span>{t("notes")} </span>,
        accessorKey: "notes",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      // {
      //   header: () => <span>{t("total")} </span>,
      //   accessorKey: "taklfa_after_tax",
      //   cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      // },
      // {
      //   header: () => <span>{t("VAT")} </span>,
      //   accessorKey: "VAT",
      //   cell: (info: any) => {
      //     const rowTaxEquation =
      //       info.row.original.karat_name === "24" ? 1 : +userData?.tax_rate / 100 + 1;
      //     const totalCostFromRow =
      //       +info.row.original.taklfa_after_tax / +rowTaxEquation +
      //       +ratioForOneItem;
      //     const totaltaklfaFromRow =
      //       +info.row.original.taklfa_after_tax +
      //       ratioForOneItem +
      //       ratioForOneItemTaxes;
      //     const totalTaxFromRow = +totaltaklfaFromRow - +totalCostFromRow;

      //     return <div>{formatReyal(Number(totalTaxFromRow))}</div>;
      //   },
      // },
      // {
      //   header: () => <span>{t("total")} </span>,
      //   accessorKey: "total",
      //   cell: (info: any) => {
      //     const totaltaklfaFromRow =
      //       +info.row.original.taklfa_after_tax +
      //       ratioForOneItem +
      //       ratioForOneItemTaxes;

      //     return <div>{formatReyal(Number(totaltaklfaFromRow))}</div>;
      //   },
      // },

      {
        header: () => <span>{t("price before tax")} </span>,
        accessorKey: "taklfa",
        cell: (info: any) => {
          const rowTaxEquation = +info.row.original?.tax_rate + 1;
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
          const rowTaxEquation = +info.row.original.tax_rate + 1;
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
            Number(info.row.original.taklfa_after_tax) +
            Number(ratioForOneItem) +
            Number(ratioForOneItemTaxes);

          return <div>{formatReyal(Number(totaltaklfaFromRow))}</div>;
        },
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
      client_id: invoiceHeaderData.client_id,
      client_value: invoiceHeaderData.client_value,
      supplier_id: invoiceHeaderData.supplier_id,
      supplier_name: invoiceHeaderData.supplier_name,
      invoice_date: invoiceHeaderData.bond_date,
      invoice_number: invoiceHeaderData?.invoice_number + 1,
      count: sellingItemsData.length,
      karat_price: sellingItemsData[0].gold_price,
    };
    const items = sellingItemsData.map((item) => {
      const rowTaxEquation = Number(item?.tax_rate) + 1;
      const taklfaFromOneItem =
        Number(item.taklfa_after_tax) +
        Number(ratioForOneItem) +
        Number(ratioForOneItemTaxes);

      const totalCostFromOneItem =
        Number(item.taklfa_after_tax) / Number(rowTaxEquation) +
        Number(ratioForOneItem);

      const totalTaxFromOneRow = +taklfaFromOneItem - +totalCostFromOneItem;
      return {
        branch_id: userData?.branch_id,
        weight: item.weight,
        karat_id: item.karat_id,
        category_name: item.karat_id,
        price_gram: Number(item.taklfa) / Number(item.weight),
        vat: +totalTaxFromOneRow,
        taklfa: item.taklfa,
        taklfa_after_tax: item.taklfa_after_tax,
        cost: item.taklfa,
        total: taklfaFromOneItem,
        commission_oneItem: ratioForOneItem,
        commissionTax_oneItem: ratioForOneItemTaxes,
      };
    });

    const payments = paymentData?.map((item) => {
      const maxDiscountOrNOt =
        item.max_discount_limit && item.amount >= item.max_discount_limit
          ? item.add_commission_ratio === "yes"
            ? Number(item.amount) + Number(item?.max_discount_limit_value)
            : Number(item.amount)
          : item.add_commission_ratio === "yes"
          ? Number(item.amount) + Number(item.commission_riyals)
          : Number(item.amount);

      const isAddCommissionRatio =
        item.add_commission_ratio === "yes"
          ? Number(maxDiscountOrNOt) + Number(item.commission_tax)
          : Number(maxDiscountOrNOt);

      const commissionReyals = Number(item.commission_riyals);
      const commissionVat =
        Number(item.commission_riyals) * Number(userData?.tax_rate / 100);

      return {
        type: item.paymentCardId
          ? "card"
          : item.paymentBankId
          ? "bank"
          : "cash",
        type_id: item.paymentCardId || item.paymentBankId || "cash",
        type_amount: isAddCommissionRatio,
        bank_account_id: item.payment_id || "cash",
        commission: commissionReyals,
        vat: commissionVat,
      };
    });

    mutate({
      endpointName: "/oldGold/api/v1/add_Invoice",
      values: { invoice, items, payments },
    });
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
      <div className="flex items-center justify-between mx-2 relative">
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

      <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"} -mx-8 `}>
        <SellingFinalPreview
          ItemsTableContent={<SellingTableComp />}
          setStage={setStage}
          paymentData={paymentData}
          invoiceHeaderData={invoiceHeaderData}
          sellingItemsData={sellingItemsData}
          costDataAsProps={costDataAsProps}
          isSuccess={isSuccess}
          responseSellingData={responseSellingData}
        />
      </div>

      {!isSuccess ? (
        <div className="flex gap-3 justify-end mx-2 mb-8">
          <Button bordered action={() => setStage(2)}>
            {t("back")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end items-center mx-2 mb-8">
          <Button action={() => window.location.reload()} bordered>
            {t("back")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellingBrokenGoldInvoiceData;
