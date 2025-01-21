import { useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ViewIcon } from "../../atoms/icons";
import { UseClickOutsideAndKeyboardDrop } from "../../../utils/UseClickOutsideAndKeyboardDrop";

const UnknownIdentitiesInBranch = ({
  unknownIdentities,
  setOpenDetailsItem,
  setUnknownItemDetails,
  setSelectedItem,
  activeTableId,
  setActiveTableId
}: any) => {

  const unknownTableRef = useRef<HTMLDivElement>(null);

  const { selectedRow, setSelectedRow } = UseClickOutsideAndKeyboardDrop(
    unknownIdentities,
    setSelectedItem,
    unknownTableRef,
    "Unknown",
    activeTableId,
    setActiveTableId
  );

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => (
          <ViewIcon
            size={21}
            action={() => {
              setOpenDetailsItem(true);
              setUnknownItemDetails(info.row.original);
            }}
            className="text-mainGreen mx-auto"
          />
        ),
        accessorKey: "#",
        header: () => <span>{t("#")}</span>,
      },
    ],
    []
  );

  const totalWeight = unknownIdentities?.reduce((acc: number, curr: any) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const table = useReactTable({
    data: unknownIdentities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1000000,
      },
    },
  });

  return (
    <div>
      <h2 className="bg-[#218A7A] rounded-t-2xl py-6 text-center text-white font-semibold">
        {t("Unknown identities")}
      </h2>

      <div ref={unknownTableRef} onClick={() => setActiveTableId("Unknown")}>
        <>
          <table className="min-w-full text-center border-b ">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${"!bg-[#218A7A33] text-[#218A7A] font-semibold"} text-start px-4 py-4 text-sm`}
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
            <table className="min-w-full text-start">
              <tbody>
                {table.getRowModel().rows.map((row, i) => {
                  return (
                    <tr
                      key={row.id}
                      className={`border-b ${
                        selectedRow === i && !!unknownTableRef ? "bg-[#295E5608]" : "bg-[#FAFAFA]"
                      }`}
                      onClick={() => {
                        setSelectedRow(i);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className={`whitespace-nowrap px-3 py-3 text-sm font-light cursor-pointer ${
                            selectedRow === i && !!unknownTableRef 
                              ? "bg-[#295E5608]"
                              : "bg-[#FAFAFA]"
                          } !text-gray-900`}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      </div>

      <div className="bg-[#C1D9D5] rounded-b-2xl py-3.5 flex items-center justify-between px-4">
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("Total pieces")} : </span>{" "}
          {unknownIdentities?.length} {t("item")}
        </h2>
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("total weight")} : </span>{" "}
          {totalWeight} {t("gram")}
        </h2>
      </div>
    </div>
  );
};

export default UnknownIdentitiesInBranch;
