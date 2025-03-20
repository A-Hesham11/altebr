import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { t } from "i18next";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { GiWeight } from "react-icons/gi";
import { numberContext } from "../../../context/settings/number-formatter";
import { UseClickOutsideAndKeyboardDrop } from "../../../utils/UseClickOutsideAndKeyboardDrop";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const AvailableItemsInBranch = ({
  availableItems,
  setAvailableItems,
  setNumberItemsInBranch,
  setSelectedItem,
  activeTableId,
  setActiveTableId,
}: any) => {
  const availabletableCRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<number>(1);
  const { userData } = useContext(authCtx);
  const [hasMore, setHasMore] = useState(true);
  const { formatGram } = numberContext();

  const { selectedRow, setSelectedRow } = UseClickOutsideAndKeyboardDrop(
    availableItems,
    setSelectedItem,
    availabletableCRef,
    "Available",
    activeTableId,
    setActiveTableId
  );

  const totalWeight = availableItems?.reduce(
    (sum, item) => sum + +item.weight * (+item.karat_name / 24),
    0
  );

  // const { data, refetch, isLoading } = useFetch({
  //   queryKey: ["available_items_inBranch", page],
  //   endpoint: `/inventory/api/v1/getItems/${userData?.branch_id}?page=${page}`,
  //   onSuccess: (data) => {
  //     setNumberItemsInBranch(data?.total);
  //     if (data?.data?.length > 0) {
  //       setAvailableItems((prevItems) => [...prevItems, ...data?.data]);
  //     } else {
  //       setHasMore(false);
  //     }
  //   },
  //   pagination: true,
  // });

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // useEffect(() => {
  //   if (page > 1) {
  //     refetch();
  //   }
  // }, [page]);

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
        cell: (info: any) => (
          <>
            {info.row.original.category_selling_type === "all" ? (
              <div className="flex items-end gap-x-1">
                <p>
                  <GiWeight className="text-mainGreen" size={23} />
                </p>
                <span>{info.getValue()}</span>{" "}
              </div>
            ) : (
              <span>{info.getValue()}</span>
            )}
          </>
        ),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: availableItems || [],
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
      <h2 className="bg-mainGreen rounded-t-2xl py-6 text-center text-white font-semibold">
        {t("IDs in the branch warehouse")}
      </h2>

      <div>
        <>
          <div
            ref={availabletableCRef}
            className={` w-full flex flex-col`}
            onClick={() => setActiveTableId("Available")}
          >
            <table className="min-w-full text-center border-b ">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`${"!bg-[#295E5633] text-mainGreen font-semibold"} text-start px-4 py-4 text-sm`}
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

            <InfiniteScroll
              dataLength={table.getRowModel().rows.length}
              next={fetchMoreData}
              hasMore={hasMore}
              // loader={<h4 className="text-center">{t("loading")} ...</h4>}
              endMessage={
                <p className="text-center">{t("No more items to load")}</p>
              }
              height={455}
            >
              <table className="min-w-full text-start">
                <tbody>
                  {table.getRowModel().rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b cursor-pointer ${
                        selectedRow === i && !!availabletableCRef
                          ? "bg-[#295E5608]"
                          : "bg-[#FAFAFA]"
                      }`}
                      onClick={() => setSelectedRow(i)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className={`whitespace-nowrap px-3 py-3 text-sm font-light !text-gray-900 w-fit`}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </>
      </div>

      <div className="bg-[#C3D0CE] rounded-b-2xl py-3.5 flex items-center justify-between px-4">
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("Total pieces")} : </span>{" "}
          {availableItems?.length} {t("item")}
        </h2>
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("total weight")} : </span>{" "}
          {formatGram(Number(totalWeight))} {t("gram")}
        </h2>
      </div>
    </div>
  );
};

export default AvailableItemsInBranch;
