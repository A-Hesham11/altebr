import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { Loading } from "../../../components/organisms/Loading";
import { Back } from "../../../utils/utils-components/Back";
import { useFetch, useIsRTL } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/molecules";
import TableOfIdentitiesPreview from "./TableOfIdentitiesPreview";
import { useMemo, useState } from "react";
import { BsEye } from "react-icons/bs";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { notify } from "../../../utils/toast";

interface ImportTotals_TP {
  totals?: object;
  pieces?: object[];
  importPageResponse: number;
  setImportPageResponse: any;
}

const ImportTotals: React.FC<ImportTotals_TP> = ({
  totals,
  pieces,
  setImportPageResponse,
  importPageResponse,
}) => {
  console.log("🚀 ~ pieces:", pieces);
  // DATA FROM THE RESPONSE ON MUTATE (WITH KEY "get")
  const { formatReyal, formatGram } = numberContext();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [page, setPage] = useState(1);
  const isRTL = useIsRTL();

  const {
    data: importData,
    isFetching,
    isRefetching,
    isLoading,
  } = useFetch({
    queryKey: ["totals-data"],
    endpoint: "/tarqimGold/api/v1/imported-items",
    onError: (error) => {
      notify("error", error?.response?.data?.errors);
    },
  });

  const {
    data: imprtPieces,
    isFetching: imprtPiecesIsFetching,
    isRefetching: imprtPiecesIsRefetching,
    isLoading: imprtPiecesIsLoading,
  } = useFetch({
    queryKey: ["pieces-data", page],
    endpoint: `/tarqimGold/api/v1/imported-items-details?page=${page}`,
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || ++info.row.index || "---",
        accessorKey: "id",
        header: () => <span>{t("Id number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("id code")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "model_number",
        header: () => <span>{t("modal number")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <div
              className={`${
                info.row.original.weight === "0" &&
                "bg-mainOrange text-white p-2"
              }`}
            >
              {info.getValue() ? formatGram(Number(info.getValue())) : "---"}
            </div>
          );
        },
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "supplier",
        header: () => <span>{t("supplier")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "bond_id",
        header: () => <span>{t("supply bond")}</span>,
      },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return formatReyal(wages);
        },
        accessorKey: "wages",
        header: () => <span>{t("wages")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "branch",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setSelectedItem(info.row.original);
              setOpenIdentitiesModal(true);
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  const tarqimBoxes = [
    {
      account: "total pieces",
      id: 1,
      value: pieces?.total || imprtPieces?.total,
      unit: "piece",
    },
    {
      account: "total wages",
      id: 6,
      value: totals
        ? formatReyal(totals?.total_wage)
        : formatReyal(importData?.total_wage),
      unit: "ryal",
    },
    {
      account: "total weight of 18 karat",
      id: 7,
      value: totals
        ? formatGram(totals?.total_weight_karat18)
        : formatGram(importData?.total_weight_karat18),
      unit: "gram",
    },
    {
      account: "total weight of 21 karat",
      id: 8,
      value: totals
        ? formatGram(totals?.total_weight_karat21)
        : formatGram(importData?.total_weight_karat21),
      unit: "gram",
    },
    {
      account: "total weight of 22 karat",
      id: 9,
      value: totals
        ? formatGram(totals?.total_weight_karat22)
        : formatGram(importData?.total_weight_karat22),
      unit: "gram",
    },
    {
      account: "total weight of 24 karat",
      id: 10,
      value: totals
        ? formatGram(totals?.total_weight_karat24)
        : formatGram(importData?.total_weight_karat24),
      unit: "gram",
    },
    {
      account: "total weight converted to 24",
      id: 11,
      value: totals
        ? formatGram(totals?.karat_diffrence)
        : formatGram(importData?.karat_diffrence),
      unit: "gram",
    },
    {
      account: "total karat difference",
      id: 11,
      value: totals
        ? formatGram(totals?.farq_karat)
        : formatGram(importData?.farq_karat),
      unit: "gram",
    },
    {
      account: "total tax",
      id: 12,
      value: totals
        ? formatReyal(totals?.total_tax)
        : formatReyal(importData?.total_tax),
      unit: "ryal",
    },
    {
      account: "total diamond",
      id: 13,
      value: totals
        ? formatGram(totals?.diamond_total_selling_price)
        : formatGram(importData?.diamond_total_selling_price),
      unit: "gram",
    },
    {
      account: "total motafreqat",
      id: 14,
      value: totals
        ? formatGram(totals?.motafreqat_total_selling_price)
        : formatGram(importData?.motafreqat_total_selling_price),
      unit: "gram",
    },

    {
      account: "total gold stones",
      id: 14,
      value: totals
        ? formatGram(totals?.gold_ahgar_count)
        : formatGram(importData?.gold_ahgar_count),
      unit: "pieces",
    },
    {
      account: "total gold stones weight",
      id: 14,
      value: totals
        ? formatGram(totals?.gold_ahgar_weight)
        : formatGram(importData?.gold_ahgar_weight),
      unit: "gram",
    },
    {
      account: "total diamond stones",
      id: 14,
      value: totals
        ? formatGram(totals?.diamond_ahgar_count)
        : formatGram(importData?.diamond_ahgar_count),
      unit: "piece",
    },
    {
      account: "total diamond stones weight",
      id: 14,
      value: totals
        ? formatGram(totals?.diamond_ahgar_weight)
        : formatGram(importData?.diamond_ahgar_weight),
      unit: "gram",
    },
    {
      account: "total motafreqat stones",
      id: 14,
      value: totals
        ? formatGram(totals?.motafreqat_ahgar_count)
        : formatGram(importData?.motafreqat_ahgar_count),
      unit: "piece",
    },
    {
      account: "total motafreqat stones weight",
      id: 14,
      value: totals
        ? formatGram(totals?.motafreqat_ahgar_weight)
        : formatGram(importData?.motafreqat_ahgar_weight),
      unit: "gram",
    },
  ];

  // LOADING ....
  if (
    isFetching ||
    isRefetching ||
    isLoading ||
    imprtPiecesIsFetching ||
    imprtPiecesIsLoading ||
    imprtPiecesIsRefetching
  )
    return <Loading mainTitle={`${t("loading totals")}`} />;

  return (
    <div>
      <div className="py-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold text-slate-700">
            {t("totals of imported pieces")}
          </h3>
        </div>
        {pieces?.data?.length > 0 || imprtPieces?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tarqimBoxes?.map((data: any) => (
              <li
                key={data?.id}
                className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md"
              >
                <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                  {t(`${data?.account}`)}
                </p>
                <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                  {data?.value} <span>{t(`${data?.unit}`)}</span>
                </p>
              </li>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center my-10">
            <h3 className="text-2xl font-bold text-mainGreen">
              {t("there is no imported data")}
            </h3>
          </div>
        )}
      </div>

      <Table
        data={pieces?.data || imprtPieces?.data || []}
        columns={tableColumn}
      >
        <div className="mt-3 flex items-center justify-center gap-5 p-2">
          <div className="flex items-center gap-2 font-bold">
            {t("page")}
            <span className=" text-mainGreen">
              {importPageResponse || page}
            </span>
            {t("from")}
            {
              <span className=" text-mainGreen">
                {pieces?.pages || imprtPieces?.pages}
              </span>
            }
          </div>
          <div className="flex items-center gap-2 ">
            <Button
              className=" rounded bg-mainGreen p-[.18rem]"
              action={() => {
                if (pieces?.data?.length > 0) {
                  setImportPageResponse((prev: number) => prev - 1);
                } else {
                  setPage((prev: any) => prev - 1);
                }
              }}
              disabled={
                pieces?.data?.length > 0 ? importPageResponse == 1 : page == 1
              }
            >
              {isRTL ? (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              )}
            </Button>

            <Button
              className="rounded bg-mainGreen p-[.18rem]"
              action={() => {
                if (pieces?.data?.length > 0) {
                  setImportPageResponse((prev: number) => prev + 1);
                } else {
                  setPage((prev: any) => prev + 1);
                }
              }}
              disabled={page == (pieces?.pages || imprtPieces?.pages)}
            >
              {isRTL ? (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              )}
            </Button>
          </div>
        </div>
      </Table>

      <Modal
        isOpen={IdentitiesModal}
        onClose={() => setOpenIdentitiesModal(false)}
      >
        <TableOfIdentitiesPreview item={selectedItem} />
      </Modal>
    </div>
  );
};

export default ImportTotals;
