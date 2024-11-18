import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { formatDate } from "../../utils/date";
import { t } from "i18next";
import billLogo from "../../assets/bill-logo.png";
import { Cards_Props_TP } from "../../components/templates/bankCards/ViewBankCards";

const PaymentFinalPreviewBillData = ({
  isSupply,
  clientData,
  invoiceNumber,
  invoiceData,
}: any) => {
  console.log("🚀 ~ invoiceNumber:", invoiceNumber);
  console.log("🚀 ~ invoiceData:", invoiceData);
  const {
    client_id,
    client_value,
    bond_date,
    bondType,
    branchName,
    supplier_id,
  } = clientData;
  console.log("🚀 ~ bond_date:", bond_date);

  console.log("🚀 ~ branchName:", branchName);
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const location = useLocation();
  const path = location.pathname;

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const billNumber = invoiceNumber;

  const { data: invoiceInformation } = useFetch<Cards_Props_TP[]>({
    endpoint: `/companySettings/api/v1/InvoiceData`,
    queryKey: ["InvoiceHeader_Data"],
    pagination: true,
    onSuccess(data) {
      const returnData = data?.data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setInvoiceInfo(returnData);
    },
  });

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("bond number")} : <span className="font-medium">{billNumber}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("bond date")} :{" "}
          <span className="font-medium">
            {path === "/selling/honesty/return-honest" ||
            path === "/selling/viewInvoice/" ||
            path === "/selling/return-entry" ||
            path === "/selling/viewPayment" ||
            path === "/branch-bonds-react" ||
            path === "/selling/supplyReturn" ||
            path === "/selling/wasteReturn" ||
            path === "/wasteBonds" ||
            path === "/selling/payoff/supply-payoff"
              ? bond_date
              : formatDate(bond_date)}
          </span>{" "}
        </p>
        {isSupply && (
          <p className="text-xs font-bold">
            {t("bond type")} : <span className="font-medium">{bondType}</span>{" "}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoiceInfo?.InvoiceCompanyLogo || billLogo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        {path === "/coding-react" ? (
          <p>{t("supply bond")}</p>
        ) : (
          <p className="text-base font-medium">
            {invoiceData.invoiceName
              ? invoiceData?.invoiceName
              : t("simplified tax invoice")}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          <span className="font-bold text-[16px] text-mainGreen">
            {isSupply
              ? t("supply bond")
              : invoiceData?.invoiceName
              ? invoiceData?.invoiceName
              : t("bond payment")}
          </span>{" "}
        </p>
        {isSupply ? (
          <p className="text-xs font-medium">
            <span className="font-bold">{t("branch name")}:</span>
            {branchName}
          </p>
        ) : (
          <p className="text-xs font-medium">
            <span className="font-bold">{t("branch number")}:</span>
            {userData?.branch?.id}
          </p>
        )}

        {/* <p className="text-xs font-bold">
          {supplier_id ? t("supplier name") : t("client name")} :{" "}
          <span className="font-medium">{client_value}</span>{" "}
        </p>

        <p className="text-xs font-bold">
          {t("mobile number")} :{" "}
          <span className="font-medium">{data?.phone}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("Id number")} :{" "}
          <span className="font-medium">
            {data?.identity || data?.national_number}
          </span>{" "}
        </p> */}
      </div>
    </div>
  );
};

export default PaymentFinalPreviewBillData;
