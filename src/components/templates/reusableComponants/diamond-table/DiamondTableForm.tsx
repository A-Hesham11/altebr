import { useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Field, Form, useFormikContext } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useFetch } from "../../../../hooks";
import { DeleteIcon, EditIcon } from "../../../atoms/icons";
import { BaseInputField, Select } from "../../../molecules";
import { OTableDataTypes } from "../../../supply/SupplySecondForm";
import { FirstFormInitValues_TP } from "../../../supply/formInitialValues_types";
import AddMinerals from "../../systemEstablishment/minerals/AddMinerals";
import SelectCategory from "../categories/select/SelectCategory";
import { SelectMineralKarat } from "../minerals/SelectMineralKarat";
/////////// HELPER VARIABLES & FUNCTIONS
///
type OTableFormProps_TP = {
  dirty: boolean;
  setDirty: Dispatch<SetStateAction<boolean>>;
  editRow: boolean;
  categoriesOptions: never[];
  karatsOptions: never[];
  data: OTableDataTypes[];
  setBoxValues: Dispatch<SetStateAction<OTableDataTypes[]>>;
  setData: Dispatch<SetStateAction<OTableDataTypes[]>>;
  formValues: FirstFormInitValues_TP | undefined;
  editData: OTableDataTypes;
  setEditRow: Dispatch<SetStateAction<boolean>>;
  setEditData: Dispatch<SetStateAction<OTableDataTypes>>;
};

export type KaratValues_TP = {
  id: number;
  karat: string;
  value: string;
};

///
export const DiamondTableForm = ({
  dirty,
  setDirty,
  editRow,
  categoriesOptions,
  karatsOptions,
  data,
  setBoxValues,
  setData,
  formValues,
  editData,
  setEditRow,
  setEditData,
}: OTableFormProps_TP) => {
  const { formatGram, formatReyal } = numberContext();
  let { enableReinitialize, resetForm, values, setFieldValue, submitForm } =
    useFormikContext<any>();
  const { currency, factorial } = formValues;
  const factorialValue = currency === "other_currency" ? +factorial : 1;
  useEffect(() => {
    if (
      values.category_id !== "" ||
      values.mineral_id !== "" ||
      values.karatmineral_id !== "" ||
      values.gold_weight !== "" ||
      values.diamond_value_ryal !== "" ||
      values.diamond_amount !== "" ||
      values.diamond_stone_weight !== "" ||
      values.other_stones_weight !== ""
    ) {
      setDirty(true);
    } else {
      setDirty(false);
    }
  }, [
    values.stock,
    values.weight,
    values.category_id,
    values.mineral_id,
    values.gold_weight,
    values.diamond_value_ryal,
    values.diamond_amount,
    values.diamond_stone_weight,
    values.other_stones_weight,
  ]);

  const columnHelper = createColumnHelper<any>();
  const columns: any = [
    columnHelper.accessor("number", {
      cell: (info) => `${info.row.index + 1}`,
      header: () => `${t("#")}`,
    }),
    columnHelper.accessor("category_value", {
      header: () => `${t("categories")}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("mineral_value", {
      header: () => `${t("mineral type")}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("karat_value", {
      header: () => `${t("karats")}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("gold_weight", {
      header: () => `${t("mineral weight")}`,
      cell: (info) => formatGram(info.getValue()),
    }),
    columnHelper.accessor("diamond_value", {
      header: `${t("diamond value")}`,
      cell: (info) => formatReyal(info.getValue()),
    }),
    columnHelper.accessor("diamond_value_ryal", {
      header: `${t("diamond value ryal")}`,
      cell: (info) => formatReyal(info.getValue()),
    }),
    columnHelper.accessor("diamond_amount", {
      header: `${t("diamond amount")}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("diamond_stone_weight", {
      header: `${t("diamond stone weight")}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("other_stones_weight", {
      header: `${t("other stones weight")}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("weight", {
      header: () => `${t("weight")}`,
      cell: (info) =>
        formatGram(
          Number(info.row.original.diamond_stone_weight) / 5 +
            Number(info.row.original.other_stones_weight) / 5 +
            Number(info.row.original.gold_weight)
        ),
    }),
    columnHelper.accessor("diamond_tax", {
      header: `${t("added tax")}`,
      cell: (info) => formatReyal(info.row.original.diamond_value_ryal * 0.15),
    }),
    columnHelper.accessor("actions", {
      header: `${t("actions")}`,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { data: karatValues } = useFetch<KaratValues_TP[]>({
    endpoint: "classification/api/v1/allkarats",
    queryKey: ["karat_bond_select"],
  });

  // functions
  function deleteRowHandler(id: string) {
    setData((prev: OTableDataTypes[]) => prev.filter((row) => row.id !== id));
    setBoxValues((prev: OTableDataTypes[]) =>
      prev.filter((row) => row.id !== id)
    );
  }

  function editRowHandler(row: OTableDataTypes, id: string) {
    setEditData(row);
  }
  //side effects
  useEffect(() => {
    if (karatValues) {
      setFieldValue(
        "stock",
        karatValues
          .find((item) => item.karat === values.karat_value)
          ?.value.replace(/\.?0+$/, "")
      );
    }
  }, [values.karat_id]);

  /// get options from cache
  const queryClient = useQueryClient();

  // minerals options
  const minerals = queryClient.getQueryData(["minerals"]);
  const mineralsOptions =
    (minerals &&
      minerals?.map((option) => ({
        id: option.id,
        value: option.name_ar,
        label: option.name_ar,
      }))) ||
    [];
  // categories options
  const categories = queryClient.getQueryData(["categories_all"]);

  // const categoriesOptionsCache = categories && categories.filter(item=>!item.items)?.map(option => ({
  //   id: option.id,
  //   value: option.name,
  //   label: option.name,
  // })) || []

  const categoriesOptionsCache =
    (categories &&
      categories
        .filter((item) => !item.items && item.selling_type !== "all")
        ?.map((option) => ({
          id: option.id,
          value: option.name,
          label: option.name,
        }))) ||
    [];

  const {
    data: karats,
    isLoading: karatLoading,
    isError: karatError,
    isFetching,
    refetch,
  } = useFetch({
    endpoint: `classification/api/v1/karat_minerals/${values?.mineral_id}`,
    queryKey: ["minerals_karat"],
    select: (karats) => {
      return karats.map((item) => ({
        value: item.karatmineral,
        label: `${item.karatmineral}`,
        equivalent: item.value,
        name: item?.mineral,
        id: item.id,
      }));
    },
  });

  useEffect(() => {
    refetch();
  }, [values?.mineral_id]);

  return (
    <>
      <Form>
        <table className="mt-8 border-mainGreen mb-2">
          <thead className="bg-mainGreen text-white ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="">
                {headerGroup.headers.map((header, i) => {
                  if (i === 1) {
                    return (
                      <th
                        key={header.id}
                        className="p-4 border-l-2 border-l-lightGreen"
                        style={{ minWidth: "170px" }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  } else if (i === 3) {
                    return (
                      <th
                        key={header.id}
                        className="p-4 border-l-2 border-l-lightGreen"
                        style={{ minWidth: "130px" }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={header.id}
                        className="p-2 border-l-2 border-l-lightGreen text-sm"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  }
                })}
              </tr>
            ))}
          </thead>

          <tbody className="bg-lightGray">
            {editRow ? (
              <tr>
                <td className="text-center">
                  {table.getRowModel().rows.length}
                </td>
                <td>
                  <Select
                    options={
                      categoriesOptions.length
                        ? categoriesOptions
                        : categoriesOptionsCache
                    }
                    id="category"
                    noMb={true}
                    placement="top"
                    name="category_id"
                    placeholder={`${t("categories")}`}
                    value={{
                      value: values.category_value || editData.category_value,
                      label:
                        values.category_value ||
                        editData.category_value ||
                        t("categories"),
                      id: values.category_id || values.category_id,
                    }}
                    onChange={(option: any) => {
                      setFieldValue("category_id", option!.id);
                      setFieldValue("category_value", option!.value);
                    }}
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "150px" }}
                >
                  <Select
                    id="mineral"
                    name="mineral_id"
                    placeholder={`${t("المعدن")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={mineralsOptions}
                    fieldKey="id"
                    value={{
                      value: values.mineral_value || editData.mineral_value,
                      label:
                        values.mineral_value ||
                        editData.mineral_value ||
                        t("mineral"),
                      id: values.mineral_id || values.mineral_id,
                    }}
                    onChange={(option) => {
                      setFieldValue("mineral_id", option.id);
                      setFieldValue("mineral_value", option.label);
                    }}
                    creatable
                    //@ts-ignore
                    CreateComponent={AddMinerals}
                  />
                </td>
                <td>
                  <Select
                    id="mineral"
                    name="karatmineral_id"
                    placeholder={`${t("المعدن")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={karats}
                    fieldKey="id"
                    loading={isFetching}
                    isDisabled={karats?.length === 0}
                    value={{
                      value: values.karat_value || editData.karat_value,
                      label:
                        values.karat_value ||
                        editData.karat_value ||
                        t("mineral karat"),
                      id: values.mineral_id || values.mineral_id,
                    }}
                    onChange={(option) => {
                      setFieldValue("karat_value", option.label);
                    }}
                  />
                </td>
                <td>
                  <Field
                    id="gold_weight"
                    name="gold_weight"
                    type="number"
                    value={values.gold_weight || editData.gold_weight}
                    onChange={(e: any) => {
                      setFieldValue("gold_weight", e.target.value);
                    }}
                    className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                  />
                </td>
                <td>
                  <Field
                    id="diamond_value"
                    name="diamond_value"
                    type="number"
                    value={values.diamond_value || editData.diamond_value}
                    onChange={(e: any) => {
                      setFieldValue("diamond_value", e.target.value);
                    }}
                    className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                  />
                </td>
                <td>
                  <Field
                    id="diamond_value_ryal"
                    name="diamond_value_ryal"
                    type="number"
                    value={
                      values.diamond_value * factorialValue ||
                      editData.diamond_value * factorialValue
                    }
                    className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                  />
                </td>
                <td>
                  <Field
                    id="diamond_amount"
                    name="diamond_amount"
                    type="number"
                    value={values.diamond_amount || editData.diamond_amount}
                    onChange={(e: any) => {
                      setFieldValue("diamond_amount", e.target.value);
                    }}
                    className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                  />
                </td>
                <td>
                  <Field
                    id="diamond_stone_weight"
                    name="diamond_stone_weight"
                    type="number"
                    value={
                      values.diamond_stone_weight ||
                      editData.diamond_stone_weight
                    }
                    onChange={(e: any) => {
                      setFieldValue("diamond_stone_weight", e.target.value);
                    }}
                    className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                  />
                </td>
                <td>
                  <Field
                    id="other_stones_weight"
                    name="other_stones_weight"
                    type="number"
                    value={
                      values.other_stones_weight || editData.other_stones_weight
                    }
                    onChange={(e: any) => {
                      setFieldValue("other_stones_weight", e.target.value);
                    }}
                    className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td className="text-center border-l-2 border-l-flatWhite">
                  {table.getRowModel().rows.length + 1}
                </td>
                <td className="border-l-2 border-l-flatWhite">
                  <SelectCategory
                    name="category_id"
                    // noMb={true}
                    placement="top"
                    onChange={(option) => {
                      setFieldValue("category_value", option!.value);
                    }}
                    all={true}
                    value={{
                      value: values.category_value || editData.category_value,
                      label:
                        values.category_value ||
                        editData.category_value ||
                        t("categories"),
                      id: values.category_id || values.category_id,
                    }}
                    showItemsDiamond={true}
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "150px" }}
                >
                  <SelectMineralKarat
                    showLabel={false}
                    showMineral
                    showMineralKarat={false}
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "150px" }}
                >
                  <SelectMineralKarat
                    showLabel={false}
                    showMineral={false}
                    showMineralKarat
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "70px" }}
                >
                  <BaseInputField
                    id="gold_weight"
                    name="gold_weight"
                    type="number"
                    noMb={true}
                  />
                </td>
                {/* <td className="border-l-2 border-l-flatWhite">
                  <BaseInputField id="stock" name="stock" type="number" />
                </td> */}
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "100px" }}
                >
                  <BaseInputField
                    id="diamond_value"
                    name="diamond_value"
                    type="number"
                    noMb={true}
                    onChange={(e) =>
                      setFieldValue(
                        "diamond_value_ryal",
                        e.target.value * factorialValue
                      )
                    }
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "100px" }}
                >
                  <BaseInputField
                    id="diamond_value_ryal"
                    disabled
                    className="bg-mainGray"
                    name="diamond_value_ryal"
                    type="number"
                    noMb={true}
                    value={values.diamond_value * factorialValue}
                  />
                </td>
                <td
                  className="border-l-2  border-l-flatWhite"
                  style={{ minWidth: "70px" }}
                >
                  <BaseInputField
                    id="diamond_amount"
                    name="diamond_amount"
                    type="number"
                    noMb={true}
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "70px" }}
                >
                  <BaseInputField
                    id="diamond_stone_weight"
                    name="diamond_stone_weight"
                    type="number"
                    noMb={true}
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "70px" }}
                >
                  <BaseInputField
                    id="other_stones_weight"
                    name="other_stones_weight"
                    type="number"
                    noMb={true}
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "70px" }}
                >
                  <Field
                    id="weight"
                    name="weight"
                    value={formatGram(
                      Number(values.diamond_stone_weight) / 5 +
                        Number(values.other_stones_weight) / 5 +
                        Number(values.gold_weight)
                    )}
                    className="border-none bg-inherit outline-none cursor-default caret-transparent text-center w-full"
                  />
                </td>
                <td
                  className="border-l-2 border-l-flatWhite"
                  style={{ minWidth: "70px" }}
                >
                  <Field
                    id="diamond_tax"
                    name="diamond_tax"
                    value={formatReyal(
                      Number(values.diamond_value_ryal) * 0.15
                    )}
                    className="border-none bg-inherit outline-none cursor-default caret-transparent text-center w-full"
                  />
                </td>
                <td>
                  {!editRow && (
                    <div className="flex">
                      <AiOutlinePlus
                        className="cursor-pointer text-lg font-bold rounded-md mx-auto w-[30px] h-[30px] active:shadow-none active:w-[28px]"
                        onClick={submitForm}
                      />
                      {dirty && (
                        <DeleteIcon
                          className="cursor-pointer rounded-md mx-auto w-[30px] h-[30px] active:shadow-none active:w-[28px]"
                          action={() => {
                            Object.keys(values).forEach((key) =>
                              setFieldValue(key, "")
                            );
                          }}
                        />
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`${
                  editRow && editData.id !== row.original.id
                    ? "hidden cursor-not-allowed pointer-events-none"
                    : "border-b-2 border-b-flatWhite"
                }`}
              >
                {row.getVisibleCells().map((cell, i) => {
                  return i + 1 !== row.getVisibleCells().length ? (
                    <td
                      key={cell.id}
                      className="border-l-2 px-6 py-4 whitespace-nowrap border-l-flatWhite text-center bg-lightGray"
                      style={{
                        minWidth: "max-content",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ) : (
                    <td className="flex px-6 py-5 bg-lightGreen gap-x-2 items-center">
                      {!editRow && (
                        <DeleteIcon
                          action={() => deleteRowHandler(row.original.id)}
                        />
                      )}
                      {editRow && editData.id === row.original.id ? (
                        <button
                          type="submit"
                          className="relative active:top-[1px] py-2 px-2 font-bold rounded-md border-mainGreen border-2"
                          onClick={() => {
                            setEditRow(false);
                            const index = data.findIndex(
                              (item) => item.id === row.original.id
                            );
                            const updatedData = [...data];
                            updatedData[index] = {
                              ...editData,
                              category_value:
                                values.category_value ||
                                editData.category_value,
                              weight: values.weight || editData.weight,
                              gold_weight:
                                values.gold_weight || editData.gold_weight,
                              karat_value:
                                values.karat_value || editData.karat_value,
                              mineral_id:
                                values.mineral_id || editData.mineral_id,
                              mineral_value:
                                values.mineral_value || editData.mineral_value,
                              stock: values.stock || editData.stock,
                              diamond_value:
                                values.diamond_value || editData.diamond_value,
                              diamond_value_ryal:
                                values.diamond_value * factorialValue ||
                                editData.diamond_value * factorialValue,
                              diamond_amount:
                                values.diamond_amount ||
                                editData.diamond_amount,
                              diamond_stone_weight:
                                values.diamond_stone_weight ||
                                editData.diamond_stone_weight,
                              other_stones_weight:
                                values.other_stones_weight ||
                                editData.other_stones_weight,
                              diamond_tax:
                                values.diamond_tax || editData.diamond_tax,
                            };
                            setData(updatedData);
                            setBoxValues(updatedData);
                            resetForm();
                            //resetting select field values
                            editData.karat_value = "";
                            editData.category_value = "";
                          }}
                        >
                          {t("edit")}
                        </button>
                      ) : (
                        <EditIcon
                          action={() => {
                            editRowHandler(row.original, row.original.id);
                            enableReinitialize = true;
                            setEditRow(true);
                            resetForm();
                          }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        </table>
      </Form>
    </>
  );
};
