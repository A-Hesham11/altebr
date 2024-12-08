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
const SellingInvoiceDataDemo = ({
  setStage,
  sellingItemsData,
  paymentData,
  invoiceHeaderData,
}: CreateHonestSanadProps_TP) => {
  const { formatGram, formatReyal } = numberContext();
  const contentRef = useRef();
  //   const taxRate = values.karat_name === "24" ? 1 : 1.15;

  const [responseSellingData, SetResponseSellingData] = useState(null);

  const { userData } = useContext(authCtx);

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

  const totalCostBeforeTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa;
    return acc;
  }, 0);

  const totalVat = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax - +curr.taklfa;
    return acc;
  }, 0);

  const totalCostAfterTax = sellingItemsData.reduce((acc, curr) => {
    acc += +curr.taklfa_after_tax;
    return acc;
  }, 0);

  const totalStonesWeight = sellingItemsData?.reduce((acc, curr) => {
    const stoneWeigthByGram = Number(curr.stones_weight) / 5;
    const weight = Number(curr.weight) * 0.05;
    const result = stoneWeigthByGram > weight;
    acc += result ? Number(curr.stones_weight) : 0;
    return acc;
  }, 0);

  // const resultTable = [
  //   {
  //     number: t("totals"),
  //     weight: formatGram(Number(totalWeight)),
  //     cost: formatReyal(Number(totalCostBeforeTax)),
  //     vat: formatReyal(Number(totalVat)),
  //     total: formatReyal(Number(totalCostAfterTax)),
  //   },
  // ];

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(Number(totalCostAfterTax))
  );

  const costDataAsProps = {
    totalCommissionRatio,
    totalCostAfterTax,
    totalFinalCostIntoArabic,
  };

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      stonesWeight:
        totalStonesWeight != 0 ? formatGram(Number(totalStonesWeight)) : "---",
      totalWeight:
        formatGram(Number(totalStonesWeight) + Number(totalWeight)) || "---",
      cost: formatReyal(Number(totalCostBeforeTax)),
      vat: formatReyal(Number(totalVat)),
      total: formatReyal(Number(totalCostAfterTax)),
    },
  ];

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("category")}</span>,
        accessorKey: "classification_id",
        cell: (info) =>
          info.getValue() === 1
            ? t("gold")
            : info.getValue() === 2
            ? t("diamond")
            : info.getValue() === 3
            ? t("accessories")
            : "---",
      },
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("Price per gram")} </span>,
        accessorKey: "Price_gram",
        cell: (info: any) => {
          const taxRate = info.row.original.karat_name === "24" ? 1 : 1.15;
          const totalCostFromRow =
            Number(info.row.original.taklfa_after_tax) / Number(taxRate);

          return formatReyal(
            Number(totalCostFromRow) / Number(info.row.original.weight)
          );
        },
      },
      {
        header: () => (
          <span>{`${t("precious metal weight")} (${t("In grams")})`}</span>
        ),
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => (
          <span>
            {`${t("The weight of the stones if it exceeds 5%")} (${t(
              "in karat"
            )})`}{" "}
          </span>
        ),
        accessorKey: "stones_weight",
        cell: (info) => {
          const stoneWeigthByGram = Number(info.getValue()) / 5;
          const weight = Number(info.row.original.weight) * 0.05;
          const result = stoneWeigthByGram > weight;
          return !!result ? info.getValue() : "---";
        },
      },
      {
        header: () => <span>{`${t("total weight")}`} </span>,
        accessorKey: "total_Weight",
        cell: (info) => {
          const stoneWeigthByGram =
            Number(info.row.original?.stones_weight) / 5;
          const weight = Number(info.row.original.weight) * 0.05;
          const result = stoneWeigthByGram > weight;
          const valueOfWeight =
            Number(result ? info.row.original?.stones_weight : 0) +
            Number(info.row.original?.weight);

          return valueOfWeight || "---";
        },
      },
      {
        header: () => <span>{t("price before tax")} </span>,
        accessorKey: "taklfa",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "VAT",
        cell: (info: any) => {
          return (
            <div>
              {formatReyal(
                Number(info.row.original.taklfa_after_tax) -
                  Number(info.row.original.taklfa)
              )}
            </div>
          );
        },
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "taklfa_after_tax",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
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
      client_id: invoiceHeaderData.client_id,
      client_value: invoiceHeaderData.client_value,
      invoice_date: invoiceHeaderData.bond_date,
      invoice_number: invoiceHeaderData?.invoice_number + 1,
      count: sellingItemsData.length,
      //   total_vat: totalItemsTax,
      karat_price: sellingItemsData[0].gold_price,
    };
    const items = sellingItemsData.map((item) => {
      return {
        classification_id: item.classification_id,
        category_id: item.category_id,
        category_name: item.category_name,
        branch_id: userData?.branch_id,
        weight: item.weight,
        total_weight: item.total_weight,
        stones_weight: item.stones_weight,
        karat_name: item.karat_name,
        price_gram: Number(item.taklfa) / Number(item.weight),
        vat: Number(item.taklfa_after_tax) - Number(item.taklfa),
        taklfa: item.taklfa,
        taklfa_after_tax: item.taklfa_after_tax,
        cost: item.taklfa,
        total: item.taklfa_after_tax,
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

    const paymentCard = paymentData?.map((item) => ({
      card_id: item.frontkey === "cash" ? "cash" : item.paymentCardId,
      bank_id: item.paymentBankId,
      amount: item.cost_after_tax,
    }));

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
      endpointName: "/invoiceSales/api/v1/add_Invoice",
      values: { invoice, items, card, paymentCommission, paymentCard },
    });

    console.log(
      "🚀 ~ file: SellingInvoiceData.tsx:227 ~ posSellingDataHandler ~ { invoice, items, card }:",
      { invoice, items, card, paymentCommission, paymentCard }
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
          // clientData={clientData}
          invoiceHeaderData={invoiceHeaderData}
          sellingItemsData={sellingItemsData}
          costDataAsProps={costDataAsProps}
          // invoiceNumber={invoiceNumber}
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

export default SellingInvoiceDataDemo;
