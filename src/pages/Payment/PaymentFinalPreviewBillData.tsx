import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { formatDate } from "../../utils/date";
import { t } from "i18next";
import billLogo from "../../assets/bill-logo.png";

const PaymentFinalPreviewBillData = ({ clientData, invoiceNumber }: any) => {
  const { client_id, client_value, bond_date, supplier_id } = clientData;

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
            path === "/selling/payoff/supply-payoff"
              ? bond_date
              : formatDate(bond_date)}
          </span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img src={billLogo} alt="bill" />
        <p className="text-xs font-medium">
          {userData?.branch?.country?.name} , {userData?.branch?.city?.name}
        </p>
        <p className="text-xs font-medium">
          <span className="font-bold">{t("district")}:</span>
          {userData?.branch?.district?.name}
        </p>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          <span className="font-bold text-[16px] text-mainGreen">
            {t("bond payment")}
          </span>{" "}
        </p>
        <p className="text-xs font-medium">
          <span className="font-bold">{t("branch number")}:</span>
          {userData?.branch?.id}
        </p>
      </div>
    </div>
  );
};

export default PaymentFinalPreviewBillData;
