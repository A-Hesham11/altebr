import React, { useEffect, useMemo, useState } from "react";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useFormikContext } from "formik";
import { t } from "i18next";
import { useFetch } from "../../hooks";
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
  Select,
} from "../../components/molecules";
import { Button } from "../../components/atoms";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import DraggableRow from "./DraggableRow";
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik";
import { formatDate } from "../../utils/date";
import { useContext } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { notify } from "../../utils/toast";
import { FilesPreview } from "../../components/molecules/files/FilesPreview";
import { MultiFilesPreview } from "../../components/molecules/files/MultiFilesPreview";
import { numberContext } from "../../context/settings/number-formatter";

function isDebit(entry) {
  return (
    (entry.indebted_gram && entry.indebted_gram !== "") ||
    (entry.indebted_reyal && entry.indebted_reyal !== "")
  );
}

function isCredit(entry) {
  return (
    (entry.creditor_gram && entry.creditor_gram !== "") ||
    (entry.creditor_reyal && entry.creditor_reyal !== "")
  );
}

const ManualEntryTableData = ({
  dataSource,
  setDataSource,
  isLoading,
  allAccountOptions,
  isFetchingAccounts,
  editEntryBond,
}: any) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const { userData } = useContext(authCtx);
  const [newValue, setNewValue] = useState([]);
  const { formatGram, formatReyal } = numberContext();

  const imagePreview = values?.media?.map((image) => {
    if (image instanceof File) {
      const imageURL = URL.createObjectURL(image);
      return {
        preview: imageURL,
        path: imageURL,
        type: "image",
        id: image.id || crypto.randomUUID(),
      };
    }

    return {
      preview: image.preview,
      path: image.path,
      type: image.type || "image",
      id: image.id,
    };
  });

  const indebtedGram = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.indebted_gram;
    return acc;
  }, 0);

  const creditorGram = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.creditor_gram;
    return acc;
  }, 0);

  const indebtedReyal = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.indebted_reyal;
    return acc;
  }, 0);

  const creditorReyal = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.creditor_reyal;
    return acc;
  }, 0);

  const isUnitTypeOne = Number(values?.unit_id) === 1;
  const isUnitTypeTwo = Number(values?.unit_id) === 2;

  const shouldDisable = {
    indebted_gram:
      isUnitTypeOne ||
      values?.creditor_gram !== "" ||
      values?.creditor_reyal !== "",
    creditor_gram:
      isUnitTypeOne ||
      values?.indebted_gram !== "" ||
      values?.indebted_reyal !== "",
    indebted_reyal:
      isUnitTypeTwo ||
      values?.creditor_reyal !== "" ||
      values?.creditor_gram !== "",
    creditor_reyal:
      isUnitTypeTwo ||
      values?.indebted_reyal !== "" ||
      values?.indebted_gram !== "",
  };

  const getInputClass = (disabled: boolean) =>
    `${disabled ? "bg-mainDisabled" : ""} text-center`;

  // const { data: allAccounts, isFetching } = useFetch<any[]>({
  //   endpoint: `/journalEntry/api/v1/allAccounts/${values?.branch_id}`,
  //   queryKey: ["manual_entry_accounts", values?.branch_id],
  //   enabled: !!values?.branch_id,
  // });

  // const allAccountOptions = allAccounts?.map((account) => ({
  //   id: account.id,
  //   label: `${account.name} (${account.numeric_system})`,
  //   value: account.numeric_system,
  //   unit_id: account.unit_id,
  //   type: account.type,
  // }));

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => dataSource?.map(({ item_id }) => item_id),
    [dataSource]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setDataSource((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const rerender = () => {
    const debits = dataSource.filter(isDebit);
    const credits = dataSource.filter((e) => !isDebit(e) && isCredit(e));
    const others = dataSource.filter((e) => !isDebit(e) && !isCredit(e));
    setDataSource([...debits, ...others, ...credits]);
  };

  const Cols = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => <span>{t("account name")}</span>,
        accessorKey: "account_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("gram")}</span>,
        accessorKey: "indebted_gram",
        cell: (info) => formatGram(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("reyal")} </span>,
        accessorKey: "indebted_reyal",
        cell: (info) => formatGram(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("gram")} </span>,
        accessorKey: "creditor_gram",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },

      {
        header: () => <span>{t("reyal")} </span>,
        accessorKey: "creditor_reyal",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      // {
      //   header: () => <span>{t("description")} </span>,
      //   accessorKey: "comments",
      //   cell: (info) => info.getValue() || "---",
      // },
    ],
    []
  );

  const table = useReactTable({
    data: dataSource ?? [],
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.item_id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const ColsHead = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => <span>{t("description")}</span>,
        accessorKey: "description",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 1 },
      },
      {
        header: () => <span>{t("indebted")}</span>,
        accessorKey: "indebted",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 2 },
      },
      {
        header: () => <span>{t("creditor")}</span>,
        accessorKey: "creditor",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 2 },
      },
      {
        header: () => <span>{t("")}</span>,
        accessorKey: "empty",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 3 },
      },
    ],
    []
  );

  const tableHead = useReactTable({
    data: [],
    columns: ColsHead,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totals = [
    { value: t("total"), colSpan: 1 },
    { value: indebtedGram, colSpan: 1 },
    { value: indebtedReyal, colSpan: 1 },
    { value: creditorGram, colSpan: 1 },
    { value: creditorReyal, colSpan: 1 },
    {
      value: "",
      colSpan: 3,
    },
  ];

  const entryDetails = [
    { title: "attachment number", value: values?.bond_number },
    { title: "entry date", value: formatDate(values?.date) },
    {
      title: "actual date of operation",
      value: formatDate(values?.operation_date),
    },
    { title: "entry type", value: t(values?.entry_type) },
    { title: "branch name", value: userData?.branch_name },
    { title: "employee name", value: userData?.name },
    { title: "media", value: values?.media },
    { title: "notes", value: values?.description },
  ];

  useEffect(() => {
    const best = {
      id: values?.account_id || "",
      value: values?.account_name || "",
      label: values?.account_name || `${t("account name")}`,
    };
    setNewValue(best);
  }, [values?.account_id || values?.account_name]);

  return (
    <div className="-mt-5">
      <div>
        <OuterFormLayout>
          <InnerFormLayout title={t("main data")}>
            <div className="col-span-4">
              <ul className="grid grid-cols-3 gap-y-2 list-disc">
                {entryDetails?.map((detail: any, index: number) => (
                  <li
                    key={index}
                    className={`flex gap-x-2 items-center ${
                      (detail.title === "notes" || detail.title === "media") &&
                      "col-span-3"
                    }`}
                  >
                    <strong>{t(detail.title)}:</strong>
                    {detail.title === "media" ? (
                      <>
                        {imagePreview?.length > 0 ? (
                          <MultiFilesPreview
                            preview
                            images={imagePreview || []}
                          />
                        ) : (
                          t("no items")
                        )}
                      </>
                    ) : detail.title === "notes" ? (
                      <p className="wrapText">
                        {detail?.value ? detail?.value : t("no notes")}
                      </p>
                    ) : (
                      <>{detail?.value ? detail?.value : t("no items")}</>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </InnerFormLayout>
        </OuterFormLayout>
      </div>

      <div className="">
        <h2 className="text-xl font-bold mt-5">{t("add entry")}</h2>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <table className="mt-4 min-w-[815px] lg:w-full">
            <thead className="bg-mainGreen text-white">
              {tableHead.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="py-2 px-2 w-full">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.column.columnDef.meta?.colSpan || 1}
                      className="py-4 px-2 text-sm font-semibold text-white border"
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
            <thead className="bg-[#295E5633] text-mainGreen">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="p-2 w-full">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2.5 px-2 font-semibold text-mainGreen border w-[20%]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                  <th className="font-semibold text-mainGreen border p-2">
                    {t("actions")}
                  </th>
                  <th className="font-semibold text-mainGreen border p-2">
                    {t("sort")}
                  </th>
                </tr>
              ))}
            </thead>

            <tbody className="">
              <tr className="border-b text-center table-shadow last:shadow-0">
                <td>
                  <Select
                    id="account_name"
                    name="account_name"
                    placeholder={`${t("account name")}`}
                    loading={isFetchingAccounts}
                    loadingPlaceholder={`${t("loading")}`}
                    options={allAccountOptions}
                    value={newValue}
                    onChange={(option) => {
                      setFieldValue("account_id", option?.id);
                      setFieldValue("item_id", option?.value);
                      setFieldValue("account_name", option?.label);
                      setFieldValue("type", option?.type);
                      setFieldValue("unit_id", option?.unit_id);
                      setNewValue(option);
                    }}
                    isDisabled={!!values?.isEdit}
                  />
                </td>
                <td>
                  <BaseInputField
                    placeholder={`${t("indebted")}`}
                    id="indebted_gram"
                    name="indebted_gram"
                    type="number"
                    min={0}
                    disabled={shouldDisable.indebted_gram}
                    className={getInputClass(shouldDisable.indebted_gram)}
                  />
                </td>
                <td>
                  <BaseInputField
                    placeholder={`${t("indebted")}`}
                    id="indebted_reyal"
                    name="indebted_reyal"
                    type="number"
                    min={0}
                    disabled={shouldDisable.indebted_reyal}
                    className={getInputClass(shouldDisable.indebted_reyal)}
                  />
                </td>
                <td className="border-l-2 border-l-flatWhite">
                  <BaseInputField
                    placeholder={`${t("creditor")}`}
                    id="creditor_gram"
                    name="creditor_gram"
                    type="number"
                    min={0}
                    disabled={shouldDisable.creditor_gram}
                    className={getInputClass(shouldDisable.creditor_gram)}
                  />
                </td>

                <td>
                  <BaseInputField
                    placeholder={`${t("creditor")}`}
                    id="creditor_reyal"
                    name="creditor_reyal"
                    type="number"
                    min={0}
                    disabled={shouldDisable.creditor_reyal}
                    className={getInputClass(shouldDisable.creditor_reyal)}
                  />
                </td>
                {/* <td>
                  <BaseInputField
                    placeholder={`${t("description")}`}
                    id="comments"
                    name="comments"
                    type="text"
                    className={`text-center`}
                  />
                </td> */}
                <td className="bg-lightGreen border border-[#C4C4C4] flex items-center">
                  <Button
                    action={() => {
                      setNewValue(null);
                      const {
                        bond_number,
                        entry_type,
                        branch_id,
                        branch_name,
                        date,
                        operation_date,
                        description,
                        entry_archive,
                        media,
                        isEdit,
                        ...restValues
                      } = values;

                      console.log("🚀 ~ restValues:", restValues);
                      console.log("🚀 ~ restValues:", restValues);

                      const hasNegativeValue = Object.values(restValues).some(
                        (val) => val < 0
                      );

                      const hasValue = Object.values(restValues).every(
                        (val) => !val
                      );

                      if (hasNegativeValue) {
                        notify("info", `${t("Value cannot be less than 0")}`);
                        return;
                      }

                      if (hasValue) {
                        notify("info", `${t("the data is not complete")}`);
                        return;
                      }

                      setDataSource((prev) => [restValues, ...prev]);

                      setFieldValue("isEdit", false);

                      Object.keys(restValues).forEach((key) => {
                        setFieldValue(key, "");
                      });
                    }}
                    className="bg-transparent px-2 m-auto"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </Button>
                </td>
                <td className="bg-lightGreen border border-[#C4C4C4] items-center">
                  <Button
                    action={() => rerender()}
                    className="p-2 bg-transparent"
                  >
                    <BiSortAlt2 size={20} className="text-mainGreen" />
                  </Button>
                </td>
              </tr>
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <>
                    <DraggableRow
                      key={row.original.item_id}
                      row={row}
                      dataSource={dataSource}
                      setDataSource={setDataSource}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  </>
                ))}
              </SortableContext>
            </tbody>

            {dataSource?.length > 0 && (
              <tfoot className="text-center">
                <tr className=" text-mainGreen text-center border-[1px] border-[#7B7B7B4D]">
                  {totals?.map((total, index) => (
                    <td
                      colSpan={total.colSpan}
                      key={index}
                      className={`${
                        total.error
                          ? "bg-mainRed text-white"
                          : "bg-[#295E5633] text-mainGreen"
                      }  px-2 py-2 font-bold  gap-x-2 items-center border-[1px] border-[#7B7B7B4D]`}
                    >
                      {total.error ? total.error : total.value}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </DndContext>
      </div>

      <div className="flex gap-3 justify-end my-8">
        <Button type="submit" loading={isLoading}>
          {t("save entry")}
        </Button>
      </div>
    </div>
  );
};

export default ManualEntryTableData;
