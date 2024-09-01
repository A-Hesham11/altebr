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

type PayOffFirstScreenProps_TP = {
  stage: number;
  setStage: Dispatch<SetStateAction<number>>;
  selectedItem: any;
  setSelectedItem: Dispatch<SetStateAction<any>>;
};

export const PayOffFirstScreen = ({
  stage,
  selectedItem,
  setSelectedItem,
  setStage,
}: PayOffFirstScreenProps_TP) => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [restrictModal, setOpenRestrictModal] = useState(false);
  const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0);
  const { data, isSuccess, refetch, isRefetching, isLoading } = useFetch({
    endpoint:
      search === ""
        ? `branchManage/api/v1/reject-on-sand/${userData?.branch_id}?page=${page}`
        : `${search}`,
    queryKey: ["reject-on-sand"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data);
    },
  });
  const goldCols = useMemo<any>(
    () => [
      {
        header: () => <span>{t("#")}</span>,
        accessorKey: "action",
        cell: (info: any) => {
          return (
            <div className="flex items-center justify-center gap-4">
              <input
                type="radio"
                id={`selectedItem${crypto.randomUUID()}`}
                name="selectedItem"
                onClick={() => setSelectedItem(info.row.original)}
                className={`${
                  dataSource.find((item) => item.id === info.row.original.id)
                    ?.mordwd === 1 && "!bg-slate-500"
                }`}
                disabled={
                  dataSource.find((item) => item.id === info.row.original.id)
                    ?.mordwd
                }
              />
            </div>
          );
        },
      },
      {
        cell: (info: any) => info.getValue(),
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
          const itemsCount = dataSource
            .find((item) => item.id === info.row.original.id)
            .items.filter((item) => item.item_status === "Rejected").length;
          return itemsCount;
        },
        accessorKey: "count_items",
        header: () => <span>{t("items count")}</span>,
      },
      {
        cell: (info: any) => {
          const item = dataSource.find(
            (item) => item.id === info.row.original.id
          );
          const statusText = item.mordwd == 1 ? t("closed") : t("opened");
          return statusText;
        },
        accessorKey: "bond_status",
        header: () => <span>{t("bond status")}</span>,
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
      // {
      //     cell: (info: any) => t("payoff"),
      //     accessorKey: "bond_status",
      //     header: () => <span>{t("item status")}</span>,
      // },
      {
        cell: (info: any) => (
          <ViewIcon
            size={23}
            action={() => {
              setOpenModal(true);
              setSelectedItem(info.row.original);
              setSelectedRowDetailsId(info.row.original.id);
            }}
            className="text-mainGreen mx-auto"
          />
        ),
        accessorKey: "view",
        header: () => <span>{t("piece details")}</span>,
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
  // // functions
  // const getSearchResults = async (req: any) => {
  //     let uri = `branchManage/api/v1/get-bonds/${userData?.branch_id}`
  //     let first = false
  //     Object.keys(req).forEach(key => {
  //         if (req[key] !== '') {
  //             if (first) {
  //                 uri += `?${key}[eq]=${req[key]}`
  //                 first = false
  //             } else {
  //                 uri += `?${key}[eq]=${req[key]}`
  //             }
  //         }
  //     })
  //     setSearch(uri)
  // }

  // const searchValues = {
  //     id: '',
  //     date: '',
  //     count_items: '',
  // }

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
      {/* <Formik initialValues={searchValues} onSubmit={values => {
                getSearchResults({
                    ...values,
                    date: values.date ? formatDate(values.date) : '',
                })
            }}>
                <Form className="my-8">
                    <div className="flex items-end gap-3">
                        <p className="font-bold mb-2">{t('filter')}</p>
                        <BaseInputField
                            id="id"
                            name="id"
                            label={`${t('bond number')}`}
                            placeholder={`${t('bond number')}`}
                            className="shadow-xs"
                            type="text"
                        />
                         <DateInputField
                            label={`${t('bond date')}`}
                            placeholder={`${t('bond date')}`}
                            name="date"
                            labelProps={{ className: "mt--10" }}
                        />
                        <Button type="submit" disabled={isRefetching} className="flex h-[38px]">
                            {t('search')}
                        </Button>
                    </div>
                </Form>
            </Formik>  */}
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
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <ItemDetailsTable
          selectedItem={selectedItem}
          selectedRowDetailsId={selectedRowDetailsId}
        />
      </Modal>
      <Modal
        isOpen={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
      >
        <RejectedItemsInvoice item={selectedItem} />
      </Modal>
      <Modal isOpen={restrictModal} onClose={() => setOpenRestrictModal(false)}>
        <RejectedItemsAccountingEntry
          sanadId={selectedItem.id}
          setStage={setStage}
          isInPopup
        />
      </Modal>
    </div>
  );
};
