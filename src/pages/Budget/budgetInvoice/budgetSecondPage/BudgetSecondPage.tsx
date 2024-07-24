import React, { SetStateAction, useContext, useMemo, useState } from "react";
import { Button } from "../../../../components/atoms";
import { t } from "i18next";
import { useFetch, useMutate } from "../../../../hooks";
import { ClientData_TP } from "../../../selling/PaymentSellingPage";
import { numberContext } from "../../../../context/settings/number-formatter";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { Back } from "../../../../utils/utils-components/Back";
import BudgetSecondScreenHeader from "./BudgetSecondScreenHeader";
import BudgetSecondPageItems from "./BudgetSecondPageItems";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";

interface BudgetSecondPage_TP {
  setStage: React.Dispatch<SetStateAction<number>>;
  selectedBankData: never[];
}

const BudgetSecondPage: React.FC<BudgetSecondPage_TP> = ({
  setStage,
  selectedBankData,
}) => {
  console.log("🚀 ~ selectedBankData:", selectedBankData);
  const { userData } = useContext(authCtx);
  const { formatGram, formatReyal } = numberContext();
  const [showPrint, setShowPrint] = useState(false);

  // SENTENCE API
  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  // COMPANY DATA API
  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

  const clientData = {
    bank_name: selectedBankData?.label,
  };

  const costDataAsProps = {
    amount: 1000,
    remaining_amount: 2000,
    totalCost: 5000,
  };

  const firstColumnCardData = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "account",
        header: () => <span>{t("card name")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original.debtor
            ? formatReyal(Number(info.row.original.debtor))
            : info.row.original.creditor
            ? formatReyal(Number(info.row.original.creditor))
            : "---",
        accessorKey: "balance",
        header: () => <span>{t("balance")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission",
        header: () => <span>{t("commission")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "commission_tax",
        header: () => <span>{t("commission tax")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() > 0 ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "value",
        header: () => <span>{t("total balance")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "restriction_name",
        header: () => <span>{t("operation type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date_time",
        header: () => <span>{t("date and time")}</span>,
      },
    ],
    []
  );

  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      setShowPrint(true);
      // navigate(`/selling/honesty/all-honest/${data.bond_id}`);
    },
  });

  return (
    <div className="overflow-hidden p-10 h-full">
      <div className="py-10">
        <div className="print-section space-y-12 bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <BudgetSecondScreenHeader clientData={clientData} />
          <BudgetSecondPageItems
            firstData={[]}
            firstColumns={firstColumnCardData}
            costDataAsProps={costDataAsProps}
          />
          {/* </div> */}
          <div className="text-center">
            <p className="my-4 py-1 border-y border-mainOrange">
              {data && data?.sentence}
            </p>
            <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
              <p>
                {" "}
                العنوان : {userData?.branch?.country?.name} ,{" "}
                {userData?.branch?.city?.name} ,{" "}
                {userData?.branch?.district?.name}
              </p>
              {/* <p>رقم المحل</p> */}
              <p>
                {t("phone")}: {userData?.phone}
              </p>
              <p>
                {t("email")}: {userData?.email}
              </p>
              <p>
                {t("tax number")}:{" "}
                {companyData && companyData[0]?.taxRegisteration}
              </p>
              <p>
                {t("Mineral license")}:{" "}
                {companyData && companyData[0]?.mineralLicence}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-4 mr-auto mt-8">
          {showPrint && (
            <div className="animate_from_right">
              <Button bordered action={() => window.print()}>
                {t("print")}
              </Button>
            </div>
          )}

          {!showPrint && (
            <div className="animate_from_bottom flex gap-4">
              <Button
                className="bg-transparent border text-mainGreen border-mainGreen"
                type="button"
                action={() => setStage(1)}
              >
                {t("back")}
              </Button>

              <Button
                action={() => {
                  // mutate({
                  //   endpointName: "branchSafety/api/v1/create",
                  //   values: finalData,
                  //   dataType: "formData",
                  // });
                }}
                // loading={isLoading}
              >
                {t("save")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetSecondPage;
