import { useContext, useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { t } from "i18next";
import { BsEye } from "react-icons/bs";
import { Loading } from "../../../components/organisms/Loading";
import { Formik, Form } from "formik";
import { formatDate, getDayAfter } from "../../../utils/date";
import {
  BaseInputField,
  DateInputField,
  Modal,
  Select,
} from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Back } from "../../../utils/utils-components/Back";
import ExpensesBondsPreview from "./ExpensesBondsPreview";
import ExpensesBondsEntry from "./ExpensesBondsEntry";
import { BiSpreadsheet } from "react-icons/bi";

const ExpensesBonds = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [openEntryModal, setOpenEntryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");
  console.log("🚀 ~ ExpensesBonds ~ search:", search);

  const searchValues = {
    expence_bond_number: "",
    expence_amount: "",
    child_id: "",
    expence_from_date: "",
    expence_to_date: "",
  };

  // FETCHING INVOICES DATA FROM API
  const {
    data: expenseData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["expense-bonds"],
    endpoint:
      search === `/expenses/api/v1/expense-invoices/${userData?.branch_id}?` ||
      search === ""
        ? `/expenses/api/v1/expense-invoices/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log(
    "🚀 ~ file: PurchaseBonds.tsx:52 ~ PurchaseBonds ~ expenseData:",
    expenseData
  );

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expence_bond_number",
        header: () => <span>{t("expenses bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expence_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "parent",
        header: () => <span>{t("main expense")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "child",
        header: () => <span>{t("sub expense")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expence_amount",
        header: () => <span>{t("amount")}</span>,
      },

      {
        cell: (info: any) => info.getValue(),
        accessorKey: "description",
        header: () => <span>{t("description")}</span>,
      },
      {
        cell: (info: any) => (
          <BiSpreadsheet
            onClick={() => {
              setOpenEntryModal(true);
              setSelectedItem(info.row.original);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "restriction",
        header: () => <span>{t("restriction")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setOpenInvoiceModal(true);
              setSelectedItem(info.row.original);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("expense type")}</span>,
        accessorKey: "expense_type_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("We paid to")}</span>,
        accessorKey: "directed_to",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("description")} </span>,
        accessorKey: "add_description",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("expense price")}</span>,
        accessorKey: "expense_price",
        cell: (info) =>
          formatReyal(
            Number(info.getValue()) - info.row.original.expense_price_after_tax
          ),
      },
      {
        header: () => <span>{t("expense tax")} </span>,
        accessorKey: "expense_price_after_tax",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) => {
          return (
            formatReyal(
              +info.row.original.expense_price +
                +info.row.original.expense_price_tax
            ) || "---"
          );
        },
      },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (expenseData) {
      setDataSource(expenseData.data);
    }
  }, [expenseData]);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `/expenses/api/v1/expense-invoices/${userData?.branch_id}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      console.log("🚀 ~ file: ExpensesBonds.tsx:144 ~ Object.keys ~ key:", key);
      console.log(
        "🚀 ~ file: ExpensesBonds.tsx:137 ~ Object.keys ~ key:",
        req[key]
      );
      if (req[key] !== "") {
        if (first) {
          // url += `?${key}[eq]=${req[key]}`;
          if (key === "expence_from_date")
            url += `?expence_from_date[gte]=${formatDate(req[key])}`;
          else if (key === "expence_to_date")
            url += `?expence_to_date[lte]=${formatDate(req[key])}`;
          else url += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          // url += `&${key}[eq]=${req[key]}`;
          if (key === "expence_from_date")
            url += `&expence_from_date[gte]=${formatDate(req[key])}`;
          else if (key === "expence_to_date")
            url += `&expence_to_date[lte]=${formatDate(req[key])}`;
          else url += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  const { data: expensesBoxes } = useFetch({
    endpoint: `/expenses/api/v1/expense-count/${userData?.branch_id}`,
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

  const { data: subExpenses } = useFetch({
    endpoint: `/expenses/api/v1/sub-expence/${userData?.branch_id}`,
    queryKey: ["subExpenses_option"],
    select: (subExpenses) =>
      subExpenses.map((subExpenses: any) => ({
        id: subExpenses?.id,
        label: subExpenses?.name_ar,
        name: subExpenses?.name_ar,
        value: subExpenses?.id,
      })),
  });
  console.log(
    "🚀 ~ file: ExpensesBonds.tsx:157 ~ ExpensesBonds ~ subExpenses:",
    subExpenses
  );

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-16">
      <div className="flex justify-between items-center">
        <h2 className="mb-8 text-base font-bold">{t("expenses bonds")}</h2>
        <Back className="hover:bg-slate-50 transition-all duration-300" />
      </div>

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

      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* 1) FORM */}
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
              invoice_date: values.invoice_date
                ? formatDate(getDayAfter(new Date(values.invoice_date)))
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

      {/* 2) TABLE */}
      <div className="">
        <Table data={dataSource || []} columns={tableColumn}>
          {dataSource?.length === 0 ? (
            <p className="text-center text-xl text-mainGreen font-bold">
              {t("there is no pieces available")}
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">
                  {expenseData?.current_page}
                </span>
                {t("from")}
                {<span className=" text-mainGreen">{expenseData?.pages}</span>}
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]"
                  action={() => setPage((prev) => prev - 1)}
                  disabled={page == 1}
                >
                  {isRTL ? (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  )}
                </Button>

                <Button
                  className="rounded bg-mainGreen p-[.18rem]"
                  action={() => setPage((prev) => prev + 1)}
                  disabled={page == expenseData?.pages}
                >
                  {isRTL ? (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </Table>
      </div>

      {/* 3) MODAL */}
      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <ExpensesBondsPreview item={selectedItem} />
      </Modal>

      <Modal isOpen={openEntryModal} onClose={() => setOpenEntryModal(false)}>
        <ExpensesBondsEntry item={selectedItem} />
      </Modal>
    </div>
  );
};

export default ExpensesBonds;
