import { useContext, useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../hooks";
import { numberContext } from "../../context/settings/number-formatter";
import { SelectOption_TP } from "../../types";
import ProcessBoxes from "../stocksInEdara/ProcessBoxes";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { formatDate, getDayAfter } from "../../utils/date";
import { DateInputField, Select } from "../../components/molecules";
import { Button } from "../../components/atoms";
import { ExportToExcel } from "../../components/ExportToFile";
import { TableComponent } from "../stocksInEdara/TableComponent";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Back } from "../../utils/utils-components/Back";

const BranchStocks = () => {
  const [search, setSearch] = useState("");
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { formatReyal } = numberContext();
  const [accountId, setAccountId] = useState<{ id: number; unit_id: number }>(
    null
  );
  const { userData } = useContext(authCtx);

  const filterInitialValues = {
    branch_id: "",
    account_id: "",
    form: "",
    to: "",
  };

  // FETCHING BONDS DATA FROM API
  const {
    data: edaraCredit,
    isInitialLoading,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["credits-branch-data"],
    endpoint:
      search ===
        `/branchAccount/api/v1/getAllAccountBranches/${accountId?.id || 0}/${
          userData?.branch_id
        }/${accountId?.unit_id || 0}?` || search === ""
        ? `/branchAccount/api/v1/getAllAccountBranches/${accountId?.id || 0}/${
            userData?.branch_id
          }/${accountId?.unit_id || 0}`
        : `${search}`,
    pagination: true,
  });

  const {
    data: accountsNameDataSelect,
    isLoading: accountNameDataSelectIsLoading,
    isFetching: accountNameDataSelectIsFetching,
    isRefetching: accountNameDataSelectIsRefetching,
    refetch: accountsNameRefetch,
  } = useFetch({
    queryKey: ["accounts-name-data-single-branch"],
    endpoint: `/branchAccount/api/v1/getAccountBranches/${userData?.branch_id}?per_page=10000`,
    select: (data: any) =>
      data?.map((account: any) => {
        return {
          id: account?.accountable_id,
          selectedId: account?.id,
          unit_id: account?.unit_id,
          label: (
            <p className="flex justify-between items-center">
              <span>{account?.accountable}</span>
              <span
                className={`text-[9px] text-white p-[5px] rounded-lg ${
                  account?.unit_id === 2 ? "bg-mainGreen" : "bg-mainOrange"
                } `}
              >
                {account?.unit}
              </span>
            </p>
          ),
          value: account?.id,
        };
      }),
  });

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `/branchAccount/api/v1/getAllAccountBranches/${
      accountId?.id || 0
    }/${userData?.branch_id}/${accountId?.unit_id || 0}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}=${req[key]}`;
          first = false;
        } else {
          url += `&${key}=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  useEffect(() => {
    if (edaraCredit) {
      const processedBoxes = ProcessBoxes(edaraCredit?.data?.boxes);
      setDataSource(processedBoxes);
    }
  }, [edaraCredit]);

  useEffect(() => {
    refetch();

    setSearch("");
  }, [accountId]);

  useEffect(() => {
    refetch();
  }, [search]);

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => {
          return info.row.index + 1;
        },
        accessorKey: "index",
        header: () => <span>{t("#")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "restriction_name",
        header: () => <span>{t("statement")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) >= 0
            ? formatReyal(Number(info.getValue()).toFixed(2))
            : "---",
        accessorKey: "first_period_debit",
        header: () => <span>{t("the first period debtor")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) >= 0
            ? `(${formatReyal(Number(info.getValue()).toFixed(2))})`
            : "---",
        accessorKey: "first_period_credit",
        header: () => <span>{t("the first period creditor")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) === 0
            ? "---"
            : formatReyal(Number(info.getValue()).toFixed(2)),
        accessorKey: "movement_debit",
        header: () => <span>{t("debtor movement")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) === 0
            ? "---"
            : `(${formatReyal(Number(info.getValue()).toFixed(2))})`,
        accessorKey: "movement_credit",
        header: () => <span>{t("creditor movement")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) > 0
            ? formatReyal(Number(info.getValue()).toFixed(2))
            : "---",
        accessorKey: "balance_debtor",
        header: () => <span>{t("debtor balance")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) > 0
            ? `(${formatReyal(Number(info.getValue()).toFixed(2))})`
            : "---",
        accessorKey: "balance_credit",
        header: () => <span>{t("creditor balance")}</span>,
      },
    ],
    []
  );

  const dataSourceToExport = dataSource?.map((data: any) => {
    return {
      date: data?.date,
      statement: data?.restriction_name,
      bond_number: data?.bond_id,
      first_period_debit:
        data?.first_period_debit >= 0 ? data?.first_period_debit : "",
      first_period_credit:
        data?.first_period_credit >= 0 ? data?.first_period_credit : "",
      movement_debit: data?.movement_debit > 0 ? data?.movement_debit : "",
      movement_credit: data?.movement_credit > 0 ? data?.movement_credit : "",
      balance_debtor: data?.balance_debtor > 0 ? data?.balance_debtor : "",
      balance_credit: data?.balance_credit > 0 ? data?.balance_credit : "",
      unit: data?.unit_id,
    };
  });

  return (
    <div className="py-6 px-16">
      <div className="flex justify-end my-4">
        <Back />
      </div>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* 1) FORM */}
        <Formik
          initialValues={filterInitialValues}
          onSubmit={(values: any) => {
            getSearchResults({
              ...values,
              form: values.form
                ? formatDate(getDayAfter(new Date(values.form)))
                : "",
              to: values.to ? formatDate(getDayAfter(new Date(values.to))) : "",
            });
          }}
        >
          {({ values, setFieldValue, resetForm }) => {
            return (
              <Form className="w-full">
                <div className="flex w-full justify-between items-end gap-3">
                  <div className="flex items-end gap-3 w-full">
                    <div className="w-80">
                      <Select
                        id="account name"
                        label={`${t("account name")}`}
                        name="account_id"
                        placeholder={`${t("account name")}`}
                        loadingPlaceholder={`${t("loading")}`}
                        options={accountsNameDataSelect}
                        value={values?.value}
                        onChange={(option: any) => {
                          setFieldValue("account_id", option!.id);
                          setAccountId(option);
                          resetForm();
                        }}
                        loading={accountNameDataSelectIsLoading}
                        isDisabled={
                          accountNameDataSelectIsLoading ||
                          accountNameDataSelectIsFetching ||
                          accountNameDataSelectIsRefetching
                        }
                      />
                    </div>
                    <div className="">
                      <DateInputField
                        label={`${t("date from")}`}
                        placeholder={`${t("date from")}`}
                        name="form"
                        labelProps={{ className: "mt-10" }}
                      />
                    </div>
                    <div className="">
                      <DateInputField
                        label={`${t("date to")}`}
                        placeholder={`${t("date to")}`}
                        name="to"
                        labelProps={{ className: "mt-10" }}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="flex h-[38px] mx-4 hover:bg-emerald-900 duration-300 transition-all"
                    >
                      {t("search")}
                    </Button>

                    <Button
                      action={(e) => {
                        // COMPONENT FOR EXPORT DATA TO EXCEL FILE ACCEPT DATA AND THE NAME OF THE FILE
                        ExportToExcel(
                          dataSourceToExport,
                          `${t("statement of account")} (${
                            edaraCredit?.data?.accountable
                          }) - ${formatDate(new Date())}`
                        );
                      }}
                      className="bg-mainGreen text-white mr-auto hover:bg-emerald-900 duration-300 transition-all"
                    >
                      {t("export")}
                    </Button>
                  </div>
                </div>

                <div className="mt-14">
                  {edaraCredit?.data?.boxes?.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h2 className="text-center text-mainGreen flex justify-between">
                          <p className="text-2xl font-bold flex items-center gap-2">
                            <span>
                              {edaraCredit?.data?.accountable &&
                                edaraCredit?.data?.accountable}
                            </span>
                            <span>
                              (
                              {edaraCredit?.data?.unit &&
                                edaraCredit?.data?.unit}
                              )
                            </span>
                          </p>
                          <p className="text-base font-bold flex items-center gap-2">
                            {dataSource?.length === 1 ? (
                              <>
                                <span>{t("date")}</span>
                                <span>{dataSource[0]?.date}</span>
                              </>
                            ) : dataSource?.length > 1 ? (
                              <>
                                <span>{t("from")}</span>
                                <span className="-my-1">
                                  {dataSource[0]?.date}
                                </span>
                                <span> {t("to")} </span>
                                <span className="-my-1">
                                  {dataSource[dataSource?.length - 1]?.date}
                                </span>
                              </>
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="text-sm flex items-center gap-2 font-bold bg-mainGreen text-white py-2 px-4 rounded-md">
                            <span>{t("account number")}</span>
                            <span className="-my-1">
                              {edaraCredit?.data?.numeric_system &&
                                edaraCredit?.data?.numeric_system}
                            </span>
                          </p>
                        </h2>
                      </div>
                      <TableComponent
                        isLoading={isLoading}
                        isRefetching={isRefetching}
                        isFetching={isFetching}
                        data={dataSource || []}
                        columns={tableColumn}
                      />
                    </>
                  ) : (
                    <p className="text-mainGreen py-4 text-center text-2xl font-bold">
                      {t("there is no data for your search")}
                    </p>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default BranchStocks;
