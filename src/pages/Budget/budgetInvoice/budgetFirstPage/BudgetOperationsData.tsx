import React, { SetStateAction } from "react";
import BudgetStatementTable from "./BudgetStatementTable";
import BudgetStatementOperationTable from "./BudgetStatementOperationTable";
import BudgetStatementOperationTotals from "./BudgetStatementOperationTotals";
import { Button } from "../../../../components/atoms";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { t } from "i18next";
import { Loading } from "../../../../components/organisms/Loading";
import { notify } from "../../../../utils/toast";

interface BudgetOperationsData_TP {
  setStage: React.Dispatch<SetStateAction<number>>;
  setOperationCardData: React.Dispatch<SetStateAction<any>>;
  mainCardData: never[];
  isLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
}

const BudgetOperationsData: React.FC<BudgetOperationsData_TP> = ({
  setStage,
  mainCardData,
  setOperationCardData,
  isLoading,
  isFetching,
  isRefetching,
}) => {
  if (isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("loading budget balance")} />;

  return (
    <>
      <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5 space-y-6">
        {/* TOTALS */}
        <BudgetStatementOperationTotals mainCardData={mainCardData} />

        {/* SECOND TABLE FIR OPERATION */}
        <BudgetStatementOperationTable mainCardData={mainCardData} />

        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold">{t("budget statement")}</h2>
          <h2 className="text-base font-bold">
            <span>{t("bond number")}</span> / {/* TODO: */}
            <span className="text-mainGreen">002</span>
          </h2>
        </div>
        <BudgetStatementTable
          mainCardData={mainCardData}
          setOperationCardData={setOperationCardData}
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          action={() => {
            if (mainCardData?.cards?.length === 0) {
              notify("error", `${t("there is no data to transfer")}`);
            }

            setStage(2);
          }}
          className="flex items-center gap-2 bg-mainGreen/5 text-mainGreen border border-mainGreen"
        >
          <span>{t("transfer")}</span>
          <span>
            <HiArrowPathRoundedSquare className="text-mainGreen text-lg" />
          </span>
        </Button>
      </div>
    </>
  );
};

export default BudgetOperationsData;
