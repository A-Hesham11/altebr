import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseFinalPreview } from "./ExpenseFinalPreview";
import BuyingInvoiceTable from "../../Buying/BuyingInvoiceTable";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { numberContext } from "../../../context/settings/number-formatter";
import { ClientData_TP, Selling_TP } from "../../selling/PaymentSellingPage";
import { mutateData } from "../../../utils/mutateData";
import { useMutate } from "../../../hooks";
import { Button } from "../../../components/atoms";
import ExpenseFinalInvoiceTable from "./ExpenseFinalInvoiceTable";
import { BuyingFinalPreview } from "../../Buying/BuyingFinalPreview";
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
};
const ExpensesInvoiceSecond = ({
  setStage,
  sellingItemsData,
  paymentData,
  clientData,
  invoiceNumber,
  selectedItemDetails,
  odwyaTypeValue,
  setOdwyaTypeValue,
}: CreateHonestSanadProps_TP) => {
  console.log(
    "🚀 ~ file: ExpensesInvoiceSecond.tsx:32 ~ sellingItemsData:",
    sellingItemsData
  );
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();

  const { setFieldValue, values } = useFormikContext<any>();

  // FORMULA TO CALC THE TOTAL COST OF BUYING INVOICE
  const totalCost = sellingItemsData.reduce((acc: number, curr: any) => {
    acc = +curr.expense_price + +curr.expense_price_tax;
    return acc;
  }, 0);

  const totalValueAddedTax = sellingItemsData.reduce(
    (acc: number, curr: any) => {
      acc += +curr.value_added_tax;
      return acc;
    },
    0
  );

  const totalValueAfterTax = sellingItemsData.reduce(
    (acc: number, curr: any) => {
      acc += +curr.total_value;
      return acc;
    },
    0
  );

  const costDataAsProps = {
    totalCost,
    // totalValueAddedTax,
    // totalValueAfterTax,
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("expense type")}</span>,
        accessorKey: "expense_type_name",
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
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("expense tax")} </span>,
        accessorKey: "expense_price_tax",
        cell: (info) => formatReyal(Number(info.getValue())) || "---",
      },
      // {
      //   header: () => <span>{t("total value")} </span>,
      //   accessorKey: "total_value",
      //   cell: (info) => formatReyal(Number(info.getValue())) || "---",
      // },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) => {
          return formatReyal(+info.row.original.expense_price + +info.row.original.expense_price_tax) || "---";
        },
      },
    ],
    []
  );

  // if (odwyaTypeValue === "supplier") {
  //   Cols.push(
  //     {
  //       header: () => <span>{t("value added tax")} </span>,
  //       accessorKey: "value_added_tax",
  //       cell: (info) => formatReyal(Number(info.getValue())) || "---",
  //     },
  //     {
  //       header: () => <span>{t("total value")} </span>,
  //       accessorKey: "total_value",
  //       cell: (info) => formatReyal(Number(info.getValue())) || "---",
  //     }
  //   );
  // }

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
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success", t("success add expense invoice"));
      // navigate(`/selling/honesty/return-honest/${data.bond_id}`)
      navigate(`/expenses/expensesBonds/`);
    },
    onError: (error) => {
      notify("error", error?.message);
    },
  });

  const posSellingDataHandler = () => {
    // if (odwyaTypeValue === "supplier") {
    //   invoice = {
    //     employee_id: userData?.id,
    //     branch_id: userData?.branch_id,
    //     supplier_id: clientData.client_id,
    //     client_id: "",
    //     invoice_date: clientData.bond_date,
    //     invoice_number: invoiceNumber.length + 1,
    //     count: sellingItemsData.length,
    //   };
    // } else {
    //   invoice = {
    //     employee_id: userData?.id,
    //     branch_id: userData?.branch_id,
    //     client_id: clientData.client_id,
    //     supplier_id: "",
    //     invoice_date: clientData.bond_date,
    //     invoice_number: invoiceNumber.length + 1,
    //     count: sellingItemsData.length,
    //   };
    // }

    const invoice = {
      expence_date: values.expense_date || formatDate(new Date()),
      branch_id: userData?.branch_id,
      expence_bond_number: invoiceNumber.length + 1,
      child_id: values.sub_expense,
      description: values.add_description,
      expence_amount: values.expense_price_after_tax,
    };

    // const items = sellingItemsData.map((item) => {
    //   if (odwyaTypeValue === "supplier") {
    //     return {
    //       category_id: item.category_id,
    //       karat_id: item.karat_id,
    //       branch_id: userData?.branch_id,
    //       gram_price: item.piece_per_gram,
    //       // edited: "0",
    //       value_added_tax: item.value_added_tax,
    //       total_value: item.total_value,
    //       weight: item.weight,
    //       value: item.value,
    //       has_stones: `${item.stones_id}`,
    //     };
    //   } else {
    //     return {
    //       category_id: item.category_id,
    //       karat_id: item.karat_id,
    //       branch_id: userData?.branch_id,
    //       gram_price: item.piece_per_gram,
    //       // edited: "0",
    //       // value_added_tax: item.value_added_tax,
    //       // total_value: item.total_value,
    //       weight: item.weight,
    //       value: item.value,
    //       has_stones: `${item.stones_id}`,
    //     };
    //   }
    // });

    console.log(invoice);

    mutate({
      endpointName: "/expenses/api/v1/add-expense-invoice",
      values: invoice,
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
          <Button
            className="bg-mainOrange px-7 py-[6px]"
            loading={isLoading}
            action={posSellingDataHandler}
          >
            {t("save")}
          </Button>
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
      />
    </div>
  );
};

export default ExpensesInvoiceSecond;
