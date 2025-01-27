import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { formatDate, getDayAfter } from "../../../utils/date";
import { SET_SEARCH } from "../../../Reducers/Constants";
import {
  BaseInputField,
  DateInputField,
  Select,
} from "../../../components/molecules";
import { t } from "i18next";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Button } from "../../../components/atoms";

type TSearchValues = {
  expense_bond_number: string;
  expense_amount: string;
  child_id: string;
  expense_from_date: string;
  expense_to_date: string;
};

const EdaraExpensesFilter = ({
  dispatch,
  isRefetching,
}: {
  dispatch: any;
  isRefetching: boolean;
}) => {
  const { userData } = useContext(authCtx);

  const searchValues: TSearchValues = {
    expense_bond_number: "",
    expense_amount: "",
    child_id: "",
    expense_from_date: "",
    expense_to_date: "",
  };

  const buildUrl = (req: any) => {
    const formatQueryParam = (key: string, value: any): string => {
      if (key === "expense_from_date") {
        return `expense_from_date[gte]=${value}`;
      } else if (key === "expense_to_date") {
        return `expense_to_date[lte]=${value}`;
      }
      return `${key}[eq]=${value}`;
    };

    return Object.keys(req)
      .filter((key) => req[key] !== "")
      .reduce((acc, key, index) => {
        const queryParam = formatQueryParam(key, req[key]);
        return index === 0 ? `?${queryParam}` : `${acc}&${queryParam}`;
      }, "");
  };

  const getSearchResults = async (req: any) => {
    const url = `/edaraaExpense/api/v1/edaraaExpense-invoices${buildUrl(req)}`;
    dispatch({ type: SET_SEARCH, payload: url });
  };

  const { data: subExpenses } = useFetch({
    endpoint: `/expenses/api/v1/sub-expence/${userData?.branch_id}`,
    queryKey: ["subExpenses_option"],
    select: (subExpenses: any) =>
      subExpenses.map((subExpenses: any) => ({
        id: subExpenses?.id,
        label: subExpenses?.name_ar,
        name: subExpenses?.name_ar,
        value: subExpenses?.id,
      })),
  });

  return (
    <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
      {/* 1) FORM */}
      <Formik
        initialValues={searchValues}
        onSubmit={(values: TSearchValues) => {
          console.log("🚀 ~ values:", values);
          getSearchResults({
            ...values,
            expense_to_date: values.expense_to_date
              ? formatDate(getDayAfter(new Date(values.expense_to_date)))
              : "",
            expense_from_date: values.expense_from_date
              ? formatDate(getDayAfter(new Date(values.expense_from_date)))
              : "",
          });
        }}
      >
        <Form className="w-full flex">
          <div className="flex w-full justify-between items-end gap-3">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end gap-3">
              <div className="">
                <BaseInputField
                  id="expense_bond_number"
                  name="expense_bond_number"
                  label={`${t("expenses bond number")}`}
                  placeholder={`${t("expenses bond number")}`}
                  className="shadow-xs"
                  type="text"
                />
              </div>
              <div className="">
                <BaseInputField
                  id="expense_amount"
                  name="expense_amount"
                  label={`${t("expense amount")}`}
                  placeholder={`${t("expense amount")}`}
                  className="shadow-xs"
                  type="text"
                />
              </div>
              <div className="">
                <Select
                  id="child_id"
                  label={`${t("sub expense")}`}
                  name="child_id"
                  placeholder={`${t("sub expense")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={subExpenses}
                />
              </div>
              <div className="">
                <DateInputField
                  label={`${t("expense from date")}`}
                  placeholder={`${t("expense from date")}`}
                  name="expense_from_date"
                  labelProps={{ className: "mt-10" }}
                />
              </div>
              <div className="">
                <DateInputField
                  label={`${t("expense to date")}`}
                  placeholder={`${t("expense to date")}`}
                  name="expense_to_date"
                  labelProps={{ className: "mt-10" }}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isRefetching}
              className="flex h-[38px] w-24 mx-4 hover:bg-emerald-900 duration-300 transition-all"
            >
              {t("search")}
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EdaraExpensesFilter;
