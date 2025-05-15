import { t } from "i18next";
import { BaseInput, Button } from "../../components/atoms";
import { Form, Formik } from "formik";
import {
  BaseInputField,
  DateInputField,
  Select,
  TextAreaField,
} from "../../components/molecules";
import { CiCalendarDate } from "react-icons/ci";
import { formatDate } from "../../utils/date";
import RadioGroup from "../../components/molecules/RadioGroup";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { numberContext } from "../../context/settings/number-formatter";
import { DeleteIcon, EditIcon } from "../../components/atoms/icons";
import { IoMdAdd } from "react-icons/io";
import { useFetch } from "../../hooks";

type Entry = {
  entry_number: null;
  date: Date;
  description: string;
  entry_archive: string;
  account_id: string;
  account_name: string;
  indebted_gram: string;
  creditor_gram: string;
  indebted_reyal: string;
  creditor_reyal: string;
};

const AddManualEntry = () => {
  const [dataSource, setDataSource] = useState<Entry[]>([]);
  console.log("🚀 ~ AddManualEntry ~ dataSourse:", dataSource);
  const { formatGram, formatReyal } = numberContext();

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

  const { data: allAccounts } = useFetch<any[]>({
    endpoint: "/journalEntry/api/v1/allAccounts",
    queryKey: ["manual_entry_accounts"],
  });
  console.log("🚀 ~ AddManualEntry ~ allAccounts:", allAccounts);

  const allAccountOptions = allAccounts?.map((account) => ({
    id: account.id,
    label: `${account.name} (${account.numeric_system})`,
    value: account.numeric_system,
    unit_id: account.unit_id,
    type: account.type,
  }));

  console.log("🚀 ~ allAccountOptions ~ allAccountOptions:", allAccountOptions);

  const initialValues = {
    entry_number: null,
    date: new Date(),
    description: "",
    entry_archive: "",
    id: "",
    account_name: "",
    unit_id: "",
    type: "",
    indebted_gram: "",
    creditor_gram: "",
    indebted_reyal: "",
    creditor_reyal: "",
  };

  const Cols = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => <span>{t("account name")}</span>,
        accessorKey: "account_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("indebted")}</span>,
        accessorKey: "indebted_gram",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("creditor")} </span>,
        accessorKey: "creditor_gram",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("indebted")} </span>,
        accessorKey: "indebted_reyal",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("creditor")} </span>,
        accessorKey: "creditor_reyal",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("comments")} </span>,
        accessorKey: "comments",
        cell: (info) => info.getValue() || "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: dataSource ?? [],
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const totals = [
    { value: "total" },
    { value: indebtedGram },
    { value: creditorGram },
    { value: indebtedReyal },
    { value: creditorReyal },
    { value: "" },
  ];

  const ColsHead = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => <span>{t("description")}</span>,
        accessorKey: "description",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 1 },
      },
      {
        header: () => <span>{t("gram")}</span>,
        accessorKey: "gram",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 2 },
      },
      {
        header: () => <span>{t("reyal")}</span>,
        accessorKey: "reyal",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 2 },
      },
      {
        header: () => <span>{t("")}</span>,
        accessorKey: "empty",
        cell: (info) => info.getValue() || "---",
        meta: { colSpan: 1 },
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

  const handleDeleteRow = (itemId) => {
    dataSource?.findIndex((item) => {
      return item.item_id == itemId;
    });

    const newData = dataSource?.filter((item) => {
      return item.item_id !== itemId;
    });

    setDataSource(newData);
  };

  return (
    <div className="overflow-hidden">
      <div className="relative h-full">
        <h2 className="mb-4 text-2xl font-bold">{t("manual entry")}</h2>

        <Formik
          initialValues={initialValues}
          onSubmit={(data) => {
            console.log("🚀 ~ AddManualEntry ~ data:", data);
          }}
        >
          {({ values, setFieldValue, resetForm }) => {
            console.log("🚀 ~ AddManualEntry ~ values:", values);

            const isUnitTypeOne = Number(values.unit_id) === 1;
            const isUnitTypeTwo = Number(values.unit_id) === 2;

            const shouldDisable = {
              indebted_gram:
                isUnitTypeOne ||
                values.creditor_gram !== "" ||
                values.creditor_reyal !== "",
              creditor_gram:
                isUnitTypeOne ||
                values.indebted_gram !== "" ||
                values.indebted_reyal !== "",
              indebted_reyal:
                isUnitTypeTwo ||
                values.creditor_reyal !== "" ||
                values.creditor_gram !== "",
              creditor_reyal:
                isUnitTypeTwo ||
                values.indebted_reyal !== "" ||
                values.indebted_gram !== "",
            };

            const getInputClass = (disabled: boolean) =>
              `${disabled ? "bg-mainDisabled" : ""} text-center`;

            return (
              <Form>
                <div>
                  <div className="flex items-center justify-between gap-x-5 mb-5">
                    <div>
                      <BaseInputField
                        id="entry_number"
                        name="entry_number"
                        label={`${t("entry number")}`}
                        placeholder={`${t("entry number")}`}
                        type="number"
                      />
                    </div>
                    <div>
                      <DateInputField
                        label={`${t("date")}`}
                        name="date"
                        minDate={new Date()}
                        icon={<CiCalendarDate />}
                        required
                        labelProps={{ className: "mb-2" }}
                        placeholder={`${formatDate(new Date())}`}
                      />
                    </div>
                    <div>
                      <RadioGroup name="entry_archive">
                        <div className="flex gap-x-2">
                          <label>{t("saving the entry in the archive")}</label>
                          <RadioGroup.RadioButton
                            value="yes"
                            label={`${t("yes")}`}
                            id="yes"
                          />
                          <RadioGroup.RadioButton
                            value="no"
                            label={`${t("no")}`}
                            id="no"
                          />
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div>
                    <TextAreaField
                      label={`${t("description")}`}
                      placeholder={`${t("add description")}`}
                      id="description"
                      name="description"
                      required
                    />
                  </div>
                </div>

                <table className="mt-8 min-w-[815px] lg:w-full">
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
                      <tr key={headerGroup.id} className="py-2 px-2 w-full">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="py-2.5 px-2 font-semibold text-mainGreen border w-[16.6%]"
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
                  <tbody>
                    <tr className="border-b text-center table-shadow last:shadow-0">
                      <td>
                        <Select
                          id="account_name"
                          name="account_name"
                          placeholder={`${t("account name")}`}
                          loadingPlaceholder={`${t("loading")}`}
                          options={allAccountOptions}
                          onChange={(option) => {
                            setFieldValue("id", option?.id);
                            setFieldValue("account_name", option?.label);
                            setFieldValue("type", option?.type);
                            setFieldValue("unit_id", option?.unit_id);
                          }}
                        />
                      </td>
                      <td>
                        <BaseInputField
                          placeholder={`${t("indebted")}`}
                          id="indebted_gram"
                          name="indebted_gram"
                          type="text"
                          disabled={shouldDisable.indebted_gram}
                          className={getInputClass(shouldDisable.indebted_gram)}
                        />
                      </td>
                      <td className="border-l-2 border-l-flatWhite">
                        <BaseInputField
                          placeholder={`${t("creditor")}`}
                          id="creditor_gram"
                          name="creditor_gram"
                          type="text"
                          disabled={shouldDisable.creditor_gram}
                          className={getInputClass(shouldDisable.creditor_gram)}
                        />
                      </td>
                      <td>
                        <BaseInputField
                          placeholder={`${t("indebted")}`}
                          id="indebted_reyal"
                          name="indebted_reyal"
                          type="text"
                          disabled={shouldDisable.indebted_reyal}
                          className={getInputClass(
                            shouldDisable.indebted_reyal
                          )}
                        />
                      </td>
                      <td>
                        <BaseInputField
                          placeholder={`${t("creditor")}`}
                          id="creditor_reyal"
                          name="creditor_reyal"
                          type="text"
                          disabled={shouldDisable.creditor_reyal}
                          className={getInputClass(
                            shouldDisable.creditor_reyal
                          )}
                        />
                      </td>
                      <td>
                        <BaseInputField
                          placeholder={`${t("comments")}`}
                          id="comments"
                          name="comments"
                          type="text"
                          className={`text-center`}
                        />
                      </td>
                      <td className="bg-lightGreen border border-[#C4C4C4] flex items-center">
                        <Button
                          action={() => {
                            const {
                              entry_number,
                              date,
                              description,
                              entry_archive,
                              ...restValues
                            } = values;

                            setDataSource((prev) => [values, ...prev]);

                            Object.keys(restValues).forEach((key) => {
                              setFieldValue(key, "");
                            });
                          }}
                          className="bg-transparent px-2 m-auto"
                        >
                          <IoMdAdd className="fill-mainGreen w-6 h-6" />
                        </Button>
                      </td>
                    </tr>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <tr key={row.id} className="text-center">
                          {row.getVisibleCells().map((cell, i) => (
                            <td
                              className="px-2 py-2 bg-lightGreen bg-[#295E5608] gap-x-2 items-center border border-[#C4C4C4]"
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                          <td className="bg-lightGreen p-0 border border-[#C4C4C4]">
                            <div className="flex items-center ">
                              <Button
                                action={() => {
                                  handleDeleteRow(row?.original?.item_id);
                                }}
                                className="bg-transparent px-2"
                              >
                                <EditIcon
                                  size={16}
                                  className="fill-mainGreen w-6 h-6 mb-[2px]"
                                />
                              </Button>
                              <Button
                                action={() => {
                                  handleDeleteRow(row?.original?.item_id);
                                }}
                                className="bg-transparent px-2 "
                              >
                                <DeleteIcon className="fill-[#C75C5C] w-6 h-6" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {dataSource?.length > 0 && (
                    <tfoot className="text-center">
                      <tr className=" text-mainGreen text-center border-[1px] border-[#7B7B7B4D]">
                        {totals?.map((total, index) => (
                          <td
                            key={index}
                            className="bg-[#295E5633] px-2 py-2 font-bold text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
                          >
                            {t(total.value)}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  )}
                </table>

                <div className="flex gap-3 justify-end mt-12 pb-8">
                  <Button type="submit" loading={false} action={() => {}}>
                    {t("confirm")}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddManualEntry;
