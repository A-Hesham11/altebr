import { Form, Formik } from "formik";
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
import { Link, useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../hooks";
import { formatDate } from "../../../utils/date";
import { RecivedItemTP } from "../../../utils/selling";
import { notify } from "../../../utils/toast";
import { BiSpreadsheet } from "react-icons/bi";
import { BaseInputField, Modal } from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { Loading } from "../../../components/organisms/Loading";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import RecieveItemsSecondScreen from "../../../components/selling/recieve items/RecieveItemsSecondScreen";
import { PayOffSecondScreen } from "../../../components/selling/payoff/PayOffSecondScreen";
import { AcceptedItemsAccountingEntry } from "../../../components/selling/recieve items/AcceptedItemsAccountingEntry";

type RecieveItemsFirstScreenProps_TP = {
  sanadId: number;
  setStage: Dispatch<SetStateAction<number>>;
  selectedItem: RecivedItemTP;
  setSelectedItem: Dispatch<SetStateAction<RecivedItemTP>>;
  setSanadId: Dispatch<SetStateAction<number>>;
};

const SortPiecesFirstScreen = ({
  sanadId,
  selectedItem,
  setSelectedItem,
  setStage,
  setSanadId,
}: RecieveItemsFirstScreenProps_TP) => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const [sortsData, setSortsData] = useState([]);
  const [page, setPage] = useState<number>(1);

  const dataSource = sortsData;
  console.log("🚀 ~ RecieveItemsFirstScreen ~ dataSource:", dataSource);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openMardodModal, setOpenMardodModal] = useState(false);
  const [restrictModal, setOpenRestrictModal] = useState(false);
  // const { data, isSuccess, refetch, isRefetching, isLoading } = useFetch({
  //   endpoint:
  //     search === ""
  //       ? `branchManage/api/v1/get-bonds/${userData?.branch_id}?page=${page}`
  //       : `${search}`,
  //   queryKey: ["get-bonds"],
  //   pagination: true,
  //   onSuccess(data) {
  //     setNewData(data.data);
  //   },
  // });
  // console.log("🚀 ~ RecieveItemsFirstScreen ~ data:", data);

  const {
    data: sortData,
    isSuccess: SortSuccess,
    refetch: sortRefetch,
    isRefetching: sortRefetching,
    isLoading: sortLoading,
  } = useFetch({
    endpoint:
      search === ""
        ? `branchManage/api/v1/sort-items/${userData?.branch_id}?page=${page}`
        : `${search}`,
    queryKey: ["sort-items"],
    pagination: true,
    onSuccess(data) {
      setSortsData(data.data);
    },
  });
  console.log("🚀 ~ RecieveItemsFirstScreen ~ sortData:", sortData);

  const goldCols = useMemo<any>(
    () => [
      {
        header: () => <span>{t("#")}</span>,
        accessorKey: "action",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center gap-4">
              <input
                type="radio"
                id={`selectedItem${crypto.randomUUID()}`}
                name="selectedItem"
                onClick={() => setSelectedItem(info.row.original)}
                // className={`${
                //   info.row.original.items?.every(
                //     (item) => item.acceptedItems !== 0
                //   ) && "!bg-slate-400"
                // }`}
                // disabled={info.row.original.items?.every(
                //   (item) => item.acceptedItems !== 0
                // )}

                className={`${
                  info.row.original.count_items ===
                    info.row.original.acceptedItems +
                      info.row.original.rejectItems && "!bg-slate-400"
                }`}
                disabled={
                  info.row.original.count_items ===
                  info.row.original.acceptedItems +
                    info.row.original.rejectItems
                }
              />
            </div>
          );
        },
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "bond_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("supply bond number")}</span>,
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "date",
        header: () => <span>{t("receive date")}</span>,
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "count_items",
        header: () => <span>{t("items count")}</span>,
      },
      {
        cell: (info) =>
          info.row.original.acceptedItems === info.row.original.count_items
            ? t("closed")
            : t("opened"),
        accessorKey: "band_status",
        header: () => <span>{t("item status")}</span>,
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
    ],
    [sortData, dataSource]
  );
  // functions
  const getSearchResults = async (req: any) => {
    let uri = `branchManage/api/v1/get-bonds/${userData?.branch_id}`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          uri += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          uri += `?${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(uri);
  };

  const searchValues = {
    id: "",
    date: "",
    count_items: "",
  };

  // use effects
  useEffect(() => {
    sortRefetch();
  }, [page]);

  useEffect(() => {
    // reset chosen bond for validation issue
    setSelectedItem({} as RecivedItemTP);
  }, []);

  useEffect(() => {
    if (page == 1) {
      sortRefetch();
    } else {
      setPage(1);
    }
  }, [search]);

  return (
    <div className="px-2 md:px-16 py-2 md:py-8">
      <h3 className="font-bold">{t("sort pieces")}</h3>
      <Formik
        initialValues={searchValues}
        onSubmit={(values) => {
          getSearchResults({
            ...values,
            date: values.date ? formatDate(values.date) : "",
          });
        }}
      >
        <Form className="my-8">
          <div>
            <div className="flex justify-between">
              <div className="flex gap-4 mb-4">
                <BaseInputField
                  id="id"
                  name="id"
                  placeholder={`${t("bond number")}`}
                  className="shadow-xs"
                  type="text"
                />
              </div>
              <Link to="/selling/payoff/supply-payoff">
                <Button bordered className="">
                  {t("go to payoff")}
                </Button>
              </Link>
            </div>
          </div>
        </Form>
      </Formik>
      {!dataSource.length && !sortRefetching && (
        <h2 className="font-bold text-xl mx-auto my-8 text-mainGreen bg-lightGreen p-2 rounded-lg w-fit">
          {t("no results")}
        </h2>
      )}
      {(sortRefetching || sortLoading) && (
        <Loading mainTitle={t("loading items")} />
      )}
      {!sortData?.data.length && sortRefetching && (
        <h4 className="text-center font-bold mt-16">{t("no results found")}</h4>
      )}
      {!!dataSource &&
        !sortLoading &&
        !sortRefetching &&
        !!dataSource.length && (
          <Table data={dataSource} columns={goldCols}>
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">
                  {sortData?.current_page}
                </span>
                {t("from")}
                {<span className=" text-mainGreen">{sortData?.total}</span>}
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
                  disabled={page == sortData?.pages}
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
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <RecieveItemsSecondScreen
          selectedItem={selectedItem}
          setStage={setStage}
          openModal
        />
      </Modal>
      <Modal isOpen={openMardodModal} onClose={() => setOpenMardodModal(false)}>
        <PayOffSecondScreen
          selectedItem={selectedItem}
          setSanadId={setSanadId}
          setStage={setStage}
        />
      </Modal>
      <Modal isOpen={restrictModal} onClose={() => setOpenRestrictModal(false)}>
        <AcceptedItemsAccountingEntry
          sanadId={selectedItem.id}
          setStage={setStage}
          isInPopup
        />
      </Modal>
    </div>
  );
};

export default SortPiecesFirstScreen;
