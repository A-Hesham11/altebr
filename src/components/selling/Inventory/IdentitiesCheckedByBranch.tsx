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
import { Button } from "../../atoms";
import { Modal } from "../../molecules";
import WeightAdjustmentInBranch from "./WeightAdjustmentInBranch";

const IdentitiesCheckedByBranch = ({
  identitiesCheckedItems,
  setIdentitiesCheckedItems,
}: any) => {
  console.log(
    "🚀 ~ IdentitiesCheckedByBranch ~ identitiesCheckedItems:",
    identitiesCheckedItems
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<any>(1);
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ IdentitiesCheckedByBranch ~ userData:", userData);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [editWeight, setEditWeight] = useState({});
  console.log("🚀 ~ editWeight:", editWeight);

  //   const { data, refetch, isLoading } = useFetch({
  //     queryKey: ["available_items_inBranch", page],
  //     endpoint: `/branchManage/api/v1/all-accepted/${userData?.branch_id}?page=${page}`,
  //     onSuccess: (data) => {
  //       if (data?.data?.length > 0) {
  //         setAvailableItems((prevItems) => [...prevItems, ...data?.data]);
  //       } else {
  //         setHasMore(false);
  //       }
  //     },
  //     pagination: true,
  //   });

  //   useEffect(() => {
  //     if (page > 1) {
  //       refetch();
  //     }
  //   }, [page]);

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
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
    ],
    []
  );

  const IdentitiesCheckedItems = [
    {
      id: 1,
      groupName: "المجموعة الاولي",
      totalItems: 3500,
      totalWeight: 1500,
      items: [
        {
          hwya: "93ABE5",
          category_selling_type: "all",
          classification_name: "دهب",
          category_name: "طقم",
          weight: "10",
        },
        {
          hwya: "93ABE6",
          classification_name: "دهب",
          category_name: "طقم",
          weight: "20",
        },
      ],
    },
    {
      id: 2,
      groupName: "المجموعة الثانية",
      totalItems: 2000,
      totalWeight: 1200,
      items: [
        {
          hwya: "93ABF7",
          classification_name: "فضة",
          category_name: "خاتم",
          weight: "15",
        },
        {
          hwya: "93ABF8",
          classification_name: "فضة",
          category_name: "خاتم",
          weight: "25",
        },
      ],
    },
    {
      id: 3,
      groupName: "المجموعة الثالثة",
      totalItems: 2000,
      totalWeight: 1200,
      items: [
        {
          hwya: "93ABF7",
          classification_name: "فضة",
          category_name: "خاتم",
          weight: "15",
        },
        {
          hwya: "93ABF8",
          classification_name: "فضة",
          category_name: "خاتم",
          weight: "25",
        },
      ],
    },
    {
      id: 4,
      groupName: "المجموعة الرابعة",
      totalItems: 2000,
      totalWeight: 1200,
      items: [
        {
          hwya: "93ABF7",
          classification_name: "فضة",
          category_name: "خاتم",
          weight: "15",
        },
        {
          hwya: "93ABF8",
          classification_name: "فضة",
          category_name: "خاتم",
          weight: "25",
        },
      ],
    },
  ];

  const testID = 1;

  const sortedIdentitiesCheckedItems = [
    ...identitiesCheckedItems.filter((group) => group.id === testID),
    ...identitiesCheckedItems.filter((group) => group.id !== testID),
  ];
  console.log(
    "🚀 ~ IdentitiesCheckedByBranch ~ sortedIdentitiesCheckedItems:",
    sortedIdentitiesCheckedItems
  );

//   useEffect(() => {
//     setIdentitiesCheckedItems(IdentitiesCheckedItems);
//   }, []);

  const table = useReactTable({
    data: sortedIdentitiesCheckedItems,
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
      <h2 className="bg-[#DB8028] rounded-t-2xl py-6 text-center text-white font-semibold">
        {t("Identities checked")}
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
                        className={`${"!bg-[#E8E8E2] text-[#000000B2] font-semibold"} px-6 py-4 text-sm`}
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

            <div className="max-h-[455px] overflow-y-scroll">
              <table className="min-w-full text-center">
                <tbody>
                  {sortedIdentitiesCheckedItems?.map((group) => (
                    <>
                      <tr
                        key={`group-${group.id}`}
                        className="border-t border-[#db7f2857] bg-[#E8E8E2] w-full text-sm"
                      >
                        <td
                          colSpan={columns.length / 2}
                          className="text-start font-bold p-3"
                        >
                          {group.groupName}
                        </td>
                        <td
                          colSpan={columns.length / 2}
                          className="text-end font-bold px-3 text-mainOrange"
                        >
                          {group.totalItems} {t("item")} -{group.totalWeight}{" "}
                          {t("gram")}
                        </td>
                      </tr>

                      {group.items.map((item, index) => {
                        return (
                          <tr
                            key={`item-${group.id}-${index}`}
                            className="border-b !bg-[#FAFAFA]"
                          >
                            {columns.map((col) => {
                              return (
                                <td
                                  className={`whitespace-nowrap px-0 py-3 text-sm font-light !text-gray-900`}
                                  key={col.accessorKey}
                                >
                                  {col.accessorKey === "weight" &&
                                  item["category_selling_type"] === "all" ? (
                                    <div
                                      className="flex items-end justify-center gap-x-1 cursor-pointer"
                                      onClick={() => {
                                        setOpen(true);
                                        setEditWeight(item);
                                      }}
                                    >
                                      <GiWeight
                                        className="text-mainGreen"
                                        size={24}
                                      />
                                      <p>{item[col.accessorKey]}</p>
                                    </div>
                                  ) : (
                                    item[col.accessorKey]
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      </div>

      <div className="bg-[#E8E8E2] rounded-b-2xl py-3.5 flex items-center justify-between px-4">
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("Total pieces")} : </span> {2500}{" "}
          {t("item")}
        </h2>
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("total weight")} : </span> {1000}{" "}
          {t("gram")}
        </h2>
      </div>

      <Modal
        onClose={() => setOpen(false)}
        isOpen={open}
        title={`${t("Enter weight for a piece")}`}
      >
        <WeightAdjustmentInBranch
          editWeight={editWeight}
          setIdentitiesCheckedItems={setIdentitiesCheckedItems}
        />
      </Modal>
    </div>
  );
};

export default IdentitiesCheckedByBranch;
