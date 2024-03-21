import { Form, Formik, useFormikContext } from "formik";
import React, {
  useMemo,
} from "react";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { t } from "i18next";
import { numberContext } from "../../context/settings/number-formatter";
import { Selling_TP } from "../Buying/BuyingPage";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";

const SalesReturnTableInputOfSelsal = () => {

  const { formatGram, formatReyal } = numberContext();

  const { values } = useFormikContext<any>();

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

  return (
    <Table data={values?.selsal} columns={sellingColsOfWeight} />
  );
};

export default SalesReturnTableInputOfSelsal;
