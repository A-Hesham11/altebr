import { Formik } from "formik";
import {
  BaseInputField,
  Checkbox,
  DateInputField,
  Select,
} from "../../components/molecules";
import { t } from "i18next";
import { Button } from "../../components/atoms";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Loading } from "../../components/organisms/Loading";
import { useReactToPrint } from "react-to-print";
import { ExportToExcel } from "../../components/ExportToFile";
import { formatDate } from "../../utils/date";

const taxPeriodOptions = [
  {
    id: 1,
    label: `الربع الاول`,
    value: "1",
  },
  {
    id: 2,
    label: "الربع الثاني",
    value: "2",
  },
  {
    id: 3,
    label: "الربع الثالث",
    value: "3",
  },
  {
    id: 4,
    label: "الربع الرابع",
    value: "4",
  },
];

const checkBoxesOptions = [
  { id: 1, name: "selling", value: "selling" },
  { id: 2, name: "return selling", value: "return_selling" },
  { id: 3, name: "selling zero", value: "selling_zero" },
  { id: 4, name: "return selling zero", value: "return_selling_zero" },
  { id: 5, name: "buying", value: "buying" },
  { id: 6, name: "return buying", value: "return_buying" },
  { id: 7, name: "buying zero", value: "buying_zero" },
  { id: 8, name: "return buying zero", value: "return_buying_zero" },
  { id: 0, name: "all", value: "all" },
];

const EdaraTaxReturn = () => {
  const { formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const contentRef = useRef(null);
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const [netTotal, setNetTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [netTax, setNetTax] = useState(0);

  const initialValue = {
    tax_period: "",
    months: "",
    year: new Date().getFullYear(),
    from: "",
    to: "",
    all: false,
    selling: false,
    return_selling: false,
    selling_zero: false,
    return_selling_zero: false,
    buying: false,
    return_buying: false,
    buying_zero: false,
    return_buying_zero: false,
  };

  const sellingCols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "نوع العملية",
        header: () => <span>{t("نوع العملية")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "عدد الفواتير",
        header: () => <span>{t("عدد الفواتير")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() || formatReyal(info.getValue()) || "---",
        accessorKey: "إجمالي المبلغ",
        header: () => <span>{t("إجمالي المبلغ")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "نسبة الضريبة",
        header: () => <span>{t("نسبة الضريبة")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() || formatReyal(info.getValue()) || "---",
        accessorKey: "الضريبة المحسوبة",
        header: () => <span>{t("الضريبة المحسوبة")}</span>,
      },
    ],
    []
  );

  const buyingCols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "نوع العملية",
        header: () => <span>{t("نوع العملية")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "عدد الفواتير",
        header: () => <span>{t("عدد الفواتير")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() || formatReyal(info.getValue()) || "---",
        accessorKey: "إجمالي المبلغ",
        header: () => <span>{t("إجمالي المبلغ")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "نسبة الضريبة",
        header: () => <span>{t("نسبة الضريبة")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() || formatReyal(info.getValue()) || "---",
        accessorKey: "الضريبة المحسوبة",
        header: () => <span>{t("الضريبة المحسوبة")}</span>,
      },
    ],
    []
  );

  const { data, isLoading, isRefetching, isFetching, refetch } = useFetch({
    endpoint:
      search === "" ? `/report/api/v1/vat/${userData?.branch_id}` : `${search}`,
    queryKey: ["get-edara-tax-return"],
    onSuccess: (data: any) => {
      const lastNetSellingTotal =
        data?.selling?.[data?.selling?.length - 1]?.["إجمالي المبلغ"] -
        data?.buying?.[data?.buying?.length - 1]?.["إجمالي المبلغ"];

      const lastNetSellingTax =
        data?.selling?.[data?.selling?.length - 1]?.["الضريبة المحسوبة"] -
        data?.buying?.[data?.buying?.length - 1]?.["الضريبة المحسوبة"];

      setNetTotal(lastNetSellingTotal || 0);
      setNetTax(lastNetSellingTax || 0);
      setDataSource(data.data);
    },
  });

  const { data: dataExcel, refetch: dataExcelRefetch } = useFetch({
    queryKey: ["excel-data-vat"],
    endpoint:
      search === "" ? `/report/api/v1/vat/${userData?.branch_id}` : `${search}`,
    select: (data: any) => {
      return [...data?.selling, ...data?.buying]?.map(
        ({ type, ...rest }) => rest
      );
    },
  });

  const getSearchResults = async (req: any) => {
    let uri = `/report/api/v1/vat/${userData?.branch_id}`;
    const params = new URLSearchParams();

    // Handle checkbox values first
    if (req.all) {
      params.append("all", "1");

      // If all is checked, ignore other checkbox values
      delete req.selling;
      delete req.return_selling;
      delete req.selling_zero;
      delete req.return_selling_zero;
      delete req.buying;
      delete req.return_buying;
      delete req.buying_zero;
      delete req.return_buying_zero;
    } else {
      // Only include other checkboxes if they're true
      const checkboxKeys = [
        "selling",
        "return_selling",
        "selling_zero",
        "return_selling_zero",
        "buying",
        "return_buying",
        "buying_zero",
        "return_buying_zero",
      ];

      checkboxKeys.forEach((key) => {
        if (req[key]) {
          params.append(key, "1");
        }
      });
    }

    // Handle other non-checkbox fields
    Object.keys(req).forEach((key) => {
      const value = req[key];

      // Skip falsy values except boolean false (already handled checkboxes)
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        typeof value === "boolean"
      )
        return;

      // Handle array values (like tax_period)
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => params.append(`${key}[]`, v));
      }
      // Handle regular values
      else {
        params.append(key, value);
      }
    });

    // Only add query string if there are parameters
    const queryString = params.toString();
    if (queryString) {
      uri += `?${queryString}`;
    }

    setSearch(uri);
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
      .container_print {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
    `,
  });

  useEffect(() => {
    refetch();
    dataExcelRefetch();
  }, [search]);

  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={t("loading")} />;

  return (
    <div className="space-y-8">
      <Formik
        initialValues={initialValue}
        onSubmit={(values: any) => {
          getSearchResults({
            ...values,
            from: values.from ? formatDate(values.from) : "",
            to: values.to ? formatDate(values.to) : "",
          });
        }}
      >
        {({ handleSubmit, setFieldValue }) => {
          return (
            <form onSubmit={handleSubmit} className="space-y-14">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Select
                    id="tax_period"
                    label={`${t("tax period")}`}
                    name="tax_period"
                    placeholder={`${t("choose tax period")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={taxPeriodOptions}
                  />
                </div>

                <div>
                  <DateInputField
                    label={`${t("from")}`}
                    placeholder={`${t("from")}`}
                    labelProps={{ className: "mb-1" }}
                    name="from"
                  />
                </div>
                <div>
                  <DateInputField
                    label={`${t("to")}`}
                    placeholder={`${t("to")}`}
                    labelProps={{ className: "mb-1" }}
                    name="to"
                  />
                </div>

                <BaseInputField
                  id="year"
                  label={`${t("year")}`}
                  name="year"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-5 gap-6">
                {checkBoxesOptions.map((option) => (
                  <Checkbox
                    labelClassName="text-base"
                    key={option.id}
                    name={option.value}
                    label={`${t(option.name)}`}
                    id={option.value}
                    onChange={(e) => {
                      setFieldValue(option.value, e.target.checked);
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit">{t("search")}</Button>
              </div>
            </form>
          );
        }}
      </Formik>

      {/* TABLE */}
      <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"} space-y-1`}>
        <div className="flex justify-end print:hidden gap-4">
          <Button
            onClick={handlePrint}
            className="bg-transparent text-mainGreen border border-mainGreen"
          >
            {t("print")}
          </Button>
          <Button
            action={() => {
              ExportToExcel(dataExcel, `tax return ${formatDate(new Date())}`);
            }}
          >
            {t("export")}
          </Button>
        </div>

        {/* selling table */}
        {data && data?.selling?.length > 0 && (
          <div className="pt-6">
            <p className=" bg-slate-300 font-bold text-center p-2">
              {t("selling")}
            </p>
            <Table columns={sellingCols} data={data?.selling || []} />
          </div>
        )}

        {/* buying table */}
        {data && data?.buying?.length > 0 && (
          <div className="pt-6">
            <p className=" bg-slate-300 font-bold text-center p-2">
              {t("purchase")}
            </p>
            <Table columns={buyingCols} data={data?.buying || []} />
          </div>
        )}

        {/* net */}
        <p className="bg-mainOrange/40 p-2 flex justify-between">
          <span className="font-bold mx-4">{t("net")}</span>
          <span className="font-bold text-center mr-32">
            {formatReyal(netTotal)}
          </span>
          <span className="font-bold mx-4 ml-32">{formatReyal(netTax)}</span>
        </p>
      </div>
    </div>
  );
};

export default EdaraTaxReturn;
