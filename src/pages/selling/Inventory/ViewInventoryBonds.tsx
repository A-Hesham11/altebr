import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/atoms";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, ViewIcon } from "../../../components/atoms/icons";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Modal } from "../../../components/molecules";
import { authCtx } from "../../../context/auth-and-perm/auth";
import SelectEmployeesModal from "../../../components/selling/Inventory/SelectEmployeesModal";
import { useFetch, useIsRTL } from "../../../hooks";
import { HiDotsHorizontal } from "react-icons/hi";
import { Loading } from "../../../components/organisms/Loading";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ViewInventoryBonds = () => {
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ ViewInventoryBonds ~ dataSource:", dataSource);
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [openRowId, setOpenRowId] = useState(null);
  const [editEmployees, setEditEmployees] = useState({});
  const isRTL = useIsRTL();
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ ViewInventoryBonds ~ userData:", userData);
  const navigate = useNavigate();

  const dropListItems = [
    { drop_id: "a", title: t("Lost and Found Report") },
    { drop_id: "b", title: t("Inventory groups") },
    { drop_id: "c", title: t("Breakage and Cash Loss Report") },
    {
      drop_id: "d",
      title: t("Branch Inventory Report"),
      report_name: t("Branch Inventory Report"),
    },
    {
      drop_id: "e",
      title: t("Minutes of delivery of custody"),
      report_name: "Custody Handover Report",
    },
    {
      drop_id: "f",
      title: t("Minutes of receipt of the trust"),
      report_name: "Custody Receipt Report",
    },
    {
      drop_id: "g",
      title: t("Inventory report"),
      report_name: "Branch inventory report",
    },
    {
      drop_id: "h",
      title: t("Promissory note"),
      report_name: "Promissory note",
    },
  ];

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => <span>{t("Report number")} </span>,
        accessorKey: "bond_number",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("date")} </span>,
        accessorKey: "date",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("The manager")} </span>,
        accessorKey: "manager_name",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("Number of items in the branch")} </span>,
        accessorKey: "count_items",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("Total missing parts")} </span>,
        accessorKey: "missing_count_items",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("total weight")} </span>,
        accessorKey: "total_weight",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("Total weight lost")} </span>,
        accessorKey: "missing_total_weight",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("Total cash")} </span>,
        accessorKey: "cashing",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("Total cash lost")} </span>,
        accessorKey: "missing_cashing",
        cell: (info) => info.getValue() ?? "---",
      },
      {
        header: () => <span>{t("action")}</span>,
        accessorKey: "action",
        cell: (info) => {
          const rowId = info.row.original.id;
          const reportNumber = info.row.original.bond_number;
          const date = info.row.original.date;
          const statusBond = info.row.original.status;

          const employeesData = info.row.original.employees.map((item) => ({
            id: item.employee_id,
            value: item.employee_id,
            label: item.employee_name,
            is_start: item.is_start,
          }));
          console.log("🚀 ~ employeesData ~ employeesData:", employeesData);

          const toggleDropdown = () => {
            if (openRowId === rowId) {
              setOpenRowId(null);
            } else {
              setOpenRowId(rowId);
            }
          };
          return (
            <div className="flex items-center justify-center gap-5 relative">
              {statusBond === 0 ? (
                <>
                  <ViewIcon
                    size={19}
                    className="text-mainGreen"
                    action={() => {
                      navigate(`/selling/inventory/create/${rowId}`);
                    }}
                  />
                  {userData?.role_id === 3 && (
                    <EditIcon
                      size={19}
                      className="text-mainGreen"
                      action={() => {
                        setEditEmployees({
                          id: info.row.original.id,
                          report_number: info.row.original.bond_number,
                          employe: employeesData,
                        });
                        setOpen(true);
                      }}
                    />
                  )}
                </>
              ) : (
                <HiDotsHorizontal
                  size={20}
                  className="text-mainGreen cursor-pointer"
                  onClick={toggleDropdown}
                />
              )}

              {openRowId === rowId && (
                <ul className="absolute top-6 left-0 z-50 bg-white shadow-md rounded-xl">
                  {dropListItems?.map((item) => (
                    <li
                      key={item.drop_id}
                      className="p-2 text-[#000000B2] text-[17px] hover:bg-gray-100 cursor-pointer border-b py-4 px-5 text-start"
                      onClick={() => {
                        navigate("/selling/inventory/reportes", {
                          state: {
                            reportID: item.drop_id,
                            reportName: item.report_name,
                            inventoryID: rowId,
                            reportNumber,
                            date,
                          },
                        });
                      }}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        },
      },
    ],
    [openRowId]
  );

  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch<
    any[]
  >({
    endpoint: `/inventory/api/v1/inventory/${userData?.branch_id}?page=${page}`,
    queryKey: ["InventoryBonds"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data?.data);
    },
  });

  useEffect(() => {
    if (!open) {
      setEditEmployees({});
    }
  }, [open]);

  useEffect(() => {
    refetch();
  }, [page]);

  if (isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("loading")} />;

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
        <h2 className="text-xl font-semibold ">{t("Inventory Reports")}</h2>
        {userData?.role_id === 3 && (
          <Button bordered action={() => setOpen(true)}>
            {t("Create an inventory process")}
          </Button>
        )}
      </div>

      <div className="mt-8">
        <Table data={dataSource} columns={columns}>
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{data?.current_page}</span>
              {t("from")}
              <span className=" text-mainGreen">{data?.pages}</span>
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
      </div>

      <div>
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <SelectEmployeesModal
            editEmployees={editEmployees}
            open={open}
            setOpen={setOpen}
            refetch={refetch}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ViewInventoryBonds;
