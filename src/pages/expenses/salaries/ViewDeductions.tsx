import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Form, Formik } from "formik";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { EditIcon } from "../../../components/atoms/icons";
import { SvgDelete } from "../../../components/atoms/icons/SvgDelete";
import { AddButton } from "../../../components/molecules/AddButton";
import { Back } from "../../../utils/utils-components/Back";
import { Loading } from "../../../components/organisms/Loading";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { Modal } from "../../../components/molecules";
import AddEmployeeDeductions from "../../../components/templates/employeeDeductions/AddEmployeeDeductions";
import { Header } from "../../../components/atoms/Header";

const ViewDeductions = ({ employeeData }) => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [model, setModel] = useState(false);
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  });
  const [editData, setEditData] = useState<Cards_Props_TP>();
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>();
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);
  const [page, setPage] = useState<number>(1);
  const { userData } = useContext(authCtx);
  const [branchId, setBranchId] = useState<string>(1);

  const initialValues = {
    branch_id: "",
  };

  const totalReceivables = employeeData.empEntitlement?.reduce((acc, curr) => {
    acc +=
      curr.entitlement_id === 1
        ? +curr.value * 0.01 * ((employeeData.salary / employeeData.basicNumberOfHours) * employeeData.extraTime)
        : +curr.value;
    return acc;
  }, 0) || 0

  const housingAllowance = employeeData?.empEntitlement?.filter(item => item.entitlement_id === 2)[0]?.value

  const watchPrice = +employeeData.salary / +employeeData.basicNumberOfHours;

  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("employee name")} </span>,
        accessorKey: "employee_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("deduction name")} </span>,
        accessorKey: "deduction_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) => {
          const value =
            +info.row.original.deduction_id === 2 // تأمين إجتماعي
              ? ((+info.row.original.value * 0.01) * ((+housingAllowance ? +housingAllowance : 0) + +employeeData.salary) / 2)
              : +info.row.original.deduction_id === 3 //  تأمين مخاطر
              ? ((+info.row.original.value * 0.01) * ((+housingAllowance ? +housingAllowance : 0) + +employeeData.salary))
              : +info.row.original.deduction_id === 1 // خصم
              ? +info.row.original.value *
                0.01 *
                (watchPrice * employeeData.wastedTime)
              : +info.row.original.value;
          return value;
        },
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev);
                  setEditData(info.row.original);
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  });
                  setModel(false);
                }}
                className="fill-mainGreen"
              />

              <SvgDelete
                action={() => {
                  setOpen((prev) => !prev);
                  setDeleteData(info.row.original);
                  setAction({
                    delete: true,
                    view: false,
                    edit: false,
                  });
                  setModel(false);
                }}
                stroke="#ef4444"
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    data,
    isSuccess,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
    isFetching,
  } = useFetch<Cards_Props_TP[]>({
    endpoint: `/employeeSalary/api/v1/employee-deduction-per-branch/${branchId}`,
    queryKey: ["employeeDeductions"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data);
    },
    select: (data) => {
      return {
        ...data,
        data: data.data.map((branches, i) => ({
          ...branches,
          index: i + 1,
        })),
      };
    },
  });

  useEffect(() => {
    refetch();
  }, [branchId]);

  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        return {
          id: branch.id,
          value: branch.name || "",
          label: branch.name || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<Cards_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["employeeDeductions"]);
      setOpen(false);
      notify("success");
    },
  });

  const handleDelete = () => {
    mutate({
      endpointName: `/employeeSalary/api/v1/delete-employee-deduction/${deleteData?.id}`,
      method: "delete",
    });
  };

  return (
    <Formik
      className=""
      initialValues={initialValues}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div className="flex justify-between mb-8 ">
          <p className="font-semibold text-lg mt-2">
            {t("view employee deductions policies")}
          </p>
          <div className="flex gap-2 mt-16">
            <AddButton
              action={() => {
                setEditData(undefined);
                setModel(true);
                setOpen(true);
                setAction({
                  edit: false,
                  delete: false,
                  view: false,
                });
              }}
              addLabel={`${t("add")}`}
            />
          </div>
        </div>

        {isFetching && (
          <Loading mainTitle={t("employee deductions policies")} />
        )}
        {isSuccess &&
        !isLoading &&
        !isRefetching &&
        employeeData?.empDeduction?.length ? (
          <Table data={employeeData?.empDeduction} columns={columns}>
            <div className="mt-3 flex items-center justify-end gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{data.current_page}</span>
                {t("from")}
                <span className=" text-mainGreen">{data.pages}</span>
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.12rem] "
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
                  className=" rounded bg-mainGreen p-[.18rem]  "
                  action={() => setPage((prev) => prev + 1)}
                  disabled={page == data.pages}
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
        ) : (
          !isLoading &&
          !isRefetching &&
          !dataSource.length && (
            <div className="flex justify-center items-center mt-32">
              <p className="text-lg font-bold">
                {t("there are no employee deductions policies available yet")}
              </p>
            </div>
          )
        )}

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {action.edit && (
            <AddEmployeeDeductions
              editData={editData}
              setDataSource={setDataSource}
              setShow={setOpen}
              isFetching={isFetching}
              title={`${editData ? t("edit cards") : t("Add cards")}`}
              refetch={refetch}
              isSuccess={isSuccess}
              deductionsData={employeeData?.empDeduction}
            />
          )}
          {model && (
            <AddEmployeeDeductions
              editData={editData}
              isFetching={isFetching}
              setDataSource={setDataSource}
              setShow={setOpen}
              title={`${editData ? t("edit cards") : t("Add cards")}`}
              refetch={refetch}
              isSuccess={isSuccess}
              deductionsData={employeeData?.empDeduction}
            />
          )}
          {action.delete && (
            <div className="flex flex-col gap-8 justify-center items-center">
              <Header header={` حذف : ${deleteData?.employee_name}`} />
              <div className="flex gap-4 justify-center items-cent">
                <Button
                  loading={mutateLoading}
                  action={handleDelete}
                  variant="danger"
                >
                  {`${t("confirm")}`}
                </Button>
                <Button action={() => setOpen(false)}>{`${t("close")}`}</Button>
              </div>
            </div>
          )}
        </Modal>
      </Form>
    </Formik>
  );
};

export default ViewDeductions;
