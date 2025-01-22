import { t } from "i18next";
import { useContext } from "react";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import "../../Support/searchResultLoading.css";
import Loader from "./Loader";

type TExpensesBoxes = {
  yearlyExpenseCount: number;
  mounthlyExpenseCount: number;
  dailyExpenseCount: number;
};

const EdaraExpensesTotals = () => {
  const {
    data: expensesBoxes,
    isLoading,
    isFetching,
    isRefetching,
  } = useFetch<TExpensesBoxes>({
    endpoint: `/edaraaExpense/api/v1/expense-count`,
    queryKey: ["expensesBoxes"],
  });

  const boxes = [
    {
      account: t("total expenses of day"),
      id: 1,
      value: expensesBoxes?.dailyExpenseCount,
    },
    {
      account: t("total expenses of month"),
      id: 2,
      value: expensesBoxes?.mounthlyExpenseCount,
    },
    {
      account: t("total expenses of year"),
      id: 3,
      value: expensesBoxes?.yearlyExpenseCount,
    },
  ];

  if (isLoading || isFetching || isRefetching)
    return (
      <div className="flex justify-center my-12">
        <Loader />
      </div>
    );

  return (
    <>
      {/* 1) EXPENSES BOXES */}
      <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boxes?.map((data: any) => (
          <li
            key={data.id}
            className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md"
          >
            <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
              {t(`${data.account}`)}
            </p>
            <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
              {data.value}
            </p>
          </li>
        ))}
      </div>
    </>
  );
};

export default EdaraExpensesTotals;
