import { useContext, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";
import { formatDate, getDayAfter } from "../../../utils/date";
import {
  BaseInputField,
  DateInputField,
  Modal,
} from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { SelectBranches } from "../../../components/templates/reusableComponants/branches/SelectBranches";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import ReceiveMoneyTable from "./ReceiveMoneyTable";

const ReceiveMoneyBonds = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");

  const searchValues = {
    invoice_number: "",
    invoice_date: "",
  };

  const {
    data: invoiceData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["allDeliveredBranchBond"],
    endpoint:
      search === ""
        ? `/aTM/api/v1/allDeliveredBranchBond/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bond_number",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() === "cash" ? t("cash") : t("Bank"),
        accessorKey: "transfer_type",
        header: () => <span>{t("transfer type")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amount",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setOpenInvoiceModal(true);
              setSelectedItem(info.row.original);
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

  // EFFECTS
  useEffect(() => {
    if (invoiceData) {
      setDataSource(invoiceData.data);
    }
  }, [invoiceData]);

  useEffect(() => {
    refetch();
  }, [page, invoiceData, search]);

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `/sdad/api/v1/sdadbonds/${userData?.branch_id}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          url += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold">{t("cash receipt")}</h2>
        <Back className="hover:bg-slate-50 transition-all duration-300" />
      </div>
      {/* <ul className="grid grid-cols-5 gap-4 mb-12">
            {BoxspaymentData.map(({id, name_ar, name_en, value, unit }) => (
                <BoxesDataBase key={id}>
                    <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl">{ isRTL ? name_ar : name_en}</p>
                    <p className="bg-white p-2 text-black h-[35%] rounded-b-xl">
                        {value?.toFixed(2)} {t(unit)}
                    </p>
                </BoxesDataBase>
            ))}
        </ul> */}
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
              invoice_date: values.invoice_date
                ? formatDate(getDayAfter(new Date(values.invoice_date)))
                : "",
            });
          }}
        >
          <Form className="w-full flex">
            <div className="flex w-full justify-between items-end gap-3">
              <div className="flex items-end gap-3 w-full">
                <div className="">
                  <BaseInputField
                    id="invoice_number"
                    name="invoice_number"
                    label={`${t("invoice number")}`}
                    placeholder={`${t("invoice number")}`}
                    className="shadow-xs"
                    type="text"
                  />
                </div>
                <div className="">
                  <DateInputField
                    label={`${t("invoice date")}`}
                    placeholder={`${t("invoice date")}`}
                    name="invoice_date"
                    labelProps={{ className: "mt-10" }}
                  />
                </div>
                <div className="w-[230px]">
                  <SelectBranches required name="branch_id" />
                </div>
                <Button
                  type="submit"
                  disabled={isRefetching}
                  className="flex h-[38px] mx-4 hover:bg-emerald-900 duration-300 transition-all"
                >
                  {t("search")}
                </Button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>

      {/* 2) TABLE */}
      <div className="">
        <Table data={dataSource || []} columns={tableColumn}>
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              <span className=" text-mainGreen">{invoiceData?.pages}</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className=" rounded bg-mainGreen p-[.18rem] "
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
                className=" rounded bg-mainGreen p-[.18rem] "
                action={() => setPage((prev) => prev + 1)}
                disabled={page == invoiceData.pages}
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
      </div>

      {/* 3) MODAL */}
      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <ReceiveMoneyTable
          item={selectedItem}
          setOpenInvoiceModal={setOpenInvoiceModal}
          refetch={refetch}
        />
      </Modal>
    </div>
  );
};

export default ReceiveMoneyBonds;
