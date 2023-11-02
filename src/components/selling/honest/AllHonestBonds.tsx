/////////// IMPORTS
///
///
/////////// Types
///
import { Form, Formik } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { BiSpreadsheet } from "react-icons/bi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../hooks";
import { formatDate, getDayAfter } from "../../../utils/date";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../atoms";
import { BaseInputField, DateInputField, Modal } from "../../molecules";
import { Loading } from "../../organisms/Loading";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { HonestBondAccountingRestriction } from "./HonestBondAccountingRestriction";

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AllHonestBonds = () => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const { userData } = useContext(authCtx);

  const isRTL = useIsRTL();
  ///
  /////////// STATES
  ///
  const [dataSource, setDataSource] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [restrictModal, setOpenRestrictModal] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const {
    data: honestBondsData,
    isLoading: honestBondsLoading,
    refetch,
    isRefetching,
    isFetching,
  } = useFetch({
    queryKey: ["all-honest-bonds"],
    endpoint:
      search === `branchSafety/api/v1/bonds/${userData?.branch_id}?` ||
      search === ""
        ? `branchSafety/api/v1/bonds/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });
  /////////// VARIABLES
  ///
  const searchValues = {
    bondsafety_id: "",
    bond_date: "",
  };

  const Cols = useMemo<any>(
    () => [
      // {
      //     cell: (info: any) => <input type="radio" id={crypto.randomUUID()} name='selectedHonest' onClick={() => setSelectedItem(info.row.original)} />,
      //     accessorKey: "radio",
      //     header: () => <span>{t("#")}</span>,
      // },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bondsafety_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bond_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "client_id",
        header: () => <span>{t("client name")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original?.boxes?.length ? t("paid") : t("non paid"),
        accessorKey: "item-status",
        header: () => <span>{t("payment status")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
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
    ],
    []
  );

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (honestBondsData) {
      setDataSource(honestBondsData.data);
    }
  }, [honestBondsData]);

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

  const navigate = useNavigate();
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const getSearchResults = async (req: any) => {
    let uri = `branchSafety/api/v1/bonds/${userData?.branch_id}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          uri += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          uri += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(uri);
  };
  ///
  if (honestBondsLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-16">
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
              bond_date: values.bond_date
                ? formatDate(getDayAfter(new Date(values.bond_date)))
                : "",
            });
          }}
        >
          <Form className="w-full flex">
            <div className="flex w-full justify-between items-end gap-3">
              <div className="flex items-end gap-3">
                <BaseInputField
                  id="bondsafety_id"
                  name="bondsafety_id"
                  label={`${t("bond number")}`}
                  placeholder={`${t("bond number")}`}
                  className="shadow-xs"
                  type="text"
                />
                <DateInputField
                  label={`${t("bond date")}`}
                  placeholder={`${t("bond date")}`}
                  name="bond_date"
                  labelProps={{ className: "mt--10" }}
                />
                <Button
                  type="submit"
                  disabled={isRefetching}
                  className="flex h-[38px] mx-4"
                >
                  {t("search")}
                </Button>
              </div>
              <Back />
            </div>
          </Form>
        </Formik>
      </div>
      <Table data={dataSource || []} columns={Cols}>
        <div className="mt-3 flex items-center justify-center gap-5 p-2">
          <div className="flex items-center gap-2 font-bold">
            {t("page")}
            <span className=" text-mainGreen">
              {honestBondsData?.current_page}
            </span>
            {t("from")}
            {<span className=" text-mainGreen">{honestBondsData?.total}</span>}
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
              disabled={page == honestBondsData?.pages}
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
      {/* <div className="flex justify-end mt-5">
            <Button
                action={() => {
                    if (!Object.keys(selectedItem).length) {
                        notify('info', `${t('choose item first')}`)
                    } else {
                        navigate(`/selling/honesty/all-honest/${selectedItem.id!}`)
                    }
                }}
            >{t('next')}</Button>
        </div> */}
      <Modal isOpen={restrictModal} onClose={() => setOpenRestrictModal(false)}>
        <HonestBondAccountingRestriction sanadId={selectedItem.id} />
      </Modal>
    </div>
  );
};
