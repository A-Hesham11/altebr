import React, { useMemo } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Loading } from "../../../components/organisms/Loading";

interface TableOfTransformImport_TP {
  operationTypeSelect: [];
  setRowWage: () => void;
  setInputWeight: () => void;
}

const TableOfTransformImport = ({
  operationTypeSelect,
  setRowWage,
  setInputWeight,
}: TableOfTransformImport_TP) => {
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
        cell: (info: any) => formatReyal(info.getValue()) || "-",
        accessorKey: "wage",
        header: () => <span>{t("wage geram/ryal")}</span>,
      },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return formatReyal(wages) || "-";
        },
        accessorKey: "total_wages",
        header: () => <span>{t("total wage by ryal")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "-",
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
            // setInputWeight((prev: any) => {
            //   // Check if the object with the same id exists in the array
            //   const existingItemIndex = prev.findIndex(
            //     (item) => item.id === info.row.original.id
            //   );

            //   if (existingItemIndex !== -1) {
            //     // If the object exists, update its value
            //     return prev.map((item, index) =>
            //       index === existingItemIndex
            //         ? { ...item, value: info.row.original.weight }
            //         : item
            //     );
            //   } else {
            //     // If the object doesn't exist, add a new one
            //     return [
            //       ...prev,
            //       {
            //         value: info.row.original.weight,
            //         id: info.row.original.id,
            //       },
            //     ];
            //   }
            // });

            return (
              <>
                <input
                  type="text"
                  className="w-20 rounded-md h-10 bg-mainDisabled"
                  name="weight_input"
                  disabled
                  id="weight_input"
                  value={info.row.original.weight}
                  // onChange={(e: any) => {
                  //   setInputWeight((prev: any) => {
                  //     // Check if the object with the same id exists in the array
                  //     const existingItemIndex = prev.findIndex(
                  //       (item) => item.id === info.row.original.id
                  //     );

                  //     if (existingItemIndex !== -1) {
                  //       // If the object exists, update its value
                  //       return prev.map((item, index) =>
                  //         index === existingItemIndex
                  //           ? { ...item, value: info.row.original.weight }
                  //           : item
                  //       );
                  //     } else {
                  //       // If the object doesn't exist, add a new one
                  //       return [
                  //         ...prev,
                  //         {
                  //           value: info.row.original.weight,
                  //           id: info.row.original.id,
                  //         },
                  //       ];
                  //     }
                  //   });
                  // }}
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
      <div className="flex items-center gap-6">
        <h2 className="text-xl ml-4 mb-2 font-bold text-slate-700">
          {t("selected pieces")}
        </h2>
      </div>
      <Table
        showNavigation
        data={operationTypeSelect || []}
        columns={tableColumn}
      ></Table>
    </div>
  );
};

export default TableOfTransformImport;
