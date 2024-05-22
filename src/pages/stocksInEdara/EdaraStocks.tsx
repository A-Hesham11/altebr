// import { useEffect, useMemo, useState } from "react";
// import { useFetch, useIsRTL } from "../../hooks";
// import { numberContext } from "../../context/settings/number-formatter";
// import { t } from "i18next";
// import { Loading } from "../../components/organisms/Loading";
// import { Back } from "../../utils/utils-components/Back";
// import { Table } from "../../components/templates/reusableComponants/tantable/Table";
// import { Button } from "../../components/atoms";
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../hooks";
import { formatDate, getDayAfter } from "../../utils/date";
import { t } from "i18next";
import { DateInputField, Select } from "../../components/molecules";
import { Button } from "../../components/atoms";
import { numberContext } from "../../context/settings/number-formatter";
import { Loading } from "../../components/organisms/Loading";
import { TableComponent } from "./TableComponent";
import ProcessBoxes from "./ProcessBoxes";

// const EdaraStocks = () => {
//   // STATE
//   const isRTL = useIsRTL();
//   const [dataSource, setDataSource] = useState([]);
//   const [page, setPage] = useState(1);
//   const { formatGram, formatReyal } = numberContext();

//   // FETCHING CREDITS DATA FROM API
//   const {
//     data: edaraCredit,
//     isLoading,
//     isFetching,
//     isRefetching,
//     refetch,
//   } = useFetch({
//     queryKey: ["credits-edara-data", page],
//     endpoint: `/branchAccount/api/v1/getAllAccountEdara?page=${page}`,
//     select: (data: object[]) => {
//       return {
//         ...data,
//         data: data?.data?.map((credit: any, i: number) => ({
//           ...credit,
//           index: i + 1,
//         })),
//       };
//     },
//     pagination: true,
//   });

//   // COLUMNS FOR THE TABLE
//   const tableColumn = useMemo<any>(
//     () => [
//       {
//         cell: (info: any) => info.getValue(),
//         accessorKey: "index",
//         header: () => <span>{t("#")}</span>,
//       },
//       {
//         cell: (info: any) => info.getValue(),
//         accessorKey: "numeric_system",
//         header: () => <span>{t("numeric system")}</span>,
//       },
//       {
//         cell: (info: any) => info.getValue(),
//         accessorKey: "accountable",
//         header: () => <span>{t("account name")}</span>,
//       },
//       {
//         cell: (info: any) => {
//           return info.row.original.unit_id === 1
//             ? formatReyal(Number(info.getValue()).toFixed(2))
//             : formatGram(Number(info.getValue()).toFixed(2));
//         },
//         accessorKey: "debtor",
//         header: () => <span>{t("debtor")}</span>,
//       },
//       {
//         cell: (info: any) => {
//           return info.row.original.unit_id === 1
//             ? formatReyal(Number(info.getValue()).toFixed(2))
//             : formatGram(Number(info.getValue()).toFixed(2));
//         },
//         accessorKey: "creditor",
//         header: () => <span>{t("creditor")}</span>,
//       },
//       {
//         cell: (info: any) => {
//           const balance =
//             Number(info?.row?.original?.debtor) -
//             Number(info?.row?.original?.creditor);

//           return balance > 0 ? formatReyal(balance.toFixed(2)) : "---";
//         },
//         accessorKey: "debtor_balance",
//         header: () => <span>{t("debtor balance")}</span>,
//       },
//       {
//         cell: (info: any) => {
//           const balance =
//             Number(info?.row?.original?.debtor) -
//             Number(info?.row?.original?.creditor);

//           return balance > 0
//             ? "---"
//             : formatReyal(Math.abs(balance.toFixed(2)));
//         },
//         accessorKey: "creditor_balance",
//         header: () => <span>{t("creditor balance")}</span>,
//       },
//       {
//         cell: (info: any) => info.getValue(),
//         accessorKey: "unit",
//         header: () => <span>{t("unit id")}</span>,
//       },
//     ],
//     []
//   );

//   // EFFECTS
//   useEffect(() => {
//     if (edaraCredit) {
//       setDataSource(edaraCredit?.data);
//     }
//   }, [edaraCredit]);

//   // LOADING ....
//   if (isLoading || isRefetching || isFetching)
//     return <Loading mainTitle={`${t("loading credits")}`} />;

//   return (
//     <div className="">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className=" text-base font-bold">{t("edara credits")}</h2>
//       </div>

//       <div className="">
//         <Table data={dataSource || []} columns={tableColumn}>
//           {dataSource?.length === 0 ? (
//             <p className="text-center text-xl text-mainGreen font-bold">
//               {t("there is no pieces available")}
//             </p>
//           ) : (
//             <div className="mt-3 flex items-center justify-center gap-5 p-2">
//               <div className="flex items-center gap-2 font-bold">
//                 {t("page")}
//                 <span className=" text-mainGreen">
//                   {edaraCredit?.current_page}
//                 </span>
//                 {t("from")}
//                 {<span className=" text-mainGreen">{edaraCredit?.pages}</span>}
//               </div>
//               <div className="flex items-center gap-2 ">
//                 <Button
//                   className=" rounded bg-mainGreen p-[.18rem]"
//                   action={() => setPage((prev) => prev - 1)}
//                   disabled={page == 1}
//                 >
//                   {isRTL ? (
//                     <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
//                   ) : (
//                     <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
//                   )}
//                 </Button>

//                 <Button
//                   className="rounded bg-mainGreen p-[.18rem]"
//                   action={() => setPage((prev) => prev + 1)}
//                   disabled={page == edaraCredit?.pages}
//                 >
//                   {isRTL ? (
//                     <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
//                   ) : (
//                     <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
//                   )}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default EdaraStocks;

const EdaraStocks = () => {
  const [search, setSearch] = useState("");
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ EdaraStocks ~ dataSource:", dataSource);
  const { formatGram, formatReyal } = numberContext();
  const [accountId, setAccountId] = useState(0);
  console.log("🚀 ~ EdaraStocks ~ accountId:", accountId);

  const filterInitialValues = {
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

  // COLUMNS FOR THE TABLE
  // const tableColumn = useMemo<any>(
  //   () => [
  //     {
  //       cell: (info: any) => {
  //         return info.row.index + 1;
  //       },
  //       accessorKey: "index",
  //       header: () => <span>{t("#")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "date",
  //       header: () => <span>{t("date")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "restriction_name",
  //       header: () => <span>{t("statement")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "bond_id",
  //       header: () => <span>{t("bond number")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const infoTarget = dataSource?.find((item) => {
  //           return Number(item.index) === Number(info.row.index) - 1;
  //         });

  //         if (info.row.index === 0) {
  //           return (
  //             formatReyal(
  //               Number(info.row.original?.The_first_period_debtor).toFixed(2)
  //             ) || "---"
  //           );
  //         } else if (info.row.index === 1) {
  //           const value =
  //             Number(infoTarget?.The_first_period_debtor) +
  //             infoTarget?.movement_debtor -
  //             infoTarget?.movement_creditor;

  //           return value > 0 ? formatReyal(Number(value).toFixed(2)) : "---";
  //         } else {
  //           return formatReyal(Number(firstDebt).toFixed(2)) || "---";
  //         }
  //       },
  //       accessorKey: "#",
  //       header: () => <span>{t("the first period debtor")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const infoTarget = dataSource?.find(
  //           (item) => Number(item.index) === Number(info.row.index) - 1
  //         );

  //         if (info.row.index === 0) {
  //           return (
  //             formatReyal(
  //               Number(info.row.original?.The_first_period_creditor).toFixed(2)
  //             ) || "---"
  //           );
  //         } else {
  //           const value =
  //             Number(infoTarget?.value) +
  //             infoTarget?.movement_debtor -
  //             infoTarget?.movement_creditor;

  //           return value < 0 ? formatReyal(Number(value).toFixed(2)) : "---";
  //         }
  //       },
  //       accessorKey: "#",
  //       header: () => <span>{t("the first period creditor")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         return info.row.original.computational_movement === "debtor"
  //           ? formatReyal(Number(info.getValue()).toFixed(2))
  //           : "---";
  //       },
  //       accessorKey: "value",
  //       header: () => <span>{t("debtor movement")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         return info.row.original.computational_movement === "creditor"
  //           ? formatReyal(Number(info.getValue()).toFixed(2))
  //           : "---";
  //       },
  //       accessorKey: "value",
  //       header: () => <span>{t("creditor movement")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const infoTarget = dataSource?.find(
  //           (item) => Number(item.index) === Number(info.row.index) - 1
  //         );

  //         if (info.row.index === 0) {
  //           return info.row.original.computational_movement === "debtor"
  //             ? formatReyal(Number(info.getValue()).toFixed(2))
  //             : "---";
  //         } else if (info.row.index === 1) {
  //           const value =
  //             Number(infoTarget?.The_first_period_debtor) +
  //             infoTarget?.movement_debtor -
  //             infoTarget?.movement_creditor;

  //           const balanceValue =
  //             value +
  //             info.row.original.movement_debtor -
  //             info.row.original.movement_creditor;

  //           setFirstDebt(balanceValue);
  //           return formatReyal(Number(balanceValue).toFixed(2)) || "---";
  //         } else {
  //           const value =
  //             firstDebt +
  //             info.row.original?.movement_debtor -
  //             info.row.original?.movement_creditor;

  //           return formatReyal(Number(value).toFixed(2)) || "---";
  //         }
  //       },
  //       accessorKey: "balance_debtor",
  //       header: () => <span>{t("debtor balance")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const infoTarget = dataSource?.find(
  //           (item) => Number(item.index) === Number(info.row.index) - 1
  //         );

  //         if (info.row.index === 0) {
  //           return info.row.original.computational_movement === "creditor"
  //             ? formatReyal(Number(info.getValue()).toFixed(2))
  //             : "---";
  //         } else if (info.row.index === 1) {
  //           const value =
  //             Number(infoTarget?.The_first_period_creditor) +
  //             infoTarget?.movement_creditor -
  //             infoTarget?.movement_debtor;

  //           const balanceValue =
  //             value +
  //             info.row.original.movement_creditor -
  //             info.row.original.movement_debtor;

  //           setFirstCredit(balanceValue);
  //           return formatReyal(Number(balanceValue).toFixed(2)) || "---";
  //         }
  //       },
  //       accessorKey: "balance_creditor",
  //       header: () => <span>{t("creditor balance")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "unit_id",
  //       header: () => <span>{t("unit id")}</span>,
  //     },
  //   ],
  //   [dataSource, firstDebt, firstCredit]
  // );

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

export default EdaraStocks;
