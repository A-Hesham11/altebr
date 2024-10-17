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

export const SupplyYieldRestrictions = ({}) => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const [dataSource, setDataSource] = useState([]);
  console.log("🚀 ~ dataSource:", dataSource);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [restrictModal, setOpenRestrictModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [stage, setStage] = useState(1)
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
          const itemsCount = info.row.original.items.length
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
      <Modal isOpen={restrictModal} onClose={() => setOpenRestrictModal(false)}>
        <SupplyYieldRestrictionsEntry
          selectedItem={selectedItem}
          setStage={setStage}
          isInPopup
        />
      </Modal>
    </div>
  );
};
