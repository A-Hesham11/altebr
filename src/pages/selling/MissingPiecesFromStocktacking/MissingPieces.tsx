import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { numberContext } from "../../../context/settings/number-formatter";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { notify } from "../../../utils/toast";
import { Loading } from "../../../components/organisms/Loading";
import { Form, Formik } from "formik";
import { Button } from "../../../components/atoms";
import { BaseInputField, Modal } from "../../../components/molecules";
import { SelectMineralKarat } from "../../../components/templates/reusableComponants/minerals/SelectMineralKarat";
import SelectClassification from "../../../components/templates/reusableComponants/classifications/select/SelectClassification";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import { mutateData } from "../../../utils/mutateData";
import { ViewIcon } from "../../../components/atoms/icons";
import { missingPiecesReducer } from "../../../Reducers/reducers";
import { MissingPiecesInitialState } from "../../../Reducers/InitialState";
import {
  SET_DATA_SOURCE,
  SET_MODAL_OPEN,
  SET_PAGE,
  SET_SEARCH,
  SET_SELECTED_ROW_DETAILS_ID,
} from "../../../Reducers/Constants";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { MissingItemsDetails } from "./MissingItemsDetails";
import SelectionTable from "./SelectionTable";

function MissingPieces() {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const isLocation = location.pathname;
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [state, dispatch] = useReducer(
    missingPiecesReducer,
    MissingPiecesInitialState
  );

  const { dataSource, selectedRowDetailsId, modalOpen, page, search } = state;

  const searchValues = {
    id: "",
    hwya: "",
    classification_id: "",
    weight: "",
    wage: "",
  };

  const convertSelectionObjToArray = () =>
    Object.keys(rowSelection).map((key) => {
      return {
        restore_id: +key,
      };
    });

  const missingPiecesTableCols = useMemo<any>(
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
              dispatch({ type: SET_MODAL_OPEN, payload: true });
              dispatch({
                type: SET_SELECTED_ROW_DETAILS_ID,
                payload: info.row.original.id,
              });
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

  const { data, refetch, isSuccess, isRefetching, isLoading } = useFetch({
    queryKey: ["missing-pieces"],
    pagination: true,
    endpoint:
      search === ""
        ? `/branchManage/api/v1/getMissingItems/${userData?.branch_id}?page=${page}`
        : `${search}`,
    onSuccess: (data) => {
      dispatch({ type: SET_DATA_SOURCE, payload: data?.data });
    },
  });

  const {
    mutate,
    isLoading: returnLoading,
    isSuccess: isSuccessData,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["return-item"],
    onSuccess: (data) => {
      notify("success");
      refetch();
    },
    onError: (error) => {
      notify("error", error?.response?.data?.message);
    },
  });

  const fetchValue = (path: string, defaultValue = 0) =>
    data?.data?.[0]?.allboxes?.[path] || defaultValue;

  const totals = useMemo(() => {
    const values = {
      total24: fetchValue("karat24"),
      total22: fetchValue("karat22"),
      total21: fetchValue("karat21"),
      total18: fetchValue("karat18"),
      allItemsCount: fetchValue("allcounts"),
      allGoldCount: fetchValue("allGoldCount"),
      allDiamondCount: fetchValue("allDiamondCount"),
      allMotafareqatCount: fetchValue("allMotafareqatCount"),
      diamondAllPrice: fetchValue("diamondAllPrice"),
      motafareqatAllPrice: fetchValue("motafareqatAllPrice"),
    };

    return [
      {
        name: t("عدد القطع"),
        key: crypto.randomUUID(),
        value: values.allItemsCount,
      },
      {
        name: "إجمالي وزن 24",
        key: crypto.randomUUID(),
        unit: "gram",
        value: formatGram(Number(values.total24)),
      },
      {
        name: "إجمالي وزن 22",
        key: crypto.randomUUID(),
        unit: "gram",
        value: formatGram(Number(values.total22)),
      },
      {
        name: "إجمالي وزن 21",
        key: crypto.randomUUID(),
        unit: "gram",
        value: formatGram(Number(values.total21)),
      },
      {
        name: t("إجمالي وزن 18"),
        key: crypto.randomUUID(),
        unit: "gram",
        value: formatGram(Number(values.total18)),
      },
      {
        name: t("total gold pieces"),
        key: crypto.randomUUID(),
        value: values.allGoldCount,
      },
      {
        name: t("total diamonds"),
        key: crypto.randomUUID(),
        value: values.allDiamondCount,
      },
      {
        name: t("total miscellaneous pieces"),
        key: crypto.randomUUID(),
        value: values.allMotafareqatCount,
      },
      {
        name: t("total diamonds price"),
        key: crypto.randomUUID(),
        unit: "reyal",
        value: formatReyal(Number(values.diamondAllPrice)),
      },
      {
        name: t("total miscellaneous price"),
        key: crypto.randomUUID(),
        unit: "reyal",
        value: formatReyal(Number(values.motafareqatAllPrice)),
      },
    ];
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      dispatch({ type: SET_PAGE, payload: 1 });
    }
  }, [search]);

  const getSearchResults = async (req: any) => {
    let url = `branchManage/api/v1/getMissingItems/${userData?.branch_id}`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `&${key}[eq]=${req[key]}`;
          first = false;
        } else {
          url += `?${key}[eq]=${req[key]}`;
        }
      }
    });
    dispatch({ type: SET_SEARCH, payload: url });
  };

  const processItemReturn = () => {
    if (!validateReturnItems()) return;
    submitReturnRequest();
  };

  const validateReturnItems = () => {
    if (convertSelectionObjToArray().length === 0) {
      notify("error", `${t("select at least one item")}`);
      return false;
    }
    return true;
  };

  const submitReturnRequest = () => {
    mutate({
      endpointName: `branchManage/api/v1/restoreItem`,
      method: "post",
      values: {
        restores: convertSelectionObjToArray(),
      },
    });
  };

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
                    {t("missing pieces from the stocktaking")}
                  </Button>
                </div>
              </div>
              <p className="font-bold mb-2">{t("filter")}</p>
              <div className="grid grid-cols-4 gap-x-4">
                <BaseInputField
                  id="hwya"
                  name="hwya"
                  label={`${t("identification")}`}
                  placeholder={`${t("identification")}`}
                  className="shadow-xs"
                  type="text"
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
      {dataSource?.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button loading={returnLoading} action={processItemReturn}>
            {t("return items")}
          </Button>
        </div>
      )}
      {isSuccess &&
      !!dataSource &&
      !isLoading &&
      !isRefetching &&
      !!dataSource.length ? (
        <SelectionTable
          getRowId={(row) => row.restore_id}
          columns={missingPiecesTableCols}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          data={dataSource}
        >
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
                action={() => dispatch({ type: SET_PAGE, payload: page - 1 })}
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
                action={() => dispatch({ type: SET_PAGE, payload: page + 1 })}
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
        </SelectionTable>
      ) : (
        <p className="text-center text-2xl font-bold text-mainGreen my-8">
          {t("there is no pieces")}
        </p>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => dispatch({ type: SET_MODAL_OPEN, payload: false })}
      >
        <MissingItemsDetails
          selectedItem={data?.data}
          selectedRowDetailsId={selectedRowDetailsId}
        />
      </Modal>

      {/* <Modal
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
            printModal={printModal}
            setDataSourcePrint={setDataSourcePrint}
            setReturnItemsModel={setReturnItemsModel}
          />
        </Formik>
      </Modal>

      <Modal isOpen={printModal} onClose={() => setPrintModal(false)}>
        <RejectedItemsInvoicePrint item={dataSourcePrint} />
      </Modal> */}
    </div>
  );
}

export default MissingPieces;
