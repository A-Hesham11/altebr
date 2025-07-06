import { useFormikContext } from "formik";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../utils/date";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import { useContext } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";

type TFormikValues = {
  receipt_date: string;
};

const ReceiptBondInvoiceHeader = () => {
  const { values } = useFormikContext<TFormikValues>();
  const { invoice_logo } = GlobalDataContext();
  const { userData } = useContext<any>(authCtx);

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("bond number")} :{" "}
          <span className="font-medium">
            {/* FIXME: THIS WILL FETCH HERE THE VIEW API AND GET THE INVOICE NUMBER FROM IT */}
            {Number(1)}
          </span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("bill date")} :{" "}
          <span className="font-medium">
            {formatDate(new Date(values.receipt_date))}
          </span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("branch name")} :{" "}
          <span className="font-medium">{userData?.branch_name}</span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoice_logo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">{t("receipt bond")}</p>
      </div>
    </div>
  );
};

export default ReceiptBondInvoiceHeader;
