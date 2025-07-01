import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFetch, useIsRTL } from "../../hooks";
import { BiSpreadsheet } from "react-icons/bi";
import { t } from "i18next";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  BaseInputField,
  DateInputField,
  InnerFormLayout,
  Modal,
  OuterFormLayout,
  Select,
} from "../../components/molecules";
import TableEntry from "../../components/templates/reusableComponants/tantable/TableEntry";
import { Loading } from "../../components/organisms/Loading";
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik";
import { useReactToPrint } from "react-to-print";
import { Form, Formik } from "formik";
import { CiCalendarDate } from "react-icons/ci";
import { formatDate, getDayAfter } from "../../utils/date";
import { EditIcon } from "../../components/atoms/icons";
import { useNavigate } from "react-router-dom";
import { SelectBranches } from "../../components/templates/reusableComponants/branches/SelectBranches";
import { SelectOption_TP } from "../../types";
import { Employee_TP } from "../employees/employees-types";

const ViewManualEntry = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const isRTL = useIsRTL();
  const contentRef = useRef<React.LegacyRef<HTMLDivElement>>();
  const navigate = useNavigate();

  const entryTypeOptions = [
    { id: "daily", label: t("daily"), value: "daily" },
    { id: "settlement", label: t("settlement"), value: "settlement" },
    { id: "opening", label: t("opening"), value: "opening" },
    { id: "closing", label: t("closing"), value: "closing" },
  ];

  const initialValues = {
    id: "",
    bond_number: "",
    date: "",
    operation_date: "",
    branch_id: "",
    employee_id: "",
  };

  const { data, isLoading, isSuccess, isFetching, refetch, isRefetching } =
    useFetch<any[]>({
      endpoint:
        search === ""
          ? `/journalEntry/api/v1/entries?page=${page}`
          : `${search}&page=${page}`,
      queryKey: ["manual_entries"],
      onSuccess: (data) => {
        setDataSource(data?.data);
      },
      pagination: true,
    });

  const {
    data: employees,
    isLoading: employeesLoading,
    failureReason: employeeError,
    refetch: refetchEmployee,
  } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "employee/api/v1/employees?per_page=10000",
    queryKey: ["employees"],
    select: (employees) =>
      employees?.map((employee) => ({
        id: employee.id,
        value: employee.name,
        label: employee.name,
        name: employee.name,
      })),
  });

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "bond_number",
        header: () => <span>{t("attachment number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "branch",
        header: () => <span>{t("branch name")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "entry_type_lang",
        header: () => <span>{t("entry type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date",
        header: () => <span>{t("entry date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "operation_date",
        header: () => <span>{t("actual date of operation")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "employee",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        header: () => <span>{t("attachments")} </span>,
        accessorKey: "media",
        cell: (info: any) => {
          return (
            <div className="w-[30%] m-auto">
              {info?.row.original?.attachment?.length > 0 ? (
                <FilesPreviewOutFormik
                  images={info?.row.original?.attachment}
                  preview
                />
              ) : (
                "---"
              )}
            </div>
          );
        },
      },
      {
        cell: (info: any) => (
          <BiSpreadsheet
            size={25}
            onClick={() => {
              setOpen(true);
              setSelectedItem(info.row.original);
            }}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "restriction",
        header: () => <span>{t("restriction")}</span>,
      },
      {
        cell: (info: any) => (
          <EditIcon
            onClick={() => {
              navigate("/addManualEntry", {
                state: { id: info.row.original.id },
              });
            }}
            className="text-mainGreen w-6 h-6 mx-auto cursor-pointer"
          />
        ),
        accessorKey: "action",
        header: () => <span>{t("restriction")}</span>,
      },
    ],
    []
  );

  const entryDetails = [
    { title: "entry number", value: selectedItem?.id },
    { title: "entry date", value: selectedItem?.date },
    { title: "actual date of operation", value: selectedItem?.operation_date },
    { title: "attachment number", value: selectedItem?.bond_number },
    { title: "entry type", value: selectedItem?.entry_type_lang },
    { title: "branch name", value: selectedItem?.branch },
    { title: "employee name", value: selectedItem?.employee },
    { title: "media", value: selectedItem?.attachment },
    { title: "notes", value: selectedItem?.comments },
  ];

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
        @page {
          size: A5 landscape;;
          margin: 5px !important;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            zoom: 0.5;
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

  const getSearchResults = async (req: any) => {
    let uri = `/journalEntry/api/v1/entries`;
    let first = true;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          uri += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          uri += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(uri);
  };

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

  if (!isSuccess || isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("manual entry")} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-semibold text-xl ">{t("view manual entries")}</h2>
        <Button action={() => navigate("/addManualEntry")}>
          {t("add manual entries")}
        </Button>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          getSearchResults({
            ...values,
            date: values.date ? formatDate(getDayAfter(values?.date)) : "",
            operation_date: values.operation_date
              ? formatDate(getDayAfter(values?.operation_date))
              : "",
          });
        }}
      >
        <Form>
          <div className="grid grid-cols-4 gap-4 mb-5">
            <BaseInputField
              id="id"
              name="id"
              label={`${t("bond number")}`}
              placeholder={`${t("bond number")}`}
              type="number"
            />
            <BaseInputField
              id="bond_number"
              name="bond_number"
              label={`${t("attachment number")}`}
              placeholder={`${t("attachment number")}`}
              type="number"
            />
            <Select
              id="entry_type"
              label={`${t("entry type")}`}
              name="entry_type"
              placeholder={`${t("entry type")}`}
              loadingPlaceholder={`${t("loading")}`}
              options={entryTypeOptions}
            />
            <DateInputField
              label={`${t("entry date")}`}
              name="date"
              icon={<CiCalendarDate />}
              required
              labelProps={{ className: "mb-2" }}
              placeholder={`${formatDate(new Date())}`}
            />
            <DateInputField
              label={`${t("actual date of operation")}`}
              name="operation_date"
              icon={<CiCalendarDate />}
              required
              labelProps={{ className: "mb-2" }}
              placeholder={`${formatDate(new Date())}`}
            />
            <SelectBranches required name="branch_id" />
            <Select
              id="employee_id"
              label={`${t("employee name")}`}
              name="employee_id"
              placeholder={`${t("employee name")}`}
              loadingPlaceholder={`${t("loading")}`}
              options={employees}
              fieldKey="id"
              loading={employeesLoading}
              isDisabled={!employeesLoading && !!employeeError}
            />
          </div>
          <div className="flex items-center justify-end mb-8">
            <Button type="submit" disabled={isRefetching}>
              {t("search")}
            </Button>
          </div>
        </Form>
      </Formik>

      <Table data={dataSource || []} columns={Cols}>
        <div className="mt-3 flex items-center justify-center gap-5 p-2">
          <div className="flex items-center gap-2 font-bold">
            {t("page")}
            <span className=" text-mainGreen">{data?.current_page}</span>
            {t("from")}
            {<span className=" text-mainGreen">{data?.pages}</span>}
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
              disabled={page == data?.pages}
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

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className="mt-8 mb-4 flex items-center justify-end">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={handlePrint}
          >
            {t("print")}
          </Button>
        </div>
        <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
          <div>
            <h2 className="text-xl font-bold">{t("entry details")}</h2>
            <OuterFormLayout>
              <InnerFormLayout title={t("main data")}>
                <div className="col-span-4">
                  <ul className="grid grid-cols-3 gap-y-2 list-disc">
                    {entryDetails?.map((detail: any, index: number) => (
                      <li
                        key={index}
                        className={`flex gap-x-2 items-center ${
                          (detail.title === "notes" ||
                            detail.title === "media") &&
                          "col-span-3"
                        }`}
                      >
                        <strong>{t(detail.title)}:</strong>
                        {detail.title === "media" ? (
                          <>
                            {detail.value?.length > 0 ? (
                              <FilesPreviewOutFormik
                                images={detail.value}
                                preview
                              />
                            ) : (
                              t("no items")
                            )}
                          </>
                        ) : detail.title === "notes" ? (
                          <p className="wrapText">
                            {detail?.value ? detail?.value : t("no notes")}
                          </p>
                        ) : (
                          <>{detail?.value ? detail?.value : t("no items")}</>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </InnerFormLayout>
            </OuterFormLayout>
          </div>
          <TableEntry item={selectedItem} isSameCollection={true} />
        </div>
      </Modal>
    </div>
  );
};

export default ViewManualEntry;
