import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { formatDate } from "../../utils/date";
import { t } from "i18next";
import billLogo from "../../assets/bill-logo.png";

const PaymentFinalPreviewBillData = ({
  isSupply,
  clientData,
  invoiceNumber,
}: any) => {
  const {
    client_id,
    client_value,
    bond_date,
    bondType,
    branchName,
    supplier_id,
  } = clientData;
  console.log("🚀 ~ branchName:", branchName);

  const location = useLocation();
  const path = location.pathname;

  const { userData } = useContext(authCtx);

  const billNumber = invoiceNumber;

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
        <img src={billLogo} alt="bill" />
        <p className="text-base font-medium">{t("simplified tax invoice")}</p>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          <span className="font-bold text-[16px] text-mainGreen">
            {isSupply ? t("supply bond") : t("bond payment")}
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
