import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseFinalPreview } from "./ExpenseFinalPreview";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { numberContext } from "../../../context/settings/number-formatter";
import { ClientData_TP, Selling_TP } from "../../selling/PaymentSellingPage";
import { mutateData } from "../../../utils/mutateData";
import { useMutate } from "../../../hooks";
import { Button } from "../../../components/atoms";
import ExpenseInvoiceTable from "./ExpensesInvoiceTable";
import { useFormikContext } from "formik";
import { formatDate } from "../../../utils/date";
import { notify } from "../../../utils/toast";

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  sellingItemsData: never[];
  paymentData: never[];
  clientData: ClientData_TP;
  invoiceNumber: any;
  selectedItemDetails: any;
  setFiles: any;
  setPaymentData: any;
};
const ExpensesInvoiceSecond = ({
  setStage,
  sellingItemsData,
  paymentData,
  setPaymentData,
  clientData,
  invoiceNumber,
  selectedItemDetails,
  odwyaTypeValue,
  setOdwyaTypeValue,
  taxType,
  files,
  setFiles,
}: CreateHonestSanadProps_TP) => {
  console.log("🚀 ~ paymentData:", paymentData);
  console.log("🚀 ~ sellingItemsData:", sellingItemsData);
  console.log("🚀 ~ taxType:", taxType);
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();
  const [responseSellingData, SetResponseSellingData] = useState(null);
  console.log("🚀 ~ responseSellingData:", responseSellingData);

  const { setFieldValue, values, resetForm } = useFormikContext<any>();

  // FORMULA TO CALC THE TOTAL COST OF BUYING INVOICE
  const totalCost = sellingItemsData?.reduce((acc: number, curr: any) => {
    acc = +curr.expense_price + +curr.expense_price_tax;
    return acc;
  }, 0);

  const totalValueAddedTax = sellingItemsData?.reduce(
    (acc: number, curr: any) => {
      acc += +curr.value_added_tax;
      return acc;
    },
    0
  );
  console.log("🚀 ~ totalValueAddedTax:", totalValueAddedTax);

  const totalValueAfterTax = sellingItemsData?.reduce(
    (acc: number, curr: any) => {
      acc += +curr.expense_price_after_tax;
      return acc;
    },
    0
  );
  console.log("🚀 ~ totalValueAfterTax:", totalValueAfterTax);

  const costDataAsProps = {
    totalCost,
    totalValueAfterTax,
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("expense type")}</span>,
        accessorKey: "expense_type_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("We paid to")}</span>,
        accessorKey: "directed_to",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("description")} </span>,
        accessorKey: "add_description",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("expense price")}</span>,
        accessorKey: "expense_price",
        cell: (info) =>
          formatReyal(
            Number(info.getValue()) - info.row.original.expense_price_after_tax
          ),
      },
      {
        header: () => <span>{t("expense tax")} </span>,
        accessorKey: "expense_price_after_tax",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) => {
          return (
            formatReyal(
              +info.row.original.expense_price +
                +info.row.original.expense_price_tax
            ) || "---"
          );
        },
      },
    ],
    []
  );

  const ExpenseTableComp = () => (
    <ExpenseInvoiceTable
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
      odwyaTypeValue={odwyaTypeValue}
      setOdwyaTypeValue={setOdwyaTypeValue}
    ></ExpenseInvoiceTable>
  );

  // api
  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      console.log("🚀 ~ data:", data);
      SetResponseSellingData(data);
      console.log("🚀 ~ data:", data);
      notify("success", `${t("success add expense invoice")}`);
      resetForm();
      setFiles([])
      setPaymentData([])
      // navigate(`/selling/honesty/return-honest/${data.bond_id}`)
      // navigate(`/expenses/expensesBonds/`);
    },
    onError: (error) => {
      notify("error", error?.message);
    },
  });

  const posSellingDataHandler = () => {
    const invoice = {
      expence_date: values.expense_date || formatDate(new Date()),
      branch_id: userData?.branch_id,
      expence_bond_number: invoiceNumber?.length + 1,
      child_id: values.sub_expense,
      description: values.add_description,
      expence_amount: +values.expense_price,
      expence_tax: +values.expense_price_after_tax,
      expencetax_id: taxType?.expencetax_id ? taxType?.expencetax_id : "",
    };

    console.log({ ...invoice });

    const card = paymentData.reduce((acc, curr) => {
      acc[curr.exchangeFrontKey] = Number(curr.amount);
      return acc;
    }, {});

    const paymentCard = paymentData?.map((item) => ({
      card_id: item.frontkey === "cash" ? "cash" : item.paymentCardId,
      bank_id: item.paymentBankId,
      amount: item.cost_after_tax,
    }));

    mutate({
      endpointName: "/expenses/api/v1/add-expense-invoice",
      values: { ...invoice, media: files, card, paymentCard },
      dataType: "formData",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-8 mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={() => window.print()}
          >
            {t("print")}
          </Button>
          {!isSuccess && (
            <Button
              className="bg-mainOrange px-7 py-[6px]"
              loading={isLoading}
              action={posSellingDataHandler}
            >
              {t("save")}
            </Button>
          )}
        </div>
      </div>
      <ExpenseFinalPreview
        ItemsTableContent={<ExpenseTableComp />}
        setStage={setStage}
        paymentData={paymentData}
        clientData={clientData}
        sellingItemsData={sellingItemsData}
        costDataAsProps={costDataAsProps}
        invoiceNumber={invoiceNumber}
        odwyaTypeValue={odwyaTypeValue}
        setOdwyaTypeValue={setOdwyaTypeValue}
        responseSellingData={responseSellingData}
      />
    </div>
  );
};

export default ExpensesInvoiceSecond;
