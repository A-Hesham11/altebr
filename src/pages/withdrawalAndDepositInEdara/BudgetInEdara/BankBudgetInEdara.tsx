import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useFetch, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { processBudgetData } from "../../../utils/helpers";
import { formatDate } from "../../../utils/date";
import BudgetFirstPage from "../../Budget/budgetInvoice/budgetFirstPage/BudgetFirstPage";
import BudgetSecondPage from "../../Budget/budgetInvoice/budgetSecondPage/BudgetSecondPage";
import BankBudgetInEdaraFirstPage from "./BankBudgetInEdaraFirstPage";

const BankBudgetInEdara = () => {
  const [stage, setStage] = useState<number>(1);
  const [budgetFiles, setBudgetFiles] = useState<File[]>([]);
  const [selectedBankData, setSelectedBankData] = useState(null);
  console.log("🚀 ~ BankBudgetInEdara ~ selectedBankData:", selectedBankData);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  console.log(
    "🚀 ~ BankBudgetInEdara ~ selectedAccountData:",
    selectedAccountData
  );
  const [mainCardData, setMainCardData] = useState([]);
  console.log("🚀 ~ BankBudgetInEdara ~ mainCardData:", mainCardData);
  const [operationCardData, setOperationCardData] = useState([]);
  console.log("🚀 ~ BankBudgetInEdara ~ operationCardData:", operationCardData);
  const { userData } = useContext(authCtx);
  const [showPrint, setShowPrint] = useState(false);
  const [operationData, setOperationData] = useState(null);
  const mainCardDataBoxes = mainCardData?.cards
    ?.map((card) => card?.boxes)
    .flat();

  const budgetOperation = processBudgetData(mainCardData.cards);
  console.log("🚀 ~ BankBudgetInEdara ~ budgetOperation:", budgetOperation);
  const formattedBudgetOperation = Object.entries(budgetOperation);
  console.log(
    "🚀 ~ BankBudgetInEdara ~ formattedBudgetOperation:",
    formattedBudgetOperation
  );

  const operationDataTotals = formattedBudgetOperation.map((budgets) => {
    console.log("🚀 ~ operationDataTotals ~ budgets:", budgets);
    return budgets[1].reduce(
      (acc, curr) => {
        return {
          accountable: curr.account,
          // front_id: mainCardData.cards?.[0].front_id,
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

  const totalBalance = totalCardBalanceWithCommission;

  const initialValues = {
    bankName: "",
    accountNumber: "",
    accountBalance: "",
    from: null,
    to: null,
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
    },
  });

  const handleSubmit = (values: any) => {
    const formatedCardData = mainCardData?.cards?.map((card) => {
      console.log("🚀 ~ formatedCardData ~ card:", card)
      const frontKeyValue = operationDataTotals.find(
        (el) => el.accountable === card.accountable
      )?.total_balance;
      console.log("🚀 ~ formatedCardData ~ frontKeyValue:", frontKeyValue);

      return {
        [card.front_id]: frontKeyValue,
      };
    });

    const transformedObject = formatedCardData.reduce((acc: any, obj: any) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];

      acc[key] = value;

      return acc;
    }, {});
    console.log(
      "🚀 ~ transformedObject ~ transformedObject:",
      transformedObject
    );

    const bankFrontKeyValues = formatedCardData?.map((values) => {
      return Object.values(values).map((val) => val);
    });

    const formatedValue = {
      branch_id: userData?.branch_id,
      bond_date: new Date(),
      employee_id: userData?.id,
      bond_number: invoiceData.length + 1,
      // bankFrontKey: mainCardData?.base?.front_key,
      bankFrontKey: selectedAccountData?.id,
      total_commission: totalCardCommission,
      account_number: values?.accountNumber,
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
    console.log("🚀 ~ handleSubmit ~ formatedValue:", formatedValue);

    mutate({
      endpointName: "/budget/api/v1/handel",
      values: formatedValue,
      dataType: "formData",
    });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => {
        return (
          <Form className="">
            {stage === 1 && (
              <BankBudgetInEdaraFirstPage
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

export default BankBudgetInEdara;
