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
import { Header } from "../../components/atoms/Header";
import SupplyPayoffTableInputKit from "./SupplyPayoffTableInputKit";
import SupplyPayoffTableInputOfSelsal from "./SupplyPayoffTableInputOfSelsal";

type SellingTableInputData_TP = {
  dataSource: any;
  sellingItemsData: Selling_TP;
  setDataSource: any;
  setSellingItemsData: any;
  rowsData: Selling_TP;
  selectedItemDetails: any;
  setSelectedItemDetails: any;
  sellingItemsOfWeigth: any;
  setSellingItemsOfWeight: any;
  supplierId: any;
};

export const SupplyPayoffTableInputData = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
  selectedItemDetails,
  setSelectedItemDetails,
  sellingItemsOfWeigth,
  setSellingItemsOfWeight,
  supplierId,
}: SellingTableInputData_TP) => {
  console.log("🚀 ~ sellingItemsData:", sellingItemsData);
  console.log("🚀 ~ dataSource:", dataSource);
  const [search, setSearch] = useState("");
  console.log("🚀 ~ search:", search);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openSelsal, setOpenSelsal] = useState<boolean>(false);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);
  const [page, setPage] = useState<number>(1);
  const { formatGram, formatReyal } = numberContext();

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const { values, setFieldValue } = useFormikContext<any>();
  console.log("🚀 ~ values:", values);

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

  const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("id code")}</span>,
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
        accessorKey: "category",
        cell: (info) => info.getValue(),
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
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("fare")} </span>,
        accessorKey: "wage",
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
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
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
      return item.id == itemId;
    });

    const newData = sellingItemsData?.filter((item) => {
      return item.id !== itemId;
    });

    setSellingItemsData(newData);
  };

  const goldTaklfa =
    dataSource &&
    (Number(dataSource[0]?.wage) + Number(dataSource[0]?.api_gold_price)) *
      Number(dataSource[0]?.weight);

  const goldVat = goldTaklfa * (Number(userData?.tax_rate) / 100);

  useEffect(() => {
    const {
      client_id,
      bond_date,
      client_value,
      client_name,
      supplier_id,
      supplier_name,
      ...restValues
    } = values;
    Object.keys(restValues).map((key) => {
      if (dataSource?.length === 1) {
        setFieldValue(key, dataSource[0][key]);
        setFieldValue(
          "vat",
          dataSource[0]?.classification_id === 1
            ? goldVat
            : Number(dataSource[0]?.cost) * (Number(userData?.tax_rate) / 100)
        );

        setFieldValue(
          "cost",
          dataSource[0]?.classification_id === 1
            ? goldTaklfa
            : Number(dataSource[0]?.cost)
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
    const {
      client_id,
      bond_date,
      client_value,
      client_name,
      supplier_id,
      supplier_name,
      ...restValues
    } = values;
    Object.keys(restValues).forEach((key) => {
      setFieldValue(key, "");
    });
  };

  const getSearchResults = async (item: any) => {
    console.log("🚀 ~ getSearchResults ~ item:", item);
    let uri = `/supplyReturn/api/v1/get-Item/${item.supplier_id}?hwya[eq]=${item.hwya}`;
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
                  className="py-4 px-2 text-sm font-medium text-white border w-[12%]"
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
                placeholder={`${t("id code")}`}
                id="hwya"
                name="hwya"
                type="text"
                onChange={(e) => {
                  setFieldValue("hwya", e.target.value);
                  getSearchResults({
                    hwya: e.target.value,
                    supplier_id: supplierId,
                  });
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
                name="category"
                noMb={true}
                placement="top"
                all={true}
                value={{
                  value: values?.category_id,
                  label: values?.category || t("classification"),
                  id: values?.category_id,
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
                onChange={(e) => {
                  setFieldValue(
                    "vat",
                    values?.classification_id === 1 &&
                      (Number(values?.wage) + Number(values?.api_gold_price)) *
                        Number(e.target.value) *
                        (Number(userData?.tax_rate) / 100)
                  );

                  setFieldValue(
                    "cost",
                    values?.classification_id === 1 &&
                      (Number(values?.wage) + Number(values?.api_gold_price)) *
                        Number(e.target.value)
                  );
                }}
                className={`${
                  (!isSuccess ||
                    values.check_input_weight !== 1 ||
                    values?.weight === 0) &&
                  "bg-mainDisabled"
                } text-center`}
                disabled={
                  !isSuccess ||
                  values.check_input_weight !== 1 ||
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
                    "vat",
                    values?.classification_id === 1
                      ? (Number(dataSource[0]?.wage) +
                          Number(dataSource[0]?.api_gold_price)) *
                          Number(dataSource[0]?.weight) *
                          (Number(userData?.tax_rate) / 100)
                      : Number(dataSource[0]?.cost) *
                          (Number(userData?.tax_rate) / 100)
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
                placeholder={`${t("fare")}`}
                id="wage"
                name="wage"
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
                placeholder={`${t("VAT")}`}
                id="vat"
                name="vat"
                type="text"
                required
                value={values?.vat}
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
            <td className="bg-lightGreen border border-[#C4C4C4] flex items-center">
              {dataSource && dataSource[0]?.category_items?.length > 0 && (
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
              {/* {dataSource && dataSource[0]?.selsal?.length > 0 && (
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
              )} */}
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

                  setSellingItemsData((prev) =>
                    [
                      ...prev,
                      {
                        ...values,
                        //   stone_weight: +stoneWeitgh,
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
            console.log("🚀 ~ {table.getRowModel ~ row:", row?.original);
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
                        handleDeleteRow(row?.original?.id);
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
                        handleDeleteRow(row?.original?.id);
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
          <SupplyPayoffTableInputKit />
        </div>
      </Modal>

      <Modal isOpen={openSelsal} onClose={() => setOpenSelsal(false)}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Header header={t("chain")} />
          <SupplyPayoffTableInputOfSelsal />
        </div>
      </Modal>
    </Form>
  );
};
