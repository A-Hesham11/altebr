import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../../../../hooks";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { t } from "i18next";
import { BsEye } from "react-icons/bs";
import { Loading } from "../../../../../components/organisms/Loading";
import { Form, Formik } from "formik";
import { formatDate, getDayAfter } from "../../../../../utils/date";
import {
  BaseInputField,
  DateInputField,
  Modal,
} from "../../../../../components/molecules";
import { Button } from "../../../../../components/atoms";
import { Table } from "../../../../../components/templates/reusableComponants/tantable/Table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { numberContext } from "../../../../../context/settings/number-formatter";
import PurchaseBondsSupplierPreview from "./PurchaseBondsSupplierPreview";
import { BiSpreadsheet } from "react-icons/bi";
import PurchaseBondsSupplierInvoice from "./PurchaseBondsSupplierInvoice";

const PurchaseBondsSupplier = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");
  const { formatReyal, formatGram } = numberContext();
  const [openModal, setOpenModal] = useState(false);

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
  };

  // FETCHING BONDS DATA FROM API
  const {
    data: buyingBondsSupplier,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["buying-bonds-supplier"],
    endpoint:
      search === `/reserveGold/api/v1/list_reserve_buying_Invoice?` ||
      search === ""
        ? `/reserveGold/api/v1/list_reserve_buying_Invoice?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log(
    "🚀 ~ buyingBondsSupplier ~ buyingBondsSupplier:",
    buyingBondsSupplier
  );

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "supplier_name",
        header: () => <span>{t("supplier name")}</span>,
      },
      {
        cell: (info: any) => formatGram(info.getValue()),
        accessorKey: "weight",
        header: () => <span>{t("weight converted to 24")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) == 0
            ? "-"
            : formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "total",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) == 0
            ? "-"
            : formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "tax",
        header: () => <span>{t("VAT")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.renderValue()).toFixed(2)) == 0
            ? "-"
            : formatReyal(Number(info.renderValue()).toFixed(2)),
        accessorKey: "total_after_tax",
        header: () => <span>{t("total value after tax")}</span>,
      },
      {
        cell: (info: any) => (
          <div className="flex items-center justify-center gap-3">
            <BsEye
              onClick={() => {
                setOpenModal(true);
                setSelectedItem(info.row.original);
              }}
              size={23}
              className="text-mainGreen cursor-pointer"
            />
            <BiSpreadsheet
              onClick={() => {
                setOpenInvoiceModal(true);
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
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (buyingBondsSupplier) {
      setDataSource(buyingBondsSupplier.data);
    }
  }, [buyingBondsSupplier]);

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
    let url = `/reserveGold/api/v1/list_reserve_buying_Invoice?`;
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
    <div className="py-14">
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
                  {buyingBondsSupplier?.current_page}
                </span>
                {t("from")}
                {
                  <span className=" text-mainGreen">
                    {buyingBondsSupplier?.pages}
                  </span>
                }
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
                  disabled={page == buyingBondsSupplier?.pages}
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
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <PurchaseBondsSupplierInvoice item={selectedItem} />
      </Modal>

      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <PurchaseBondsSupplierPreview item={selectedItem} />
      </Modal>
    </div>
  );
};

export default PurchaseBondsSupplier;
