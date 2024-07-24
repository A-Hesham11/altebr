import { Form, Formik } from "formik";
import { useState } from "react";
import BudgetFirstPage from "./budgetFirstPage/BudgetFirstPage";
import BudgetSecondPage from "./budgetSecondPage/BudgetSecondPage";

const BankBudget = () => {
  const [stage, setStage] = useState<number>(1);
  const [budgetFiles, setBudgetFiles] = useState<File[]>([]);
  const [selectedBankData, setSelectedBankData] = useState(null);
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [mainCardData, setMainCardData] = useState([]);
  const [operationCardData, setOperationCardData] = useState([]);

  const initialValues = {
    bankName: "",
    accountNumber: "",
    accountBalance: "",
    date_from: "",
    date_to: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
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
                mainCardData={mainCardData}
                setMainCardData={setMainCardData}
              />
            )}
            {stage === 2 && (
              <BudgetSecondPage
                setStage={setStage}
                selectedBankData={selectedBankData}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default BankBudget;
