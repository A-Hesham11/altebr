import { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../../hooks";
import { processBudgetData } from "../../../utils/helpers";
import { ClientData_TP } from "../../selling/PaymentSellingPage";
import { t } from "i18next";
import BudgetSecondPageItems from "../budgetInvoice/budgetSecondPage/BudgetSecondPageItems";
import BudgetSecondScreenHeader from "../budgetInvoice/budgetSecondPage/BudgetSecondScreenHeader";
import { DownloadAsPDF } from "../../../utils/DownloadAsPDF";
import { Button } from "../../../components/atoms";

const InvoiceBudgetBonds = ({ selectedItem }) => {
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const { formatGram, formatReyal } = numberContext();
  const mainDataBoxes = selectedItem?.items;
  const isRTL = useIsRTL();

  // const budgetOperation = processBudgetData(selectedItem?.items);
  // const formattedBudgetOperation = Object.entries(selectedItem?.items);
  // console.log(
  //   "🚀 ~ InvoiceBudgetBonds ~ formattedBudgetOperation:",
  //   formattedBudgetOperation
  // );

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
  // console.log(
  //   "🚀 ~ operationDataTotals ~ operationDataTotals:",
  //   operationDataTotals
  // );

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

  // COMPANY DATA API
  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

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

  return (
    <div className="overflow-hidden p-10 h-full">
      <div className="py-10">
        <div className="print-section space-y-12 bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div
            ref={contentRef}
            className={`${isRTL ? "rtl" : "ltr"} budgetPrint page-break`}
          >
            <BudgetSecondScreenHeader clientData={clientData} />
            <BudgetSecondPageItems
              firstData={mainDataBoxes || []}
              secondData={[]}
              firstColumns={firstColumn}
              secondColumns={secondColumn}
              costDataAsProps={costDataAsProps}
            />
            {/* </div> */}
            <div className="text-center">
              <p className="my-4 py-1 border-y border-mainOrange">
                {t(
                  "Attach the statement from the ATM along with all the related receipts to this report"
                )}
              </p>
              <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
                <p>
                  {" "}
                  العنوان : {userData?.branch?.country?.name} ,{" "}
                  {userData?.branch?.city?.name} ,{" "}
                  {userData?.branch?.district?.name}
                </p>
                {/* <p>رقم المحل</p> */}
                <p>
                  {t("phone")}: {userData?.phone}
                </p>
                <p>
                  {t("email")}: {userData?.email}
                </p>
                <p>
                  {t("tax number")}:{" "}
                  {companyData && companyData[0]?.taxRegisteration}
                </p>
                <p>
                  {t("Mineral license")}:{" "}
                  {companyData && companyData[0]?.mineralLicence}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-4 mr-auto mt-8">
          <div className="animate_from_right">
            <Button
              bordered
              action={() => DownloadAsPDF(contentRef.current, "Budget")}
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
