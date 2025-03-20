import { t } from "i18next";
import React, { useContext, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import billLogo from "../../../assets/bill-logo.png";
import { useFetch } from "../../../hooks";
import { ClientData_TP } from "../SellingClientForm";
import { Cards_Props_TP } from "../../templates/bankCards/ViewBankCards";
import { GlobalDataContext } from "../../../context/settings/GlobalData";

interface HonestFinalScreenHeader_TP {
  clientData?: any;
}

const HonestFinalScreenHeader: React.FC<HonestFinalScreenHeader_TP> = ({
  clientData,
  popupBondId,
}) => {
  const { userData } = useContext(authCtx);
  const { client_id, client_value, bond_date } = clientData;
  const { invoice_logo } = GlobalDataContext();

  const { data } = useFetch<ClientData_TP>({
    endpoint: `branchManage/api/v1/clients/${client_id}`,
    queryKey: [`clients`, client_id],
  });


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
          <span>
            {userData?.branch?.name} - {userData?.branch?.number}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoice_logo?.InvoiceCompanyLogo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">{t("honest bond")}</p>
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
        {/* <p className="text-xs font-bold">
          {t("Id number")} :{" "}
          <span className="font-medium">
            {data?.identity || data?.national_number}
          </span>{" "}
        </p> */}
      </div>
    </div>
  );
};

export default HonestFinalScreenHeader;
