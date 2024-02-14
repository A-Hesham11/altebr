import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Form, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useFetch } from "../../../../hooks";
import { KaratValues_TP } from "../../../../types";
import { notify } from "../../../../utils/toast";
import { Button, Spinner } from "../../../atoms";
import { BaseInputField, Modal } from "../../../molecules";
import SelectCategory from "../../../templates/reusableComponants/categories/select/SelectCategory";
import SelectClassification from "../../../templates/reusableComponants/classifications/select/SelectClassification";
import { Selling_TP } from "../../../../pages/selling/PaymentSellingPage";
import SelectKarat from "../../../templates/reusableComponants/karats/select/SelectKarat";
import { DeleteIcon, EditIcon } from "../../../atoms/icons";
import { Header } from "../../../atoms/Header";
import SellingTableInputWeight from "./SellingTableInputWeight";
import { HiViewGridAdd } from "react-icons/hi";

type SellingTableInputData_TP = {
  dataSource: Selling_TP;
  sellingItemsData: Selling_TP;
  setDataSource: any;
  setSellingItemsData: any;
  setClientData: any;
  rowsData: Selling_TP;
  selectedItemDetails: any;
  setSelectedItemDetails: any;
  sellingItemsOfWeigth: any;
  setSellingItemsOfWeight: any;
};

export const SellingTableInputData = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
  selectedItemDetails,
  setSelectedItemDetails,
  sellingItemsOfWeigth,
  setSellingItemsOfWeight,
}: SellingTableInputData_TP) => {
  console.log("🚀 ~ dataSource:", dataSource);

  const [search, setSearch] = useState("");
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openSelsal, setOpenSelsal] = useState<boolean>(false);
  const [kitDetails, setKitDetails] = useState([]);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);
  const [page, setPage] = useState<number>(1);
  const { formatGram, formatReyal } = numberContext();
  const [editSellingTaklfa, setEditSellingTaklfa] = useState("");
  const [editSellingTaklfaAfterTax, setEditSellingTaklfaAfterTax] =
    useState("");

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const TaxRateOfBranch = dataSource && dataSource[0]?.tax_rate / 100;
  console.log("🚀 ~ TaxRateOfBranch:", TaxRateOfBranch);

  const priceWithCommissionRate =
    dataSource &&
    +dataSource[0]?.cost * (+dataSource[0]?.min_selling * 0.01) +
      +dataSource[0]?.cost;

  const priceWithCommissionCash =
    dataSource && +dataSource[0]?.cost + +dataSource[0]?.min_selling;

  const priceWithSellingPolicy =
    dataSource && dataSource[0]?.min_selling_type === "نسبة"
      ? priceWithCommissionRate
      : priceWithCommissionCash;

  const taklfaAfterTax =
    priceWithSellingPolicy * TaxRateOfBranch + priceWithSellingPolicy;

  const { values, setFieldValue } = useFormikContext<any>();

  const { refetch, isSuccess, isFetching, isRefetching, isLoading } = useFetch({
    queryKey: ["branch-all-accepted-selling"],
    endpoint:
      search === ""
        ? `/branchManage/api/v1/all-accepted/${userData?.branch_id}`
        : `${search}`,
    onSuccess: (data) => {
      setDataSource(data);
    },
  });

  const { data: karatValues } = useFetch<KaratValues_TP[]>({
    endpoint: "classification/api/v1/allkarats",
    queryKey: ["karats_select"],
  });

  const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "hwya",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("category")}</span>,
        accessorKey: "classification_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) =>
          info.row.original.selsal.length === 0
            ? info.getValue()
            : `${info.getValue()} مع سلسال`,
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("remaining weight")} </span>,
        accessorKey: "remaining_weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) =>
          info.row.original.classification_id === 1
            ? formatReyal(Number(info.getValue()))
            : formatGram(Number(info.row.original.karatmineral_name)),
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("selling price")} </span>,
        accessorKey: "taklfa",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("selling price after tax")} </span>,
        accessorKey: "taklfa_after_tax",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
    ],
    []
  );

  useEffect(() => {
    if (dataSource?.length) {
      setKitDetails(dataSource?.find((item) => item.weightitems)?.weightitems);
    }
  }, [dataSource]);

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => "#",
        accessorKey: "action",
        cell: (info: any) => {
          return (
            <div className="flex items-center justify-center gap-4">
              <input
                type="checkbox"
                className={`border-mainGreen text-mainGreen rounded bg-red-600' ${
                  info.row.original.status && "bg-neutral-400"
                }`}
                id={info.row.original.id}
                name="selectedItem"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItemDetails((prev) => [
                      ...prev,
                      { ...info.row.original, index: info.row.index },
                    ]);
                  } else {
                    setSelectedItemDetails((prev) =>
                      prev.filter((item) => item.index !== info.row.index)
                    );
                  }
                }}
                disabled={info.row.original.status}
              />
            </div>
          );
        },
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("cost")}</span>,
        accessorKey: "selling_price",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: sellingItemsData,
    columns: sellingCols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tablePopup = useReactTable({
    data: kitDetails,
    columns: Cols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteRow = (itemId) => {
    sellingItemsData?.findIndex((item) => {
      return item.item_id == itemId;
    });

    const newData = sellingItemsData?.filter((item) => {
      return item.item_id !== itemId;
    });

    setSellingItemsData(newData);
  };

  useEffect(() => {
    const { client_id, bond_date, client_value, client_name, ...restValues } =
      values;
    Object.keys(restValues).map((key) => {
      if (dataSource?.length === 1) {
        setFieldValue(key, dataSource[0][key]);

        setFieldValue("cost", dataSource[0]?.cost?.toFixed(2));

        setFieldValue("weight", dataSource[0]?.remaining_weight);

        if (values.classification_id === 1) {
          setFieldValue("karat_name", dataSource[0]?.karat_name);
        } else {
          setFieldValue("karatmineral_name", dataSource[0]?.karatmineral_name);
        }

        setFieldValue("taklfa", priceWithSellingPolicy?.toFixed(2));
        setFieldValue(
          "taklfa_after_tax",
          (
            priceWithSellingPolicy * TaxRateOfBranch +
            priceWithSellingPolicy
          ).toFixed(2)
        );
      }
    });
  }, [dataSource, search]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue.slice(0, 4) === "0000") {
      setIsCategoryDisabled(true);
    } else {
      setIsCategoryDisabled(false);
    }
  };

  const handleAddItemsToSelling = () => {
    const { client_id, bond_date, client_value, client_name, ...restValues } =
      values;
    Object.keys(restValues).forEach((key) => {
      setFieldValue(key, "");
    });
    setFieldValue("taklfa_after_tax", "");
  };

  const getSearchResults = async (hwya: any) => {
    let uri = `branchManage/api/v1/all-accepted/${userData?.branch_id}`;
    let first = false;
    Object.keys(hwya).forEach((key) => {
      if (hwya[key] !== "") {
        if (first) {
          uri += `&${key}[eq]=${hwya[key]}`;
          first = false;
        } else {
          uri += `?${key}[eq]=${hwya[key]}`;
        }
      }
    });
    setSearch(uri);
  };

  useEffect(() => {
    refetch();
  }, [search]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    setEditSellingTaklfa(+values?.taklfa);
  }, [values?.weight, priceWithSellingPolicy]);

  useEffect(() => {
    setEditSellingTaklfaAfterTax(+values?.taklfa_after_tax);
  }, [values?.weight, priceWithSellingPolicy]);

  return (
    <Form className="overflow-y-auto">
      <p className="font-semibold text-center text-lg text-mainGreen">
        {isRefetching ||
          (isFetching && (
            <div className="flex items-center justify-center gap-3">
              {t("loading data")}
              <Spinner />
            </div>
          ))}
      </p>
      <table className="mt-8 min-w-[815px] lg:w-full">
        <thead className="bg-mainGreen text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="py-4 px-2 w-full">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-4 px-2 text-sm font-medium text-white border w-[11%]"
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
              <BaseInputField
                placeholder={`${t("piece number")}`}
                id="hwya"
                name="hwya"
                type="text"
                onChange={(e) => {
                  setFieldValue("hwya", e.target.value);
                  getSearchResults({ hwya: e.target.value });
                  handleInputChange(e);
                }}
                className={`${!isSuccess && "bg-mainDisabled"} text-center`}
                disabled={!isSuccess}
              />
            </td>
            <td>
              {!isCategoryDisabled ? (
                <BaseInputField
                  placeholder={`${t("category")}`}
                  id="classification_name"
                  name="classification_name"
                  type="text"
                  value={values?.classification_name}
                  onChange={(e) => {
                    setFieldValue(
                      "classification_name",
                      values.classification_name
                    );
                  }}
                  disabled={!isCategoryDisabled}
                  className={`${
                    !isCategoryDisabled && "bg-mainDisabled"
                  } text-center`}
                />
              ) : (
                <SelectClassification field="value" name="classification_id" />
              )}
            </td>
            <td className="border-l-2 border-l-flatWhite">
              <SelectCategory
                name="category_name"
                noMb={true}
                placement="top"
                all={true}
                value={{
                  value: values?.category_id,
                  label: values?.category_name || t("classification"),
                  id: values?.category_id,
                }}
                onChange={(option) => {
                  setFieldValue("category_name", option!.value);
                }}
                showItems={true}
                // disabled={!String(values.item_id).startsWith('0000')}
                disabled={!isCategoryDisabled}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("weight")}`}
                id="weight"
                name="weight"
                type="text"
                required
                onChange={(e) => {
                  const remainingWeight =
                    +dataSource[0]?.remaining_weight - +e.target.value;

                  const costItem =
                    (+values.karat_price + +values.wage) * +e.target.value;

                  const priceWithCommissionRate =
                    +costItem * (+values?.min_selling * 0.01) + +costItem;
                  const priceWithCommissionCash =
                    +costItem + +values?.min_selling;

                  const priceWithSellingPolicy =
                    values?.min_selling_type === "نسبة"
                      ? priceWithCommissionRate
                      : priceWithCommissionCash;

                  const taklfaAfterTax =
                    priceWithSellingPolicy * TaxRateOfBranch +
                    priceWithSellingPolicy;

                  if (+e.target.value > +dataSource[0]?.weight) {
                    notify("error", "تجميعة الأوزان اكثر من الوزن المتبقي");
                  } else {
                    setFieldValue("remaining_weight", +remainingWeight);

                    setFieldValue("cost", +costItem.toFixed(3));

                    setFieldValue("taklfa", +priceWithSellingPolicy.toFixed(3));

                    setFieldValue(
                      "taklfa_after_tax",
                      +taklfaAfterTax.toFixed(3)
                    );

                    setOpenDetails(false);
                  }
                }}
                className={`${
                  (!isSuccess ||
                    values.category_selling_type !== "all" ||
                    values?.weight === 0) &&
                  "bg-mainDisabled"
                } text-center`}
                disabled={
                  !isSuccess ||
                  values.category_selling_type !== "all" ||
                  values?.weight === 0
                }
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("remaining weight")}`}
                id="remaining_weight"
                name="remaining_weight"
                type="text"
                disabled={!isCategoryDisabled}
                className={`${
                  !isCategoryDisabled && "bg-mainDisabled"
                } text-center`}
              />
            </td>
            <td className="border-l-2 border-l-flatWhite">
              <SelectKarat
                field="id"
                name={
                  values.classification_id === 1
                    ? "karat_name"
                    : "karatmineral_name"
                }
                noMb={true}
                placement="top"
                onChange={(option) => {
                  setFieldValue(
                    "karat_name" || "karatmineral_name",
                    option!.value
                  );
                  setFieldValue(
                    "stock",
                    karatValues!.find(
                      (item) => item.karat === values.karat_value
                    )?.value
                  );
                }}
                value={{
                  id:
                    values.karat_id !== 0
                      ? values.karat_id
                      : values.karatmineral_id,
                  value:
                    values.karat_id !== 0
                      ? values.karat_id
                      : values.karatmineral_id,
                  label:
                    values.karat_name ||
                    values.karatmineral_name ||
                    t("karat value"),
                }}
                disabled={!isCategoryDisabled}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("cost")}`}
                id="cost"
                name="cost"
                type="text"
                onChange={(e) => {
                  setFieldValue("cost", values.value.toFixed(2));
                }}
                disabled={!isCategoryDisabled}
                className={`${
                  !isCategoryDisabled && "bg-mainDisabled"
                } text-center`}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("selling price")}`}
                id="taklfa"
                name="taklfa"
                type="text"
                required
                onChange={(e) => {
                  setFieldValue("taklfa", (+values?.taklfa).toFixed(2));
                  setFieldValue(
                    "taklfa_after_tax",
                    (
                      +e.target.value * TaxRateOfBranch +
                      +e.target.value
                    ).toFixed(2)
                  );
                }}
                className={`${
                  !isSuccess || userData?.include_tax === "1"
                    ? "bg-mainDisabled"
                    : values?.taklfa && +values?.taklfa < +editSellingTaklfa
                    ? "bg-red-100"
                    : ""
                } text-center`}
                disabled={!isSuccess || userData?.include_tax === "1"}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("selling price after tax")}`}
                id="taklfa_after_tax"
                name="taklfa_after_tax"
                type="text"
                required
                onChange={(e) => {
                  setFieldValue("taklfa", (+e.target.value / 1.15).toFixed(2));
                }}
                disabled={userData?.include_tax === "0"}
                className={`${
                  !isSuccess || userData?.include_tax === "0"
                    ? "bg-mainDisabled"
                    : values?.taklfa_after_tax &&
                      +values?.taklfa_after_tax < +editSellingTaklfaAfterTax
                    ? "bg-red-100"
                    : ""
                } text-center`}
              />
            </td>
            <td className="bg-lightGreen border border-[#C4C4C4] flex items-center">
              {dataSource?.length == 1 &&
                dataSource[0]?.category_type === "multi" && (
                  <Button
                    loading={values.hwya && isFetching}
                    action={() => {
                      if ((values.hwya && values.classification_id) === "") {
                        notify("info", `${t("add piece first")}`);
                        return;
                      }

                      const pieceCheck = sellingItemsData?.findIndex((item) => {
                        return item.hwya == values.hwya;
                      });

                      if (pieceCheck !== -1) {
                        notify("info", `${t("item exists")}`);
                        return;
                      }

                      setOpenDetails(true);
                    }}
                    className="bg-transparent px-2"
                  >
                    <EditIcon className="fill-mainGreen w-6 h-6" />
                  </Button>
                )}
              {dataSource?.length == 1 && dataSource[0]?.has_selsal === 1 && (
                <Button
                  loading={values.hwya && isFetching}
                  action={() => {
                    setOpenSelsal(true);
                  }}
                  type="button"
                  className="bg-transparent px-2"
                >
                  <HiViewGridAdd className="fill-mainGreen w-6 h-6" />
                </Button>
              )}
              <Button
                loading={values.hwya && isFetching}
                action={() => {
                  if ((values.hwya && values.classification_id) === "") {
                    notify("info", `${t("add piece first")}`);
                    return;
                  }

                  const pieceCheck = sellingItemsData?.findIndex((item) => {
                    return item.hwya == values.hwya;
                  });

                  if (pieceCheck !== -1) {
                    notify("info", `${t("item exists")}`);
                    return;
                  }

                  if (values.weight == 0) {
                    notify("info", `${t("The lot is sold out")}`);
                    return;
                  }

                  if (!selectedItemDetails.length) {
                    const kitAllDetails = kitDetails.filter(
                      (item) => item.status !== 1
                    );

                    selectedItemDetails.push(kitAllDetails);
                  }

                  if (+values?.taklfa < +editSellingTaklfa) {
                    notify(
                      "info",
                      `${t(
                        "The selling price may not be less than the minimum"
                      )}`
                    );
                    return;
                  }

                  const weight_percentage = +values.remaining_weight * 0.05;

                  const stone_weight_percentage =
                    dataSource && values.classification_id === 1
                      ? dataSource[0]?.detailsItem[0]?.stonesDetails[0]?.weight
                      : dataSource[0]?.detailsItem[0]?.stonesDetails[0]
                          ?.diamondWeight;

                  const stoneWeitgh =
                    values.classification_id === (2 || 3) ||
                    +stone_weight_percentage > +weight_percentage
                      ? +stone_weight_percentage
                      : "v";

                  setSellingItemsData((prev) =>
                    [
                      ...prev,
                      {
                        ...values,
                        itemDetails: selectedItemDetails.flat(Infinity),
                        selsal: sellingItemsOfWeigth,
                        stone_weight: +stoneWeitgh,
                      },
                    ].reverse()
                  );

                  handleAddItemsToSelling();
                  setDataSource([]);
                  setSearch("");
                  setSelectedItemDetails([]);
                  setSellingItemsOfWeight([]);
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="bg-lightGreen p-0 border border-[#C4C4C4]">
                  <div className="flex items-center ">
                    <Button
                      action={() => {
                        const {
                          client_id,
                          bond_date,
                          client_value,
                          ...restValues
                        } = values;
                        Object.keys(restValues).map((key) => {
                          setFieldValue(key, row?.original[key]);
                        });
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
                        setSelectedItemDetails([]);
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
      </table>

      <Modal isOpen={openDetails} onClose={() => setOpenDetails(false)}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Header header={t("kit details")} />
          {dataSource &&
          dataSource[0]?.weightitems.find(
            (itemWeight) => itemWeight.weight == 0
          ) ? (
            <>
              <div className="bg-flatWhite rounded-lg bill-shadow p-5 my-3 w-full">
                <div className="flex items-center justify-between py-4">
                  {dataSource[0]?.weightitems?.map((item) => {
                    return (
                      <BaseInputField
                        placeholder={item?.category_name}
                        id={item?.category_name}
                        name={item?.category_name}
                        type="text"
                        label={item?.category_name}
                        disabled={item.weight != 0}
                        className={`${item.weight != 0 && "bg-mainDisabled"}`}
                        onChange={(e) => {
                          setSelectedItemDetails((prev: any) => {
                            const index = prev.findIndex(
                              (prevItem) =>
                                item?.category_id === prevItem?.category_id
                            );
                            const updatedState = [...prev];

                            if (index !== -1) {
                              updatedState[index] = {
                                category_id: item.category_id,
                                category_name: item.category_name,
                                weight: e.target.value,
                              };
                            } else {
                              updatedState.push({
                                category_id: item.category_id,
                                category_name: item.category_name,
                                weight: e.target.value,
                              });
                            }

                            return updatedState;
                          });

                          setFieldValue(`weightitems-${item.category_name}`, {
                            category_id: item.category_id,
                            category_name: item.category_name,
                            weight: e.target.value,
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <table className="mt-8 w-[815px] lg:w-full">
                <thead className="bg-mainGreen text-white text-center">
                  {tablePopup.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="py-4 px-2 w-full">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="py-4 px-2 text-sm font-medium text-white border w-[11%]"
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
                  {tablePopup.getRowModel().rows.map((row) => {
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
          <div className="flex gap-4 justify-end items-center w-full">
            <Button
              type="submit"
              action={() => {
                const clacSelectedWeight = selectedItemDetails.reduce(
                  (acc, item) => {
                    acc += +item.weight;
                    return acc;
                  },
                  0
                );

                const clacSelectedCost = selectedItemDetails.reduce(
                  (acc, item) => {
                    acc += +item.selling_price;
                    return acc;
                  },
                  0
                );

                const remainingWeight =
                  +values?.remaining_weight - +clacSelectedWeight;

                const costItem =
                  values.classification_id === 1
                    ? (+values.karat_price + +values.wage) * clacSelectedWeight
                    : +clacSelectedCost;

                const priceWithCommissionRate =
                  +costItem * (+values?.min_selling * 0.01) + +costItem;
                const priceWithCommissionCash =
                  +costItem + +values?.min_selling;

                const priceWithSellingPolicy =
                  values?.min_selling_type === "نسبة"
                    ? priceWithCommissionRate
                    : priceWithCommissionCash;

                const taklfaAfterTax =
                  priceWithSellingPolicy * TaxRateOfBranch +
                  priceWithSellingPolicy;

                const checkedFromWeight = selectedItemDetails?.every(
                  (item) => item.weight !== ""
                );

                const checkedFromPeiceisLength =
                  selectedItemDetails.length ==
                  dataSource[0].weightitems.length;

                if (+clacSelectedWeight > +dataSource[0]?.remaining_weight) {
                  notify("error", "تجميعة الأوزان اكثر من الوزن المتبقي");
                } else if (
                  checkedFromWeight &&
                  checkedFromPeiceisLength &&
                  +clacSelectedWeight < +remainingWeight
                ) {
                  notify("error", "تجميعة الأوزان أقل من الوزن المتبقي");
                } else {
                  setFieldValue("taklfa", priceWithSellingPolicy);

                  setFieldValue("taklfa_after_tax", +taklfaAfterTax);

                  setFieldValue("remaining_weight", remainingWeight);

                  setFieldValue("cost", costItem);

                  setFieldValue("weight", clacSelectedWeight);

                  setOpenDetails(false);
                }

                setEditSellingTaklfa(+priceWithSellingPolicy);
                setEditSellingTaklfaAfterTax(+priceWithSellingPolicy);
              }}
            >
              {`${t("confirm")}`}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={openSelsal} onClose={() => setOpenSelsal(false)}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Header header={t("Add a chain")} />
          <SellingTableInputWeight
            handleDeleteRow={handleDeleteRow}
            sellingItemsOfWeigth={sellingItemsOfWeigth}
            setSellingItemsOfWeight={setSellingItemsOfWeight}
            dataSource={dataSource}
            setOpenSelsal={setOpenSelsal}
            TaxRateOfBranch={TaxRateOfBranch}
          />
        </div>
      </Modal>
    </Form>
  );
};
