import React, { Fragment, useMemo } from "react";
import { useFormikContext } from "formik";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { numberContext } from "../../context/settings/number-formatter";
import { Selling_TP } from "../Buying/BuyingPage";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";

const SupplyPayoffTableInputKit = () => {
  const { values } = useFormikContext<any>();
  const { formatGram, formatReyal } = numberContext();

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "child",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "item_weight",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      // {
      //   header: () => <span>{t("cost")}</span>,
      //   accessorKey: "selling_price",
      //   cell: (info) =>
      //     info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      // },
    ],
    []
  );

  return (
    <Fragment>
      <Table data={values?.category_items} columns={Cols} />
    </Fragment>
  );
};

export default SupplyPayoffTableInputKit;
