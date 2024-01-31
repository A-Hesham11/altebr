import { useContext, useMemo, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { Cards_Props_TP } from "../bankCards/ViewBankCards";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { EditIcon } from "../../atoms/icons";
import { SvgDelete } from "../../atoms/icons/SvgDelete";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Form, Formik } from "formik";
import { AddButton } from "../../molecules/AddButton";
import { Back } from "../../../utils/utils-components/Back";
import { Loading } from "../../organisms/Loading";
import { Table } from "../reusableComponants/tantable/Table";
import { Button } from "../../atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import AddSalariesPolicies from "../salaries/AddSalariesPolicies";
import { Modal } from "../../molecules";
import { Header } from "../../atoms/Header";
import AddEntitlementsPolicies from "./AddEntitlementsPolicies";

const ViewEtitlementsPolicies = () => {
  const isRTL = useIsRTL();
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
        header: () => <span>{t("name in arabic")} </span>,
        accessorKey: "name_ar",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in english")} </span>,
        accessorKey: "name_en",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("type")} </span>,
        accessorKey: "type",
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
    endpoint: `/employeeSalary/api/v1/entitlements?page=${page}`,
    queryKey: ["entitlements", page],
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

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<Cards_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["entitlements"]);
      setOpen(false);
      notify("success");
    },
  });

  const handleDelete = () => {
    mutate({
      endpointName: `/employeeSalary/api/v1/delete-entitlement/${deleteData?.id}`,
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
          <p className="font-semibold text-lg">
            {t("view entitlements policy")}
          </p>
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

        {isFetching && <Loading mainTitle={t("entitlements policies")} />}
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
                {t("there are no entitlement policies available yet")}
              </p>
            </div>
          )
        )}

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {action.edit && (
            <AddEntitlementsPolicies
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
            <AddEntitlementsPolicies
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
              <Header header={` حذف : ${deleteData?.name_en}`} />
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

export default ViewEtitlementsPolicies;
