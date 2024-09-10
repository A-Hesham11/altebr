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
import { numberContext } from "../../../context/settings/number-formatter";
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon } from "../../../components/atoms/icons";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import { AcceptedItemsAccountingEntry } from "../../../components/selling/recieve items/AcceptedItemsAccountingEntry";
import { Button } from "../../../components/atoms";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Modal } from "../../../components/molecules";
import { ItemDetailsTable } from "../../../components/selling/recieve items/ItemDetailsTable";
import { Loading } from "../../../components/organisms/Loading";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

type RecieveItemsSecondScreenProps_TP = {
  setStage: Dispatch<SetStateAction<number>>;
  selectedItem: RecivedItemTP;
  setSanadId?: Dispatch<SetStateAction<number>>;
  openModal?: boolean;
};
const RecentItemsSecondScreen = ({
  setStage,
  selectedItem,
  setSanadId,
  openModal,
}: RecieveItemsSecondScreenProps_TP) => {
  const isSanadOpened = selectedItem.bond_status !== 0;
  console.log("🚀 ~ isSanadOpened:", isSanadOpened);
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [dataSource, setDataSource] = useState({});
  const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState<boolean>(false);
  const [openRefusedModal, setOpenRefusedModal] = useState<boolean>(false);
  const [isItRefusedAllBtn, setIsItRefusedAllBtn] = useState<boolean>(false);
  const [newSelectData, setNewSelectData] = useState([]);
  const [page, setPage] = useState<number>(1);

  const [search, setSearch] = useState("");
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
      console.log("🚀 ~ onSuccess ~ data:", data);
      setNewSelectData(data.data.items);
    },
  });

  console.log("🚀 ~ data:", data);

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
      const filteredArray = newSelectData?.filter(
        (item) =>
          !disableSelectedCheckAfterSendById.includes(item.id) &&
          item.item_status === "Waiting"
      );
      setOpenAcceptModal(false);
      notify("success");
      setOpenRefusedModal(false);
      setStage(3);
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
      const filteredArray = newSelectData?.filter(
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
    },
  });

  const Cols = useMemo<any>(
    () => [
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
    [newSelectData, receivedSuccess, disableSelectedCheckAfterSendById]
  );

  // variables
  // TOTALS
  const total24 = newSelectData
    ?.filter((piece) => piece.karat === "24")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const total22 = newSelectData
    ?.filter((piece) => piece.karat === "22")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const total21 = newSelectData
    ?.filter((piece) => piece.karat === "21")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const total18 = newSelectData
    ?.filter((piece) => piece.karat === "18")
    ?.reduce((acc, { weight }) => acc + +weight, 0);

  const allItemsCount = selectedItem?.items?.[0]?.allboxes?.allcounts;

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: newSelectData?.length,
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

  useEffect(() => {
    setDataSource(newSelectData);
  }, [disableSelectedCheckAfterSendById, selectedRows, newSelectData]);

  const handleTableSearch = () => {
    const matchedHwyaRow = dataSource?.filter(
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
        {!openModal && (
          <>
            <h3 className="font-bold">{t("receive items in branch")}</h3>
            <p className="text-sm font-bold mt-2 mb:4 md:mb-8">
              {t("bonds aggregations")}
            </p>
          </>
        )}
        <ul className="grid grid-cols-4 gap-6 mb-5">
          {totals?.map(({ name, key, unit, value }) => (
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

        <div className="flex justify-end my-5">
          <FilesUpload setFiles={setFiles} files={files} />
        </div>

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
                  newSelectData?.filter(
                    (item) => item.item_status === "Waiting"
                  )
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
          <div className="flex gap-4">
            <Button
              className="bg-mainOrange text-white"
              action={() => {
                files.length
                  ? setOpenAcceptModal(true)
                  : notify("info", `${t("attachments is required")}`);
              }}
            >
              {t("receive all bond")}
            </Button>
            <Button
              className="border-mainOrange text-mainOrange"
              action={() => {
                setOpenRefusedModal(true);
                setSelectedRows(newSelectData);
                setIsItRefusedAllBtn(true);
              }}
              bordered
            >
              {t("refuse all")}
            </Button>
          </div>

          <Button
            className="mr-auto"
            action={() => setStage((prev) => prev - 1)}
            bordered
          >
            {t("back")}
          </Button>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ItemDetailsTable
            selectedItem={newSelectData}
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

                  // const receivedFinalValue = {
                  //   id: selectedItem?.id,
                  //   branch_id: userData?.branch_id,
                  //   allItems: selectedItem.items.map((item) => {
                  //     return {
                  //       hwya: item.hwya,
                  //       front: item.front,
                  //     };
                  //   }),
                  //   items: selectedItems,
                  //   entity_gold_price: selectedItem?.entity_gold_price,
                  //   api_gold_price: selectedItem?.api_gold_price,
                  //   type: selectedItem?.type,
                  // };

                  mutateReceived({
                    endpointName: "branchManage/api/v1/restriction-items",
                    // values: { ...receivedFinalValue, media: files },
                    values: {
                      id: selectedItem?.id,
                      branch_id: userData?.branch_id,
                      media: files,
                    },
                    dataType: "formData",
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
                    // items: selectedItems,
                    entity_gold_price: selectedItem?.entity_gold_price,
                    api_gold_price: selectedItem?.api_gold_price,
                    type: selectedItem?.type,
                    allRejected:true,
                    ...(isItRefusedAllBtn ? { media: files } : {}),
                  };
                  setSelectedRows([]);
                  mutateReject({
                    endpointName: "branchManage/api/v1/reject-items",
                    // values: rejectFinalValue,
                    values: rejectFinalValue,
                    dataType: "formData",
                  });
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

export default RecentItemsSecondScreen;
