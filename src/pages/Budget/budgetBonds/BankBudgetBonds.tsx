import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { t } from "i18next";
import { Loading } from "../../../components/organisms/Loading";
import { Form, Formik } from "formik";
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
import { BsEye } from "react-icons/bs";
import { BiSpreadsheet } from "react-icons/bi";
import InvoiceBudgetBonds from "./InvoiceBudgetBonds";
import EntryBudgetBonds from "./EntryBudgetBonds";
import TableEntry from "../../../components/templates/reusableComponants/tantable/TableEntry";
import { HonestBondAccountingRestriction } from "../../../components/selling/honest/HonestBondAccountingRestriction";
import BudgetTableEntry from "./BudgetTableEntry";
import { FilesPreview } from "../../../components/molecules/files/FilesPreview";
import { FilesPreviewOutFormik } from "../../../components/molecules/files/FilesPreviewOutFormik";
import { numberContext } from "../../../context/settings/number-formatter";
import { PDFSvgIcon, ViewSvgIcon } from "../../../components/atoms/icons";

const BankBudgetBonds = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const { formatReyal } = numberContext();
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [entryModal, setOpenEntryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  console.log("🚀 ~ BankBudgetBonds ~ selectedItem:", selectedItem);
  const [search, setSearch] = useState("");

  const searchValues = {
    account_number: "",
    bond_number: "",
    bond_date: "",
  };

  // FETCHING INVOICES DATA FROM API
  const {
    data: invoiceData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["budget-bonds-invoice"],
    endpoint:
      search === `/budget/api/v1/budgetBond/${userData?.branch_id}?` ||
      search === ""
        ? `/budget/api/v1/budgetBond/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log("🚀 ~ BankBudgetBonds ~ invoiceData:", invoiceData);

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bond_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bond_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "account_name",
        header: () => <span>{t("account name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "account_number",
        header: () => <span>{t("account number")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())),
        accessorKey: "totals",
        header: () => <span>{t("budget balance")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "card_count",
        header: () => <span>{t("card count")}</span>,
      },
      {
        cell: (info: any) => (
          <div className="flex items-center gap-4 justify-center">
            <BsEye
              onClick={() => {
                setOpenInvoiceModal(true);
                setSelectedItem(info.row.original);
              }}
              size={23}
              className="text-mainGreen cursor-pointer"
            />
            <BiSpreadsheet
              onClick={() => {
                setOpenEntryModal(true);
                setSelectedItem(info.row.original);
              }}
              size={23}
              className="text-mainGreen cursor-pointer"
            />
          </div>
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <>
              <div className="flex items-center gap-4 justify-center">
                <FilesPreviewOutFormik
                  images={info.row.original.images || []}
                  preview
                  pdfs={[]}
                />
              </div>
            </>
          );
        },
        accessorKey: "attachment",
        header: () => <span>{t("attachment")}</span>,
      },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (invoiceData) {
      setDataSource(invoiceData.data);
    }
  }, [invoiceData]);

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
    let url = `/budget/api/v1/budgetBond/${userData?.branch_id}?`;
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
    return <Loading mainTitle={`${t("loading bonds")}`} />;

  return (
    <div className="p-16">
      <h2 className="mb-8 text-base font-bold">{t("budget bonds")}</h2>
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* 1) FORM */}
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
              bond_date: values.bond_date
                ? formatDate(getDayAfter(new Date(values.bond_date)))
                : "",
            });
          }}
        >
          <Form className="w-full flex">
            <div className="flex w-full justify-between items-end gap-3">
              <div className="flex items-end gap-3">
                <div className="">
                  <BaseInputField
                    id="account_number"
                    name="account_number"
                    label={`${t("account number")}`}
                    placeholder={`${t("account number")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <BaseInputField
                    id="bond_number"
                    name="bond_number"
                    label={`${t("bond number")}`}
                    placeholder={`${t("bond number")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <DateInputField
                    label={`${t("bond date")}`}
                    placeholder={`${t("bond date")}`}
                    name="bond_date"
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
                  {invoiceData?.current_page}
                </span>
                {t("from")}
                {<span className=" text-mainGreen">{invoiceData?.pages}</span>}
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
                  disabled={page == invoiceData?.pages}
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
        <InvoiceBudgetBonds selectedItem={selectedItem} />
      </Modal>
      <Modal isOpen={entryModal} onClose={() => setOpenEntryModal(false)}>
        {/* <EntryBudgetBonds selectedItem={selectedItem} /> */}
        {/* <TableEntry item={selectedItem} /> */}
        <BudgetTableEntry item={selectedItem} />
        {/* <HonestBondAccountingRestriction /> */}
      </Modal>
    </div>
  );
};

export default BankBudgetBonds;
