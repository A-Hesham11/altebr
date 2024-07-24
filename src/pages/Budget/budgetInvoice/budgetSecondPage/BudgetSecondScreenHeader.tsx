import React, { useContext } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import billLogo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { formatDate, formatDateAndTime } from "../../../../utils/date";

interface ClientData_TP {
  bank_name: string;
}

interface BudgetSecondScreenHeader_TP {
  clientData: ClientData_TP;
}

const BudgetSecondScreenHeader: React.FC<BudgetSecondScreenHeader_TP> = ({
  clientData,
}) => {
  const { userData } = useContext(authCtx);
  const { bank_name } = clientData;

  const { data } = useFetch<ClientData_TP>({
    endpoint: `branchSafety/api/v1/bonds/${userData?.branch_id}?per_page=10000`,
    queryKey: [`bondsData`],
  });

  return (
    <div className="flex justify-between mx-6 bill-shadow rounded-md p-6">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("budget bond number")} : <span className="font-medium">{1}</span>
        </p>
        <p>
          <span>{t("branch")}: </span>
          <span>{userData?.branch?.id}</span>
        </p>
        <p>
          <span>{t("date and time")}: </span>
          <span>{`${formatDateAndTime(new Date())}`}</span>
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
          {t("bank name")} : <span className="font-medium">{bank_name}</span>
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
        </p>
      </div>
    </div>
  );
};

export default BudgetSecondScreenHeader;
