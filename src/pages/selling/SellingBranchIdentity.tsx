/////////// IMPORTS
///
//import classes from './SellingBranchIdentity.module.css'
///
/////////// Types
///

import { Form, Formik } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "../../components/atoms";
import { BoxesDataBase } from "../../components/atoms/card/BoxesDataBase";
import { ViewIcon } from "../../components/atoms/icons";
import { BaseInputField, Modal, Select } from "../../components/molecules";
import { Loading } from "../../components/organisms/Loading";
import { ItemDetailsTable } from "../../components/selling/recieve items/ItemDetailsTable";
import { SelectMineralKarat } from "../../components/templates/reusableComponants/minerals/SelectMineralKarat";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../hooks";
import SelectClassification from "../../components/templates/reusableComponants/classifications/select/SelectClassification";
import { useNavigate } from "react-router-dom";
import { numberContext } from "../../context/settings/number-formatter";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import ReturnItemsToEdaraModal from "../../components/selling/payoff/ReturnItemsToEdaraModal";
import RejectedItemsInvoice from "../../components/selling/recieve items/RejectedItemsInvoice";
import RejectedItemsInvoicePrint from "./RejectedItemsInvoicePrint";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import SelectCategory from "../../components/templates/reusableComponants/categories/select/SelectCategory";

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SellingBranchIdentity = () => {
  /////////// VARIABLES
  ///
  const { userData } = useContext(authCtx);
  const [dataSource, setDataSource] = useState({});
  const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  // const [searchPage, setSearchPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [dataSourcePrint, setDataSourcePrint] = useState([]);
  console.log("🚀 ~ SellingBranchIdentity ~ dataSourcePrint:", dataSourcePrint);
  const [printModal, setPrintModal] = useState(false);
  const [printModalData, setPrintModalData] = useState({});
  console.log("🚀 ~ SellingBranchIdentity ~ printModalData:", printModalData);
  const { gold_price } = GlobalDataContext();

  const isRTL = useIsRTL();

  const { formatGram, formatReyal } = numberContext();
  const [returnItemsModel, setReturnItemsModel] = useState(false);

  const navigate = useNavigate();

  const searchValues = {
    id: "",
    hwya: "",
    thwelbond_id: "",
    classification_id: "",
    category_id: "",
    karat_minerals: "",
    weight: "",
    wage: "",
    model_number: "",
  };

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("ID")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "thwelbond_id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("identification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        header: () => <span>{t("remaining weight")} </span>,
        accessorKey: "remaining_weight",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("gold karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "mineral",
        header: () => <span>{t("mineral")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karatmineral_id",
        header: () => <span>{t("mineral karat")}</span>,
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
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
        accessorKey: "stones_weight",
        header: () => <span>{t("other stones weight")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("selling price")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
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
    []
  );
  ///
  /////////// CUSTOM HOOKS
  ///
  // const { data, refetch, isSuccess, isRefetching, isLoading } = useFetch({
  //   queryKey: ["branch-all-accepted-items"],
  //   pagination: true,
  //   endpoint:
  //     search === ""
  //       ? `/branchManage/api/v1/all-accepted/${userData?.branch_id}?page=${page}`
  //       : `${search}`,
  //   onSuccess: (data) => {
  //     setDataSource(data.data);
  //   },
  // });

  const { data, refetch, isSuccess, isRefetching, isLoading } = useFetch({
    queryKey: ["branch-all-accepted-items", page, search],
    pagination: true,
    endpoint: search
      ? `${search}&page=${page}`
      : `/branchManage/api/v1/all-accepted/${userData?.branch_id}?page=${page}`,
    onSuccess: (data) => {
      setDataSource(data.data);
    },
  });
  console.log("🚀 ~ SellingBranchIdentity ~ data:", data);

  const queryClient = useQueryClient();
  const {
    mutate,
    isLoading: returnLoading,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["returnToSort"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["returnToSort"]);
      refetch();
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message);
    },
  });

  const total24 = (data && data?.data[0]?.allboxes.karat24) || 0;
  const total22 = (data && data?.data[0]?.allboxes.karat22) || 0;
  const total21 = (data && data?.data[0]?.allboxes.karat21) || 0;
  const total18 = (data && data?.data[0]?.allboxes.karat18) || 0;
  const allItemsCount = (data && data?.data[0]?.allboxes.accepted) || 0;
  const allGoldCount = (data && data?.data[0]?.allboxes.allGoldCount) || 0;
  const allDiamondCount =
    (data && data?.data[0]?.allboxes.allDiamondCount) || 0;
  const allMotafareqatCount =
    (data && data?.data[0]?.allboxes.allMotafareqatCount) || 0;
  const diamondAllPrice =
    (data && data?.data[0]?.allboxes.diamondAllPrice) || 0;
  const motafareqatAllPrice =
    (data && data?.data[0]?.allboxes.motafareqatAllPrice) || 0;

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: allItemsCount,
    },
    {
      name: "إجمالي وزن 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(Number(total24)),
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(Number(total22)),
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(Number(total21)),
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: formatGram(Number(total18)),
    },
    {
      name: t("total gold pieces"),
      key: crypto.randomUUID(),
      value: allGoldCount,
    },
    {
      name: t("total diamonds"),
      key: crypto.randomUUID(),
      value: allDiamondCount,
    },
    {
      name: t("total miscellaneous pieces"),
      key: crypto.randomUUID(),
      value: allMotafareqatCount,
    },
    {
      name: t("total diamonds price"),
      key: crypto.randomUUID(),
      unit: t("reyal"),
      value: formatReyal(Number(diamondAllPrice)),
    },
    {
      name: t("total miscellaneous price"),
      key: crypto.randomUUID(),
      unit: t("reyal"),
      value: formatReyal(Number(motafareqatAllPrice)),
    },
  ];

  // METAL OPTION
  const { data: karatMineralsOption } = useFetch({
    endpoint: "/classification/api/v1/karatminerals?type=all",
    queryKey: ["karat_mineral_option"],
    select: (karats) =>
      karats.map((karat: any) => ({
        id: karat?.id,
        label: karat?.karatmineral,
        name: karat?.karatmineral,
        value: karat?.id,
      })),
  });

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

  //
  // functions
  const getSearchResults = async (req: any) => {
    let uri = `branchManage/api/v1/all-accepted/${userData?.branch_id}`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          uri += `&${key}[eq]=${req[key]}`;
          first = false;
        } else {
          uri += `?${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(uri);
  };

  // const getSearchResults = async (req: any) => {
  //   let uri = `branchManage/api/v1/all-accepted/${userData?.branch_id}`;
  //   let params = [];

  //   Object.keys(req).forEach((key) => {
  //     if (req[key] !== "") {
  //       params.push(`${key}[eq]=${req[key]}`);
  //     }
  //   });

  //   if (params.length > 0) {
  //     uri += `?${params.join("&")}`;
  //   }

  //   setSearch(uri);
  // };
  const isLocation = location.pathname;
  ///
  if (isLoading || isRefetching)
    return <Loading mainTitle={t("loading items")} />;
  return (
    <div className="px-8 md:px-16">
      <div>
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
            });
            setPage(1);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="my-8">
              <div className="flex items-center justify-between my-8">
                <p className="font-bold mb-2 text-lg">
                  {t("branch identity management")}
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    action={() => {
                      navigate("/selling/branch-identity");
                    }}
                    className={`${
                      isLocation === "/selling/branch-identity"
                        ? "bg-mainOrange text-white"
                        : "bg-transparent border-2 border-mainOrange text-mainOrange"
                    } h-12`}
                  >
                    {t("Pieces in the branch")}
                  </Button>
                  <Button
                    action={() => {
                      navigate("/selling/Pieces-Sold");
                    }}
                    className={`${
                      isLocation === "/selling/Pieces-Sold"
                        ? "bg-mainOrange text-white"
                        : "bg-transparent border-2 border-mainOrange text-mainOrange"
                    } h-12`}
                  >
                    {t("Pieces sold")}
                  </Button>
                  {/* MISSING PIECES BUTTON */}
                  <Button
                    action={() => {
                      navigate("/missing-pieces");
                    }}
                    className={`${
                      isLocation === "/missing-pieces"
                        ? "bg-mainOrange text-white"
                        : "bg-transparent border-2 border-mainOrange text-mainOrange"
                    } h-12`}
                  >
                    {t("missing pieces")}
                  </Button>
                </div>
              </div>
              <p className="font-bold mb-2">{t("filter")}</p>
              <div className="grid grid-cols-4 gap-4">
                <BaseInputField
                  id="hwya"
                  name="hwya"
                  label={`${t("identification")}`}
                  placeholder={`${t("identification")}`}
                  className="shadow-xs"
                  type="text"
                />
                <BaseInputField
                  id="thwelbond_id"
                  label={`${t("supply voucher number")}`}
                  name="thwelbond_id"
                  type="text"
                  placeholder={`${t("supply voucher number")}`}
                />
                <BaseInputField
                  id="weight"
                  name="weight"
                  label={`${t("weight")}`}
                  placeholder={`${t("weight")}`}
                  className="shadow-xs"
                  type="text"
                />
                <BaseInputField
                  id="wage"
                  name="wage"
                  label={`${t("wage")}`}
                  placeholder={`${t("wage")}`}
                  className="shadow-xs"
                  type="text"
                />
                <SelectMineralKarat showLabel showMineralKarat={false} />
                <SelectClassification
                  name="classification_id"
                  field="id"
                  label={`${t("category")}`}
                />
                <div className="">
                  <SelectCategory
                    name="category_id"
                    all={true}
                    showItems={true}
                    label={t("classification")}
                  />
                </div>
                <div className="">
                  <Select
                    id="karat_minerals"
                    label={`${t("mineral karat")}`}
                    name="karat_minerals"
                    placeholder={`${t("mineral karat")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={karatMineralsOption}
                  />
                </div>
                <BaseInputField
                  id="model_number"
                  label={`${t("modal number")}`}
                  name="model_number"
                  type="text"
                  placeholder={`${t("modal number")}`}
                />
              </div>
              <Button
                type="submit"
                disabled={isRefetching}
                className="flex h-[38px] mr-auto"
              >
                {t("search")}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <p className="text-sm font-bold mt-2 mb:4 md:mb-8">
        {t("bonds aggregations")}
      </p>
      <ul className="grid grid-cols-4 gap-6 mb-12">
        {totals.map(({ name, key, unit, value }) => (
          <BoxesDataBase variant="secondary" key={key}>
            <p className="bg-mainGreen px-2 py-4 flex items-center justify-center rounded-t-xl">
              {name}
            </p>
            <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
              {value} {t(unit)}
            </p>
          </BoxesDataBase>
        ))}
      </ul>
      <div className="flex justify-end mb-4">
        <Button
          loading={returnLoading}
          action={() => setReturnItemsModel(true)}
        >
          {t("return items")}
        </Button>
      </div>
      {isSuccess &&
        !!dataSource &&
        !isLoading &&
        !isRefetching &&
        !!dataSource.length && (
          <Table data={dataSource} columns={Cols}>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ItemDetailsTable
          selectedItem={data?.data}
          selectedRowDetailsId={selectedRowDetailsId}
        />
      </Modal>

      <Modal
        isOpen={returnItemsModel}
        onClose={() => setReturnItemsModel(false)}
      >
        <Formik
          validationSchema=""
          initialValues={{
            branch_id: "",
            gold_price: gold_price?.price_gram_24k || "",
            sanad_type: "",
            weight_input: "",
            search: "",
            ManualSearch: "",
          }}
          enableReinitialize={true}
          onSubmit={(values) => {}}
        >
          <ReturnItemsToEdaraModal
            refetch={refetch}
            setPage={setPage}
            setPrintModal={setPrintModal}
            setPrintModalData={setPrintModalData}
            printModal={printModal}
            setDataSourcePrint={setDataSourcePrint}
            setReturnItemsModel={setReturnItemsModel}
          />
        </Formik>
      </Modal>

      <Modal isOpen={printModal} onClose={() => setPrintModal(false)}>
        <RejectedItemsInvoicePrint
          item={dataSourcePrint}
          printModalData={printModalData}
        />
      </Modal>
    </div>
  );
};
