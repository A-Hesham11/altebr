/////////// IMPORTS
///
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms";
import { OuterFormLayout } from "../../components/molecules/OuterFormLayout";
///
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Header } from "../../components/atoms/Header";
import { EditIcon, ViewIcon } from "../../components/atoms/icons";
import { SvgDelete } from "../../components/atoms/icons/SvgDelete";
import { Modal } from "../../components/molecules/Modal";
import { Loading } from "../../components/organisms/Loading";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import { AddAdministrativeStructure } from "./AddAdministrativeStructure";
import { PermissionGroup_TP } from "./types-and-schemas";
/////////// Types
///
type AdministrativeStructureProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
type Admin = {
  id: string;
  name: string;
  action: any;
};

const columnHelper = createColumnHelper<Admin>();

///
export const AdministrativeStructure = ({
  title,
}: AdministrativeStructureProps_TP) => {
  /////////// VARIABLES
  ///
  const navigate = useNavigate();

  // states
  const [dataSource, setDataSource] = useState<PermissionGroup_TP[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [model, setModel] = useState(false);
  const [editData, setEditData] = useState<any>();
  const [deleteData, setDeleteData] = useState<any>();

  ///
  const AddAdministrative = (
    <Button
      bordered
      action={() => {
        navigate(-1);
      }}
    >
      {t("back")}
    </Button>
  );
  /////////// CUSTOM HOOKS
  ///
  const { data, isSuccess, isFetching } = useFetch<PermissionGroup_TP[]>({
    endpoint: "administrative/api/v1/roles?per_page=10000",
    queryKey: ["allRoles"],
    onSuccess: (data) => {
      setDataSource(data.data);
    },
    pagination: true,
  });

  const { mutate, isLoading: isDeleting } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      setDataSource((prev: PermissionGroup_TP[]) =>
        prev.filter((p) => p.id !== deleteData?.id)
      );
      setOpen(false);
      notify("success");
    },
  });

  const cols = useMemo<ColumnDef<PermissionGroup_TP>[]>(
    () => [
      {
        header: t("Name").toString(),
        cell: (info) => info.renderValue(),
        accessorKey: "name",
      },
      {
        header: t("Edit").toString(),
        cell: (info) => (
          <div className="flex items-center justify-center gap-4">
            <EditIcon
              action={() => {
                setOpen((prev) => !prev);
                setEditData(info.row.original);
                setModel(true);
              }}
            />
            <SvgDelete
              action={() => {
                setOpen((prev) => !prev);
                setDeleteData(info.row.original);
                setModel(false);
              }}
              stroke="#ef4444"
            />
            <ViewIcon
              action={() =>
                navigate(`/administrative/api/v1/roles/${info.row.original.id}`)
              }
            />
          </div>
        ),
        accessorKey: "edit",
      },
    ],
    []
  );
  ////

  ///
  /////////// STATES
  ///
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const handleSubmit = () => {
    mutate({
      endpointName: `administrative/api/v1/roles/${deleteData?.id}`,
      method: "delete",
    });
  };
  if (isFetching) return <Loading mainTitle={t("administrative structure")} />;
  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <OuterFormLayout
        leftComponent={AddAdministrative}
        header={t("administrative structure")}
      >
        <div className="flex justify-between mb-6">
          {/* <h3 className="font-bold">{`${t("administrative structure")}`}</h3> */}
        </div>
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {model ? (
            <AddAdministrativeStructure
              title={`${
                editData
                  ? t("edit-administrative-structure")
                  : t("add-administrative-structure")
              }`}
              editData={editData}
              setOpen={setOpen}
            />
          ) : (
            <div className="flex flex-col gap-8 justify-center items-center">
              <Header header={` حذف : ${deleteData?.name}`} />
              <div className="flex gap-4 justify-center items-cent">
                <Button
                  action={handleSubmit}
                  loading={isDeleting}
                  variant="danger"
                >
                  {`${t("confirm")}`}
                </Button>
                <Button action={() => setOpen(false)}>{`${t("close")}`}</Button>
              </div>
            </div>
          )}
        </Modal>
        <div className="flex flex-col gap-6 items-center">
          {isSuccess && dataSource.length === 0 && (
            <div className="mb-5 pr-5">
              <Header
                header={t("no items")}
                className="text-center text-2xl font-bold"
              />
            </div>
          )}
          {isSuccess && !!dataSource && !!dataSource.length && (
            <Table data={dataSource} showNavigation columns={cols} />
          )}
        </div>
      </OuterFormLayout>
    </>
  );
};
