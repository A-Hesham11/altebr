import { useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../hooks";
import { numberContext } from "../../context/settings/number-formatter";
import ProcessBoxes from "./ProcessBoxes";
import { t } from "i18next";
import { Loading } from "../../components/organisms/Loading";
import { Form, Formik } from "formik";
import { formatDate, getDayAfter } from "../../utils/date";
import { DateInputField, Select } from "../../components/molecules";
import { Button } from "../../components/atoms";
import { TableComponent } from "./TableComponent";

const BranchStocks = () => {
  const [search, setSearch] = useState("");
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ EdaraStocks ~ dataSource:", dataSource);
  const { formatGram, formatReyal } = numberContext();
  const [accountId, setAccountId] = useState(0);
  console.log("🚀 ~ EdaraStocks ~ accountId:", accountId);

  const filterInitialValues = {
    branch_id: "",
    account_id: "",
    form: "",
    to: "",
  };

  // FETCHING BONDS DATA FROM API
  const {
    data: edaraCredit,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["credits-edara-data"],
    endpoint:
      search === `/branchAccount/api/v1/getAllAccountEdara/${accountId}?` ||
      search === ""
        ? `/branchAccount/api/v1/getAllAccountEdara/${accountId}`
        : `${search}`,
    pagination: true,
  });
  console.log("🚀 ~ EdaraStocks ~ edaraCredit:", edaraCredit);

  const {
    data: accountsNameDataSelect,
    isLoading: accountNameDataSelectIsLoading,
    isFetching: accountNameDataSelectIsFetching,
    isRefetching: accountNameDataSelectIsRefetching,
  } = useFetch({
    queryKey: ["accounts-name-data"],
    endpoint: "/branchAccount/api/v1/getAccountEdara?per_page=10000",
    select: (data: any) =>
      data?.map((account: any) => {
        return {
          id: account?.id,
          label: (
            <p className="flex justify-between items-center">
              <span>{account?.accountable}</span>
              <span className="text-[9px] text-white p-[5px] rounded-lg bg-mainGreen">
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
    let url = `/branchAccount/api/v1/getAllAccountEdara/${accountId}?`;
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
    if (accountId) {
      refetch();
    }

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
          Number(info.getValue()) > 0
            ? formatReyal(Number(info.getValue()).toFixed(2))
            : "---",
        accessorKey: "first_period_debit",
        header: () => <span>{t("the first period debtor")}</span>,
      },
      {
        cell: (info: any) =>
          Number(info.getValue()) > 0
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

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading credits")}`} />;

  return (
    <div>
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
          {({ values, setFieldValue }) => {
            return (
              <Form className="w-full">
                <div className="flex w-full justify-between items-end gap-3">
                  <div className="flex items-end gap-3">
                    <div className="w-64">
                      <Select
                        id="account name"
                        label={`${t("account name")}`}
                        name="account_id"
                        placeholder={`${t("account name")}`}
                        loadingPlaceholder={`${t("loading")}`}
                        options={accountsNameDataSelect}
                        value={values?.account_id}
                        onChange={(option) => {
                          setFieldValue("account_id", option!.id);
                          setAccountId(option?.id);
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
                      disabled={isRefetching}
                      className="flex h-[38px] mx-4 hover:bg-emerald-900 duration-300 transition-all"
                    >
                      {t("search")}
                    </Button>
                  </div>
                </div>

                <div className="mt-14">
                  {edaraCredit?.data?.boxes?.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h2 className="text-center text-mainGreen flex justify-between">
                          <p className="text-2xl font-bold">
                            {edaraCredit?.data?.accountable &&
                              edaraCredit?.data?.accountable}
                          </p>
                          <p className="text-2xl font-bold flex items-center gap-2">
                            {dataSource?.length === 1 ? (
                              <>
                                <span>{t("date")}</span>
                                <span>{dataSource[0]?.date}</span>
                              </>
                            ) : dataSource?.length > 1 ? (
                              <>
                                <span>{dataSource[0]?.date}</span>
                                <span> - </span>
                                <span>
                                  {dataSource[dataSource?.length - 1]?.date}
                                </span>
                              </>
                            ) : (
                              ""
                            )}
                          </p>
                          <p className="text-sm flex items-center gap-2 font-bold bg-mainGreen text-white py-2 px-4 rounded-md">
                            <span>{t("numeric system")}</span>
                            <span className="-my-1">
                              {edaraCredit?.data?.numeric_system &&
                                edaraCredit?.data?.numeric_system}
                            </span>
                          </p>
                        </h2>
                      </div>
                      <TableComponent
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
