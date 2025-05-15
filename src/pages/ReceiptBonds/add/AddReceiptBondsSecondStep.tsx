import React, { useContext } from "react";
import { useReactToPrint } from "react-to-print";
import { useIsRTL, useMutate } from "../../../hooks";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import { Button } from "../../../components/atoms";
import { t } from "i18next";
import ReceiptBondInvoiceHeader from "./ReceiptBondInvoiceHeader";
import ReceiptBondInvoiceTable from "./ReceiptBondInvoiceTable";
import { useFormikContext } from "formik";
import { numberContext } from "../../../context/settings/number-formatter";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/date";

const AddReceiptBondsSecondStep = ({ files, paymentData, setStage }: any) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const isRTL = useIsRTL();
  const { formatReyal } = numberContext();
  const { values } = useFormikContext<any>();
  const { userData } = useContext<any>(authCtx);

  const taxCalc = (values.receipt_price * userData?.tax_rate) / 100;
  const total = +values.receipt_price + taxCalc;

  const { mutate, isSuccess, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success", `${t("bond created successfully")}`);
    },
    onError: () => {
      notify("error", `${t("bond created failed")}`);
    },
  });

  const data = [
    {
      amountPaid: formatReyal(values.receipt_price),
      tax: formatReyal(taxCalc),
      total: formatReyal(total),
    },
  ];

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

  const totalFinalCostIntoArabic = convertNumToArWord(total);

  const handleSave = async () => {
    const sendingData = {
      bond_date: formatDate(values.receipt_date),
      arrest_tax: taxCalc,
      branch_id: userData?.branch_id,
      employee_id: userData?.id,
      amount: values.receipt_price,
      type: values.type,
      type_id: values.agency_beneficiary,
      invoice_number: values.invoice_number,
      notes: values.description,
      reason: values.reason,
      media: files,
      banksAccounts: paymentData?.map((item: any) => ({
        [item.frontkey === "cash" ? "cash" : item.paymentBankId]: item.amount,
      })),
    };

    mutate({
      endpointName: "/arrest/api/v1/addArrest",
      values: sendingData,
      dataType: "formData",
    });
  };

  return (
    <div className="relative h-full py-16 px-8">
      <div className="flex justify-end gap-4 mb-8 w-full">
        {isSuccess ? (
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={handlePrint}
          >
            {t("print")}
          </Button>
        ) : (
          <Button
            action={handleSave}
            loading={isLoading}
            className="bg-lightWhite text-white px-7 py-[6px] border-2 bg-mainGreen"
          >
            {t("save")}
          </Button>
        )}
        <Button
          action={() => setStage(1)}
          className=" text-mainGreen px-7 py-[6px] border-2 !border-gray-400 bg-white"
        >
          {t("back")}
        </Button>
      </div>

      <div
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
        ref={contentRef}
      >
        <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow">
          <div className="mx-5 bill-shadow rounded-md p-6">
            <ReceiptBondInvoiceHeader />
          </div>

          <div className="">
            <ReceiptBondInvoiceTable data={data} />
          </div>

          <div className="mx-5 bill-shadow rounded-md p-6 space-y-20 text-lg my-9 ">
            <div className="space-y-7">
              <p className="flex items-center gap-4">
                <span>{t("received from the honorable")}</span>{" "}
                <span className="border-b flex-1 border-dashed border-[#C7C7C7]">
                  {values.beneficiary}
                </span>
              </p>
              <p className="flex items-center gap-4">
                <span>{t("amount and value")}</span>
                <span className="border-b flex-1 border-dashed border-[#C7C7C7]">
                  {totalFinalCostIntoArabic}
                </span>
                <span>{t("only")}</span>
              </p>
              <p className="flex items-center gap-4">
                <span>{t("this is about")}</span>
                <span className="border-b flex-1 border-dashed border-[#C7C7C7]">
                  {values.reason}
                </span>
              </p>
              <p className="flex items-center gap-4">
                <span>{t("invoice number")}</span>
                <span className="border-b w-64 border-dashed border-[#C7C7C7]">
                  {values.invoice_number}
                </span>
              </p>
            </div>

            <div className="flex items-center px-44 justify-between">
              <p className="flex flex-col gap-4 justify-center">
                <span className="text-center">
                  {t("signature of bond organizer")}
                </span>
                <span className="text-center">{userData?.name}</span>
              </p>
              <div className="flex flex-col gap-4">
                <span className="text-center">{t("branch manager")}</span>
                <p className="flex">
                  <span className="mx-4">{t("name")}</span>
                  <span className="flex-1">
                    -----------------------------------------------
                  </span>
                </p>
                <p className="flex">
                  <span className="mx-4">{t("signature")}</span>
                  <span className="flex-1">
                    -----------------------------------------------
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <InvoiceFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptBondsSecondStep;
