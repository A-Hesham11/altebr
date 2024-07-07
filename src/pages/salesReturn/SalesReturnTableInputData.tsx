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
import { Selling_TP } from "../Buying/BuyingPage";
import { numberContext } from "../../context/settings/number-formatter";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch } from "../../hooks";
import { KaratValues_TP } from "../../types";
import { Button, Spinner } from "../../components/atoms";
import { BaseInputField, Modal } from "../../components/molecules";
import SelectClassification from "../../components/templates/reusableComponants/classifications/select/SelectClassification";
import SelectCategory from "../../components/templates/reusableComponants/categories/select/SelectCategory";
import SelectKarat from "../../components/templates/reusableComponants/karats/select/SelectKarat";
import { notify } from "../../utils/toast";
import { DeleteIcon, EditIcon } from "../../components/atoms/icons";
import { HiViewGridAdd } from "react-icons/hi";
import { Header } from "../../components/atoms/Header";
import SalesReturnTableInputOfSelsal from "./SalesReturnTableInputOfSelsal";
import SalesReturnTableInputKit from "./SalesReturnTableInputKit";

type SellingTableInputData_TP = {
  dataSource: any;
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

export const SalesReturnTableInputData = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
  selectedItemDetails,
  setSelectedItemDetails,
  sellingItemsOfWeigth,
  setSellingItemsOfWeight,
}: SellingTableInputData_TP) => {
  console.log("🚀 ~ dataSource:", dataSource)
  console.log("🚀 ~ sellingItemsData:", sellingItemsData)
  const [search, setSearch] = useState("");
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openSelsal, setOpenSelsal] = useState<boolean>(false);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);
  const [page, setPage] = useState<number>(1);
  const { formatGram, formatReyal } = numberContext();
  const [editSellingTaklfa, setEditSellingTaklfa] = useState<number>();

  const { userData } = useContext(authCtx);

  const priceWithCommissionRate =
    dataSource &&
    Number(dataSource[0]?.cost) * (Number(dataSource[0]?.min_selling) * 0.01) +
      Number(dataSource[0]?.cost);

  const priceWithCommissionCash =
    dataSource &&
    Number(dataSource[0]?.cost) + Number(dataSource[0]?.min_selling);

  const priceWithSellingPolicy =
    dataSource && dataSource[0]?.min_selling_type === "نسبة"
      ? priceWithCommissionRate
      : priceWithCommissionCash;

  const { values, setFieldValue } = useFormikContext<any>();

  const { refetch, isSuccess, isFetching, isRefetching } = useFetch({
    queryKey: ["branch-all-return-selling"],
    endpoint:
      search === ""
        ? `/sellingReturn/api/v1/all-selling/${userData?.branch_id}`
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
        header: () => <span>{t("bill number")}</span>,
        accessorKey: "invoice_id",
        cell: (info) => info.getValue() || "---",
      },
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
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
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
        setFieldValue("tax_rate", dataSource[0].tax_rate);
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

  const getSearchResults = async (item: any) => {
    let uri = `/sellingReturn/api/v1/all-selling/${userData?.branch_id}?hwya[eq]=${item.hwya}&invoice_id[eq]=${item.invoice_id}`;
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
                placeholder={`${t("bill number")}`}
                id="invoice_id"
                name="invoice_id"
                type="number"
                className={`${!isSuccess && "bg-mainDisabled"} text-center`}
                disabled={!isSuccess}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("piece number")}`}
                id="hwya"
                name="hwya"
                type="text"
                onChange={(e) => {
                  setFieldValue("hwya", e.target.value);
                  getSearchResults({
                    hwya: e.target.value,
                    invoice_id: values.invoice_id,
                  });
                  handleInputChange(e);
                }}
                className={`${
                  !isSuccess || (!values.invoice_id && "bg-mainDisabled")
                } text-center`}
                disabled={!isSuccess || !values.invoice_id}
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
                disabled={!isCategoryDisabled}
                className={`${
                  !isCategoryDisabled && "bg-mainDisabled"
                } text-center`}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("VAT")}`}
                id="vat"
                name="vat"
                type="text"
                required
                className={`${
                  !isSuccess || userData?.include_tax === "1"
                    ? "bg-mainDisabled"
                    : ""
                } text-center`}
                disabled={!isSuccess || userData?.include_tax === "1"}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("total")}`}
                id="total"
                name="total"
                type="text"
                required
                disabled
                className={`bg-mainDisabled text-center`}
              />
            </td>
            <td className="bg-lightGreen border border-[#C4C4C4] flex items-center">
              {dataSource && dataSource[0]?.kitItem.length > 0 && (
                <Button
                  loading={values.hwya && isFetching}
                  action={() => {
                    setOpenDetails(true);
                  }}
                  className="bg-transparent px-2"
                >
                  <EditIcon className="fill-mainGreen w-6 h-6" />
                </Button>
              )}
              {dataSource && dataSource[0]?.selsal.length > 0 && (
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

                  if (+values?.taklfa < +editSellingTaklfa) {
                    notify(
                      "info",
                      `${t(
                        "The selling price may not be less than the minimum"
                      )}`
                    );
                    return;
                  }

                  setSellingItemsData((prev) =>
                    [
                      ...prev,
                      {
                        ...values,
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

      {/* Selling Kit */}
      <Modal isOpen={openDetails} onClose={() => setOpenDetails(false)}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Header header={t("kit details")} />
          <SalesReturnTableInputKit />
        </div>
      </Modal>

      <Modal isOpen={openSelsal} onClose={() => setOpenSelsal(false)}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Header header={t("chain")} />
          <SalesReturnTableInputOfSelsal />
        </div>
      </Modal>
    </Form>
  );
};
