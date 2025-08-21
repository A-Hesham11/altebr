import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import LostItemsReports from "./LostItemsReports";
import { useFetch } from "../../../../hooks";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { Loading } from "../../../../components/organisms/Loading";
import InventoryGroupsReport from "./InventoryGroupsReport";
import BreakageCashLossReport from "./BreakageCashLossReport";
import BranchInventoryReport from "./BranchInventoryReport";
import { t } from "i18next";
import PromissoryNote from "./PromissoryNote";

const InventoryReportes = () => {
  const [dataSource, setDataSource] = useState();
  const { userData } = useContext(authCtx);
  const { state } = useLocation();

  const isActiveReport = ["d", "e", "f", "g"].includes(state?.reportID)
    ? "c"
    : state?.reportID === "h"
    ? "d"
    : state?.reportID;

  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch<
    any[]
  >({
    endpoint: `/inventory/api/v1/handleReport?key=${isActiveReport}&inventory_id=${state?.inventoryID}&branch_id=${userData?.branch_id}?per_page=10000`,
    queryKey: ["InventoryBonds"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data?.data);
    },
    enabled: Boolean(state?.reportID) && Boolean(state?.inventoryID),
  });

  if (isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("reportes")} />;
  return (
    <div>
      {state?.reportID === "a" && (
        <LostItemsReports
          dataSource={dataSource}
          reportNumber={state.reportNumber}
          date={state?.date}
        />
      )}

      {state?.reportID === "b" && (
        <InventoryGroupsReport
          dataSource={dataSource}
          reportNumber={state.reportNumber}
          date={state?.date}
        />
      )}

      {state?.reportID === "c" && (
        <BreakageCashLossReport
          dataSource={dataSource}
          reportNumber={state.reportNumber}
          date={state?.date}
        />
      )}

      {["d", "e", "f", "g"].includes(state?.reportID) && (
        <BranchInventoryReport
          dataSource={dataSource}
          reportNumber={state?.reportNumber}
          date={state?.date}
          reportName={state?.reportName}
        />
      )}

      {state?.reportID === "h" && (
        <PromissoryNote
          dataSource={dataSource}
          reportNumber={state?.reportNumber}
          date={state?.date}
        />
      )}
    </div>
  );
};

export default InventoryReportes;
