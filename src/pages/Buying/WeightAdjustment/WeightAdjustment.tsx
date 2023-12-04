import { Form, Formik } from "formik";
import WeightAdjustmentSearch from "./WeightAdjustmentSearch";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import TableOfWeightAdjustment from "./TableOfWeightAdjustment";
import { useFetch, useMutate } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../../components/atoms";
import { BoxesData } from "../../../components/molecules/card/BoxesData";
import { Modal } from "../../../components/molecules";
import TableOfWeightAdjustmentPreview from "./TableOfWeightAdjustmentPreview";
import { notify } from "../../../utils/toast";
import { Loading } from "../../../components/organisms/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { formatDate, getDayAfter } from "../../../utils/date";

const WeightAdjustment = () => {
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [operationTypeSelect, setOperationTypeSelect] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const [search, setSearch] = useState("");
  console.log("🚀 ~ file: WeightAdjustment.tsx:27 ~ WeightAdjustment ~ search:", search)
  const [inputWeight, setInputWeight] = useState([]);
  const [weightModal, setWeightModal] = useState(false);
  const [endpoint, setEndPoint] = useState(
    `/buyingUsedGold/api/v1/items_has_stones/`
  );

  const { userData } = useContext(authCtx);

  const initailSearchValues = {
    invoice_number: "",
    karat_id: "",
    bond_id: "",
    invoice_date: "",
    weight_input: "",
    stones_type: "",
  };

  // const { data: ahgaring } = useFetch({
  //   queryKey: ["ahgaring"],
  //   endpoint: `/buyingUsedGold/api/v1/items_has_stones/${userData?.branch_id}`,
  //   pagination: true,
  // });

  // const { data: notAhgaring } = useFetch({
  //   queryKey: ["notAhgaring"],
  //   endpoint: `/buyingUsedGold/api/v1/items_hasnot_stones/${userData?.branch_id}`,
  //   pagination: true,
  // });

  // FETCHING DATA FROM API
  const {
    data: weightAdjustmentData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["wegiht_table"],
    endpoint:
      search ===
        `/buyingUsedGold/api/v1/buying_invoices/${userData?.branch_id}?page=${page}` ||
      search === ""
        ? `/buyingUsedGold/api/v1/buying_invoices/${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log(
    "🚀 ~ file: WeightAdjustment.tsx:28 ~ WeightAdjustment ~ weightAdjustmentData:",
    weightAdjustmentData
  );

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["wegiht_table"]);
      notify("success");
    },
  });

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `/buyingUsedGold/api/v1/buying_invoices/${userData?.branch_id}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}=${req[key]}`;
          first = false;
        } else {
          url += `&${key}=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // EFFECTS
  useEffect(() => {
    if (weightAdjustmentData) {
      setDataSource(weightAdjustmentData);
    }
  }, [weightAdjustmentData]);

  useEffect(() => {
    refetch();
  }, [page, endpoint, search]);

  useEffect(() => {
    setOperationTypeSelect([]);
    setSearch("");
  }, [endpoint]);

  if (isRefetching || isLoading || isFetching)
    return <Loading mainTitle={t("loading items")} />;

  const setEndPointAndSetActiveTab = (endpoint, tabNumber) => {
    setEndPoint(endpoint);
    setActiveTab(tabNumber);
  };

  const hasDifferenceKarat = () => {
    if (operationTypeSelect.length <= 1) return false;

    const firstKarat = operationTypeSelect[0].karat_name;

    for (let i = 1; i < operationTypeSelect.length; i++) {
      if (operationTypeSelect[i].karat_name !== firstKarat) {
        return true; // There is a difference
      }
    }

    return false;
  };
  console.log(
    "🚀 ~ file: WeightAdjustment.tsx:145 ~ hasDifferenceKarat ~ hasDifferenceKarat:",
    hasDifferenceKarat()
  );

  return (
    <div className="relative h-full p-10">
      <h2 className="mb-6 text-xl font-bold text-slate-700">
        {t("weight adjustment")}
      </h2>

      {/* <div className="flex items-center justify-center gap-4">
        <li
          onClick={() =>
            setEndPointAndSetActiveTab(
              "/buyingUsedGold/api/v1/items_has_stones/",
              1
            )
          }
          className={`transition-all duration-300 cursor-pointer flex flex-col h-28 w-60 justify-center rounded-xl text-center text-sm font-bold shadow-md`}
        >
          <p
            className={`${
              activeTab === 1
                ? "bg-mainGreen text-white"
                : "bg-white text-black"
            }  p-2 flex items-center justify-center h-[65%] rounded-t-xl`}
          >
            {t(`pieces with stones`)}
          </p>
          <p className={` bg-white text-black  px-2 py-2 h-[35%] rounded-b-xl`}>
            {ahgaring?.total}
            <span> {t(`piece`)}</span>
          </p>
        </li>
        <li
          onClick={() =>
            setEndPointAndSetActiveTab(
              "/buyingUsedGold/api/v1/items_hasnot_stones/",
              2
            )
          }
          className={`transition-all duration-300 cursor-pointer flex flex-col h-28 w-60 justify-center rounded-xl text-center text-sm font-bold shadow-md`}
        >
          <p
            className={`${
              activeTab === 2
                ? "bg-mainGreen text-white"
                : "bg-white text-black"
            }  p-2 flex items-center justify-center h-[65%] rounded-t-xl`}
          >
            {t(`pieces without stones`)}
          </p>
          <p className={`bg-white text-black px-2 py-2 h-[35%] rounded-b-xl`}>
            {notAhgaring?.total}
            <span> {t(`piece`)}</span>
          </p>
        </li>
      </div> */}

      <Formik
        initialValues={initailSearchValues}
        onSubmit={(values) => {
          const stones = {
            has_stones: values.stones_type == 1 ? 1 : 0,
            edited: values.stones_type == 2 ? 1 : 0,
          };
          getSearchResults({
            ...values,
            ...stones,
            // invoice_date: values.invoice_date
            //   ? formatDate(getDayAfter(new Date(values.invoice_date)))
            //   : "",
          });

          console.log({
            ...values,
            ...stones,
            // invoice_date: values.invoice_date
            //   ? formatDate(getDayAfter(new Date(values.invoice_date)))
            //   : "",
          });
        }}
      >
        {(formik) => (
          <Form className="flex flex-col gap-8">
            {/* Search */}
            <WeightAdjustmentSearch />

            {/* table */}
            <TableOfWeightAdjustment
              dataSource={dataSource}
              setPage={setPage}
              page={page}
              setOperationTypeSelect={setOperationTypeSelect}
              checkboxChecked={checkboxChecked}
              setCheckboxChecked={setCheckboxChecked}
              endpoint={endpoint}
              weightAdjustmentData={weightAdjustmentData}
              // ahgaring={ahgaring}
              // notAhgaring={notAhgaring}
            />

            <div className="flex gap-4 items-center self-end mr-auto my-6">
              <Back className="w-32" />
              <Button
                onClick={() => {
                  if (hasDifferenceKarat() === true) {
                    notify("info", t("select only a similar karat"));
                  } else {
                    setWeightModal(true);
                  }
                }}
                className="bg-mainGreen text-white"
              >
                {t("weight adjustment")}
              </Button>
            </div>

            <Modal isOpen={weightModal} onClose={() => setWeightModal(false)}>
              <TableOfWeightAdjustmentPreview
                inputWeight={inputWeight}
                setInputWeight={setInputWeight}
                item={operationTypeSelect}
                setWeightModal={setWeightModal}
              />
            </Modal>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WeightAdjustment;
