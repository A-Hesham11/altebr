import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import BudgetFirstPage from "./budgetFirstPage/BudgetFirstPage";
import BudgetSecondPage from "./budgetSecondPage/BudgetSecondPage";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { processBudgetData } from "../../../utils/helpers";

const BankBudget = () => {
  const [stage, setStage] = useState<number>(1);
  const [budgetFiles, setBudgetFiles] = useState<File[]>([]);
  const [selectedBankData, setSelectedBankData] = useState(null);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [mainCardData, setMainCardData] = useState([]);
  const [operationCardData, setOperationCardData] = useState([]);
  const { userData } = useContext(authCtx);
  const mainCardDataBoxes = mainCardData?.cards
    ?.map((card) => card?.boxes)
    .flat();

  const initialValues = {
    bankName: "",
    accountNumber: "",
    accountBalance: "",
    date_from: "",
    date_to: "",
  };

  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      // setShowPrint(true);
      // navigate(`/selling/honesty/all-honest/${data.bond_id}`);
    },
  });

  const handleSubmit = (values: any) => {
    const formatedCardData = mainCardData?.cards?.map((card) => {
      const frontKeyValue = card.debtor - card.creditor;
      return {
        [card.front_key]: frontKeyValue,
      };
    });

    const bankFrontKeyValues = formatedCardData?.map((values) => {
      return Object.values(values).map((val) => val);
    });

    const formatedValue = {
      branch_id: userData?.branch_id,
      bond_date: new Date(),
      employee_id: userData?.id,
      bankFrontKey: mainCardData?.base?.front_key,
      card: formatedCardData,
      bankValue: bankFrontKeyValues.reduce(
        (acc: any, value: any) => +acc + +value,
        0
      ),
      items: mainCardDataBoxes?.map((card) => {
        // TODO: EDIT COMMISSION AND VAT AND AMOUNT
        return {
          card_name: card?.account,
          amount: card?.amount,
          vat: card?.vat,
          commission: card?.commission,
          operation: card?.restriction_name,
          bond_number: card?.bond_id,
          total: card?.value,
          date: card?.date,
        };
      }),
    };
    console.log("🚀 ~ handleSubmit ~ formatedValue:", formatedValue);

    //   mutate({
    //     endpointName: "/budget/api/v1/create",
    //     values: formatedValue
    // })
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
              />
            )}
            {stage === 2 && (
              <BudgetSecondPage
                setStage={setStage}
                selectedBankData={selectedBankData}
                selectedAccountData={selectedAccountData}
                mainCardData={mainCardData}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default BankBudget;
