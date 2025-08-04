import { useContext, useMemo, useRef } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../hooks";
import { t } from "i18next";
import BudgetSecondPageItems from "../budgetInvoice/budgetSecondPage/BudgetSecondPageItems";
import BudgetSecondScreenHeader from "../budgetInvoice/budgetSecondPage/BudgetSecondScreenHeader";
import { DownloadAsPDF } from "../../../utils/DownloadAsPDF";
import { Button } from "../../../components/atoms";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import { useReactToPrint } from "react-to-print";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import InvoiceBasicHeader from "../../../components/Invoice/InvoiceBasicHeader";

const InvoiceBudgetBonds = ({ selectedItem }) => {
  const contentRef = useRef();
  const { formatGram, formatReyal } = numberContext();
  const mainDataBoxes = selectedItem?.items;
  const isRTL = useIsRTL();
  const { invoice_logo, gold_price } = GlobalDataContext();

  // const budgetOperation = processBudgetData(selectedItem?.items);
  // const formattedBudgetOperation = Object.entries(selectedItem?.items);

  // const operationDataTotals = formattedBudgetOperation.map((budgets) => {
  //   return budgets[1].reduce(
  //     (acc, curr) => {
  //       return {
  //         accountable: curr.card_name,
  //         commission: acc.commission + Number(curr.commission) || 0,
  //         vat: acc.vat + Number(curr.vat) || 0,
  //         total: acc.total + curr.value || 0,
  //       };
  //     },
  //     {
  //       commission: 0,
  //       vat: 0,
  //       total: 0,
  //     }
  //   );
  // });

  // const operationDataTable = selectedItem?.items?.reduce(
  //   (acc, curr) => {
  //     return {
  //       accountable: curr.card_name,
  //       commission: acc.commission + Number(curr.commission) || 0,
  //       vat: acc.vat + Number(curr.vat) || 0,
  //       total: acc.total + curr.value || 0,
  //     };
  //   },
  //   {
  //     commission: 0,
  //     vat: 0,
  //     total: 0,
  //   }
  // );

  const clientData = {
    bond_number: selectedItem?.bond_number,
    bank_name: selectedItem?.account_name,
    account_number: selectedItem?.account_number,
    bond_date: selectedItem?.bond_date,
    account_balance: selectedItem?.totals,
  };

  const costDataAsProps = {
    amount: 1000,
    remaining_amount: 2000,
    totalCost: 5000,
  };

  const firstColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "restriction_name",
        header: () => <span>{t("operation type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "card_name",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) => {
          const value = info.getValue();

          return formatReyal(value) || "---";
        },
        accessorKey: "amount",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "vat",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "total",
        header: () => <span>{t("total balance")}</span>,
      },

      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date",
        header: () => <span>{t("date and time")}</span>,
      },
    ],
    []
  );

  const secondColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "accountable",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) => {
          const balanceValue =
            info.row.original.total_balance -
            info.row.original.card_commission -
            info.row.original.card_vat;

          return balanceValue > 0 ? formatReyal(Number(balanceValue)) : "---";
        },
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "card_commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "card_vat",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "total_balance",
        header: () => <span>{t("total balance")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "operation_number",
        header: () => <span>{t("operation number")}</span>,
      },
    ],
    []
  );

  const invoiceHeaderBasicData = {
    first_title: "bond date",
    first_value: clientData?.bond_date,
    second_title: "bank name",
    second_value: clientData?.bank_name,
    third_title: "account number",
    third_value: clientData?.account_number,
    fourth_title: "transfer cash",
    fourth_value: `${formatReyal(clientData?.account_balance)} ${t("reyal")}`,
    bond_date: selectedItem?.invoice_date,
    bond_title: "budget bond number",
    invoice_number: Number(clientData?.bond_number),
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "budget bond",
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
        @page {
          size: A5 landscape;;
          margin: 15px !important;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            zoom: 0.5;
          }
          .rtl {
            direction: rtl;
            text-align: right;
          }
          .ltr {
            direction: ltr;
            text-align: left;
          }
          .container_print {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
          }
        }
      `,
  });

  return (
    <div className="overflow-hidden p-10 h-full">
      <div className="flex justify-end w-full">
        <Button
          className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
          action={handlePrint}
        >
          {t("print")}
        </Button>
      </div>
      <div className="py-10">
        <div
          ref={contentRef}
          className={`${
            isRTL ? "rtl" : "ltr"
          } container_print budgetPrint page-break`}
        >
          <div
            className={`print-header ${
              invoice_logo?.is_include_header_footer === "1"
                ? "opacity-1"
                : "opacity-0 h-12 print:h-80"
            }`}
          >
            <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
          </div>
          {/* <BudgetSecondScreenHeader clientData={clientData} /> */}

          <div className="print-content mt-4">
            <BudgetSecondPageItems
              firstData={mainDataBoxes || []}
              secondData={[]}
              firstColumns={firstColumn}
              secondColumns={secondColumn}
              costDataAsProps={costDataAsProps}
            />

            <InvoiceFooter />
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-4 mr-auto mt-8">
          <div className="animate_from_right">
            <Button
              bordered
              action={() => DownloadAsPDF(contentRef.current, "Invoice")}
            >
              {t("download pdf")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBudgetBonds;
