import { useContext } from "react";
import { useFetch } from "../../../hooks";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../utils/date";
import { t } from "i18next";
import { authCtx } from "../../../context/auth-and-perm/auth";

import billLogo from "../../../assets/bill-logo.png";
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
  };
  mobile: number;
  identity: number;
};

const ExpenseBillData = ({ clientData, invoiceNumber }: Client_TP) => {
  console.log("🚀 ~ ExpenseBillData ~ clientData:", clientData);
  console.log("🚀 ~ ExpenseBillData ~ invoiceNumber:", invoiceNumber);
  const { client_id, client_value, bond_date } = clientData;

  const { setFieldValue, values } = useFormikContext<any>();
  console.log("🚀 ~ ExpenseBillData ~ values:", values);

  const { data } = useFetch<Client_TP>({
    endpoint: `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, client_id],
  });

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ ExpenseBillData ~ userData:", userData);

  // const { data: honestBondsData } = useFetch({
  //   queryKey: [`all-retrieve-honest-bonds-${userData?.branch_id}`],
  //   endpoint: `branchSafety/api/v1/receive-bonds/${userData?.branch_id}`,
  // });

  const location = useLocation();
  const path = location.pathname;

  const billNumber =
    path === "/selling/honesty/return-honest"
      ? honestBondsData?.length + 1
      : invoiceNumber?.length + 1;

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
            {bond_date ? formatDate(bond_date) : formatDate(new Date())}
          </span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img src={billLogo} alt="bill" className=""/>
        <p className="text-base font-medium">{t("simplified tax invoice")}</p>
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
