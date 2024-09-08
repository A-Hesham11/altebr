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
import { BsEye } from "react-icons/bs";
import HonestFinalScreenHeader from "./HonestFinalScreenHeader";
import HonestFinalScreenItems from "./HonestFinalScreenItems";
import HonestFinalScreenPayment from "./HonestFinalScreenPayment";
import { numberContext } from "../../../context/settings/number-formatter";
import { ClientData_TP } from "../SellingClientForm";

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AllHonestBonds = () => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const { userData } = useContext(authCtx);
  const { formatGram, formatReyal } = numberContext();
  const [showPrint, setShowPrint] = useState(false);

  const isRTL = useIsRTL();
  ///
  /////////// STATES
  ///
  const [dataSource, setDataSource] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  console.log("🚀 ~ AllHonestBonds ~ selectedItem:", selectedItem);
  const [restrictModal, setOpenRestrictModal] = useState(false);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
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

  const paymentData = [];

  const mineralLicence = userData?.branch.document?.filter(
    (item) => item.data.docType.label === "رخصة المعادن"
  )?.[0]?.data.docNumber;

  const taxRegisteration = userData?.branch.document?.filter(
    (item) => item.data.docType.label === "شهادة ضريبية"
  )?.[0]?.data.docNumber;

  const invoiceCols = useMemo<any>(
    () => [
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "category_id",
        header: () => (
          <span className="flex justify-center">{t("classification")}</span>
        ),
      },
      {
        cell: (info) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => (
          <span className="flex justify-center">{t("weight")}</span>
        ),
      },
      {
        cell: (info) => info.getValue() || "---",
        accessorKey: "karat_id",
        header: () => <span className="flex justify-center">{t("karat")}</span>,
      },
      {
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "cost",
        header: () => (
          <span className="flex justify-center">{t("approximate cost")}</span>
        ),
      },
      {
        cell: (info) => info.getValue() || t("not found"),
        accessorKey: "description",
        header: () => (
          <span className="truncate w-44 flex justify-center">
            {t("notes")}
          </span>
        ),
      },
    ],
    []
  );

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
          <div className="flex items-center gap-2 justify-center">
            <BiSpreadsheet
              size={23}
              onClick={() => {
                setOpenRestrictModal(true);
                setSelectedItem(info.row.original);
              }}
              className="text-mainGreen cursor-pointer"
            />
            <BsEye
              onClick={() => {
                setOpenInvoiceModal(true);
                setSelectedItem(info.row.original);
              }}
              size={23}
              className="text-mainGreen cursor-pointer"
            />
          </div>
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

  // SENTENCE API
  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  // COMPANY DATA API
  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Selling_Mineral_license"],
  });

  const clientData = {
    client_id: selectedItem?.client_id_2,
    client_value: selectedItem?.client_id,
    bond_date: selectedItem?.bond_date,
  };

  const totalCost = selectedItem?.items?.reduce((acc: number, curr: any) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const totalAmount = selectedItem?.boxes?.find(
    (el) => el.account === "الأمانات"
  );

  const sanadData = {
    amount: totalAmount?.value,
    totalCost: totalCost,
    remaining_amount: totalCost - totalAmount?.value,
  };

  const costDataAsProps = {
    totalCost,
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

      {/* 3) MODAL */}
      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <div className="">
          <div className="flex items-center justify-start gap-x-4 mb-6">
            <div className="animate_from_left">
              <Button bordered action={() => window.print()}>
                {t("print")}
              </Button>
            </div>
          </div>
          <div className="print-section space-y-12 bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
            <HonestFinalScreenHeader
              clientData={clientData}
              popupBondId={selectedItem?.id}
            />
            <HonestFinalScreenItems
              sanadData={sanadData}
              data={selectedItem?.items || []}
              columns={invoiceCols}
              costDataAsProps={costDataAsProps}
            />
            <div className="pe-8">
              <HonestFinalScreenPayment
                items={selectedItem?.items}
                // paymentData={paymentData}
              />
            </div>
            <div className="text-center">
              <p className="my-4 py-1 border-y border-mainOrange">
                {data && data?.sentence}
              </p>
              <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
                <p>
                  {" "}
                  العنوان : {userData?.branch?.country?.name} ,{" "}
                  {userData?.branch?.city?.name} ,{" "}
                  {userData?.branch?.district?.name}
                </p>
                {/* <p>رقم المحل</p> */}
                <p>
                  {t("phone")}: {userData?.phone}
                </p>
                <p>
                  {t("email")}: {userData?.email}
                </p>
                <p>
                  {t("tax number")}: {taxRegisteration && taxRegisteration}
                </p>
                <p>
                  {t("Mineral license")}: {mineralLicence && mineralLicence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
