import React, { useContext, useState } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import billLogo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { formatDate, formatDateAndTime } from "../../../../utils/date";
import { numberContext } from "../../../../context/settings/number-formatter";
import { Cards_Props_TP } from "../../../../components/templates/bankCards/ViewBankCards";

interface ClientData_TP {
  bank_name: string;
  account_number: number;
  account_balance: number;
}

interface BudgetSecondScreenHeader_TP {
  clientData: ClientData_TP;
}

const BudgetSecondScreenHeader: React.FC<BudgetSecondScreenHeader_TP> = ({
  clientData,
}) => {
  const { userData } = useContext(authCtx);
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const { formatReyal } = numberContext();
  const {
    bank_name,
    bond_number,
    bond_date = formatDateAndTime(new Date()),
    account_number,
    account_balance,
  } = clientData;

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
    <div className="flex justify-between mx-6 bill-shadow rounded-md p-6">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("budget bond number")} :{" "}
          <span className="font-medium">{bond_number}</span>
        </p>
        <p>
          <span>{t("branch")}: </span>
          <span>{userData?.branch?.id}</span>
        </p>
        <p>
          <span>{t("date and time")}: </span>
          <span>{`${bond_date}`}</span>
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoiceInfo?.InvoiceCompanyLogo || billLogo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">{t("Budget bond")}</p>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("bank name")} : <span className="font-medium">{bank_name}</span>
        </p>

        <p className="text-xs font-bold">
          {t("account number")} :{" "}
          <span className="font-medium">{account_number}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("transfer cash")} :{" "}
          <span className="font-medium">{`${formatReyal(account_balance)} ${t(
            "reyal"
          )}`}</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default BudgetSecondScreenHeader;
