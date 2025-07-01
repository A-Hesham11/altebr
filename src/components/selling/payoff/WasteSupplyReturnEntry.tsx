import React, { useContext, useEffect, useMemo, useState } from "react";
import { ViewIcon } from "../../atoms/icons";
import { BiSpreadsheet } from "react-icons/bi";
import { useFetch, useIsRTL } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { t } from "i18next";
import { Loading } from "../../organisms/Loading";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { Button } from "../../atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { notify } from "../../../utils/toast";
import { Modal } from "../../molecules";
import RejectedItemsInvoice from "../recieve items/RejectedItemsInvoice";
import { SupplyYieldRestrictionsEntry } from "./SupplyYieldRestrictionsEntry";
import WasteSupplyRejectedInvoice from "./WasteSupplyRejectedInvoice";
import WasteSupplyRejectedEntry from "./WasteSupplyRejectedEntry";
import { WasteSupplyRejectedEntryFirst } from "./WasteSupplyRejectedEntryFirst";
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase";
import { numberContext } from "../../../context/settings/number-formatter";

const WasteSupplyReturnEntry = () => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const { formatReyal, formatGram } = numberContext();
  const { userData } = useContext(authCtx);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [restrictModal, setOpenRestrictModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [stage, setStage] = useState(1);
  const { data, isSuccess, refetch, isRefetching, isLoading } = useFetch({
    endpoint:
      search === ""
        ? `/wastingGold/api/v1/wastingBond/${userData?.branch_id}?page=${page}`
        : `${search}`,
    queryKey: ["wasting_Bond"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data?.data);
    },
  });

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("item number")}</span>,
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
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("gold karat")}</span>,
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
          selectedItem?.api_gold_price
            ? formatReyal(Number(selectedItem?.api_gold_price))
            : "---",
        accessorKey: "api_gold_price",
        header: () => <span>{t("selling price")}</span>,
      },
    ],
    []
  );

  const goldCols = useMemo<any>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "date",
        header: () => <span>{t("receive date")}</span>,
      },
      {
        cell: (info: any) => {
          const itemsCount = info.row.original.items.length;
          return itemsCount;
        },
        accessorKey: "count_items",
        header: () => <span>{t("items count")}</span>,
      },
      {
        cell: (info: any) => (
          <BiSpreadsheet
            size={23}
            onClick={() => {
              setOpenRestrictModal(true);
              setSelectedItem(info.row.original);
            }}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "restriction",
        header: () => <span>{t("restriction")}</span>,
      },
      {
        cell: (info: any) => (
          <ViewIcon
            size={23}
            action={() => {
              setOpenInvoiceModal(true);
              setSelectedItem(info.row.original);
            }}
            className="text-mainGreen mx-auto"
          />
        ),
        accessorKey: "view",
        header: () => <span>{t("invoice")}</span>,
      },
    ],
    [data, dataSource]
  );

  const total24 = selectedItem?.counts?.total_3yar_24 || 0;
  const total22 = selectedItem?.counts?.total_3yar_22 || 0;
  const total21 = selectedItem?.counts?.total_3yar_21 || 0;
  const total18 = selectedItem?.counts?.total_3yar_18 || 0;
  const allCounts = selectedItem?.counts?.items_count || 0;
  const totalWages = selectedItem?.counts?.wage_total || 0;

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: allCounts,
    },
    {
      name: "إجمالي وزن 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total24,
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total22,
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total21,
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total18,
    },
    {
      name: t("total wages"),
      key: crypto.randomUUID(),
      unit: t("ryal"),
      value: totalWages,
    },
  ];

  // use effects
  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <div className="px-2 md:px-16 py-2 md:py-8">
      <h3 className="font-bold">{t("payoff")}</h3>
      {(isLoading || isRefetching) && (
        <Loading mainTitle={t("loading items")} />
      )}
      {!dataSource?.length && isRefetching && (
        <h4 className="text-center font-bold mt-16">{t("no results found")}</h4>
      )}
      {isSuccess &&
        !!dataSource &&
        !isLoading &&
        !isRefetching &&
        !!dataSource.length && (
          <Table data={dataSource} columns={goldCols}>
            <div className="mt-3 flex items-center justify-end gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{data.current_page}</span>
                {t("from")}
                <span className=" text-mainGreen">{data.pages}</span>
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]"
                  action={() => setPage((prev) => prev - 1)}
                  disabled={page == 1}
                >
                  {isRTL ? (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  )}
                </Button>
                <Button
                  className="rounded bg-mainGreen p-[.18rem]"
                  action={() => setPage((prev) => prev + 1)}
                  disabled={page == data.pages}
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
        )}
      <Modal
        isOpen={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
      >
        <WasteSupplyRejectedInvoice item={selectedItem} />
      </Modal>
      {selectedItem?.branch_is_wasting === 0 ? (
        <Modal
          isOpen={restrictModal}
          onClose={() => setOpenRestrictModal(false)}
        >
          <WasteSupplyRejectedEntryFirst
            selectedItem={selectedItem}
            setStage={setStage}
            isInPopup
          />
        </Modal>
      ) : (
        <Modal
          isOpen={restrictModal}
          onClose={() => setOpenRestrictModal(false)}
        >
          <ul className="grid grid-cols-4 gap-6 mb-5 md:mb-16 mt-14">
            {totals.map(({ name, key, unit, value }) => (
              <BoxesDataBase variant="secondary" key={key}>
                <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
                  {name}
                </p>
                <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                  {value} {t(unit)}
                </p>
              </BoxesDataBase>
            ))}
          </ul>
          <Table
            data={selectedItem?.items}
            columns={tableColumn}
            showNavigation
          ></Table>
          <div className="my-6">
            <h2 className="text-xl mb-5 font-bold">
              {t("Accounting entry for returning parts to management")}{" "}
              {selectedItem && selectedItem?.branch_is_wasting === 1 && (
                <span>({t("Convert new pieces to fractions")})</span>
              )}
            </h2>
            <WasteSupplyRejectedEntry
              boxes={selectedItem?.boxes || []}
              currentBox={1}
            />
          </div>
          <div className="my-6">
            <h2 className="text-xl mb-5 font-bold">
              {t("Accounting entry for wasted wages")}
            </h2>
            <WasteSupplyRejectedEntry
              boxes={selectedItem?.boxes2 || []}
              currentBox={2}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WasteSupplyReturnEntry;
