import { useEffect, useReducer } from "react";
import { useFetch } from "../../../hooks";
import { t } from "i18next";
import { Loading } from "../../../components/organisms/Loading";
import { EdaraExpensesInitialState } from "../../../Reducers/InitialState";
import { edaraExpensesReducer } from "../../../Reducers/reducers";
import { SET_DATA_SOURCE, SET_PAGE } from "../../../Reducers/Constants";
import EdaraExpensesTotals from "./EdaraExpensesTotals";
import EdaraExpensesFilter from "./EdaraExpensesFilter";
import EdaraExpensesTable from "./EdaraExpensesTable";
import EdaraExpensesModals from "./EdaraExpensesModals";

const ViewEdaraExpenses = () => {
  // STATE
  const [state, dispatch] = useReducer(
    edaraExpensesReducer,
    EdaraExpensesInitialState
  );

  const {
    entryModalOpen,
    dataSource,
    invoiceModalOpen,
    page,
    search,
    selectedRowDetails,
  } = state;

  const getEndpoint = () => {
    if (
      search === "/edaraaExpense/api/v1/edaraaExpense-invoices?" ||
      search === ""
    ) {
      return `/edaraaExpense/api/v1/edaraaExpense-invoices?page=${page}`;
    }
    return search;
  };

  // FETCHING INVOICES DATA FROM API
  const {
    data: expenseData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch<any>({
    queryKey: ["edara-expense-bonds"],
    endpoint: getEndpoint(),
    pagination: true,
  });

  useEffect(() => {
    if (expenseData) {
      dispatch({ type: SET_DATA_SOURCE, payload: expenseData.data });
    }
  }, [expenseData]);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      dispatch({ type: SET_PAGE, payload: 1 });
    }
  }, [search]);

  // // LOADING ....
  // if (isLoading || isRefetching || isFetching)
  //   return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="mb-4 text-base font-bold">{t("expenses bonds")}</h2>
      </div>

      {/* TOTALS */}
      <EdaraExpensesTotals />

      {/* FILTER */}
      <EdaraExpensesFilter dispatch={dispatch} isRefetching={isRefetching} />

      {/* TABLE */}
      <EdaraExpensesTable
        dataSource={dataSource}
        dispatch={dispatch}
        expenseData={expenseData}
        isLoading={isLoading}
        isFetching={isFetching}
        isRefetching={isRefetching}
        page={page}
      />

      {/* 3) MODAL */}
      <EdaraExpensesModals
        invoiceModalOpen={invoiceModalOpen}
        entryModalOpen={entryModalOpen}
        selectedRowDetails={selectedRowDetails}
        dispatch={dispatch}
      />
    </div>
  );
};

export default ViewEdaraExpenses;
