import React, { useState } from "react";

import { t } from "i18next";
import { useContext } from "react";
import billLogo from "../../../assets/bill-logo.png";
import { useLocation } from "react-router-dom";
import { useFormikContext } from "formik";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { formatDate } from "../../../utils/date";
import { ClientData_TP } from "../../selling/PaymentSellingPage";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";

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
};

const FinalPreviewBillDataCodedIdentities = ({
  clientData,
  invoiceNumber,
}: Client_TP) => {
  const { client_id, client_value, bond_date, supplier_id } = clientData;
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const location = useLocation();
  const path = location.pathname;

  const { data } = useFetch<Client_TP>({
    endpoint:
      path === "/supply-return"
        ? `/supplier/api/v1/supplier/${supplier_id}`
        : `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, path === "/supply-return" ? supplier_id : client_id],
  });

  const { userData } = useContext(authCtx);

  const billNumber = invoiceNumber;

  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

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
          {t("bond date")} : <span className="font-medium">{bond_date}</span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoiceInfo?.InvoiceCompanyLogo || billLogo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">{t("simplified tax invoice")}</p>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          <span className="font-bold text-[16px] text-mainGreen">
            {t("transfer note to branch")}
          </span>{" "}
        </p>
        <p className="text-xs font-medium">
          <span className="font-bold">{t("branch number")}:</span>
          {userData?.branch_id}
        </p>
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

export default FinalPreviewBillDataCodedIdentities;
