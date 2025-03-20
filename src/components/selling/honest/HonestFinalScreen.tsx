import { t } from "i18next";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Button } from "../../atoms";
import { numberContext } from "../../../context/settings/number-formatter";
import { useReactToPrint } from "react-to-print";
import InvoiceFooter from "../../Invoice/InvoiceFooter";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import InvoiceBasicHeader from "../../Invoice/InvoiceBasicHeader";
import InvoiceTableData from "../selling components/InvoiceTableData";
import FinalPreviewBillPayment from "../selling components/bill/FinalPreviewBillPayment";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";

///
type HonestFinalScreenProps_TP = {
  sanadData: any;
  setStage: any;
  paymentData: never[];
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const HonestFinalScreen = ({
  sanadData,
  setStage,
  paymentData,
}: HonestFinalScreenProps_TP) => {
  console.log("🚀 ~ sanadData:", sanadData);
  /////////// VARIABLES
  const { userData } = useContext(authCtx);
  const { formatGram, formatReyal } = numberContext();
  const [showPrint, setShowPrint] = useState(false);
  const contentRef = useRef();
  const isRTL = useIsRTL();

  const mainSanadData = {
    client_id: sanadData.client_id,
    employee_id: userData?.id,
    branch_id: userData?.branch_id,
    bond_date: new Date(sanadData.bond_date)?.toISOString().slice(0, 10),
    remaining_amount: sanadData.remaining_amount,
    amount: sanadData.amount,
  };

  const items = sanadData.tableData.map((item) => ({
    bond_number: null,
    category_id: item.category_id,
    karat_id: item.karat_id,
    mineral_id: null,
    cost: item.cost,
    karatmineral_id: null,
    description: item.notes,
    weight: item.weight,
    media: item.media,
  }));

  const finalData = {
    bond: mainSanadData,
    card: sanadData.card,
    paymentCommission: sanadData.paymentCommission,
    items,
  };

  const totalCost = sanadData?.tableData?.reduce((acc: number, curr: any) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalFinalCostIntoArabic = convertNumToArWord(Math.round(totalCost));

  const totalFinalAmountIntoArabic = convertNumToArWord(
    Math.round(sanadData?.amount)
  );

  const totalFinalRemainingAmountIntoArabic = convertNumToArWord(
    Math.round(sanadData?.remaining_amount)
  );

  const costDataAsProps = {
    totalCost,
    finalArabicData: [
      {
        title: t("total of estimated cost"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("total of amount paid"),
        totalFinalCostIntoArabic: totalFinalAmountIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("deserved amount"),
        totalFinalCostIntoArabic: totalFinalRemainingAmountIntoArabic,
        type: t("reyal"),
      },
    ],
  };

  ///
  const Cols = useMemo<any>(
    () => [
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "category_value",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "karat_value",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "cost",
        header: () => <span>{t("approximate cost")}</span>,
      },
      {
        cell: (info) => info.getValue() || t("not found"),
        accessorKey: "notes",
        header: () => <span>{t("notes")}</span>,
      },
    ],
    []
  );
  ///
  /////////// CUSTOM HOOKS
  ///

  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      setShowPrint(true);
    },
  });
  ///
  /////////// STATES
  ///
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ dataSource:", dataSource);
  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setDataSource(sanadData.tableData);
  }, []);
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

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

  ///
  return (
    <div className="py-8">
      <div
        ref={contentRef}
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
      >
        <div className="print-header">
          <InvoiceBasicHeader
            invoiceHeaderData={sanadData?.invoiceHeaderBasicData}
          />
        </div>

        <div className="print-content">
          <InvoiceTableData
            data={sanadData?.tableData || []}
            columns={Cols}
            costDataAsProps={costDataAsProps}
          />
        </div>

        <div className="print-footer">
          <FinalPreviewBillPayment
            responseSellingData={sanadData?.tableData}
            paymentData={paymentData}
            notQRCode={true}
          />
          <InvoiceFooter />
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-4 mr-auto mt-8">
        {showPrint ? (
          <div className="animate_from_right">
            <Button bordered action={handlePrint}>
              {t("print")}
            </Button>
          </div>
        ) : (
          <div className="animate_from_bottom">
            <Button
              action={() => {
                mutate({
                  endpointName: "branchSafety/api/v1/create",
                  values: finalData,
                  dataType: "formData",
                });
              }}
              loading={isLoading}
            >
              {t("save")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
