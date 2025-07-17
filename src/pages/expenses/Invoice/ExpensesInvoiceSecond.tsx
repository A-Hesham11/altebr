import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseFinalPreview } from "./ExpenseFinalPreview";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { numberContext } from "../../../context/settings/number-formatter";
import { ClientData_TP, Selling_TP } from "../../selling/PaymentSellingPage";
import { mutateData } from "../../../utils/mutateData";
import { useIsRTL, useMutate } from "../../../hooks";
import { Button } from "../../../components/atoms";
import ExpenseInvoiceTable from "./ExpensesInvoiceTable";
import { useFormikContext } from "formik";
import { formatDate } from "../../../utils/date";
import { notify } from "../../../utils/toast";
import { useReactToPrint } from "react-to-print";

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
  isInEdara,
}: CreateHonestSanadProps_TP) => {
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const { pathname } = location;
  const navigate = useNavigate();
  const isRTL = useIsRTL();
  const [responseSellingData, SetResponseSellingData] = useState(null);

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

  const totalValueAfterTax = sellingItemsData?.reduce(
    (acc: number, curr: any) => {
      acc += +curr.expense_price_after_tax;
      return acc;
    },
    0
  );

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
      SetResponseSellingData(data);
      notify("success", `${t("success add expense invoice")}`);
      resetForm();
      setFiles([]);

      // navigate(`/selling/honesty/return-honest/${data.bond_id}`)
      // navigate(`/expenses/expensesBonds/`);
    },
    onError: (error) => {
      notify("error", error?.message);
    },
  });

  const posSellingDataHandler = () => {
    let invoice;

    if (pathname === "/edara/addExpenses") {
      invoice = {
        expense_date: values.expense_date || formatDate(new Date()),
        branch_id: userData?.branch_id,
        expense_bond_number: invoiceNumber?.length + 1,
        child_id: values.sub_expense,
        description: values.add_description,
        expense_amount: +values.expense_price,
        expense_tax: +values.expense_price_after_tax,
        tax_number: +values.tax_number,
        expensetax_id: taxType?.expencetax_id ? taxType?.expencetax_id : "",
      };
    } else {
      invoice = {
        expence_date: values.expense_date || formatDate(new Date()),
        branch_id: userData?.branch_id,
        expence_bond_number: invoiceNumber?.length + 1,
        child_id: values.sub_expense,
        description: values.add_description,
        expence_amount: +values.expense_price,
        expence_tax: +values.expense_price_after_tax,
        tax_number: +values.tax_number,
        expencetax_id: taxType?.expencetax_id ? taxType?.expencetax_id : "",
      };
    }

    // let card;

    // if (isInEdara) {
    //   card = paymentData.reduce((acc, curr) => {
    //     acc[curr.frontKeyExpenseEdaraa] = Number(curr.amount);
    //     return acc;
    //   }, {});
    // } else {
    //   card = paymentData.reduce((acc, curr) => {
    //     acc[curr.exchangeFrontKey] = Number(curr.amount);
    //     return acc;
    //   }, {});
    // }

    // const paymentCard = paymentData?.map((item) => ({
    //   card_id: item.frontkey === "cash" ? "cash" : item.paymentCardId,
    //   bank_id: item.paymentBankId,
    //   amount: item.cost_after_tax,
    // }));

    const payments = paymentData?.map((item: any) => {
      return {
        type: item?.paymentCardId
          ? "card"
          : item?.paymentBankId
          ? "bank"
          : "cash",
        type_id: item.paymentCardId || item.paymentBankId || "cash",
        type_amount: item.amount,
        bank_account_id: item.frontkey === "cash" ? "cash" : item.expenses_id,
      };
    });

    mutate({
      endpointName:
        pathname === "/edara/addExpenses"
          ? "/edaraaExpense/api/v1/edaraaExpense-invoices"
          : "/expenses/api/v1/add-expense-invoice",
      values: { ...invoice, media: files, payments },
      dataType: "formData",
    });
  };

  const contentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
      .rtl {
        direction: rtl;
        text-align: right;
      }

      .ltr {
        direction: ltr;
        text-align: left;
      }
    }
    `,
  });

  return (
    <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
      <div className="flex items-center print:hidden justify-between mx-8 mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          {isSuccess ? (
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              action={handlePrint}
            >
              {t("print")}
            </Button>
          ) : (
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
        setPaymentData={setPaymentData}
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
