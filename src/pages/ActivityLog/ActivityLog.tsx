import { useContext, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { useFetch, useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Loading } from "../../components/organisms/Loading";
import { formatDate, getDayAfter } from "../../utils/date";
import { BaseInputField, DateInputField, Modal } from "../../components/molecules";
import { Button } from "../../components/atoms";
import { Back } from "../../utils/utils-components/Back";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";

const ActivityLog = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");

  const searchValues = {
    user: "",
    operation_time: "",
  };  

  // FETCHING DATA FROM API
  const {
    data: activityData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    endpoint: `/log/api/v1/get-log`,
    queryKey: ["activity-log"],
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("ID")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "causer",
        header: () => <span>{t("user")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "date",
        header: () => <span>{t("operation time")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "event",
        header: () => <span>{t("operation type")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "subject",
        header: () => <span>{t("details")}</span>,
      },
      // {
      //   cell: (info: any) => (
      //     <BsEye
      //       onClick={() => {
      //         setOpenInvoiceModal(true);
      //         setSelectedItem(info.row.original);
      //       }}
      //       size={23}
      //       className="text-mainGreen mx-auto cursor-pointer"
      //     />
      //   ),
      //   accessorKey: "details",
      //   header: () => <span>{t("details")}</span>,
      // },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (activityData) {
      setDataSource(activityData.data);
    }
  }, [activityData]);

  useEffect(() => {
    refetch();
  }, [page, activityData]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  // SEARCH FUNCTIONALITY
  // const getSearchResults = async (req: any) => {
  //   let url = `/log/api/v1/get-log?`;
  //   let first = false;
  //   Object.keys(req).forEach((key) => {
  //     if (req[key] !== "") {
  //       if (first) {
  //         url += `?${key}[eq]=${req[key]}`;
  //         first = false;
  //       } else {
  //         url += `&${key}[eq]=${req[key]}`;
  //       }
  //     }
  //   });
  //   setSearch(url);
  // };

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-4">
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* 1) FORM */}
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            // getSearchResults({
            //   ...values,
            //   invoice_date: values.invoice_date
            //     ? formatDate(getDayAfter(new Date(values.invoice_date)))
            //     : "",
            // });
          }}
        >
          <Form className="w-full flex">
            <div className="flex w-full justify-between items-end gap-3">
              <div className="flex items-end gap-3">
                <div className="">
                  <BaseInputField
                    id="user"
                    name="user"
                    label={`${t("user")}`}
                    placeholder={`${t("user")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <DateInputField
                    label={`${t("operation time")}`}
                    placeholder={`${t("operation time")}`}
                    name="operation_time"
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
                {activityData?.current_page}
              </span>
              {t("from")}
              {<span className=" text-mainGreen">{activityData?.pages}</span>}
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
                disabled={page == activityData?.pages}
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
      {/* <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <SupplyPayoffInvoiceTablePreview item={selectedItem}/> 
      </Modal> */}
    </div>
  );
};

export default ActivityLog;