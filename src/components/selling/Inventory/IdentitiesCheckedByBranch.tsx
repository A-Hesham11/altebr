import { useMemo, useRef, useState } from "react";
import { t } from "i18next";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { GiWeight } from "react-icons/gi";
import { Modal } from "../../molecules";
import WeightAdjustmentInBranch from "./WeightAdjustmentInBranch";
import { numberContext } from "../../../context/settings/number-formatter";

const IdentitiesCheckedByBranch = ({
  identitiesCheckedItems,
  setIdentitiesCheckedItems,
  currenGroupNumber,
}: any) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [editWeight, setEditWeight] = useState({});
  const { formatGram } = numberContext();

  const totalNumberItemsInspected = identitiesCheckedItems?.reduce(
    (count, group) => count + group.items.length,
    0
  );

  const totalWeightOfAllGroups = identitiesCheckedItems.reduce(
    (total, group) => {
      const groupItemsWeight = group.items
        ? group.items.reduce(
            (itemTotal, item) => itemTotal + parseFloat(item.weight || 0),
            0
          )
        : 0;

      return total + groupItemsWeight;
    },
    0
  );

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

  const sortedIdentitiesCheckedItems = [
    ...identitiesCheckedItems.filter((group) => group.id === currenGroupNumber),
    ...identitiesCheckedItems.filter((group) => group.id !== currenGroupNumber),
  ];
  console.log("🚀 ~ sortedIdentitiesCheckedItems:", sortedIdentitiesCheckedItems)

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

            <div className="max-h-[455px] h-[455px] overflow-y-scroll">
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
                          {t("group")} {group.groupName}
                        </td>
                        <td
                          colSpan={columns.length / 2}
                          className="text-end font-bold px-3 text-mainOrange"
                        >
                          {group.totalItems} {t("item")} -{" "}
                          {formatGram(Number(group.totalWeight))} {t("gram")}
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
          <span className="font-semibold">{t("Total pieces")} : </span>{" "}
          {totalNumberItemsInspected} {t("item")}
        </h2>
        <h2 className="text-center text-[13.5px]">
          <span className="font-semibold">{t("total weight")} : </span>{" "}
          {formatGram(Number(totalWeightOfAllGroups))} {t("gram")}
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
