import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import BudgetFirstPage from "./budgetFirstPage/BudgetFirstPage";
import BudgetSecondPage from "./budgetSecondPage/BudgetSecondPage";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { processBudgetData } from "../../../utils/helpers";
import { formatDate } from "../../../utils/date";

const BankBudget = () => {
  const [stage, setStage] = useState<number>(1);
  const [budgetFiles, setBudgetFiles] = useState<File[]>([]);
  const [selectedBankData, setSelectedBankData] = useState(null);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [mainCardData, setMainCardData] = useState([]);
  console.log("🚀 ~ BankBudget ~ mainCardData:", mainCardData);
  const [operationCardData, setOperationCardData] = useState([]);
  const { userData } = useContext(authCtx);
  const [showPrint, setShowPrint] = useState(false);
  const [operationData, setOperationData] = useState(null);
  const mainCardDataBoxes = mainCardData?.cards
    ?.map((card) => card?.boxes)
    .flat();

  const budgetOperation = processBudgetData(mainCardData.cards);
  const formattedBudgetOperation = Object.entries(budgetOperation);

  const operationDataTotals = formattedBudgetOperation.map((budgets) => {
    return budgets[1].reduce(
      (acc, curr) => {
        return {
          accountable: curr.account,
          card_commission:
            acc.card_commission + Number(curr.card_commission) || 0,
          card_vat: acc.card_vat + Number(curr.card_vat) || 0,
          total_balance: acc.total_balance + curr.value || 0,
          operation_number: budgets[1].length,
        };
      },
      {
        card_commission: 0,
        card_vat: 0,
        total_balance: 0,
      }
    );
  });
  console.log(
    "🚀 ~ operationDataTotals ~ operationDataTotals:",
    operationDataTotals
  );

  const totalCardCommission = operationDataTotals.reduce(
    (acc, curr) => (acc += curr.card_commission),
    0
  );

  const totalCardCommissionTax = operationDataTotals.reduce(
    (acc, curr) => (acc += curr.card_vat),
    0
  );

  const totalCardBalanceWithCommission = operationDataTotals.reduce(
    (acc, curr) => (acc += curr.total_balance),
    0
  );

  const totalBalance =
    totalCardBalanceWithCommission -
    totalCardCommission -
    totalCardCommissionTax;

  const initialValues = {
    bankName: "",
    accountNumber: "",
    accountBalance: "",
    from: new Date(),
    to: new Date(),
  };

  const { data: invoiceData } = useFetch({
    queryKey: ["budget-bonds-invoice"],
    endpoint: `/budget/api/v1/budgetBond/${userData?.branch_id}`,
  });
  console.log("🚀 ~ invoiceData:", invoiceData);

  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      setShowPrint(true);
      // navigate(`/selling/honesty/all-honest/${data.bond_id}`);
    },
  });

  const handleSubmit = (values: any) => {
    const formatedCardData = mainCardData?.cards?.map((card) => {
      const frontKeyValue = operationDataTotals.find(
        (el) => el.accountable === card.accountable
      ).total_balance;
      return {
        [card.front_key]: frontKeyValue,
      };
    });

    const transformedObject = formatedCardData.reduce((acc: any, obj: any) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];

      acc[key] = value;

      return acc;
    }, {});

    const bankFrontKeyValues = formatedCardData?.map((values) => {
      return Object.values(values).map((val) => val);
    });

    const formatedValue = {
      branch_id: userData?.branch_id,
      bond_date: new Date(),
      employee_id: userData?.id,
      bond_number: invoiceData.length + 1,
      bankFrontKey: mainCardData?.base?.front_key,
      total_commission: totalCardCommission,
      total_commission_vat: totalCardCommissionTax,
      card: transformedObject,
      bankValue: totalBalance,
      media: budgetFiles,
      items: mainCardDataBoxes?.map((card) => {
        return {
          card_name: card?.account,
          id: card?.id,
          amount: card?.value - card?.card_commission - card?.card_vat,
          vat: card?.card_vat,
          commission: card?.card_commission,
          operation: card?.restriction_name || "لا يوجد",
          bond_number: card?.bond_id,
          total: card?.value,
          date: card?.date,
        };
      }),
    };

    // mutate({
    //   endpointName: "/budget/api/v1/create",
    //   values: formatedValue,
    //   dataType: "formData",
    // });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => {
        return (
          <Form>
            {stage === 1 && (
              <BudgetFirstPage
                budgetFiles={budgetFiles}
                setBudgetFiles={setBudgetFiles}
                setStage={setStage}
                selectedAccountData={selectedAccountData}
                selectedBankData={selectedBankData}
                setSelectedAccountData={setSelectedAccountData}
                setSelectedBankData={setSelectedBankData}
                setOperationCardData={setOperationCardData}
                operationCardData={operationCardData}
                mainCardData={mainCardData?.cards}
                setMainCardData={setMainCardData}
                invoiceData={invoiceData}
                setOperationData={setOperationData}
              />
            )}
            {stage === 2 && (
              <BudgetSecondPage
                setStage={setStage}
                isLoading={isLoading}
                showPrint={showPrint}
                selectedBankData={selectedBankData}
                selectedAccountData={selectedAccountData}
                mainCardData={mainCardData}
                invoiceData={invoiceData}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default BankBudget;
