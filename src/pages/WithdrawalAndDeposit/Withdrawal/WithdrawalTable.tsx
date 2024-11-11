import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { FilesPreviewOutFormik } from "../../../components/molecules/files/FilesPreviewOutFormik";
import { BiSpreadsheet } from "react-icons/bi";
import { Modal } from "../../../components/molecules";
import BudgetTableEntry from "../../Budget/budgetBonds/BudgetTableEntry";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useIsRTL } from "../../../hooks";

type WithdrawalTable_TP = {
  data: any[];
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
};

const WithdrawalTable: React.FC<WithdrawalTable_TP> = ({
  data,
  page,
  setPage,
}) => {
  console.log("🚀 ~ data:", data);
  const { formatGram, formatReyal } = numberContext();
  const [selectedItem, setSelectedItem] = useState(null);
  console.log("🚀 ~ selectedItem:", selectedItem);
  const [openEntryModal, setOpenEntryModal] = useState(false);
  const isRTL = useIsRTL();

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "bond_date",
        header: () => <span>{t("bond date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "account_name",
        header: () => <span>{t("account name")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "---",
        accessorKey: "total",
        header: () => <span>{t("total")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <>
              <div className="flex items-center justify-center">
                <FilesPreviewOutFormik
                  images={info.row.original.images || []}
                  preview
                  pdfs={[]}
                />
                <BiSpreadsheet
                  onClick={() => {
                    setOpenEntryModal(true);
                    setSelectedItem(info.row.original);
                  }}
                  size={23}
                  className="text-mainGreen cursor-pointer"
                />
              </div>
            </>
          );
        },
        accessorKey: "images",
        header: () => <span>{t("attachment")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <Table data={data?.data || []} columns={tableColumn}>
        {data?.length === 0 ? (
          <p className="text-center text-lg font-bold text-mainGreen">
            {t("there is no data to make withdrawal")}
          </p>
        ) : (
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
        )}
      </Table>

      <Modal isOpen={openEntryModal} onClose={() => setOpenEntryModal(false)}>
        <div className="my-16">
          <BudgetTableEntry boxes={selectedItem?.boxes} />
        </div>
      </Modal>
    </>
  );
};

export default WithdrawalTable;
