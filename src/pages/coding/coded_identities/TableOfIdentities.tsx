import { useMemo, useState } from "react";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useIsRTL } from "../../../hooks";
import { BsEye } from "react-icons/bs";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import TableOfIdentitiesPreview from "./TableOfIdentitiesPreview";

const TableOfIdentities = ({
  dataSource,
  setPage,
  page,
  fetchKey,
  setOperationTypeSelect,
  setCheckboxChecked,
  checkboxChecked
}) => {
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
              max={3000}
              // checked={checkboxChecked}
              disabled={info.row.original.weight === "0" ? true : false}
              className={`${
                info.row.original.weight === "0" &&
                "border border-gray-300 opacity-60"
              }`}
              type="checkbox"
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
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "model_number",
        header: () => <span>{t("modal number")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <div
              className={`${
                info.row.original.weight === "0" && "bg-mainOrange text-white p-2"
              }`}
            >
              {info.getValue() || "-"}
            </div>
          );
        },
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "supplier",
        header: () => <span>{t("supplier")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "bond_id",
        header: () => <span>{t("supply bond")}</span>,
      },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return wages;
        },
        accessorKey: "wages",
        header: () => <span>{t("wages")}</span>,
      },
      {
        cell: (info: any) => info.getValue()?.toFixed(2) || "-",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "branch",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              console.log(info.row.original)
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

  if (fetchKey[0] === "piece_by_weight") {
    const confirmColumn = {
      cell: (info: any) => (
        <Button
          action={() => console.log("confirm")}
          className="bg-mainGreen text-white text-xs"
        >
          {t("confirm")}
        </Button>
      ),
      accessorKey: "confirm",
      header: () => <span>{t("operations")}</span>,
    };

    tableColumn.push(confirmColumn);
  }

  return (
    <>
      <div className="">
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
        <TableOfIdentitiesPreview item={selectedItem}/>
      </Modal>
    </>
  );
};

export default TableOfIdentities;
