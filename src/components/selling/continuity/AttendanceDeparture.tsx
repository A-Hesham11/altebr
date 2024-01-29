import { useContext, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { useFetch, useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Loading } from "../../organisms/Loading";
import { formatDate, getDayAfter } from "../../../utils/date";
import { BaseInputField, DateInputField } from "../../molecules";
import { Button } from "../../atoms";
import { Back } from "../../../utils/utils-components/Back";
import { Table } from "../../templates/reusableComponants/tantable/Table";

const AttendanceDeparture = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
  };

  // FETCHING DATA FROM API
  const {
    data: AttendanceDeparture,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["attendance-departure"],
    endpoint: `/banchSalary/api/v1/presences`,
    pagination: true,
  });
  console.log(
    "🚀 ~ AttendanceDeparture ~ AttendanceDeparture:",
    AttendanceDeparture
  );

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "id",
        header: () => <span>{t("Sequence")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "employee",
        header: () => <span>{t("employee")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "job",
        header: () => <span>{t("job title")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "day",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "presences",
        header: () => <span>{t("presences")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "departure",
        header: () => <span>{t("departure")}</span>,
      },
      {
        cell: (info: any) => {
          const day = info.row.original.day;
          const presences = info.row.original.presences;
          const departure = info.row.original.departure;

          const fortmatPresences = new Date(`${day}T${presences}`);
          const fortmatDeparture = new Date(`${day}T${departure}`);

          const timeDiff = +fortmatDeparture - +fortmatPresences;

          const resultDate = new Date(timeDiff);

          const hours = resultDate.getUTCHours();
          const minutes = resultDate.getUTCMinutes();
          const seconds = resultDate.getUTCSeconds();

          // Format the result as "HH:mm:ss"
          const formattedResult = `${hours < 10 ? "0" : ""}${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

          return formattedResult || "---";
        },
        accessorKey: "numberHours",
        header: () => <span>{t("number of hours")}</span>,
      },
      {
        cell: (info: any) => {
          const decimalHours = info.getValue();

          const formattedTime = convertDecimalToTime(decimalHours);

          return formattedTime;
        },
        accessorKey: "over_time",
        header: () => <span>{t("extra time")}</span>,
      },
      {
        cell: (info: any) => {
          const decimalHours = info.getValue();

          const formattedTime = convertDecimalToTime(decimalHours);

          return formattedTime;
        },
        accessorKey: "wastedTime",
        header: () => <span>{t("waste time")}</span>,
      },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (AttendanceDeparture) {
      setDataSource(AttendanceDeparture.data);
    }
  }, [AttendanceDeparture]);

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
    let url = `selling/api/v1/invoices_per_branch/${userData?.branch_id}?`;
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

  // function convertDecimalToTime(decimalHours) {
  //   const hours = Math.floor(decimalHours);
  //   const minutes = Math.floor((decimalHours - hours) * 60);
  //   const seconds = Math.floor(((decimalHours - hours) * 60 - minutes) * 60);

  //   const formattedTime = `${String(hours).padStart(2, "0")}:${String(
  //     minutes
  //   ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  //   return formattedTime;
  // }

  function convertDecimalToTime(decimalHours) {
    const totalSeconds = Math.round(decimalHours * 3600);
  
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
  }

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-16">
      <h2 className="text-lg font-bold mb-6">
        {t("Attendance and Departure")}
      </h2>
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
                    id="employee"
                    name="employee"
                    label={`${t("employee name")}`}
                    placeholder={`${t("employee name")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <BaseInputField
                    id="job_title"
                    name="job_title"
                    label={`${t("job title")}`}
                    placeholder={`${t("job title")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <DateInputField
                    label={`${t("date")}`}
                    placeholder={`${t("date")}`}
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
          <div className="mt-3 flex items-center justify-center gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">
                {AttendanceDeparture?.current_page}
              </span>
              {t("from")}
              {
                <span className=" text-mainGreen">
                  {AttendanceDeparture?.total}
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
                disabled={page == AttendanceDeparture?.pages}
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
    </div>
  );
};

export default AttendanceDeparture;
