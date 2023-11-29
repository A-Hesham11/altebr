import { Form, Formik } from "formik";
import WeightAdjustmentSearch from "./WeightAdjustmentSearch";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import TableOfWeightAdjustment from "./TableOfWeightAdjustment";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../../components/atoms";
import { BoxesData } from "../../../components/molecules/card/BoxesData";
import { Modal } from "../../../components/molecules";
import TableOfWeightAdjustmentPreview from "./TableOfWeightAdjustmentPreview";
import { notify } from "../../../utils/toast";

const WeightAdjustment = () => {
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [operationTypeSelect, setOperationTypeSelect] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCheckout, setActiveCheckout] = useState(false);
  const [inputWeight, setInputWeight] = useState([]);
  console.log(
    "🚀 ~ file: WeightAdjustment.tsx:22 ~ WeightAdjustment ~ inputWeight:",
    inputWeight
  );
  const [weightModal, setWeightModal] = useState(false);
  const [endpoint, setEndPoint] = useState(
    `/buyingUsedGold/api/v1/buying_invoices/`
  );

  const { userData } = useContext(authCtx);

  const initailSearchValues = {
    invoice_number: "",
    karat_id: "",
    bond_id: "",
    date: "",
    weight_input: "",
  };

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
      search === `${endpoint}${userData?.branch_id}?page=${page}` ||
      search === ""
        ? `${endpoint}${userData?.branch_id}?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log(
    "🚀 ~ file: WeightAdjustment.tsx:28 ~ WeightAdjustment ~ weightAdjustmentData:",
    weightAdjustmentData
  );

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `${endpoint}${userData?.branch_id}?`;
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

  // EFFECTS
  useEffect(() => {
    if (weightAdjustmentData) {
      setDataSource(weightAdjustmentData.data);
    }
  }, [weightAdjustmentData]);

  useEffect(() => {
    refetch();
  }, [page, endpoint]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);


  return (
    <div className="relative h-full p-10">
      <h2 className="mb-6 text-xl font-bold text-slate-700">
        {t("weight adjustment")}
      </h2>

      <div className="flex items-center justify-center  gap-4">
        <li
          onClick={() =>
            setEndPoint("/buyingUsedGold/api/v1/items_has_stones/")
          }
          className="flex cursor-pointer flex-col h-20 rounded-xl text-center text-sm font-bold shadow-md"
        >
          <p className="bg-mainGreen p-2 flex items-center justify-center h-full rounded-xl text-white">
            {t(`pieces with stones`)}
          </p>
        </li>
        <li
          onClick={() =>
            setEndPoint("/buyingUsedGold/api/v1/items_hasnot_stones/")
          }
          className="flex cursor-pointer flex-col h-20 rounded-xl text-center text-sm font-bold shadow-md"
        >
          <p className="bg-mainGreen p-2 flex items-center justify-center h-full rounded-xl text-white">
            {t(`pieces without stones`)}
          </p>
        </li>
      </div>

      <Formik
        initialValues={initailSearchValues}
        onSubmit={(values) => {
          getSearchResults({
            ...values,
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
            />

            <div className="flex gap-4 items-center self-end mr-auto my-6">
              <Back className="w-32" />
              <Button
                onClick={() => setWeightModal(true)}
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
              />
            </Modal>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WeightAdjustment;
