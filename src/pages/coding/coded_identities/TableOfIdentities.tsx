import { useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useIsRTL } from "../../../hooks";
import { BsEye } from "react-icons/bs";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import TableOfIdentitiesPreview from "./TableOfIdentitiesPreview";
import { numberContext } from "../../../context/settings/number-formatter";
import { Loading } from "../../../components/organisms/Loading";

const TableOfIdentities = ({
  dataSource,
  setPage,
  page,
  fetchKey,
  setOperationTypeSelect,
  setCheckboxChecked,
  checkboxChecked,
  operationTypeSelect,
  isLoading,
  isFetching,
  isRefetching,
  activeClass,
}: any) => {
  console.log("🚀 ~ operationTypeSelect:", operationTypeSelect);
  // STATE
  const isRTL = useIsRTL();
  const { formatReyal, formatGram } = numberContext();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [allIsChecked, setAllIsChecked] = useState<any>(false);

  const isChecked = (id) => operationTypeSelect.some((item) => item.id === id);

  useEffect(() => {
    setAllIsChecked(false);
  }, [page]);

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => {
          return (
            <input
              max={3000}
              checked={isChecked(info.row.original.id)}
              disabled={info.row.original.weight === "0" ? true : false}
              className={`checked:text-mainGreen customCheckbox rounded-sm ${
                info.row.original.weight === "0" &&
                "border border-gray-300 opacity-60"
              }`}
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setOperationTypeSelect((prev) => [
                    ...prev,
                    { ...info.row.original, index: info.row.index },
                  ]);
                } else {
                  setOperationTypeSelect((prev) =>
                    prev.filter((item) => item.id !== info.row.original.id)
                  );
                }
              }}
            />
          );
        },
        accessorKey: "checkbox",
        header: () => {
          return (
            <input
              type="checkbox"
              className="checked:text-mainGreen rounded-sm"
              checked={allIsChecked}
              onChange={(e) => {
                if (e.target.checked) {
                  setOperationTypeSelect((prev) => [
                    ...prev,
                    ...dataSource?.data,
                  ]);
                  setAllIsChecked(true);
                } else {
                  setOperationTypeSelect([]);
                  setAllIsChecked(false);
                }
              }}
            />
          );
        },
      },
      // {
      //   cell: (info: any) => info.getValue() || "---",
      //   accessorKey: "id",
      //   header: () => <span>{t("Id number")}</span>,
      // },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("id code")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "model_number",
        header: () => <span>{t("modal number")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <div
              className={`${
                info.row.original.weight === "0" &&
                "bg-mainOrange text-white p-2"
              }`}
            >
              {info.getValue() ? formatGram(Number(info.getValue())) : "---"}
            </div>
          );
        },
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <div>
              {info.getValue() ? formatGram(Number(info.getValue())) : "---"}
            </div>
          );
        },
        accessorKey: "remaining_weight",
        header: () => <span>{t("remaining weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "supplier",
        header: () => <span>{t("supplier")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "bond_id",
        header: () => <span>{t("supply bond")}</span>,
      },
      // {
      //   cell: (info: any) => {
      //     const wages =
      //       Number(info.row.original.wage).toFixed(2) *
      //       Number(info.row.original.weight);
      //     return formatReyal(wages);
      //   },
      //   accessorKey: "wages",
      //   header: () => <span>{t("wages")}</span>,
      // },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())),
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "branch",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setSelectedItem(info.row.original);
              setOpenIdentitiesModal(true);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    [isChecked, page]
  );

  // if (fetchKey[0] === "piece_by_weight") {
  //   const confirmColumn = {
  //     cell: (info: any) => (
  //       <Button
  //         action={() => console.log("confirm")}
  //         className="bg-mainGreen text-white text-xs"
  //       >
  //         {t("confirm")}
  //       </Button>
  //     ),
  //     accessorKey: "confirm",
  //     header: () => <span>{t("operations")}</span>,
  //   };

  //   tableColumn.push(confirmColumn);
  // }

  //  LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <>
      <div className="">
        <Table data={dataSource?.data || []} columns={tableColumn}>
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
      <Modal
        isOpen={IdentitiesModal}
        onClose={() => setOpenIdentitiesModal(false)}
      >
        <TableOfIdentitiesPreview item={selectedItem} />
      </Modal>
    </>
  );
};

export default TableOfIdentities;
