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
} from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Back } from "../../../utils/utils-components/Back";
import ExpensesBondsPreview from "./ExpensesBondsPreview";

const ExpensesBonds = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
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
        accessorKey: "id",
        header: () => <span>{t("id")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expence_date",
        header: () => <span>{t("date")}</span>,
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
      if (req[key] !== "") {
        if (first) {
          url += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          url += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-16">
      <h2 className="mb-8 text-base font-bold">{t("expenses bonds")}</h2>
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
              <div className="flex items-end gap-3">
                <div className="">
                  <BaseInputField
                    id="invoice_number"
                    name="invoice_number"
                    label={`${t("invoice number")}`}
                    placeholder={`${t("invoice number")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <DateInputField
                    label={`${t("invoice date")}`}
                    placeholder={`${t("invoice date")}`}
                    name="invoice_date"
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
              <Back className="hover:bg-slate-50 transition-all duration-300" />
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
    </div>
  );
};

export default ExpensesBonds;
