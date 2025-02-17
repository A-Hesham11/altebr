import { Form, Formik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../hooks";
import { formatDate, getDayAfter } from "../../utils/date";
import { DateInputField } from "../../components/molecules";
import { t } from "i18next";
import { Button } from "../../components/atoms";
import SalesReportsTable from "../../components/selling/selling components/SalesReportsTable";
import InvoiceFooter from "../../components/Invoice/InvoiceFooter";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import { useReactToPrint } from "react-to-print";
import { Loading } from "../../components/organisms/Loading";

const SalesReturnReports = () => {
  const invoiceRefs = useRef([]);
  const [search, setSearch] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const { invoice_logo } = GlobalDataContext();
  const isRTL = useIsRTL();

  const initialValues = {
    branch_id: "",
    from: "",
    to: "",
  };

  const { isLoading, isFetching, isRefetching, refetch } = useFetch({
    queryKey: ["sales-return-reports"],
    endpoint:
      search === `/report/api/v1/return/${userData?.branch_id}?` ||
      search === ""
        ? `/report/api/v1/return/${userData?.branch_id}`
        : `${search}`,
    onSuccess: (data) => {
      setDataSource(data);
    },
  });

  const getSearchResults = async (req: any) => {
    let url = `/report/api/v1/return/${userData?.branch_id}?`;
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
    refetch();
  }, [search]);

  const handlePrint = useReactToPrint({
    content: () => invoiceRefs.current,
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
            zoom: 0.8;
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
      .container_print {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
    `,
  });

  if (isFetching && !search)
    return <Loading mainTitle={`${t("loading Sales Returns Report")}`} />;

  return (
    <div className="py-6 px-16">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Formik
          initialValues={initialValues}
          onSubmit={(values: any) => {
            getSearchResults({
              from: values.from
                ? formatDate(getDayAfter(new Date(values.from)))
                : "",
              to: values.to ? formatDate(getDayAfter(new Date(values.to))) : "",
            });
          }}
        >
          {({ values }) => {
            return (
              <Form className="w-full">
                <div className="flex w-full justify-between items-end gap-3">
                  <div className="flex items-end gap-3 w-full">
                    <div className="">
                      <DateInputField
                        label={`${t("date from")}`}
                        placeholder={`${t("date from")}`}
                        name="from"
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
                  </div>

                  <Button
                    className="px-7 py-[6px] border-2"
                    action={handlePrint}
                  >
                    {t("print")}
                  </Button>
                </div>

                {dataSource?.length ? (
                  <div
                    className={`mt-12 container_print ${isRTL ? "rtl" : "ltr"}`}
                    ref={invoiceRefs}
                  >
                    <div className="bg-[#E5ECEB]  rounded-xl  p-6 bill-shadow mb-5 print-only">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-1 mt-6">
                          <p className="font-semibold">
                            {t("branch number")} :{" "}
                            <span className="font-medium">
                              {userData?.branch_id}
                            </span>{" "}
                          </p>
                          <p className="font-semibold">
                            {t("bill date")} :{" "}
                            <span className="font-medium">
                              {formatDate(new Date())}
                            </span>{" "}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                          <img
                            src={invoice_logo?.InvoiceCompanyLogo}
                            alt="bill"
                            className="h-28 w-3/4 object-contain"
                          />
                          <p className="text-xl font-semibold">
                            {t("Sales Reports")}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 mt-6">
                          <p className="font-semibold">
                            {t("from")} :{" "}
                            <span className="font-medium">
                              {!!values?.from && formatDate(values?.from)}
                            </span>{" "}
                          </p>
                          <p className="font-semibold">
                            {t("to")} :{" "}
                            <span className="font-medium">
                              {!!values?.to && formatDate(values?.to)}
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <SalesReportsTable
                        dataSource={dataSource}
                        isLoading={isLoading}
                        isRefetching={isRefetching}
                        isFetching={isFetching}
                      />
                    </div>

                    <div className="print-only">
                      <InvoiceFooter />
                    </div>
                  </div>
                ) : (
                  <p className="text-mainGreen py-4 text-center text-2xl font-bold mt-8">
                    {t("there is no data for your search")}
                  </p>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SalesReturnReports;

{
  /* <p className="text-mainGreen py-4 text-center text-2xl font-bold">
{t("there is no data for your search")}
</p> */
}
