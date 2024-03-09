import { Form, Formik, useFormikContext } from "formik";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BaseInputField } from "../../../molecules";
import { useFetch } from "../../../../hooks";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import SelectCategory from "../../../templates/reusableComponants/categories/select/SelectCategory";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Selling_TP } from "../../../../pages/selling/PaymentSellingPage";
import { numberContext } from "../../../../context/settings/number-formatter";
import SelectClassification from "../../../templates/reusableComponants/classifications/select/SelectClassification";
import SelectKarat from "../../../templates/reusableComponants/karats/select/SelectKarat";
import { t } from "i18next";
import { Button } from "../../../atoms";
import { DeleteIcon, EditIcon } from "../../../atoms/icons";
import { notify } from "../../../../utils/toast";
import { IoMdAdd } from "react-icons/io";

type SellingTableInputWeight_TP = {
  sellingItemsOfWeigth?: any;
  setSellingItemsOfWeight?: any;
  dataSource?: any;
  setOpenSelsal?: any;
  TaxRateOfBranch?: any;
  selectedItemDetails?: any;
  editSelsal?: any;
  setEditSelsal?: any;
};

const SellingTableInputWeight = ({
  sellingItemsOfWeigth,
  setSellingItemsOfWeight,
  dataSource,
  setOpenSelsal,
  TaxRateOfBranch,
  selectedItemDetails,
  editSelsal,
  setEditSelsal,
}: SellingTableInputWeight_TP) => {
  const [searchWeight, setSearchWeight] = useState("");
  const [itemsOfWeight, setItemsOfWeight] = useState([]);
  const { userData } = useContext(authCtx);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);
  const { formatGram, formatReyal } = numberContext();
  const [page, setPage] = useState<number>(1);

  const { values, setFieldValue } = useFormikContext<any>();

  const calcSelectItemsOfWeight = selectedItemDetails.reduce((acc, item) => {
    acc += Number(item.weight);
    return acc;
  }, 0);

  const calcSelectItemsOfCost = selectedItemDetails.reduce((acc, item) => {
    acc += item.selling_price
      ? Number(item.selling_price)
      : (Number(item.karat_price) + Number(item.wage)) * Number(item.weight);
    return acc;
  }, 0);

  const calcOfSelsalWeight = sellingItemsOfWeigth.reduce((acc, item) => {
    acc += Number(item.weight);
    return acc;
  }, 0);

  const calcOfSelsalCost = sellingItemsOfWeigth.reduce((acc, item) => {
    acc += Number(item.cost);
    return acc;
  }, 0);

  const calcOfSelsalTaklfa = sellingItemsOfWeigth.reduce((acc, item) => {
    acc += Number(item.taklfa);
    return acc;
  }, 0);

  const calcOfSelsalTaklfaTax = sellingItemsOfWeigth.reduce((acc, item) => {
    acc += Number(item.taklfa_after_tax);
    return acc;
  }, 0);

  const weightItem =
    selectedItemDetails?.length > 0
      ? Number(calcSelectItemsOfWeight)
      : values.category_selling_type === "all"
      ? Number(values.sel_weight) - Number(values.remaining_weight)
      : Number(values.remaining_weight);

  const costItem =
    values?.classification_id === 1
      ? Number(weightItem) *
        (Number(values?.wage) + Number(values?.karat_price))
      : selectedItemDetails.length > 0
      ? Number(calcSelectItemsOfCost)
      : Number(values?.selling_price);

  const taklfaItem = costItem * (values?.min_selling / 100) + costItem;

  const taklfaTaxItem = taklfaItem * (values?.tax_rate / 100) + taklfaItem;

  const initialValuesWeight = {
    hwya: "",
    item_id: "",
    classification_id: "",
    category_id: "",
    classification_name: "",
    category_name: "",
    weight: "",
    remaining_weight: "",
    karat_id: "",
    karat_name: "",
    karat_price: "",
    selling_price: "",
    wage: "",
    cost: "",
    min_selling: "",
    min_selling_type: "",
    category_selling_type: "",
    tax_rate: "",
    taklfa: "",
    taklfa_after_tax: "",
  };

  const sellingColsOfWeight = useMemo<ColumnDef<Selling_TP>[]>(
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
        cell: (info) => info.getValue() || "---",
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
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) =>
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

  const tableOfWeight = useReactTable({
    data: sellingItemsOfWeigth,
    columns: sellingColsOfWeight,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { refetch, isFetching, isSuccess } = useFetch({
    queryKey: ["branch-all-accepted-weight-selling"],
    endpoint:
      searchWeight === ""
        ? `/branchManage/api/v1/all-accepted-weight/${userData?.branch_id}`
        : `${searchWeight}`,
    onSuccess: (data) => {
      setItemsOfWeight(data);
    },
  });

  const getSearchResultsWeight = async (hwya: any) => {
    let uri = `branchManage/api/v1/all-accepted-weight/${userData?.branch_id}`;
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
    setSearchWeight(uri);
  };

  useEffect(() => {
    refetch();
  }, [searchWeight]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [searchWeight]);

  const handleAddSelsalToPieces = () => {
    setFieldValue("weight", Number(weightItem) + Number(calcOfSelsalWeight));
    setFieldValue(
      "cost",
      (Number(costItem) + Number(calcOfSelsalCost)).toFixed(3)
    );
    setFieldValue(
      "taklfa",
      (Number(taklfaItem) + Number(calcOfSelsalTaklfa)).toFixed(3)
    );
    setFieldValue(
      "taklfa_after_tax",
      (Number(taklfaTaxItem) + Number(calcOfSelsalTaklfaTax)).toFixed(3)
    );
  };

  const handleDeleteRow = (itemId) => {
    sellingItemsOfWeigth?.findIndex((item) => {
      return item.hwya == itemId;
    });

    const newData = sellingItemsOfWeigth?.filter((item) => {
      return item.hwya != itemId;
    });

    setSellingItemsOfWeight(newData);
  };

  useEffect(() => {
    handleAddSelsalToPieces();
  }, [calcOfSelsalWeight]);

  useEffect(() => {
    if (editSelsal.length > 0) {
      setSellingItemsOfWeight(editSelsal);
    }
  }, [editSelsal]);

  return (
    <Formik
      initialValues={initialValuesWeight}
      validationSchema=""
      onSubmit={(values) => {}}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          const costItemSelsal =
            (Number(itemsOfWeight[0]?.karat_price) +
              Number(itemsOfWeight[0]?.wage)) *
            Number(itemsOfWeight[0]?.remaining_weight);

          const priceWithCommissionRateOfSelsal =
            Number(costItemSelsal) *
              (Number(itemsOfWeight[0]?.min_selling) * 0.01) +
            Number(costItemSelsal);

          const priceWithCommissionCashOfSelsal =
            Number(costItemSelsal) + Number(itemsOfWeight[0]?.min_selling);

          const priceWithSellingPolicyOfSelsal =
            itemsOfWeight[0]?.min_selling_type === "نسبة"
              ? priceWithCommissionRateOfSelsal
              : priceWithCommissionCashOfSelsal;

          const taklfaAfterTaxOfSelsal =
            priceWithSellingPolicyOfSelsal * TaxRateOfBranch +
            priceWithSellingPolicyOfSelsal;

          Object.keys(values).map((key) => {
            if (itemsOfWeight?.length === 1) {
              setFieldValue(key, itemsOfWeight[0][key]);
              setFieldValue("weight", itemsOfWeight[0]?.remaining_weight);
              setFieldValue("cost", Number(itemsOfWeight[0]?.cost).toFixed(3));
              setFieldValue(
                "taklfa",
                Number(priceWithSellingPolicyOfSelsal).toFixed(3)
              );
              setFieldValue(
                "taklfa_after_tax",
                Number(taklfaAfterTaxOfSelsal).toFixed(3)
              );
            }
          });
        }, [itemsOfWeight, searchWeight]);
        return (
          <Form>
            <table className="mt-8 w-[815px] lg:w-full">
              <thead className="bg-mainGreen text-white ">
                {tableOfWeight.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="py-4 px-2 w-full">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-4 px-2 text-sm font-medium text-white border text-center w-[14.25%]"
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
                        getSearchResultsWeight({ hwya: e.target.value });
                      }}
                      className={`${
                        !isSuccess && "bg-mainDisabled"
                      } text-center`}
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
                      <SelectClassification
                        field="value"
                        name="classification_id"
                      />
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
                      className="text-center"
                      onChange={(e) => {
                        const remainingWeight =
                          Number(itemsOfWeight[0]?.remaining_weight) -
                          Number(e.target.value);

                        const costItemSelsal =
                          (Number(values.karat_price) + Number(values.wage)) *
                          Number(e.target.value);

                        const priceWithCommissionRateOfSelsal =
                          Number(costItemSelsal) *
                            (Number(itemsOfWeight[0]?.min_selling) * 0.01) +
                          Number(costItemSelsal);

                        const priceWithCommissionCashOfSelsal =
                          Number(costItemSelsal) +
                          Number(itemsOfWeight[0]?.min_selling);

                        const priceWithSellingPolicyOfSelsal =
                          itemsOfWeight[0]?.min_selling_type === "نسبة"
                            ? priceWithCommissionRateOfSelsal
                            : priceWithCommissionCashOfSelsal;

                        const taklfaAfterTaxOfSelsal =
                          priceWithSellingPolicyOfSelsal * TaxRateOfBranch +
                          priceWithSellingPolicyOfSelsal;

                        setFieldValue(
                          "remaining_weight",
                          Number(remainingWeight)
                        );

                        setFieldValue(
                          "cost",
                          Number(costItemSelsal).toFixed(3)
                        );

                        setFieldValue(
                          "taklfa",
                          Number(priceWithSellingPolicyOfSelsal).toFixed(3)
                        );

                        setFieldValue(
                          "taklfa_after_tax",
                          Number(taklfaAfterTaxOfSelsal).toFixed(3)
                        );
                      }}
                    />
                  </td>
                  <td>
                    <BaseInputField
                      placeholder={`${t("remaining weight")}`}
                      id="remaining_weight"
                      name="remaining_weight"
                      type="text"
                      value={values.remaining_weight}
                      onChange={(e) => {
                        setFieldValue(
                          "remaining_weight",
                          values.remaining_weight
                        );
                      }}
                      disabled={!isCategoryDisabled}
                      className={`${
                        !isCategoryDisabled && "bg-mainDisabled"
                      } text-center`}
                    />
                  </td>
                  <td className="border-l-2 border-l-flatWhite">
                    <SelectKarat
                      field="id"
                      name="karat_name"
                      noMb={true}
                      placement="top"
                      value={{
                        id: values.karat_id,
                        value: values.karat_id,
                        label: values.karat_name || t("karat value"),
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
                        setFieldValue("cost", values.value.toFixed(3));
                      }}
                      disabled={!isCategoryDisabled}
                      className={`${
                        !isCategoryDisabled && "bg-mainDisabled"
                      } text-center`}
                    />
                  </td>
                  <td className="bg-mainDisabled">
                    <Button
                      loading={values.hwya && isFetching}
                      action={() => {
                        if ((values.hwya && values.classification_id) === "") {
                          notify("info", `${t("add piece first")}`);
                          return;
                        }

                        const pieceCheck = sellingItemsOfWeigth?.findIndex(
                          (item) => {
                            return item.hwya == values.hwya;
                          }
                        );

                        if (pieceCheck !== -1) {
                          notify("info", `${t("item exists")}`);
                          return;
                        }

                        if (values.weight == 0) {
                          notify("info", `${t("The lot is sold out")}`);
                          return;
                        }

                        setSellingItemsOfWeight((prev) =>
                          [...prev, values].reverse()
                        );

                        Object.keys(values).forEach((key) => {
                          setFieldValue(key, "");
                        });
                        setSearchWeight("");
                        setItemsOfWeight([]);
                      }}
                      className="bg-transparent px-2 m-auto"
                    >
                      <IoMdAdd className="fill-mainGreen w-6 h-6" />
                    </Button>
                  </td>
                </tr>
                {tableOfWeight.getRowModel().rows.map((row) => {
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
                              Object.keys(values).map((key) => {
                                setFieldValue(key, row?.original[key]);
                              });
                              handleDeleteRow(row?.original?.hwya);
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
                              handleDeleteRow(row?.original?.hwya);
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
            <div className="flex justify-end w-full mt-8">
              <Button
                action={() => {
                  handleAddSelsalToPieces();
                  setOpenSelsal(false);
                }}
                disabled={!sellingItemsOfWeigth.length}
              >
                {t("confirm")}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SellingTableInputWeight;
