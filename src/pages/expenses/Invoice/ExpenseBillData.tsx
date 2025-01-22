import { useContext, useState } from "react";
import { useFetch } from "../../../hooks";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../utils/date";
import { t } from "i18next";
import { authCtx } from "../../../context/auth-and-perm/auth";

import billLogo from "../../../assets/bill-logo.png";
import { useFormikContext } from "formik";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { GlobalDataContext } from "../../../context/settings/GlobalData";

type Client_TP = {
  clientData?: {
    amount: number;
    bond_date: string;
    client_id: number;
    client_value: string;
    employee_id: number;
    employee_value: string;
    id: number;
    invoiceNumber: number;
  };
  mobile: number;
  identity: number;
};

const ExpenseBillData = ({ clientData, invoiceNumber }: Client_TP) => {
  const { client_id, client_value, bond_date } = clientData;
  const { invoice_logo } = GlobalDataContext();
  const { data } = useFetch<Client_TP>({
    endpoint: `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, client_id],
  });

  const { userData } = useContext(authCtx);

  const location = useLocation();
  const path = location.pathname;

  const billNumber =
    path === "/selling/honesty/return-honest"
      ? honestBondsData?.length + 1
      : path === "/expenses/expensesBonds/" || path === "/edara/viewExpenses"
      ? invoiceNumber + 1
      : Number(invoiceNumber?.length) + 1;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("expense number")} :{" "}
          <span className="font-medium">{billNumber}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("expense date")} :{" "}
          <span className="font-medium">
            {/* {path === "/expenses/expensesBonds/" && bond_date} */}
            {bond_date && path !== "/expenses/expensesBonds/"
              ? formatDate(bond_date)
              : formatDate(new Date())}
          </span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoice_logo?.InvoiceCompanyLogo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">{t("mere document")}</p>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          <span className="font-bold text-[16px] text-mainGreen">
            {t("mere document")}
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

export default ExpenseBillData;
