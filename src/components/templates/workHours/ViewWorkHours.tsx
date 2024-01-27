import { useNavigate } from "react-router-dom";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { useContext, useEffect, useMemo, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { ColumnDef } from "@tanstack/react-table";
import { Cards_Props_TP } from "../bankCards/ViewBankCards";
import { t } from "i18next";
import { EditIcon } from "../../atoms/icons";
import { SelectOption_TP } from "../../../types";
import { Form, Formik } from "formik";
import { AddButton } from "../../molecules/AddButton";
import { Modal, Select } from "../../molecules";
import { Table } from "../reusableComponants/tantable/Table";
import { Loading } from "../../organisms/Loading";
import { Button } from "../../atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import AddSubExpensesPolicies from "../subExpensesPolicy/AddSubExpensesPolicies";
import AddWorkHours from "./AddWorkHours";
import { Back } from "../../../utils/utils-components/Back";
import { Header } from "../../atoms/Header";
import { SvgDelete } from "../../atoms/icons/SvgDelete";
import { useQueryClient } from "@tanstack/react-query";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";

const ViewWorkHours = () => {
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

  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("Sequence")} </span>,
        accessorKey: "index",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("branch")} </span>,
        accessorKey: "branch_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("shift")} </span>,
        accessorKey: "shift_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("shift from")} </span>,
        accessorKey: "shift_from",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{`${t("shift to")}`}</span>,
        accessorKey: "shift_to",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{`${t("work hours")}`}</span>,
        accessorKey: "work_hours",
        cell: (info) => info.getValue(),
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
  } = useFetch({
    endpoint: `/employeeSalary/api/v1/shifts-per-branch/${branchId}`,
    queryKey: ["shifts-per-branch"],
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
  console.log("🚀 ~ ViewSubExpensesPolicies ~ data:", data);

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
      queryClient.refetchQueries(["shifts-per-branch"]);
      setOpen(false);
      notify("success");
    },
  });

  const handleDelete = () => {
    mutate({
      endpointName: `/employeeSalary/api/v1/delete-shift/${deleteData?.id}`,
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
        <div className="flex justify-between items-center mb-8">
          <p className="font-semibold text-lg">{t("view work shift policy")}</p>
          <div className="flex gap-2">
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
            <div className="ms-2">
              <Back />
            </div>
          </div>
        </div>

        <div className="mb-6 w-52">
          <Select
            id="branch_id"
            label={`${t("branches")}`}
            name="branch_id"
            placeholder={`${t("branches")}`}
            loadingPlaceholder={`${t("loading")}`}
            options={branchesOptions}
            isLoading={branchesLoading}
            onChange={(e) => {
              setBranchId(e.id);
            }}
          />
        </div>

        {isFetching && <Loading mainTitle={t("sub expenses policies")} />}
        {isSuccess && !isLoading && !isRefetching && dataSource.length ? (
          <Table data={dataSource} columns={columns}>
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
                {t("there are no expenses policies available yet")}
              </p>
            </div>
          )
        )}

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {action.edit && (
            <AddWorkHours
              editData={editData}
              setDataSource={setDataSource}
              setShow={setOpen}
              isFetching={isFetching}
              title={`${editData ? t("edit cards") : t("Add cards")}`}
              refetch={refetch}
              isSuccess={isSuccess}
            />
          )}
          {model && (
            <AddWorkHours
              editData={editData}
              isFetching={isFetching}
              setDataSource={setDataSource}
              setShow={setOpen}
              title={`${editData ? t("edit cards") : t("Add cards")}`}
              refetch={refetch}
              isSuccess={isSuccess}
            />
          )}
          {action.delete && (
            <div className="flex flex-col gap-8 justify-center items-center">
              <Header header={` حذف : ${"test"}`} />
              <div className="flex gap-4 justify-center items-cent">
                <Button
                  action={handleDelete}
                  loading={mutateLoading}
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

export default ViewWorkHours;
