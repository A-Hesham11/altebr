import { t } from "i18next";
import { useContext, useState } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import { formatDate, getDayAfter } from "../../../../utils/date";
import billLogo from "../../../../assets/bill-logo.png";
import { useLocation } from "react-router-dom";
import { useFormikContext } from "formik";
import { Cards_Props_TP } from "../../../templates/bankCards/ViewBankCards";
import { GlobalDataContext } from "../../../../context/settings/GlobalData";

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
    supplier_id: number;
  };
  mobile: number;
  identity: number;
  invoiceNumber: any;
  employee_name?: string;
};

const FinalPreviewBillData = ({
  clientData,
  invoiceNumber,
  employee_name,
}: Client_TP) => {
  const { client_id, client_value, bond_date, supplier_id, supplier_name } =
    clientData;

  const location = useLocation();
  const path = location.pathname;
  const { invoice_logo } = GlobalDataContext();

  const supplyFetch =
    path === "/supply-return" ||
    path === "/bonds/supply-return" ||
    path === "/viewPurchaseBonds" ||
    path === "/viewSellingBonds";

  const { data } = useFetch<Client_TP>({
    endpoint: supplyFetch
      ? `/supplier/api/v1/supplier/${supplier_id}`
      : `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, supplyFetch ? supplier_id : client_id],
    enabled: !!client_id || !!supplier_id,
  });

  const { userData } = useContext(authCtx);

  const { data: honestBondsData } = useFetch({
    queryKey: [`all-retrieve-honest-bonds-${userData?.branch_id}`],
    endpoint: `branchSafety/api/v1/receive-bonds/${userData?.branch_id}`,
  });

  const billNumber =
    path === "/selling/honesty/return-honest"
      ? honestBondsData?.length + 1
      : path === "/addSellingBond" ||
        path === "/addPurchaseBond" ||
        path === "/selling/zatca" ||
        path === "/selling/viewInvoice/" ||
        path === "/bonds/supply-return" ||
        path === "/bonds/supplier-payment" ||
        path === "/viewSellingBonds" ||
        path === "/viewPurchaseBonds" ||
        path === "/selling/return-entry" ||
        path === "/selling/honesty/all-return-honest"
      ? invoiceNumber
      : path === "/supply-return" ||
        path === "/selling/addInvoice/" ||
        path === "/selling/payoff/sales-return"
      ? invoiceNumber + 1
      : invoiceNumber?.length + 1;

  const textInvoice =
    path === "/buying/purchaseInvoice/"
      ? t("broken gold purchase invoice")
      : path === "selling/payoff/sales-return"
      ? t("simplified tax invoice")
      : path === "/selling/return-entry"
      ? t("sales return invoice")
      : path === "/selling/honesty/all-honest"
      ? t("honest bond")
      : t("simplified tax invoice");

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("bill no")} : <span className="font-medium">{billNumber}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("bill date")} :{" "}
          <span className="font-medium">
            {path === "/selling/honesty/return-honest" ||
            path === "/selling/return-entry" ||
            path === "/selling/viewPayment" ||
            path === "/selling/viewInvoice/" ||
            path === "/bonds/supply-return" ||
            path === "/bonds/supplier-payment" ||
            path === "/viewSellingBonds" ||
            path === "/viewPurchaseBonds" ||
            path === "/selling/honesty/all-return-honest"
              ? bond_date
              : formatDate(bond_date)}
          </span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoice_logo?.InvoiceCompanyLogo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">
          {/* {userData?.branch?.country?.name} , {userData?.branch?.city?.name} */}
          {textInvoice}
        </p>
        {/* <p className="text-xs font-medium">
          <span className="font-bold">{t("district")}:</span>
          {userData?.branch?.district?.name}
        </p> */}
      </div>
      <div className="flex flex-col gap-1 mt-6">
        {employee_name ? (
          <p className="text-xs font-bold">
            {t("employee name")}
            <span className="font-medium">{employee_name}</span>{" "}
          </p>
        ) : client_value != "غير معرف" ? (
          <>
            <p className="text-xs font-bold">
              {supplier_id ? t("supplier name") : t("client name")} :{" "}
              <span className="font-medium">
                {client_value || supplier_name}
              </span>{" "}
            </p>
            <p className="text-xs font-bold">
              {t("mobile number")} :{" "}
              <span className="font-medium">{data?.phone}</span>{" "}
            </p>
            {/* <p className="text-xs font-bold">
      {t("Id number")} :{" "}
      <span className="font-medium">
        {data?.identity || data?.national_number}
      </span>{" "}
    </p> */}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FinalPreviewBillData;
