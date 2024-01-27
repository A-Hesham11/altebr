import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { useFetch, useIsRTL } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Loading } from "../../../components/organisms/Loading";
import { Back } from "../../../utils/utils-components/Back";
import { formatDate, getDayAfter } from "../../../utils/date";
import {
  BaseInputField,
  DateInputField,
  Modal,
} from "../../../components/molecules";
import { SelectBranches } from "../../../components/templates/reusableComponants/branches/SelectBranches";
import { Button } from "../../../components/atoms";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { NationalAddress } from "../../../components/templates";
import { SelectNationality } from "../../../components/templates/systemEstablishment/SelectNationality";
import { SelectRole } from "../../../components/templates/reusableComponants/roles/SelectRole";
import PaymentBondsTable from "../../coding/branch bonds/PaymentBondsTable";
import ViewReceivables from "./ViewReceivables";
import ViewDeductions from "./ViewDeductions";

interface TableColumn {
  cell: (info: any) => ReactNode;
  accessorKey: string;
  header: () => ReactNode;
}

const SalariesPage = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpenReceivables, setIsOpenReceivables] = useState(false);
  const [isOpenDeductions, setIsOpenDeductions] = useState(false);
  const [receivablesData, setReceivablesData] = useState(false);
  const [deductionsData, setDeductionsData] = useState(false);

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
  };

  const {
    data: SalariesData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["payment-invoice-inidara"],
    endpoint:
      search === ""
        ? `/employeeSalary/api/v1/getAllEmployeeInEdraa?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log("🚀 ~ SalariesPage ~ SalariesData:", SalariesData?.data);

  // COLUMNS FOR THE TABLE
  // const tableColumn = useMemo<any>(
  //   () => [
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "name",
  //       header: () => <span>{t("employee name")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "role_name",
  //       header: () => <span>{t("job title")}</span>,
  //     },
  //     {
  //       cell: (info: any) => info.getValue(),
  //       accessorKey: "salary",
  //       header: () => <span>{t("salary")}</span>,
  //     },
  //     {
  //       cell: (info: any) => (
  //         <BsEye
  //           onClick={() => {
  //             setIsOpenReceivables(true);
  //             setReceivablesData(info.row.original.empEntitlement);
  //           }}
  //           size={23}
  //           className="text-mainGreen mx-auto cursor-pointer"
  //         />
  //       ),
  //       accessorKey: "dues",
  //       header: () => <span>{t("Dues")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const receivables = info.row.original.empEntitlement;
  //         const totalReceivables = receivables?.reduce((acc, curr) => {
  //           acc += +curr.value;
  //           return acc;
  //         }, 0);
  //         return totalReceivables;
  //       },
  //       accessorKey: "total_receivables",
  //       header: () => <span>{t("Total receivables")}</span>,
  //     },
  //     {
  //       cell: (info: any) => (
  //         <BsEye
  //           onClick={() => {
  //             setIsOpenDeductions(true);
  //             setDeductionsData(info.row.original.empDeduction);
  //           }}
  //           size={23}
  //           className="text-mainGreen mx-auto cursor-pointer"
  //         />
  //       ),
  //       accessorKey: "deductions",
  //       header: () => <span>{t("Deductions")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const receivables = info.row.original.empEntitlement;
  //         const totalReceivables = receivables?.reduce((acc, curr) => {
  //           acc += +curr.value;
  //           return acc;
  //         }, 0);

  //         const deductions = info.row.original.empDeduction;
  //         const totalDeductions = deductions?.reduce((acc, curr) => {
  //           acc += curr.deduction_name == "تامينات" ? ((+curr.value * 0.01) * (+totalReceivables + +info.row.original.salary)) : +curr.value
  //           return acc;
  //         }, 0);
  //         return totalDeductions;
  //       },
  //       accessorKey: "total_deductions",
  //       header: () => <span>{t("Total deductions")}</span>,
  //     },
  //     {
  //       cell: (info: any) => {
  //         const receivables = info.row.original.empEntitlement;
  //         const totalReceivables = receivables?.reduce((acc, curr) => {
  //           acc += +curr.value;
  //           return acc;
  //         }, 0);

  //         const deductions = info.row.original.empDeduction;
  //         const totalDeductions = deductions?.reduce((acc, curr) => {
  //           acc += curr.deduction_name == "تامينات" ? ((+curr.value * 0.01) * (+totalReceivables + +info.row.original.salary)) : +curr.value
  //           return acc;
  //         }, 0);

  //         const netSalary = +info.row.original.salary + +totalReceivables - +totalDeductions

  //         return netSalary;
  //       },
  //       accessorKey: "net_salary",
  //       header: () => <span>{t("Net salary")}</span>,
  //     },
  //   ],
  //   []
  // );

  const tableColumn: TableColumn[] = useMemo(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "role_name",
        header: () => <span>{t("job title")}</span>,
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "salary",
        header: () => <span>{t("salary")}</span>,
      },
      {
        cell: (info) => (
          <BsEye
            onClick={() => {
              setIsOpenReceivables(true);
              setReceivablesData(info.row.original.empEntitlement);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "dues",
        header: () => <span>{t("Dues")}</span>,
      },
      {
        cell: (info) => {
          const totalReceivables = calcTotalReceivables(
            info.row.original.empEntitlement
          );
          return totalReceivables;
        },
        accessorKey: "total_receivables",
        header: () => <span>{t("Total receivables")}</span>,
      },
      {
        cell: (info) => (
          <BsEye
            onClick={() => {
              setIsOpenDeductions(true);
              setDeductionsData(info.row.original.empDeduction);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "deductions",
        header: () => <span>{t("Deductions")}</span>,
      },
      {
        cell: (info) => {
          const totalDeductions = calcTotalDeductions(
            info.row.original.empDeduction,
            info.row.original.empEntitlement,
            info.row.original.salary
          );
          return totalDeductions;
        },
        accessorKey: "total_deductions",
        header: () => <span>{t("Total deductions")}</span>,
      },
      {
        cell: (info) => {
          const netSalary = calcNetSalary(
            info.row.original.salary,
            info.row.original.empEntitlement,
            info.row.original.empDeduction
          );
          return netSalary;
        },
        accessorKey: "net_salary",
        header: () => <span>{t("Net salary")}</span>,
      },
    ],
    []
  );

  const calcTotalReceivables = (data: any[] | undefined): number => {
    return data?.reduce((acc, curr) => acc + +curr.value, 0) || 0;
  };

  const calcTotalDeductions = (
    deductions: any[] | undefined,
    entitlement: any[] | undefined,
    salary: number
  ): number => {
    return (
      deductions?.reduce((acc, curr) => {
        acc +=
          curr.deduction_name === "تامينات"
            ? +curr.value * 0.01 * (calcTotalReceivables(entitlement) + +salary)
            : +curr.value;
        return acc;
      }, 0) || 0
    );
  };

  const calcNetSalary = (
    salary: number,
    entitlement: any[] | undefined,
    deductions: any[] | undefined
  ): number => {
    const totalReceivables = calcTotalReceivables(entitlement);
    const totalDeductions = calcTotalDeductions(
      deductions,
      entitlement,
      salary
    );
    return +salary + totalReceivables - totalDeductions;
  };

  // EFFECTS
  useEffect(() => {
    if (SalariesData) {
      setDataSource(SalariesData.data);
    }
  }, [SalariesData]);

  useEffect(() => {
    refetch();
  }, [page, SalariesData, search]);

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

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold">{t("Salaries")}</h2>
        <Back className="hover:bg-slate-50 transition-all duration-300" />
      </div>
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
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
              <div className="flex items-end gap-3 w-full">
                <div className="w-[230px]">
                  <SelectNationality name="nationality_id" />
                </div>
                <div className="w-[230px]">
                  <SelectBranches required name="branch_id" />
                </div>
                <SelectRole name="role_id" required />
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
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              <span className=" text-mainGreen">{SalariesData.pages}</span>
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
                disabled={page == SalariesData.pages}
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

      <Modal
        isOpen={isOpenReceivables}
        onClose={() => setIsOpenReceivables(false)}
      >
        <ViewReceivables
          receivablesData={receivablesData}
          setIsOpenReceivables={setIsOpenReceivables}
          refetch={refetch}
        />
      </Modal>

      <Modal
        isOpen={isOpenDeductions}
        onClose={() => setIsOpenDeductions(false)}
      >
        <ViewDeductions
          deductionsData={deductionsData}
          setIsOpenDeductions={setIsOpenDeductions}
          refetch={refetch}
        />
      </Modal>
    </div>
  );
};

export default SalariesPage;
