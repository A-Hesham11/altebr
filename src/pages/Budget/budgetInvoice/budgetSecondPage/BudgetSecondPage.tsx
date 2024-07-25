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

interface BudgetSecondPage_TP {
  setStage: React.Dispatch<SetStateAction<number>>;
  selectedBankData: never[];
  mainCardData: never[];
  selectedAccountData: never[];
}

const BudgetSecondPage: React.FC<BudgetSecondPage_TP> = ({
  setStage,
  selectedBankData,
  mainCardData,
  selectedAccountData,
}) => {
  console.log("🚀 ~ selectedAccountData:", selectedAccountData);
  console.log("🚀 ~ mainCardData:", mainCardData);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const { formatGram, formatReyal } = numberContext();
  const [showPrint, setShowPrint] = useState(false);
  const mainDataBoxes = mainCardData?.cards?.map((card) => card.boxes).flat();
  const isRTL = useIsRTL();

  // SENTENCE API
  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  // COMPANY DATA API
  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

  const clientData = {
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

  // TODO: LINK IT WITH THE CORRECT ACCESSOR KEY
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
        cell: (info: any) =>
          info.row.original.debtor
            ? formatReyal(Number(info.row.original.debtor))
            : info.row.original.creditor
            ? formatReyal(Number(info.row.original.creditor))
            : "---",
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission_tax",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
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
      // {
      //   cell: (info: any) => info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
      //   accessorKey: "karat_name",
      //   header: () => <span>{t("balance")}</span>,
      // },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission_tax",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original.debtor
            ? formatReyal(Number(info.row.original.debtor))
            : info.row.original.creditor
            ? formatReyal(Number(info.row.original.creditor))
            : "---",
        accessorKey: "total_balance",
        header: () => <span>{t("total balance")}</span>,
      },
      {
        cell: (info: any) => info.row.original.boxes.length || "---",
        accessorKey: "operation_number",
        header: () => <span>{t("operation number")}</span>,
      },
    ],
    []
  );

  const handlePrint = () => {
    const printContent = contentRef.current.innerHTML;
    const printWindow = window.open("", "", "height=2000,width=1500");

    printWindow.document.write(
      "<html><head><title>Budget</title></head><body>"
    );
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

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
              secondData={mainCardData?.cards || []}
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
          {!showPrint && (
            <div className="animate_from_right">
              <Button bordered action={handlePrint}>
                {t("print")}
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

              <Button
                type="submit"
                action={() => {
                  // mutate({
                  //   endpointName: "branchSafety/api/v1/create",
                  //   values: finalData,
                  //   dataType: "formData",
                  // });
                }}
                // loading={isLoading}
              >
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
