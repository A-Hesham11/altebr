import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";
import { Loading } from "../../../components/organisms/Loading";
import { SvgDeleteIcon } from "../../../components/atoms/icons";
import { Form, Formik } from "formik";
import { BaseInput } from "../../atoms";
import { notify } from "../../../utils/toast";

const ReturnItemsToEdaraTable = ({
  operationTypeSelect,
  setOperationTypeSelect,
  isLoading,
  isFetching,
  isRefetching,
  dataSource,
  mainData,
  setMainData,
}: any) => {
  console.log("🚀 ~ operationTypeSelect:", operationTypeSelect);
  console.log("🚀 ~ dataSource:", dataSource);
  const { formatReyal, formatGram } = numberContext();
  const isContainCheckInputWeight = operationTypeSelect.some(
    (el) => el.check_input_weight === 1
  );

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("ID")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "thwelbond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("identification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => {
          console.log("🚀 ~ info:", info.row.index);
          const filterItem = mainData?.filter(
            (item) => item.id === info.row.original.id
          );
          console.log("🚀 ~ filterItem:", filterItem);
          console.log("🚀 ~ filterItem:", filterItem?.[info.row.index]);
          return (
            <div>
              {info.row.original.category_selling_type === "all" ? (
                <Formik
                  initialValues={{ weight: info.row.original.weight }}
                  enableReinitialize={true}
                  onSubmit={(values) => {}}
                >
                  {({ values, setFieldValue }) => {
                    console.log("🚀 ~ values:", values);
                    return (
                      <Form>
                        <BaseInput
                          id="weight"
                          name="weight"
                          type="text"
                          value={values.weight}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setFieldValue("weight", newValue);
                            updateData(info.row.original.id, {
                              weight: newValue,
                            });
                            if (newValue < 0) {
                              notify("info", `${t("Minimum weight 1")}`);
                              return;
                            }
                            if (newValue > info.row.original.remaining_weight) {
                              notify(
                                "info",
                                `${t("الحد الاعلي للوزن")} ${
                                  info.row.original.remaining_weight
                                }`
                              );
                              return;
                            }
                          }}
                        />
                      </Form>
                    );
                  }}
                </Formik>
              ) : (
                <span>{info.row.original.weight || "---"}</span>
              )}
            </div>
          );
        },
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        header: () => <span>{t("remaining weight")} </span>,
        accessorKey: "remaining_weight",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("gold karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "mineral",
        header: () => <span>{t("mineral")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karatmineral_id",
        header: () => <span>{t("mineral karat")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue()
            ? formatReyal(
                Number(info.row.original.weight * info.row.original.wage)
              )
            : "",
        accessorKey: "wage_total",
        header: () => <span>{t("total wages")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
        accessorKey: "stones_weight",
        header: () => <span>{t("other stones weight")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("selling price")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
        accessorKey: "diamond_weight",
        header: () => <span>{t("diamond weight")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <SvgDeleteIcon
              action={() => deletePieceHandler(info.row.original.hwya)}
              stroke="#ef4444"
            />
          );
        },
        accessorKey: "delete",
        header: () => <span>{t("delete")}</span>,
      },
    ],
    []
  );

  const updateData = (id, updatedValues) => {
    setOperationTypeSelect((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  const deletePieceHandler = (hwya) => {
    setOperationTypeSelect((prevData) =>
      prevData.filter((item) => item.hwya !== hwya)
    );

    setMainData((prevData) => prevData.filter((item) => item.hwya !== hwya));
  };

  if (isLoading || isFetching || isRefetching)
    return <Loading mainTitle={t("loading")} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        {isContainCheckInputWeight && (
          <p className="text-lg ml-4 mb-2 font-bold text-slate-700">
            {t("the pieces contains weight")}
          </p>
        )}
      </div>
      <Table
        showNavigation
        data={operationTypeSelect || []}
        columns={tableColumn}
      ></Table>
    </div>
  );
};

export default ReturnItemsToEdaraTable;
