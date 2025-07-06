//@ts-noCheck
import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useParams } from "react-router-dom";
import { Button, Spinner } from "../../components/atoms";
import { DeleteIcon, ViewIcon } from "../../components/atoms/icons";
import { Modal } from "../../components/molecules";
import { useFetch, useIsRTL, useLocalStorage } from "../../hooks";
import {
  GoldCodingSanad_initialValues_TP,
  GoldSanad_TP,
} from "../coding/coding-types-and-helpers";
import { DiamondSelectedDetailedWeight } from "./AccessoriesSelectedDetailedWeight";
import { DiamondSubTables } from "./AccessoriesSubTables";
import { numberContext } from "../../context/settings/number-formatter";

// types
type Categories_TP = {
  has_selsal: string;
  has_size: string;
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  selling_type: string;
  type: string;
};
export function AccessoriesExapndableTable({
  addedPieces,
  setAddedPieces,
  showDetails,
  setSelectedSanad,
  selectedSanad,
}: {
  showDetails?: boolean;
  addedPieces: GoldCodingSanad_initialValues_TP[];
  setAddedPieces?: SetState_TP<GoldCodingSanad_initialValues_TP[]>;
  setSelectedSanad?: SetState_TP<GoldSanad_TP | undefined>;
  selectedSanad?: GoldSanad_TP;
}) {
  const { sanadId } = useParams();

  const { formatGram, formatReyal } = numberContext();

  const [addedPiecesLocal, setAddedPiecesLocal] = useLocalStorage<
    GoldCodingSanad_initialValues_TP[]
  >(`addedPiecesLocal_${sanadId}`);

  const [selectedSanadLocal, setSelectedSanadLocal] =
    useLocalStorage<GoldSanad_TP>(`selectedSanadLocal_${sanadId}`);
  // variables
  let count = 0;

  const columnHelper = createColumnHelper<any>();
  const modifiedData = addedPieces.map((item) => ({
    ...item,
    classification: "متفرقات",
    id_code: crypto.randomUUID().slice(0, 5),
    karat_id: crypto.randomUUID().slice(0, 2),
    index: ++count,
    sizes: item?.sizes || [],
  }));

  //states
  const [data, setData] = useState(modifiedData);

  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [detailedWeightModalOpen, seDetailedWeightModalOpen] = useState(false);
  const [subTableData, setSubTableData] = useState<{
    index: string;
    data: typeof data;
  }>();
  const [queryData, setQueryData] = useState<any[] | undefined>();

  const columns = useMemo<any>(
    () => [
      columnHelper.accessor("index", {
        header: `${t("index")}`,
      }),
      columnHelper.accessor("classification", {
        header: `${t("classification")}`,
      }),
      columnHelper.accessor("category", {
        header: `${t("category")}`,
      }),
      columnHelper.accessor("model_number", {
        header: `${t("model number")}`,
      }),
      columnHelper.accessor("weight", {
        header: `${t("weight")}`,
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      }),
      columnHelper.accessor("mezan_weight", {
        header: `الوزن الفعلي`,
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      }),
      columnHelper.accessor("cost_item", {
        header: `${t("value")}`,
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      }),
      ...(showDetails
        ? [
            columnHelper.accessor("actions", {
              header: `${t("actions")}`,
              cell: (info) => (
                <div className="flex justify-center gap-3">
                  <ViewIcon
                    size={23}
                    action={() => {
                      setSubTableData({
                        index: info.row.original.index,
                        data: modifiedData,
                      });
                      setModalOpen(true);
                    }}
                    className="text-mainGreen"
                  />
                  {setAddedPieces && (
                    <DeleteIcon
                      size={23}
                      action={() => {
                        const row: GoldCodingSanad_initialValues_TP =
                          info.row.original;
                        const selectedBandStones = addedPieces.filter(
                          (item) => item?.band_id === row?.band_id
                        );
                        const selectedItemFromSanad = selectedSanad.items.find(
                          (sanadItem) =>
                            addedPieces.find(
                              (item) => item.id == sanadItem?.band_id
                            )
                        );
                        const diamond_stone_weight =
                          selectedItemFromSanad?.diamond_stone_weight;
                        const other_stones_weight =
                          selectedItemFromSanad?.other_stones_weight;
                        const diamondStonesSum = selectedBandStones[0]?.stones
                          ?.filter((stone) => stone.stone_id == 70)
                          .reduce((acc, curr) => {
                            if (+acc <= +diamond_stone_weight)
                              return acc + +curr.diamondWeight;
                          }, 0);
                        const otherStonesSum = selectedBandStones[0]?.stones
                          ?.filter((stone) => stone.stone_id !== 70)
                          .reduce((acc, curr) => {
                            if (+acc <= +other_stones_weight)
                              return acc + +curr.weight;
                          }, 0);

                        const thisId = row.front_key;
                        setData((curr) =>
                          curr.filter((piece) => piece.front_key !== thisId)
                        );
                        setAddedPieces((curr) =>
                          curr.filter((piece) => piece.front_key !== thisId)
                        );
                        setAddedPiecesLocal((curr) =>
                          curr.filter((piece) => piece.front_key !== thisId)
                        );
                        setSelectedSanadLocal((curr) => ({
                          ...curr,
                          items: curr.items.map((band) => {
                            if (band.id === row.band_id) {
                              return {
                                ...band,
                                leftWeight:
                                  +band.leftWeight + +row.mezan_weight,
                                leftCostItem:
                                  +band.leftCostItem + +row.cost_item,
                                // leftWeightother:  +band.leftWeightother + otherStonesSum || 0,
                                // leftWeightDiamond:  +band.leftWeightDiamond + diamondStonesSum || 0
                              };
                            } else {
                              return band;
                            }
                          }),
                        }));

                        setSelectedSanad((curr) => ({
                          ...curr,
                          items: curr.items.map((band) => {
                            if (band.id === row.band_id) {
                              return {
                                ...band,
                                leftWeight:
                                  +band.leftWeight + +row.mezan_weight,
                                leftCostItem:
                                  +band.leftCostItem + +row.cost_item,
                                // leftWeightother:  +band.leftWeightother + otherStonesSum || 0,
                                // leftWeightDiamond:  +band.leftWeightDiamond + diamondStonesSum || 0
                              };
                            } else {
                              return band;
                            }
                          }),
                        }));
                      }}
                    />
                  )}
                </div>
              ),
            }),
          ]
        : []),
    ],
    []
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  // custom hooks
  const isRTL = useIsRTL();

  const queryClient = useQueryClient();

  const { data: allCategories, isLoading: categoryLoading } = useFetch({
    endpoint: "/classification/api/v1/categories?type=all",
    queryKey: ["categoriesx"],
  });

  useEffect(() => {
    if (queryClient) {
      const categories = allCategories;
      const allQueries = modifiedData?.map((item) => {
        const finaleItem = {
          category: categories?.find(
            (category) => category.id == item.category_id
          )?.name,
        };
        return finaleItem;
      });
      setQueryData(allQueries);
    }
  }, [queryClient, allCategories]);

  useEffect(() => {
    if (queryData) {
      setData(
        modifiedData.map((item, index) => ({
          ...item,
          category: queryData[index]?.category,
          actions: true,
          detailed_weight: true,
        }))
      );
    }
  }, [queryData]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h2 className="font-bold text-2xl">{t("final review")}</h2>
      <h3>
        <span>الهويات المرقمه من سند رقم # </span>
        <span className="text-orange-500">{addedPieces[0].bond_id}</span>
      </h3>
      <div className="w-full">
        <table className="mt-2 border-mainGreen shadow-lg mb-2 w-full">
          <thead className="bg-mainGreen text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-4 border-l-2 border-l-lightGreen first:rounded-r-lg last:rounded-l-lg last:rounded-b-none first:rounded-b-none  whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="border-l-2 border-l-flatWhite text-center h-[40px]"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={`border-l-[#b9b7b7]-500 border  ${
                          !!!cell.getContext().getValue() &&
                          "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {!!cell.getContext().getValue() ? (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        ) : categoryLoading ? (
                          <Spinner />
                        ) : (
                          "---"
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="h-2" />
        <div className="mt-3 flex items-center justify-end gap-5 p-2">
          <div className="flex items-center gap-2 font-bold">
            {t("page")}
            <span className=" text-mainGreen">
              {table.getState().pagination.pageIndex + 1}
            </span>
            {t("from")}
            <span className=" text-mainGreen">{table.getPageCount()} </span>
          </div>
          <div className="flex items-center gap-2 ">
            <Button
              className=" rounded bg-mainGreen p-[.18rem] "
              action={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {isRTL ? (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              )}
            </Button>
            <Button
              className=" rounded bg-mainGreen p-[.18rem] "
              action={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {isRTL ? (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              )}
            </Button>
          </div>
        </div>
        <div></div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <DiamondSubTables
          subTableData={subTableData}
          addedPieces={addedPieces}
          categoryLoading={categoryLoading}
        />
      </Modal>
      <Modal
        isOpen={detailedWeightModalOpen}
        onClose={() => seDetailedWeightModalOpen(false)}
        title={t("detailed weight")}
      >
        <DiamondSelectedDetailedWeight
          SelectedDetailedWeight
          subTableData={subTableData}
        />
      </Modal>
    </div>
  );
}

// ----------------   filtration section -------------------------
// function Filter({
//   column,
//   table,
// }: {
//   column: Column<any, any>
//   table: Table<any>
// }) {
//   const firstValue = table
//     .getPreFilteredRowModel()
//     .flatRows[0]?.getValue(column.id)

//   const columnFilterValue = column.getFilterValue()

//   return typeof firstValue === 'number' ? (
//     <div className="flex space-x-2">
//       <input
//         type="number"
//         value={(columnFilterValue as [number, number])?.[0] ?? ''}
//         onChange={e =>
//           column.setFilterValue((old: [number, number]) => [
//             e.target.value,
//             old?.[1],
//           ])
//         }
//         placeholder={`Min`}
//         className="w-24 border shadow rounded"
//       />
//       <input
//         type="number"
//         value={(columnFilterValue as [number, number])?.[1] ?? ''}
//         onChange={e =>
//           column.setFilterValue((old: [number, number]) => [
//             old?.[0],
//             e.target.value,
//           ])
//         }
//         placeholder={`Max`}
//         className="w-24 border shadow rounded"
//       />
//     </div>
//   ) : (
//     <input
//       type="text"
//       value={(columnFilterValue ?? '') as string}
//       onChange={e => column.setFilterValue(e.target.value)}
//       placeholder={`Search...`}
//       className="w-36 border shadow rounded"
//     />
//   )
// }

// ----------------   checkbox section -------------------------
// function IndeterminateCheckbox({
//   indeterminate,
//   className = '',
//   ...rest
// }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
//   const ref = React.useRef<HTMLInputElement>(null!)

//   React.useEffect(() => {
//     if (typeof indeterminate === 'boolean') {
//       ref.current.indeterminate = !rest.checked && indeterminate
//     }
//   }, [ref, indeterminate])

//   return (
//     <input
//       type="checkbox"
//       ref={ref}
//       className={className + ' cursor-pointer'}
//       {...rest}
//     />
//   )
// }
