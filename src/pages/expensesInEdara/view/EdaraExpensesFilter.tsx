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
  expence_bond_number: string;
  expence_amount: string;
  child_id: string;
  expence_from_date: string;
  expence_to_date: string;
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
    expence_bond_number: "",
    expence_amount: "",
    child_id: "",
    expence_from_date: "",
    expence_to_date: "",
  };

  const buildUrl = (req: any) => {
    const formatQueryParam = (key: string, value: any): string => {
      if (key === "expence_from_date") {
        return `expence_from_date[gte]=${formatDate(value)}`;
      } else if (key === "expence_to_date") {
        return `expence_to_date[lte]=${formatDate(value)}`;
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
          getSearchResults({
            ...values,
            expence_to_date: values.expence_to_date
              ? formatDate(getDayAfter(new Date(values.expence_to_date)))
              : "",
            expence_from_date: values.expence_from_date
              ? formatDate(getDayAfter(new Date(values.expence_from_date)))
              : "",
          });
        }}
      >
        <Form className="w-full flex">
          <div className="flex w-full justify-between items-end gap-3">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end gap-3">
              <div className="">
                <BaseInputField
                  id="expence_bond_number"
                  name="expence_bond_number"
                  label={`${t("invoice number")}`}
                  placeholder={`${t("invoice number")}`}
                  className="shadow-xs"
                  type="text"
                />
              </div>
              <div className="">
                <BaseInputField
                  id="expence_amount"
                  name="expence_amount"
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
                  name="epxence_from_date"
                  labelProps={{ className: "mt-10" }}
                />
              </div>
              <div className="">
                <DateInputField
                  label={`${t("expense to date")}`}
                  placeholder={`${t("expense to date")}`}
                  name="expence_to_date"
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
