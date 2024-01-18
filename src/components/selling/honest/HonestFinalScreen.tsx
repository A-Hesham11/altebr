/////////// Types

import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Button } from "../../atoms";
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { numberContext } from "../../../context/settings/number-formatter";

///
type HonestFinalScreenProps_TP = {
  sanadData: any;
  setStage: any;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const HonestFinalScreen = ({
  sanadData,
  setStage,
}: HonestFinalScreenProps_TP) => {
  console.log("🚀 ~ sanadData:", sanadData.card)
  /////////// VARIABLES
  const { userData } = useContext(authCtx);
  const { formatGram, formatReyal } = numberContext();

  const mainSanadData = {
    client_id: sanadData.client_id,
    employee_id: userData?.id,
    branch_id: userData?.branch_id,
    bond_date: new Date(sanadData.bond_date)?.toISOString().slice(0, 10),
    remaining_amount: sanadData.remaining_amount,
    amount: sanadData.amount,
  };
  const items = sanadData.tableData.map((item) => ({
    bond_number: null,
    category_id: item.category_id,
    karat_id: item.karat_id,
    mineral_id: null,
    cost: item.cost,
    karatmineral_id: null,
    description: item.notes,
    weight: item.weight,
    media: item.media,
  }));
  const finalData = {
    bond: mainSanadData,
    card: sanadData.card,
    items,
  };
  console.log("🚀 ~ finalData:", finalData)
  ///
  const Cols = useMemo<any>(
    () => [
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "category_value",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "karat_value",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info) => info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "cost",
        header: () => <span>{t("approximate cost")}</span>,
      },
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "notes",
        header: () => <span>{t("notes")}</span>,
      },
      {
        cell: (info) => {
          const media = info?.row?.original?.media?.map((file) => ({
            id: info.row.id,
            path: URL.createObjectURL(file),
            preview: URL.createObjectURL(file),
          }));
          return (
            <FilesPreviewOutFormik images={media || []} preview pdfs={[]} />
          );
        },
        accessorKey: "media",
        header: () => <span>{t("attachments")}</span>,
      },
    ],
    []
  );
  ///
  /////////// CUSTOM HOOKS
  ///
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      navigate(`/selling/honesty/all-honest/${data.bond_id}`);
    },
  });
  ///
  /////////// STATES
  ///
  const [dataSource, setDataSource] = useState([]);
  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setDataSource(sanadData.tableData);
  }, []);
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <div className="py-16">
      <h3 className="font-bold mb-2">{t("main data")}</h3>
      <div className="p-8 rounded bg-white shadow-lg">
        <ul className="columns-3 list-disc">
          <li className="py-1">
            <span className="font-bold">{t("client name")}: </span>
            {sanadData.client_name}
          </li>
          <li className="py-1">
            <span className="font-bold">{t("approximate cost")}: </span>
            {formatReyal(Number(sanadData.totalApproximateCost))}
          </li>
          <li className="py-1">
            <span className="font-bold">{t("paid cost")}: </span>
            {formatReyal(Number(sanadData.amount))}
          </li>
          <li className="py-1">
            <span className="font-bold">{t("remaining cost")}: </span>
            {formatReyal(Number(sanadData.remaining_amount))}
          </li>
          <li className="py-1">
            <span className="font-bold">{t("date")}: </span>
            {new Date(sanadData.bond_date).toISOString().slice(0, 10)}
          </li>
        </ul>
      </div>
      <div className="my-8">
        <h3 className="font-bold mb-2">{t("final review")}</h3>
        <Table data={dataSource} columns={Cols}></Table>
      </div>
      <div className="flex items-center justify-end gap-x-4 mr-auto">
        <div className="animate_from_right">
          <Button bordered action={() => setStage(1)}>
            {t("back")}
          </Button>
        </div>
        <div className="animate_from_bottom">
          <Button
            action={() => {
              mutate({
                endpointName: "branchSafety/api/v1/create",
                values: finalData,
                dataType: "formData",
              });
            }}
            loading={isLoading}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
