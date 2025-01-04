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
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { GiWeight } from "react-icons/gi";

const AvailableItemsInBranch = ({ availableItems, setAvailableItems }: any) => {
  console.log("🚀 ~ AvailableItemsInBranch ~ availableItems:", availableItems);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<any>(1);
  const { userData } = useContext(authCtx);
  const [hasMore, setHasMore] = useState(true);

  const { data, refetch, isLoading } = useFetch({
    queryKey: ["available_items_inBranch", page],
    endpoint: `/inventory/api/v1/getItems/${userData?.branch_id}?page=${page}`,
    onSuccess: (data) => {
      if (data?.data?.length > 0) {
        setAvailableItems((prevItems) => [...prevItems, ...data?.data]);
      } else {
        setHasMore(false);
      }
    },
    pagination: true,
  });

  const fetchMoreData = () => {
    setPage((prevPage) => {
      return prevPage + 1;
    });
  };

  useEffect(() => {
    if (page > 1) {
      refetch();
    }
  }, [page]);

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("الكود")}</span>,
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
    data: availableItems,
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
          <div ref={tableContainerRef} className={` w-full flex flex-col`}>
            <table className="min-w-full text-center border-b ">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`${"!bg-[#295E5633] text-mainGreen font-semibold"} px-6 py-4 text-sm`}
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
              loader={<h4 className="text-center">{t("loading")} ...</h4>}
              endMessage={
                <p className="text-center">{t("No more items to load")}</p>
              }
              height={455}
            >
              <table className="min-w-full text-center">
                <tbody>
                  {table.getRowModel().rows.map((row, i) => (
                    <tr key={row.id} className="border-b">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className={`whitespace-nowrap px-0 py-3 text-sm font-light bg-[#FAFAFA] !text-gray-900 w-fit`}
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
          {data?.total} {t("item")}
        </h2>
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("total weight")} : </span> {1000}{" "}
          {t("gram")}
        </h2>
      </div>
    </div>
  );
};

export default AvailableItemsInBranch;
