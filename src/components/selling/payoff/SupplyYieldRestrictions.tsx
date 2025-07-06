import { t } from "i18next";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { Button } from "../../atoms";
import { ViewIcon } from "../../atoms/icons";
import { Modal } from "../../molecules";
import { Loading } from "../../organisms/Loading";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { ItemDetailsTable } from "../recieve items/ItemDetailsTable";
import { BiSpreadsheet } from "react-icons/bi";
import { RejectedItemsAccountingEntry } from "../recieve items/RejectedItemsAccountingEntry";
import RejectedItemsInvoice from "../recieve items/RejectedItemsInvoice";
import { SupplyYieldRestrictionsEntry } from "./SupplyYieldRestrictionsEntry";
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase";
import WasteSupplyRejectedEntry from "./WasteSupplyRejectedEntry";
import { numberContext } from "../../../context/settings/number-formatter";

export const SupplyYieldRestrictions = ({}) => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [restrictModal, setOpenRestrictModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [stage, setStage] = useState(1);
  const { formatReyal, formatGram } = numberContext();

  const { data, isSuccess, refetch, isRefetching, isLoading } = useFetch({
    endpoint:
      search === ""
        ? `/mordItems/api/v1/morditems/${userData?.branch_id}?page=${page}`
        : `${search}`,
    queryKey: ["returned_items"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data);
    },
  });

  const goldCols = useMemo<any>(
    () => [
      {
        cell: (info) => info.getValue(),
        accessorKey: "bond_number",
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
        accessorKey: "classification",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat",
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

  const total24 = selectedItem?.items?.[0]?.allboxes?.karat24 || 0;
  const total22 = selectedItem?.items?.[0]?.allboxes?.karat22 || 0;
  const total21 = selectedItem?.items?.[0]?.allboxes?.karat21 || 0;
  const total18 = selectedItem?.items?.[0]?.allboxes?.karat18 || 0;
  const allCounts = selectedItem?.items?.[0]?.allboxes?.allcounts || 0;
  const totalWages = selectedItem?.items?.[0]?.allboxes?.wage_total || 0;

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
      value: formatGram(total24),
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(total22),
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(total21),
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(total18),
    },
    {
      name: t("total wages"),
      key: crypto.randomUUID(),
      unit: t("ryal"),
      value: formatReyal(totalWages),
    },
  ];

  // use effects
  useEffect(() => {
    refetch();
  }, [page]);

  // // useEffect(() => {
  // //     // reset chosen bond for validation issue
  // //     setSelectedItem({} as any)
  // // }, [])

  // useEffect(() => {
  //     if (page == 1) {
  //         refetch()
  //     } else {
  //         setPage(1)
  //     }
  // }, [search])

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
      <div className="flex gap-x-2 justify-end">
        <Button
          action={() => {
            if (Object.keys(selectedItem).length === 0) {
              notify("info", `${t("choose bond first")}`);
            } else if (selectedItem.mordwd === 1) {
              notify(
                "info",
                `${t("all items of this bond returned to management")}`
              );
            } else {
              setStage((prev) => prev + 1);
            }
          }}
        >
          {t("next")}
        </Button>
        <Button action={() => navigate(-1)} bordered>
          {t("back")}
        </Button>
      </div>
      <Modal
        isOpen={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
      >
        <RejectedItemsInvoice item={selectedItem} />
      </Modal>
      {/* <Modal isOpen={restrictModal} onClose={() => setOpenRestrictModal(false)}>
        <SupplyYieldRestrictionsEntry
          selectedItem={selectedItem}
          setStage={setStage}
          isInPopup
        />
      </Modal> */}

      {selectedItem?.boxes2?.length === 0 ? (
        <Modal
          isOpen={restrictModal}
          onClose={() => setOpenRestrictModal(false)}
        >
          <SupplyYieldRestrictionsEntry
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
