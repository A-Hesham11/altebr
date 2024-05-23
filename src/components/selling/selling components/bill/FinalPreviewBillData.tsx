import { t } from "i18next";
import { useContext } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import { formatDate, getDayAfter } from "../../../../utils/date";
import billLogo from "../../../../assets/bill-logo.png";
import { useLocation } from "react-router-dom";
import { useFormikContext } from "formik";

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

const FinalPreviewBillData = ({ clientData, invoiceNumber }: Client_TP) => {
  const { client_id, client_value, bond_date, supplier_id } = clientData;

  const location = useLocation();
  const path = location.pathname;

  const { data } = useFetch<Client_TP>({
    endpoint: path === "/supply-return" ? `/supplier/api/v1/supplier/${supplier_id}` : `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, path === "/supply-return" ? supplier_id  : client_id],
  });

  console.log("🚀 ~ FinalPreviewBillData ~ data:", data)


  const { userData } = useContext(authCtx);

  const { data: honestBondsData } = useFetch({
    queryKey: [`all-retrieve-honest-bonds-${userData?.branch_id}`],
    endpoint: `branchSafety/api/v1/receive-bonds/${userData?.branch_id}`,
  });



  const billNumber =
    path === "/selling/honesty/return-honest"
      ? honestBondsData?.length + 1
      : path === "/addSellingBond" || path === "/addPurchaseBond"
      ? invoiceNumber
      : path === "/supply-return"
      ? invoiceNumber?.total + 1
      : invoiceNumber?.length + 1;

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("bill no")} : <span className="font-medium">{billNumber}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("bill date")} :{" "}
          <span className="font-medium">{formatDate(bond_date)}</span>{" "}
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
          {supplier_id ? t("supplier name") : t("client name")} :{" "}
          <span className="font-medium">{client_value}</span>{" "}
        </p>

        <p className="text-xs font-bold">
          {t("mobile number")} :{" "}
          <span className="font-medium">{data?.phone}</span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("Id number")} :{" "}
          <span className="font-medium">{data?.identity || data?.national_number}</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default FinalPreviewBillData;
