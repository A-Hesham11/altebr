////////// IMPORTS
import { Form, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import { Button } from "../../atoms";
import { InnerFormLayout, OuterFormLayout } from "../../molecules";
import BillInputs from "../selling components/bill/BillInputs";
import PaymentProcessing from "../selling components/data/PaymentProcessing";
import { HonestProvisons } from "./HonestProvisons";
import { notify } from "../../../utils/toast";

/////////// HELPER VARIABLES & FUNCTIONS
///
type HonestProvisonsProps_TP = {
  tableData: any;
  setTableData: any;
  paymentData: never[];
  setPaymentData: React.Dispatch<React.SetStateAction<never[]>>;
};
///
export const NewHonestForm = ({
  tableData,
  setTableData,
  paymentData,
  setPaymentData,
}: HonestProvisonsProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { submitForm, setFieldValue, values } = useFormikContext();
  const { userData } = useContext(authCtx);
  const { data: honestBondsData } = useFetch({
    queryKey: ["all-honest-bonds"],
    endpoint: `branchSafety/api/v1/bonds/${userData?.branch_id}`,
    pagination: true,
  });
  const sanadId = honestBondsData
    ? honestBondsData?.data?.find((item) => item.id).bondsafety_id
    : 0;
  ///
  /////////// STATES
  ///
  const [totalAmount, setTotalAmount] = useState(0);
  console.log("🚀 ~ file: NewHonestForm.tsx:49 ~ totalAmount:", totalAmount)
  const [totalRemainingAmount, setTotalRemainingAmount] = useState(0);
  const totalApproximateCost = tableData.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);

  const boxesData = [
    {
      id: "3278de93-0021-48ec-be9c-3583bad8b64b",
      account: "المبلغ المدفوع",
      value: totalAmount,
      unit: "ريال",
    },
    {
      id: "3278de93-0021-48ec-be9c-3583bad8b64b",
      account: "المبلغ المتبقي",
      value: totalRemainingAmount,
      unit: "ريال",
    },
    {
      id: "3278de93-0021-48ec-be9c-3583bad8b64b",
      account: t("total approximate cost"),
      value: totalApproximateCost,
      unit: "ريال",
    },
  ];
  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    const amountSummation = paymentData.reduce((acc, curr) => {
      location.pathname === "/selling/honesty/new-honest"
        ? (acc += +curr.amount + +curr.commission_tax + +curr.commission_riyals)
        : (acc +=
            +curr.cost_after_tax +
            +curr.commission_tax +
            +curr.commission_riyals);
      return acc;
    }, 0);
    setFieldValue("amount", amountSummation);
    setTotalAmount(amountSummation);
    const approxAmountSummation = tableData.reduce((acc, curr) => {
      acc += +curr.cost;
      return acc;
    }, 0);
    const approxFinalAmount = approxAmountSummation - amountSummation;
    setTotalRemainingAmount(approxFinalAmount);
    setFieldValue("remaining_amount", Math.abs(approxFinalAmount));
  }, [paymentData, tableData]);

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  // SHOW NOTIFY WHEN INPUT IS EMPTY AND SUBMIT FORM
  const handleSubmit = () => {
    if (values.client_name === "") {
      notify("info", `${t("please select a client name")}`);
      return;
    }
    submitForm();
  };

  ///
  return (
    <>
      <OuterFormLayout
        submitComponent={
          <Button
            type="submit"
            action={handleSubmit}
            className="ms-auto mt-8"
            loading={false}
          >
            {t("submit")}
          </Button>
        }
      >
        <Form>
          <InnerFormLayout
            title={`${t("main data")}`}
            leftComponent={
              <p className="font-bold">
                {`${t("bond number")}`}
                <span className="mx-2 text-mainOrange">{sanadId + 1}</span>
              </p>
            }
          >
            <div className="col-span-6 pb-6">
              <BillInputs dateFieldName="bond_date" />
            </div>
          </InnerFormLayout>
        </Form>
        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
          <h2 className="mb-4 text-base font-bold">{`${t(
            "honest provision"
          )}`}</h2>
          <HonestProvisons data={tableData} setData={setTableData} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {boxesData?.map((data: any) => (
            <li
              key={crypto.randomUUID()}
              className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md w-[80%] justify-self-center"
            >
              <p className="bg-mainOrange p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                {data.account}
              </p>
              <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                {data.value} <span>{data.unit}</span>
              </p>
            </li>
          ))}
        </div>
        <p className="h-1 w-full shadow-slate-400 shadow mt-5"></p>
        <PaymentProcessing
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          totalApproximateCost={totalApproximateCost}
        />
      </OuterFormLayout>
    </>
  );
};
