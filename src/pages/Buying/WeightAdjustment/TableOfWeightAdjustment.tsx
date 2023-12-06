import { useMemo, useState } from "react";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useIsRTL } from "../../../hooks";
import { BsEye } from "react-icons/bs";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import TableOfIdentitiesPreview from "./TableOfIdentitiesPreview";
import TableOfWeightAdjustmentPreview from "./TableOfWeightAdjustmentPreview";

const TableOfWeightAdjustment = ({
  dataSource,
  setPage,
  page,
  setOperationTypeSelect,
  setCheckboxChecked,
  checkboxChecked,
  weightAdjustmentData,
  endpoint,
}) => {
  console.log(
    "🚀 ~ file: TableOfWeightAdjustment.tsx:20 ~ dataSource:",
    dataSource
  );

  // STATE
  const isRTL = useIsRTL();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => {
          return (
            <input
              // checked={checkboxChecked}
              disabled={info.row.original.has_stones == 0}
              type="checkbox"
              className={`${
                info.row.original.has_stones == 0 &&
                "bg-mainGray border-mainGray"
              }`}
              onChange={(e) => {
                // setCheckboxChecked(!checkboxChecked)

                if (e.target.checked) {
                  setOperationTypeSelect((prev) => [
                    ...prev,
                    { ...info.row.original, index: info.row.index },
                  ]);
                } else {
                  setOperationTypeSelect((prev) =>
                    prev.filter((item) => item.index !== info.row.index)
                  );
                }
              }}
            />
          );
        },
        accessorKey: "checkbox",
        header: () => <span>{t("")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "id",
        header: () => <span>{t("#")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "employee_name",
        header: () => <span>{t("buyer name")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "invoice_date",
        header: () => <span>{t("date")}</span>,
      },
      //   {
      //     cell: (info: any) => info.getValue() || "-",
      //     accessorKey: "time",
      //     header: () => <span>{t("time")}</span>,
      //   },

      //   {
      //     cell: (info: any) => (
      //       <BsEye
      //         onClick={() => {
      //           console.log(info.row.original);
      //           setOpenIdentitiesModal(true);
      //           setSelectedItem(info.row.original);
      //         }}
      //         size={23}
      //         className="text-mainGreen mx-auto cursor-pointer"
      //       />
      //     ),
      //     accessorKey: "details",
      //     header: () => <span>{t("details")}</span>,
      //   },
    ],
    []
  );

  return (
    <>
      <div className="">
        <Table data={dataSource.data || []} columns={tableColumn}>
          <div className="mt-3 flex items-center justify-center gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              {<span className=" text-mainGreen">{dataSource?.pages}</span>}
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
      {/* <Modal
        isOpen={IdentitiesModal}
        onClose={() => setOpenIdentitiesModal(false)}
      >
        <TableOfWeightAdjustmentPreview item={selectedItem} />
      </Modal> */}
    </>
  );
};

export default TableOfWeightAdjustment;
