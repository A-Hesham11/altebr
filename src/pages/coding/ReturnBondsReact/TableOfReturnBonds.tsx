import { useMemo, useState } from "react";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useIsRTL } from "../../../hooks";
import { BsEye } from "react-icons/bs";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import { numberContext } from "../../../context/settings/number-formatter";
import TableOfBranchBondsModal from "./TableOfReturnBondsModal";

const TableOfReturnBonds = ({ dataSource, setPage, page }) => {
  console.log(
    "🚀 ~ file: TableOfBranchBonds.tsx:18 ~ dataSource:",
    dataSource.data
  );
  const { formatReyal } = numberContext();

  // STATE
  const isRTL = useIsRTL();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => {
          if (info.getValue() == "normal") {
            return "توريد عادي";
          } else {
            return info.getValue();
          }
        },
        accessorKey: "type",
        header: () => <span>{t("bond type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "date",
        header: () => <span>{t("bond date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "branch_id",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "count_items",
        header: () => <span>{t("pieces count")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "-",
        accessorKey: "total_wage",
        header: () => <span>{t("total wages")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "-",
        accessorKey: "total_gold_weight",
        header: () => <span>{t("total gold weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "count_stones",
        header: () => <span>{t("stones count")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "thwelbond_id",
        header: () => <span>{t("return from supply bond")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_type",
        header: () => <span>{t("type of supply voucher")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "status",
        header: () => <span>{t("bond status")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setOpenIdentitiesModal(true);
              setSelectedItem(info.row.original);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <div className="">
        <h2 className="text-xl font-bold text-slate-700 mb-4">
          {t("all bonds")}
        </h2>
        <Table data={dataSource.data || []} columns={tableColumn}>
          <div className="mt-3 flex items-center justify-center gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              {<span className=" text-mainGreen">{dataSource?.total}</span>}
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className=" rounded bg-mainGreen p-[.18rem]"
                action={() => setPage((prev: any) => prev - 1)}
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
                action={() => setPage((prev: any) => prev + 1)}
                disabled={page == dataSource?.pages}
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
      <Modal
        isOpen={IdentitiesModal}
        onClose={() => setOpenIdentitiesModal(false)}
      >
        <TableOfBranchBondsModal item={selectedItem} />
      </Modal>
    </>
  );
};

export default TableOfReturnBonds;
