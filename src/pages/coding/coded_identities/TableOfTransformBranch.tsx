import { t } from "i18next";
import { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";

const TableOfTransformBranch = ({
  operationTypeSelect,
  setRowWage,
  setInputWeight,
  inputWeight,
}) => {
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() == 0 ? formatReyal(info.getValue()) : "-",
        accessorKey: "wage",
        header: () => <span>{t("wage geram/ryal")}</span>,
      },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return info.getValue() == 0 ?  formatReyal(wages) : "-";
        },
        accessorKey: "total_wages",
        header: () => <span>{t("total wage by ryal")}</span>,
      },
      {
        cell: (info: any) => info.getValue() == 0 ?  formatReyal(info.getValue()) : "-",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => {
          // return info.getValue()[0]?.diamondWeight || "-";
          const stonesDetails = info.getValue().reduce((acc, curr) => {
            return acc + curr.diamondWeight;
          }, 0);

          return stonesDetails;
        },
        accessorKey: "stonesDetails",
        header: () => <span>{t("weight of diamond stone")}</span>,
      },
      {
        cell: (info: any) => {
          const stonesDetails = info.getValue().reduce((acc, curr) => {
            return acc + curr.weight;
          }, 0);

          return stonesDetails || "-";
        },
        accessorKey: "stonesDetails",
        header: () => <span>{t("stone weight")}</span>,
      },
      {
        cell: (info: any) => {
          setRowWage(info.row.original.wage);

          if (info.row.original.check_input_weight === 1) {
            return (
              <>
                <input
                  type="number"
                  className="w-20 rounded-md h-10"
                  min="1"
                  max={info.row.original.weight}
                  name="weight_input"
                  id="weight_input"
                  onBlur={(e) => {
                    setInputWeight((prev) => {
                      // Check if the object with the same id exists in the array
                      const existingItemIndex = prev.findIndex(
                        (item) => item.id === info.row.original.id
                      );

                      if (existingItemIndex !== -1) {
                        // If the object exists, update its value
                        return prev.map((item, index) =>
                          index === existingItemIndex
                            ? { ...item, value: e.target.value }
                            : item
                        );
                      } else {
                        // If the object doesn't exist, add a new one
                        return [
                          ...prev,
                          { value: e.target.value, id: info.row.original.id },
                        ];
                      }
                    });
                  }}
                />
              </>
            );
          } else {
            return info.getValue();
          }
        },
        accessorKey: "employee_name",
        header: () => <span>{t("weight conversion")}</span>,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl ml-4 mb-2 font-bold text-slate-700">
        {t("selected pieces")}
      </h2>
      <Table data={operationTypeSelect || []} columns={tableColumn}>
        <div className="mt-3 flex items-center justify-center gap-5 p-2"></div>
      </Table>
    </div>
  );
};

export default TableOfTransformBranch;
