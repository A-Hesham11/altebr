import React, {
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../../../../components/atoms";
import { t } from "i18next";
import { useFetch, useIsRTL, useMutate } from "../../../../hooks";
import { ClientData_TP } from "../../../selling/PaymentSellingPage";
import { numberContext } from "../../../../context/settings/number-formatter";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { Back } from "../../../../utils/utils-components/Back";
import BudgetSecondScreenHeader from "./BudgetSecondScreenHeader";
import BudgetSecondPageItems from "./BudgetSecondPageItems";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";
import { useReactToPrint } from "react-to-print";
import { processBudgetData } from "../../../../utils/helpers";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadAsPDF } from "../../../../utils/DownloadAsPDF";

interface BudgetSecondPage_TP {
  setStage: React.Dispatch<SetStateAction<number>>;
  selectedBankData: never[];
  mainCardData: never[];
  selectedAccountData: never[];
  isLoading: boolean;
  showPrint: boolean;
}

const BudgetSecondPage: React.FC<BudgetSecondPage_TP> = ({
  setStage,
  selectedBankData,
  mainCardData,
  selectedAccountData,
  isLoading,
  showPrint,
  invoiceData,
}) => {
  console.log("🚀 ~ mainCardData:", mainCardData);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const { formatGram, formatReyal } = numberContext();
  const mainDataBoxes = mainCardData?.cards?.map((card) => card.boxes).flat();
  const isRTL = useIsRTL();

  const budgetOperation = processBudgetData(mainCardData.cards);
  const formattedBudgetOperation = Object.entries(budgetOperation);

  const operationDataTable = formattedBudgetOperation.map((budgets) => {
    return budgets[1].reduce(
      (acc, curr) => {
        return {
          accountable: curr.account,
          card_commission:
            acc.card_commission + Number(curr.card_commission) || 0,
          card_vat: acc.card_vat + Number(curr.card_vat) || 0,
          total_balance: acc.total_balance + curr.value || 0,
          operation_number: budgets[1].length,
        };
      },
      {
        card_commission: 0,
        card_vat: 0,
        total_balance: 0,
      }
    );
  });

  const filterOperationDataTable = operationDataTable.filter(
    (operation) => operation.total_balance !== 0
  );
  console.log("🚀 ~ filterOperationDataTable:", filterOperationDataTable);

  // COMPANY DATA API
  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

  const clientData = {
    bond_number: (invoiceData.length + 1).toString().padStart(3, "0"),
    bank_name: selectedBankData?.label,
    account_number: selectedAccountData?.label,
    account_balance: mainCardData?.base?.debtor
      ? mainCardData?.base?.debtor
      : mainCardData?.base?.creditor,
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
        accessorKey: "bond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "restriction_name",
        header: () => <span>{t("operation type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "account",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) => {
          const value =
            info.row.original?.value -
            info.row.original.card_commission -
            info.row.original.card_vat;

          return formatReyal(value) || "---";
        },
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "card_commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "card_vat",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "value",
        header: () => <span>{t("total balance")}</span>,
      },

      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date_time",
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

          return formatReyal(Number(balanceValue)) || "---";
        },
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "card_commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "card_vat",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
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

  // const handlePrint = () => {
  //   const printContent = contentRef.current.innerHTML;
  //   const printWindow = window.open("", "", "height=2000,width=1500");

  //   // Copy the styles from the current document to the print window
  //   const styles = Array.from(document.querySelectorAll("link, style"))
  //     .map((style) => style.outerHTML)
  //     .join("\n");

  //   printWindow.document.write(
  //     `<html><head><title>Budget</title>${styles}</head><body>`
  //   );
  //   printWindow.document.write(printContent);
  //   printWindow.document.write("</body></html>");
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  // const handlePrint = useReactToPrint({
  //   content: () => contentRef.current,
  //   onAfterPrint: () => console.log("Print job completed."),
  // });

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
              secondData={filterOperationDataTable || []}
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
          {showPrint && (
            <div className="animate_from_right">
              <Button
                bordered
                action={() => DownloadAsPDF(contentRef.current, "Budget")}
              >
                {t("download pdf")}
              </Button>
            </div>
          )}

          {!showPrint && (
            <div className="animate_from_bottom flex gap-4">
              <Button
                className="bg-transparent border text-mainGreen border-mainGreen"
                type="button"
                action={() => setStage(1)}
              >
                {t("back")}
              </Button>

              <Button type="submit" loading={isLoading}>
                {t("save")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetSecondPage;
