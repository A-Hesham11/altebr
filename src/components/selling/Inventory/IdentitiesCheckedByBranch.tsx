import React, { Fragment, useMemo, useRef } from "react";
import { t } from "i18next";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { GiWeight } from "react-icons/gi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { numberContext } from "../../../context/settings/number-formatter";
import { Spinner } from "@/components/atoms";
import { Group_TP } from "@/pages/selling/Inventory/CreatingInventoryBond";

type Item = {
  _id?: string;
  roomId?: string;
  hwya?: string;
  category_name?: string;
  karat_name?: string | number;
  classification_name?: string;
  weight?: string | number;
  category_selling_type?: string;
  [key: string]: unknown;
};

type Group = {
  _id: string;
  groupName?: string;
  items?: Item[];
};

type Props = {
  identitiesCheckedItems: Group[] | undefined;
  currenGroup?: Group_TP;
  setOpenWeightItem: (v: boolean) => void;
  setEditWeight: (item: Item & { details_weight?: boolean }) => void;
  setSelectedItem?: (item: Item | null) => void;
  activeTableId?: string;
  setActiveTableId: (id: string) => void;
  handleDeleteRoom: (groupId: string) => void;
  handleDeleteItemFromRoom: (pieceId?: string, roomId?: string) => void;
  deletingRoomIds: any;
  deletingPieceIds: any;
};

const IdentitiesCheckedByBranch: React.FC<Props> = ({
  identitiesCheckedItems,
  currenGroup,
  setOpenWeightItem,
  setEditWeight,
  setSelectedItem,
  activeTableId,
  setActiveTableId,
  handleDeleteRoom,
  handleDeleteItemFromRoom,
  deletingRoomIds,
  deletingPieceIds,
}) => {
  const identitiesTableRef = useRef<HTMLDivElement>(null);
  const { formatGram } = numberContext();

  const groups: Group[] = Array.isArray(identitiesCheckedItems)
    ? identitiesCheckedItems
    : [];

  const sortedGroups: Group[] = useMemo(() => {
    const currentId = currenGroup?.id;
    return [
      ...groups.filter((g) => g?._id === currentId),
      ...groups.filter((g) => g?._id !== currentId),
    ];
  }, [groups, currenGroup?.id]);

  const totalNumberItemsInspected = useMemo(
    () => groups.reduce((count, g) => count + (g.items?.length ?? 0), 0),
    [groups]
  );

  // Use karat-adjusted totals consistently for groups and overall
  const karatAdjustedGroupTotal = (g: Group) =>
    (g.items ?? []).reduce((sum, item) => {
      const w = Number(item.weight) || 0;
      const k = Number(item.karat_name) || 0;
      return sum + w * (k / 24);
    }, 0);

  const totalWeightOfAllGroups = useMemo(
    () => groups.reduce((total, g) => total + karatAdjustedGroupTotal(g), 0),
    [groups]
  );

  const columns = useMemo<any>(
    () => [
      { accessorKey: "hwya", header: () => <span>{t("Hwya")}</span> },
      {
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      { accessorKey: "karat_name", header: () => <span>{t("karat")}</span> },
      {
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      { accessorKey: "weight", header: () => <span>{t("weight")}</span> },
      { accessorKey: "action", header: () => <span>#</span> },
    ],
    [t]
  );

  const table = useReactTable({
    data: sortedGroups, // used only for headers here
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 100 } },
  });

  return (
    <div>
      <h2 className="bg-[#DB8028] rounded-t-2xl py-6 text-center text-white font-semibold">
        {t("Identities checked")}
      </h2>

      <div>
        <div
          ref={identitiesTableRef}
          className="w-full flex flex-col"
          onClick={() => setActiveTableId("Identities")}
        >
          <table className="min-w-full text-center border-b">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="!bg-[#E8E8E2] text-[#000000B2] font-semibold py-5 text-sm"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>

          <div className="max-h-[455px] h-[455px] overflow-y-scroll">
            <table className="min-w-full text-center">
              <tbody>
                {sortedGroups.map((group, gIndex) => {
                  const groupTotal = karatAdjustedGroupTotal(group);

                  return (
                    <Fragment key={`group-${group._id}`}>
                      <tr className="border-t border-[#db7f2857] bg-[#E8E8E2] w-full text-sm">
                        <td className="text-start font-bold p-3" colSpan={3}>
                          <span className="whitespace-nowrap">
                            {t("group")} {group.groupName}
                          </span>
                        </td>
                        <td
                          className="text-end font-bold px-3 text-mainOrange"
                          colSpan={2}
                        >
                          <p className="whitespace-nowrap">
                            {group.items?.length ?? 0} {t("item")} -{" "}
                            {formatGram(Number(groupTotal))} {t("gram")}
                          </p>
                        </td>
                        <td
                          className="text-end font-bold px-3 text-mainOrange"
                          colSpan={2}
                        >
                          {deletingRoomIds.has(group._id) ? (
                            <Spinner size="small" />
                          ) : (
                            <div>
                              {gIndex === 0 && (
                                <div
                                  onClick={() => handleDeleteRoom(group._id)}
                                  className="text-mainRed hover:scale-110 duration-300 cursor-pointer"
                                >
                                  <RiDeleteBin5Line size={20} />
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>

                      {(group.items ?? []).map((item, index) => (
                        <tr
                          key={`item-${group._id}-${item._id ?? index}`}
                          className="border-b cursor-pointer bg-[#FAFAFA]"
                        >
                          {columns.map((col: any) => {
                            const key = col.accessorKey as
                              | keyof Item
                              | "action";
                            return (
                              <td
                                key={String(key)}
                                className="whitespace-nowrap py-3.5 text-sm font-light text-gray-900"
                              >
                                {key === "weight" &&
                                item.category_selling_type === "all" ? (
                                  <div
                                    className="flex items-end justify-center gap-x-1"
                                    onClick={() => {
                                      setOpenWeightItem(true);
                                      setEditWeight({
                                        ...item,
                                        details_weight: true,
                                      });
                                    }}
                                  >
                                    <GiWeight
                                      className="!text-mainGreen"
                                      size={24}
                                    />
                                    <p>{item.weight as React.ReactNode}</p>
                                  </div>
                                ) : key === "action" ? (
                                  <div className="">
                                    {deletingPieceIds.has(item._id) ? (
                                      <Spinner size="small" />
                                    ) : (
                                      <div>
                                        {gIndex === 0 && (
                                          <div
                                            onClick={() =>
                                              handleDeleteItemFromRoom(
                                                item._id,
                                                item.roomId
                                              )
                                            }
                                            className="text-mainRed mx-auto w-fit hover:scale-110 duration-300"
                                          >
                                            <RiDeleteBin5Line size={20} />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  (item[key] as React.ReactNode) ?? "---"
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-[#E8E8E2] rounded-b-2xl py-3.5 flex items-center justify-between px-4">
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("Total pieces")} : </span>{" "}
          {totalNumberItemsInspected} {t("item")}
        </h2>
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("total weight")} : </span>{" "}
          {formatGram(Number(totalWeightOfAllGroups))} {t("gram")}
        </h2>
      </div>
    </div>
  );
};

export default IdentitiesCheckedByBranch;

// const itemsDrop = identitiesCheckedItems.flatMap((group) => group.items);

// const { selectedRow, setSelectedRow } = UseClickOutsideAndKeyboardDrop(
//   itemsDrop,
//   setSelectedItem,
//   identitiesTableRef,
//   "Identities",
//   activeTableId,
//   setActiveTableId
// );

// ${
//   selectedRow === index && !!identitiesTableRef
//     ? "bg-[#295E5608]"
//     : "bg-[#FAFAFA]"
// }
