import { t } from "i18next";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RiArrowGoBackFill, RiErrorWarningFill } from "react-icons/ri";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { RecivedItemTP } from "../../../utils/selling";
import { notify } from "../../../utils/toast";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdLocalOffer,
  MdOutlineCancel,
  MdOutlineLocalOffer,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { numberContext } from "../../../context/settings/number-formatter";
import { ViewIcon } from "../../../components/atoms/icons";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import { AcceptedItemsAccountingEntry } from "../../../components/selling/recieve items/AcceptedItemsAccountingEntry";
import { Button } from "../../../components/atoms";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Modal } from "../../../components/molecules";
import { ItemDetailsTable } from "../../../components/selling/recieve items/ItemDetailsTable";
import { Loading } from "../../../components/organisms/Loading";

type RecieveItemsSecondScreenProps_TP = {
  setStage: Dispatch<SetStateAction<number>>;
  selectedItem: RecivedItemTP;
  setSanadId?: Dispatch<SetStateAction<number>>;
  openModal?: boolean;
};
const SortPiecesSecondScreen = ({
  setStage,
  selectedItem,
  setSanadId,
  openModal,
}: RecieveItemsSecondScreenProps_TP) => {
  const isSanadOpened = selectedItem.bond_status !== 0;
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [dataSource, setDataSource] = useState({});
  const [sortItems, setSortItems] = useState([]);
  const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState<boolean>(false);
  const [openRefusedModal, setOpenRefusedModal] = useState<boolean>(false);
  const [isItRefusedAllBtn, setIsItRefusedAllBtn] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [
    disableSelectedCheckAfterSendById,
    setDisableSelectedCheckAfterSendById,
  ] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const { formatGram, formatReyal } = numberContext();

  const navigate = useNavigate();
  // side effects
  useEffect(() => {
    setSanadId && setSanadId(selectedItem.id);
  }, [selectedItem]);

  const { data, isSuccess, refetch, isRefetching, isLoading } = useFetch({
    endpoint:
      search === ""
        ? `branchManage/api/v1/get-Bond-Items/${userData?.branch_id}/${selectedItem?.id}?page=${page}`
        : `${search}`,
    queryKey: ["get-item-bonds"],
    pagination: true,
    onSuccess(data) {
      setSortItems(data.data.items);
    },
  });

  const {
    isLoading: receivedLoading,
    mutate: mutateReceived,
    isSuccess: receivedSuccess,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      const uniqueSelectedItems = Array.from(
        new Set(selectedRows.map((obj) => obj.id))
      ).map((id) => {
        return selectedRows.find((obj) => obj.id === id);
      });
      const filteredArray = sortItems?.filter(
        (item) =>
          !disableSelectedCheckAfterSendById.includes(item.id) &&
          item.item_status === "Waiting"
      );
      setOpenAcceptModal(false);
      notify("success");
      setOpenRefusedModal(false);
      if (!isSanadOpened) setStage(3);
      if (
        isSanadOpened &&
        filteredArray.length === uniqueSelectedItems.length
      ) {
        notify("info", `${t("all bond items has been received")}`);
        setStage(1);
      }
      const selectedRowsIds = structuredClone(selectedRows)?.map(
        (item) => item.id
      );
      setDisableSelectedCheckAfterSendById((prev) => [
        ...prev,
        ...selectedRowsIds,
      ]);
      setSelectedRows([]);
      refetch();
    },
  });
  const { mutate: mutateReject, isLoading: rejectLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      const uniqueSelectedItems = Array.from(
        new Set(selectedRows.map((obj) => obj.id))
      ).map((id) => {
        return selectedRows.find((obj) => obj.id === id);
      });
      const filteredArray = sortItems?.filter(
        (item) =>
          !disableSelectedCheckAfterSendById.includes(item.id) &&
          item.item_status === "Waiting"
      );
      setOpenRefusedModal(false);
      notify("success");
      if (!isSanadOpened) setStage(1);
      if (
        isSanadOpened &&
        filteredArray.length === uniqueSelectedItems.length
      ) {
        notify("info", `${t("all bond items has been reject")}`);
        setStage(1);
      }
      const selectedRowsIds = structuredClone(selectedRows)?.map(
        (item) => item.id
      );
      setDisableSelectedCheckAfterSendById((prev) => [
        ...prev,
        ...selectedRowsIds,
      ]);
      setSelectedRows([]);
      refetch();
    },
  });

  // const handleCheckboxChange = (event: any, selectedRow: any) => {
  //   const checkboxId = event.target.id;
  //   if (event.target.checked) {
  //     setSelectedRows((prevSelectedItems: any) => [
  //       ...prevSelectedItems,
  //       selectedRow.row.original,
  //     ]);
  //   } else {
  //     setSelectedRows((prevSelectedItems: any) =>
  //       prevSelectedItems.filter((item: any) => item.id !== +checkboxId)
  //     );
  //   }
  // };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    selectedRow: any
  ) => {
    const isChecked = event.target.checked;
    const rowId = selectedRow.row.original.id;

    setSelectedRows((prevSelectedItems) => {
      if (isChecked) {
        return [...prevSelectedItems, selectedRow.row.original];
      } else {
        return prevSelectedItems.filter((item) => item.id !== rowId);
      }
    });
  };

  // Select all handler
  const handleSelectAllChange = () => {
    const filteredArray =
      sortItems?.filter(
        (item) =>
          !disableSelectedCheckAfterSendById.includes(item.id) &&
          item.item_status === "Waiting"
      ) || [];

    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredArray);
    }

    setSelectAll(!selectAll);
  };

  const isRowSelected = (id: number) => {
    return selectedRows.some((row) => row.id === id);
  };

  const Cols = useMemo<any>(
    () => [
      {
        header: () => (
          <input
            type="checkbox"
            className="border-mainGreen text-mainGreen rounded"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
        ),
        accessorKey: "action",
        cell: (info: any) => {
          const rowId = info.row.original.id;
          const disabled = disableSelectedCheckAfterSendById.includes(rowId);

          return (
            <div className="flex items-center justify-center gap-4">
              <input
                type="checkbox"
                className={`border-mainGreen text-mainGreen rounded ${
                  disabled && "bg-mainGreen"
                }`}
                id={rowId}
                name="selectedItem"
                checked={isRowSelected(rowId) || selectAll}
                onChange={(event) => handleCheckboxChange(event, info)}
                disabled={disabled}
              />
            </div>
          );
        },
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
        accessorKey: "mineral",
        header: () => <span>{t("mineral type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
        accessorKey: "wage_total",
        header: () => <span>{t("total wages")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() == 0 ? "---" : formatGram(Number(info.getValue())),
        accessorKey: "stones_weight",
        header: () => <span>{t("other stones weight")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() == 0 ? "---" : formatReyal(Number(info.getValue())),
        accessorKey: "selling_price",
        header: () => <span>{t("selling price")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() == 0 ? "---" : formatGram(Number(info.getValue())),
        accessorKey: "diamond_weight",
        header: () => <span>{t("diamond weight")}</span>,
      },
      {
        cell: (info: any) => (
          <ViewIcon
            size={23}
            action={() => {
              setModalOpen(true);
              setSelectedRowDetailsId(info.row.original.id);
            }}
            className="text-mainGreen mx-auto"
          />
        ),
        accessorKey: "view",
        header: () => <span>{t("details")}</span>,
      },
    ],
    [
      sortItems,
      receivedSuccess,
      disableSelectedCheckAfterSendById,
      selectAll,
      selectedRows,
    ]
  );

  useEffect(() => {
    setDataSource(sortItems?.filter((item) => item.item_status === "Waiting"));
  }, [disableSelectedCheckAfterSendById, selectedRows, sortItems]);

  // variables
  // TOTALS
  const total24 = sortItems
    ?.filter((piece) => piece.karat === "24")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const total22 = sortItems
    ?.filter((piece) => piece.karat === "22")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const total21 = sortItems
    ?.filter((piece) => piece.karat === "21")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const total18 = sortItems
    ?.filter((piece) => piece.karat === "18")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const allItemsCount = selectedItem?.items?.[0]?.allboxes?.allcounts;

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: sortItems?.length,
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
  ];

  const handleTableSearch = () => {
    const matchedHwyaRow = dataSource.filter(
      (item) => item.hwya === searchInputValue
    );
    setDataSource(matchedHwyaRow);
  };

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  if (isLoading || isRefetching) return <Loading mainTitle="loading items" />;

  return (
    <>
      <div className="my-8 md:my-16 mx-4 md:mx-16">
        <h3 className="font-bold">{t("receive items in branch")}</h3>
        <p className="text-sm font-bold mt-2 mb:4 md:mb-8">
          {t("bonds aggregations")}
        </p>
        <ul className="grid grid-cols-4 gap-6 mb-5">
          {totals.map(({ name, key, unit, value }) => (
            <BoxesDataBase variant="secondary" key={key}>
              <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
                {name}
              </p>
              <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                {formatReyal(Number(value))} {t(unit)}
              </p>
            </BoxesDataBase>
          ))}
        </ul>
        {/* {!dataSource?.length && !openModal ? (
          <>
            <h2 className="font-bold text-xl mx-auto my-8 text-mainGreen bg-lightGreen p-2 rounded-lg w-fit">
              {t("bond has been closed")}
            </h2>
            <AcceptedItemsAccountingEntry
              sanadId={selectedItem.id}
              isInPopup
              setStage={setStage}
              isInReceivedComp
            />
            {!openModal && (
              <Button
                className="mr-auto flex"
                action={() => setStage((prev) => prev - 1)}
                bordered
              >
                {t("back")}
              </Button>
            )}
          </>
        ) : ( */}
        <>
          <div className="flex justify-between m-4">
            <div>
              <input
                className="mb-5 shadow-lg rounded p-2"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
              <Button
                className="mx-4"
                disabled={searchInputValue === ""}
                bordered
                action={handleTableSearch}
              >
                {t("search")}
              </Button>
              <Button
                className="mx-4"
                bordered
                action={() => {
                  setDataSource(
                    sortItems?.filter((item) => item.item_status === "Waiting")
                  );
                }}
              >
                {t("empty search")}
              </Button>
            </div>
            <div className="flex flex-col mr-auto items-end justify-end">
              <Link to="/selling/payoff/supply-payoff">
                <Button bordered>{t("go to payoff")}</Button>
              </Link>
              <p className="text-end">
                {t("selected items count")}:{selectedRows.length}
              </p>
            </div>
          </div>
          <Table data={dataSource || []} columns={Cols}>
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{data?.current_page}</span>
                {t("from")}
                {<span className=" text-mainGreen">{data?.pages}</span>}
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
                  disabled={page == data?.pages}
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
          <div className="flex justify-between mt-2 md:mt-8">
            <div className="flex gap-x-4">
              <div className="flex gap-4">
                <Button
                  className="bg-mainOrange text-white"
                  action={() => {
                    if (selectedRows.length === 0)
                      notify("info", `${t("select item at least")}`);
                    else setOpenAcceptModal(true);
                  }}
                >
                  {t("offer selling")}
                </Button>
              </div>
              <div className="flex gap-4">
                <Button
                  className="text-mainOrange border-mainOrange"
                  action={() => {
                    if (selectedRows?.length === 0)
                      notify("info", `${t("select item at least")}`);
                    else setOpenRefusedModal(true);
                  }}
                  bordered
                >
                  {t("return")}
                </Button>
              </div>
            </div>

            <Button
              className="mr-auto"
              action={() => setStage((prev) => prev - 1)}
              bordered
            >
              {t("back")}
            </Button>
          </div>
        </>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ItemDetailsTable
            selectedItem={sortItems}
            selectedRowDetailsId={selectedRowDetailsId}
          />
        </Modal>
        <Modal
          isOpen={openAcceptModal}
          onClose={() => setOpenAcceptModal(false)}
        >
          <div className="flex flex-col items-center justify-center gap-y-4">
            <RiErrorWarningFill
              className="text-4xl scale-150 mb-5"
              fill="#EF432C"
            />
            <h3>{t("are you sure to return selected items")}</h3>
            <div className="flex gap-x-4 mt-5">
              <Button
                loading={receivedLoading}
                onClick={() => {
                  const selectedItems = selectedRows.map((item) => ({
                    hwya: item.hwya,
                    item_id: item.item_id,
                    weight: item.weight,
                    wage: item.wage,
                    front: item.front,
                    id: +selectedItem?.id,
                  }));

                  const receivedFinalValue = {
                    isPart: 0,
                    id: selectedItem?.id,
                    branch_id: userData?.branch_id,
                    items: selectedItems,
                    entity_gold_price: selectedItem?.entity_gold_price,
                    api_gold_price: selectedItem?.api_gold_price,
                    type: selectedItem?.type,
                  };

                  const isPartItems = sortItems?.some(
                    (sort) => sort.item_status !== "Waiting"
                  );

                  const isPart = sortItems?.every(
                    (sort) => sort.item_status === "Waiting"
                  );

                  const receivedAllFinalValue = {
                    isPart: isPart ? 1 : 0,
                    isPartItems: isPartItems ? 1 : 0,
                    id: selectedItem?.id,
                    branch_id: userData?.branch_id,
                    entity_gold_price: selectedItem?.entity_gold_price,
                    api_gold_price: selectedItem?.api_gold_price,
                    type: selectedItem?.type,
                  };

                  const isSelectedAllItems =
                    selectedRows?.length === dataSource?.length
                      ? receivedAllFinalValue
                      : receivedFinalValue;

                  mutateReceived({
                    endpointName: "branchManage/api/v1/accept-items",
                    values: isSelectedAllItems,
                  });
                }}
              >
                {t("confirm")}
              </Button>
              <Button
                bordered
                onClick={() => {
                  setOpenAcceptModal(false);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={openRefusedModal}
          onClose={() => setOpenRefusedModal(false)}
        >
          <div className="flex flex-col items-center justify-center gap-y-4">
            <RiErrorWarningFill
              className="text-4xl scale-150 mb-5"
              fill="#EF432C"
            />
            <h3>{t("are you sure to reject items")}</h3>
            <div className="flex gap-x-4 mt-5">
              <Button
                loading={rejectLoading}
                onClick={() => {
                  const selectedItems = selectedRows.map((item) => ({
                    hwya: item.hwya,
                    item_id: item.item_id,
                    weight: item.weight,
                    wage: item.wage,
                    front: item.front,
                    id: +selectedItem?.id,
                  }));
                  const rejectFinalValue = {
                    id: selectedItem?.id,
                    branch_id: userData?.branch_id,
                    items: selectedItems,
                    entity_gold_price: selectedItem?.entity_gold_price,
                    api_gold_price: selectedItem?.api_gold_price,
                    type: selectedItem?.type,
                    allRejected:
                      sortItems?.length === selectedRows.length &&
                      isItRefusedAllBtn
                        ? true
                        : false,
                    ...(isItRefusedAllBtn ? { media: files } : {}),
                  };

                  // const isAllRejected =
                  //   selectedItem.items.length === selectedRows.length && isItRefusedAllBtn
                  //     ? true
                  //     : false;

                  // const receivedFinalValue = {
                  //   id: selectedItem?.id,
                  //   branch_id: userData?.branch_id,
                  //   allRejected: isAllRejected,
                  //   items: selectedItems,
                  //   entity_gold_price: selectedItem?.entity_gold_price,
                  //   api_gold_price: selectedItem?.api_gold_price,
                  //   type: selectedItem?.type,
                  // };

                  // const receivedAllFinalValue = {
                  //   id: selectedItem?.id,
                  //   allRejected: isAllRejected,
                  //   branch_id: userData?.branch_id,
                  //   items: selectedItems,
                  //   entity_gold_price: selectedItem?.entity_gold_price,
                  //   api_gold_price: selectedItem?.api_gold_price,
                  //   type: selectedItem?.type,
                  // };

                  // const isSelectedAllItems =
                  //   selectedRows?.length === dataSource?.length
                  //     ? receivedAllFinalValue
                  //     : receivedFinalValue;

                  mutateReject({
                    endpointName: "branchManage/api/v1/reject-items",
                    values: rejectFinalValue,
                    dataType: "formData",
                  });

                  setSelectedRows([]);
                }}
              >
                {t("reject")}
              </Button>
              <Button
                bordered
                onClick={() => {
                  setOpenRefusedModal(false);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default SortPiecesSecondScreen;
