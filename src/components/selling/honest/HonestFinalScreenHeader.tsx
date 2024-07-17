import { t } from "i18next";
import React, { useContext } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import billLogo from "../../../assets/bill-logo.png";
import { useFetch } from "../../../hooks";
import { ClientData_TP } from "../SellingClientForm";

interface HonestFinalScreenHeader_TP {
  clientData?: any;
}

const HonestFinalScreenHeader: React.FC<HonestFinalScreenHeader_TP> = ({
  clientData,
}) => {
  const { userData } = useContext(authCtx);
  const { client_id, client_value, bond_date } = clientData;

  const { data } = useFetch<ClientData_TP>({
    endpoint: `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, client_id],
  });

  const { data: bondsData } = useFetch<ClientData_TP>({
    endpoint: `branchSafety/api/v1/bonds/${userData?.branch_id}?per_page=10000`,
    queryKey: [`bondsData`],
  });
  console.log("🚀 ~ bondsData:", bondsData);

  const bondNumber = bondsData?.[0]?.id === null ? 1 : bondsData?.[0]?.id + 1;

  return (
    <div className="flex justify-between mx-6 bill-shadow rounded-md p-6">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("honest bond number")} :{" "}
          <span className="font-medium">{bondNumber}</span>
        </p>
        <p className="text-xs font-bold">
          {t("honest bond date")} :{" "}
          <span className="font-medium">{`${new Date(bond_date)
            .toISOString()
            .slice(0, 10)}`}</span>{" "}
        </p>
        <p>
          <span>{t("branch")}: </span>
          <span>{userData?.branch?.id}</span>
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
          {t("client name")} :{" "}
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
        </p>
      </div>
    </div>
  );
};

export default HonestFinalScreenHeader;
