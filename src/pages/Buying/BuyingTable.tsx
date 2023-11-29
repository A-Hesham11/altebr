import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Form, Formik, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { numberContext } from "../../context/settings/number-formatter";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Selling_TP } from "./BuyingPage";
import { Button, Spinner } from "../../components/atoms";
import { BaseInputField, Select } from "../../components/molecules";
import SelectCategory from "../../components/templates/reusableComponants/categories/select/SelectCategory";
import SelectClassification from "../../components/templates/reusableComponants/classifications/select/SelectClassification";
import SelectKarat from "../../components/templates/reusableComponants/karats/select/SelectKarat";
import { notify } from "../../utils/toast";
import { DeleteIcon, EditIcon } from "../../components/atoms/icons";
import { useFetch } from "../../hooks";

type SellingTableInputData_TP = {
  dataSource: Selling_TP;
  sellingItemsData: Selling_TP;
  setDataSource: any;
  setSellingItemsData: any;
  setClientData: any;
  rowsData: Selling_TP;
};

export const BuyingTable = ({
  dataSource,
  setDataSource,
  sellingItemsData,
  setSellingItemsData,
}: SellingTableInputData_TP) => {
  console.log(
    "🚀 ~ file: BuyingTable.tsx:40 ~ sellingItemsData:",
    sellingItemsData
  );
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const [data, setData] = useState("")
  const { values, setFieldValue } = useFormikContext();
  console.log("🚀 ~ file: BuyingTable.tsx:46 ~ values:", values)

  const stonesOption = [
    {
      id: 0,
      name: "لا يوجد",
      label: "لا يوجد",
      value: "لا يوجد",
    },
    {
      id: 1,
      name: "يوجد",
      label: "يوجد",
      value: "يوجد",
    },
  ];

  //   const { refetch, isSuccess, isLoading, isFetching, isRefetching } = useFetch({
  //     queryKey: ["branch-all-accepted-selling"],
  //     endpoint:
  //       search === ""
  //         ? `/branchManage/api/v1/all-accepted/${userData?.branch_id}?per_page=10000`
  //         : `${search}`,
  //     onSuccess: (data) => {
  //       setDataSource(data);
  //     },
  //   });

    // const { data: goldPrice } = useFetch({
    //   endpoint: "/buyingUsedGold/api/v1/get-gold-price",
    //   queryKey: ["get_gold_price"],
    // });
    // console.log("🚀 ~ file: BuyingTable.tsx:78 ~ goldPrice:", goldPrice)

    // const {
    //   data: goldPrice,
    //   isLoading,
    //   isFetching,
    // } = useFetch({
    //   queryKey: ["get-price"],
    //   endpoint: "/buyingUsedGold/api/v1/get-gold-price",
    //   onSuccess(data) {
    //     console.log("🚀 ~ file: BuyingTable.tsx:89 ~ onSuccess ~ data:", data)
    //   }
    // });



 const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) => formatGram(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("piece per gram")} </span>,
        accessorKey: "piece_per_gram",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) => {
          //   console.log(info.getValue());
          //   setTotalValues(() => [...info.getValue()]);
          return formatReyal(Number(info.getValue())) || "---";
        },
      },
      {
        header: () => <span>{t("stones")}</span>,
        accessorKey: "stones_name",
        cell: (info) => info.getValue() || "---",
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

  const handleAddItemsToSelling = () => {
    const { client_id, bond_date, client_value, client_name, ...restValues } =
      values;
    Object.keys(restValues).forEach((key) => {
      setFieldValue(key, "");
    });
  };

  return (
    <>
      {/* <p className="font-semibold text-center text-lg text-mainGreen">
        {isRefetching ||
          (isFetching && (
            <div className="flex items-center justify-center gap-3">
              {t("loading data")}
              <Spinner />
            </div>
          ))}
      </p> */}
      <table className="mt-8 w-[1180px]">
        <thead className="bg-mainGreen text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="py-4 px-2">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-4 px-2 text-sm font-medium text-white border"
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
          <tr className="text-center table-shadow last:shadow-0">
            <td className="border-l-2 border-l-flatWhite w-40">
              <SelectCategory
                name="category_id"
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
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("weight")}`}
                id="weight"
                name="weight"
                type="text"
                required
                className={`text-center`}
                onChange={(e) => {
                  setFieldValue("value", +e.target.value * 10);
                }}
                // onChange={() =>
                //   setFieldValue(
                //     "value",
                //     Number(values?.weight) * Number(values?.piece_per_gram)
                //   )
                // }
              />
            </td>
            <td className="border-l-2 border-l-flatWhite w-48">
              <SelectKarat
                field="id"
                name="karat_id"
                noMb={true}
                placement="top"
                onChange={(option) => {
                  setFieldValue("karat_name", option!.value);
                  //   setFieldValue(
                  //     "stock",
                  //     karatValues!.find(
                  //       (item) => item.karat === values.karat_value
                  //     )?.value
                  //   );
                }}
                value={{
                  id: values.karat_id,
                  value: values.karat_id,
                  label: values.karat_name || t("karat value"),
                }}
              />
            </td>
            <td className="text-center">
              <BaseInputField
                placeholder={`${t("piece per gram")}`}
                id="piece_per_gram"
                name="piece_per_gram"
                type="text"
                className="text-center"
                onChange={(e) => {
                  setFieldValue("value", +e.target.value * +values?.weight);
                }}
                // onChange={() => setFieldValue("value", (Number(values?.weight) * Number(values?.piece_per_gram)) )}

                // value="2000"
                // onChange={(e) => {
                //   setFieldValue("piece_per_gram", values.value);
                // }}
              />
            </td>
            <td>
              <BaseInputField
                placeholder={`${t("value")}`}
                id="value"
                name="value"
                type="text"
                className="text-center"
                required
                className="bg-mainDisabled text-center"
                // value={(Number(values?.weight) * Number(values?.piece_per_gram))}
                disabled
                // onBlur={(e) => setFieldValue(e.target.value)}
                // onChange={(e) => {
                //   setFieldValue("value", +values?.weight * +values?.piece_per_gram);
                // }}
              />
            </td>
            <td>
              <Select
                placeholder={`${t("stones")}`}
                id="stones_id"
                className="text-center text-black w-40"
                name="stones_id"
                options={stonesOption}
                onChange={(option) => {
                  setFieldValue("stones_name", option!.value);
                  setFieldValue("stones_id", option!.id);
                }}
                value={{
                  id: values.stones_id,
                  value: values.stones_id,
                  label: values.stones_name || t("stones"),
                }}
              />
            </td>
            <td className="bg-lightGreen w-max border border-[#C4C4C4] flex items-center">
              {dataSource?.length == 1 &&
                dataSource[0]?.category_type === "multi" && (
                  <Button
                    action={() => {
                      //   if (
                      //     (values.value &&
                      //       values.piece_per_gram &&
                      //       values.stones &&
                      //       values.karat_name &&
                      //       values.weight &&
                      //       values.category_name) === ""
                      //   ) {
                      //     notify("info", `${t("add piece first")}`);
                      //     return;
                      //   }
                      // if (pieceCheck !== -1) {
                      //   notify("info", `${t("item exists")}`);
                      //   return;
                      // }
                      // setOpenDetails(true);
                    }}
                    className="bg-transparent px-2"
                  >
                    <EditIcon className="fill-mainGreen w-6 h-6" />
                  </Button>
                )}
              <Button
                action={() => {
                  if (
                    (values.piece_per_gram &&
                      values.stones_name &&
                      values.karat_name &&
                      values.weight &&
                      values.category_name) === ""
                  ) {
                    notify("info", `${t("the data is not complete")}`);
                    return;
                  }

                  // if (pieceCheck !== -1) {
                  //   notify("info", `${t("item exists")}`);
                  //   return;
                  // }

                  setSellingItemsData((prev) =>
                    [
                      ...prev,
                      { ...values, item_id: crypto.randomUUID() },
                    ].reverse()
                  );

                  handleAddItemsToSelling();
                  setDataSource([]);
                }}
                className="bg-transparent px-2"
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
    </>
  );
};
