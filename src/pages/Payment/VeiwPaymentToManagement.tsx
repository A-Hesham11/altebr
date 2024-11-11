import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import { Form, Formik } from "formik";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { useFetch, useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Loading } from "../../components/organisms/Loading";
import { formatDate, getDayAfter } from "../../utils/date";
import {
  BaseInputField,
  DateInputField,
  Modal,
} from "../../components/molecules";
import { Button } from "../../components/atoms";
import { Back } from "../../utils/utils-components/Back";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import PaymentToManagementTable from "./PaymentToManagementTable";
import { BiSpreadsheet } from "react-icons/bi";
import { numberContext } from "../../context/settings/number-formatter";
import { useReactToPrint } from "react-to-print";
import PaymentFinalPreviewBillData from "./PaymentFinalPreviewBillData";
import PaymentInvoiceTable from "./PaymentInvoiceTable";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";

const VeiwPaymentToManagement = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [invoiceViewModal, setOpenInvoiceViewModal] = useState(false);
  const [selectedViewItem, setSelectedViewItem] = useState<any>({});

  const [search, setSearch] = useState("");

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
  };

  const {
    data: invoiceData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["payment-invoice"],
    endpoint:
      search === ""
        ? `/sdad/api/v1/sdadbonds/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "payment_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => (
          <div className="flex justify-center gap-2">
            <BsEye
              onClick={() => {
                setOpenInvoiceViewModal(true);
                setSelectedViewItem(info.row.original);
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
    if (invoiceData) {
      setDataSource(invoiceData.data);
    }
  }, [invoiceData]);

  useEffect(() => {
    refetch();
  }, [page, invoiceData]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `/sdad/api/v1/sdadbonds/${userData?.branch_id}?`;
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

  // ========================================================
  const { formatGram, formatReyal } = numberContext();
  const contentRef = useRef();

  const clientData = {
    client_id: selectedViewItem?.client_id,
    client_value: selectedViewItem?.client_name,
    bond_date: selectedViewItem?.payment_date,
    supplier_id: selectedViewItem?.supplier_id,
  };

  // COLUMNS FOR THE TABLE
  const cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "card_name",
        header: () => <span>{t("payment method")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
        accessorKey: "value_reyal",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "value_gram",
        header: () => <span>{t("Gold value (in grams)")}</span>,
      },
    ],
    []
  );

  const totalFinalCost = selectedViewItem?.items?.reduce((acc, curr) => {
    acc += +curr.value_reyal;
    return acc;
  }, 0);

  const totalGoldAmountGram = selectedViewItem?.items?.reduce((acc, curr) => {
    acc += Number(curr.value_gram);
    return acc;
  }, 0);

  const costDataAsProps = {
    totalFinalCost,
    totalGoldAmountGram,
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
      }
    `,
  });

  // ========================================================

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-16">
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
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              <span className=" text-mainGreen">{invoiceData.pages}</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className=" rounded bg-mainGreen p-[.18rem] "
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
                className=" rounded bg-mainGreen p-[.18rem] "
                action={() => setPage((prev) => prev + 1)}
                disabled={page == invoiceData.pages}
              >
                {isRTL ? (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                )}
              </Button>
            </div>
          </div>
        </Table>
      </div>

      {/* 3) MODAL */}
      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <PaymentToManagementTable item={selectedItem} />
      </Modal>
      <Modal
        isOpen={invoiceViewModal}
        onClose={() => setOpenInvoiceViewModal(false)}
      >
        <div className="relative h-full py-16 px-8">
          <div className="flex justify-end mb-8 w-full">
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              action={handlePrint}
            >
              {t("print")}
            </Button>
          </div>
          <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
            <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
              <div className="mx-5 bill-shadow rounded-md p-6">
                <PaymentFinalPreviewBillData
                  clientData={clientData}
                  invoiceNumber={selectedViewItem?.invoice_number}
                  invoiceData={selectedViewItem}
                />
              </div>

              <PaymentInvoiceTable
                data={selectedViewItem?.items}
                columns={cols || []}
                costDataAsProps={costDataAsProps}
              ></PaymentInvoiceTable>

              <div className="mx-5 bill-shadow rounded-md p-6 my-9">
                <div className="flex justify-between items-start pb-12 pe-8">
                  <div className="text-center flex flex-col gap-4">
                    <span className="font-medium text-xs">
                      {t("recipient's signature")}
                    </span>
                    <p>------------------------------</p>
                  </div>
                  <div className="text-center flex flex-col gap-4">
                    <span className="font-medium text-xs">
                      {t("bond organizer")}
                    </span>
                    <p>{userData?.name}</p>
                  </div>
                </div>
              </div>

              <div>
                <InvoiceFooter />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VeiwPaymentToManagement;
