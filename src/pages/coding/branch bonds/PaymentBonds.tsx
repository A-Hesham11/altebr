import { useContext, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";
import { formatDate, getDayAfter } from "../../../utils/date";
import { BaseInputField, DateInputField, Modal } from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import PaymentBondsTable from "./PaymentBondsTable";
import { SelectBranches } from "../../../components/templates/reusableComponants/branches/SelectBranches";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";

const PaymentBonds = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ PaymentBonds ~ userData:", userData)
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
    queryKey: ["payment-invoice-inidara"],
    endpoint:
      search === ""
        ? `/sdad/api/v1/sdadbonds?page=${page}`
        : `${search}`,
    pagination: true,
  });

  console.log("🚀 ~ file: VeiwPaymentToManagement.tsx:34 ~ VeiwPaymentToManagement ~ invoiceData:", invoiceData)

  const {
    data,
    refetch: refetchBoxsData
  } = useFetch({
    queryKey: ["payment-data"],
    endpoint: `/sdad/api/v1/countTrigger`,
    pagination: true,
    // enabled: !!userData?.branch_id,
  });
    console.log("🚀 ~ PaymentBonds ~ data:", data)

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "branch_name",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "payment_date",
        header: () => <span>{t("date")}</span>,
      },
      // {
      //   cell: (info: any) => info.getValue(),
      //   accessorKey: "employee_name",
      //   header: () => <span>{t("employee name")}</span>,
      // },
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
    refetchBoxsData();
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

  const BoxspaymentData = [
    {
        id:1,
        name_ar: "صندوق ذهب الكسر عيار 18",
        name_en: "gold box 18 karat",
        value: data?.data[0]?.gold_box_18,
        unit:"جرام",
    },
    {
        id:2,
        name_ar: "صندوق ذهب الكسر عيار 21",
        name_en: "gold box 21 karat",
        value:  data?.data[0]?.gold_box_21,
        unit:"جرام",
    },
    {
        id:3,
        name_ar: "صندوق ذهب الكسر عيار 22",
        name_en: "gold box 22 karat",
        value:  data?.data[0]?.gold_box_22,
        unit:"جرام",
    },
    {
        id:4,
        name_ar: "صندوق ذهب الكسر عيار 24",
        name_en: "gold box 24 karat",
        value:  data?.data[0]?.gold_box_24,
        unit:"جرام",
    },
    {
        id:5,
        name_ar: "نقدي",
        name_en: "cash",
        value:  data?.data[0]?.cash,
        unit:"ريال",
    },
    {
        id:6,
        name_ar: "الأهلي",
        name_en: "Alahly",
        value:  data?.data[0]?.alaly,
        unit:"ريال",
    },
    {
        id:7,
        name_ar: "بنك مصر",
        name_en: "Bank masr",
        value:  data?.data[0]?.masr,
        unit:"ريال",
    },
    {
        id:8,
        name_ar: "بنك القاهرة",
        name_en: "Bank cairo",
        value:  data?.data[0]?.cairo_bank,
        unit:"ريال",
    },
    {
        id:9,
        name_ar: "بنك الإسكندرية",
        name_en: "Bank Alex",
        value:  data?.data[0]?.alex,
        unit:"ريال",
    },
  ];

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="p-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold">{t("Payment bonds")}</h2>
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
              invoice_date: values.invoice_date ? formatDate(getDayAfter(new Date(values.invoice_date))) : "",
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
                  <SelectBranches
                    required
                    name="branch_id"
                  />
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
                <span className=" text-mainGreen">
                  {page}
                </span>
                {t("from")}
                <span className=" text-mainGreen">{invoiceData.pages}</span>
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
        <PaymentBondsTable item={selectedItem} setOpenInvoiceModal={setOpenInvoiceModal} refetch={refetch} refetchBoxsData={refetchBoxsData} receive={true}/>
      </Modal>
    </div>
  );
};

export default PaymentBonds;