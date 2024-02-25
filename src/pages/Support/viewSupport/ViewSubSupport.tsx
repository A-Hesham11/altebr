import { useFetch, useIsRTL } from "../../../hooks";
import { useEffect, useMemo, useState } from "react";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { EditIcon } from "../../../components/atoms/icons";
import { Formik, Form } from "formik";
import { AddButton } from "../../../components/molecules/AddButton";
import { Back } from "../../../utils/utils-components/Back";
import { Loading } from "../../../components/organisms/Loading";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import AddSupport from "../AddSupport/AddSupport";
import { Modal } from "../../../components/molecules";

const ViewSubSupport = () => {
  const isRTL = useIsRTL();
  const [open, setOpen] = useState<boolean>(false);
  const [model, setModel] = useState(false);
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  });
  const [editData, setEditData] = useState<Cards_Props_TP>();
  console.log("🚀 ~ ViewSubSupport ~ editData:", editData);
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>();
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);
  console.log("🚀 ~ ViewSubSupport ~ dataSource:", dataSource);
  const [page, setPage] = useState<number>(1);

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
        header: () => <span>{t("main section")} </span>,
        accessorKey: "parent",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: () => <span>{t("sub section")} </span>,
        accessorKey: "name",
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
  } = useFetch<Cards_Props_TP[]>({
    endpoint: `/attachment/api/v1/subcategories`,
    queryKey: ["sub-section", page],
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
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={""}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div className="flex justify-between items-center mb-8">
          <p className="font-semibold text-lg">{t("view sub section")}</p>
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

        {isFetching && <Loading mainTitle={t("view sub section")} />}
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
                {t("there are no sub section available yet")}
              </p>
            </div>
          )
        )}

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {action.edit && (
            <AddSupport
              editData={editData}
              setDataSource={setDataSource}
              setShow={setOpen}
              isFetching={isFetching}
              title={`${editData ? t("edit section") : t("Add section")}`}
              refetch={refetch}
              isSuccess={isSuccess}
              isSub
              activeBtn={2}
            />
          )}
          {model && (
            <AddSupport
              editData={editData}
              isFetching={isFetching}
              setDataSource={setDataSource}
              setShow={setOpen}
              title={`${editData ? t("edit section") : t("Add section")}`}
              refetch={refetch}
              isSuccess={isSuccess}
            />
          )}
        </Modal>
      </Form>
    </Formik>
  );
};

export default ViewSubSupport;
