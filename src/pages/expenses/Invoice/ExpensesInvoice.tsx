import { t } from "i18next";
import { Form, Formik } from "formik";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
import ExpenseHeader from "./ExpenseHeader";
import {
  BaseInputField,
  DateInputField,
  Modal,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { CiCalendarDate } from "react-icons/ci";
import { formatDate } from "../../../utils/date";
import { useFetch, useIsRTL } from "../../../hooks";
import { useContext, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { IoMdAdd } from "react-icons/io";
import { Add } from "../../../components/atoms/icons/Add";
import AddExpensesPolicies from "../../../components/templates/expensesPolicy/AddExpensesPolicies";
import AddSubExpensesPolicies from "../../../components/templates/subExpensesPolicy/AddSubExpensesPolicies";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import PaymentCard from "../../../components/selling/selling components/data/PaymentCard";
import ExpensesInvoiceTable from "./ExpensesInvoiceTable";
import PaymentProccessingToManagement, {
  Payment_TP,
} from "../../Payment/PaymentProccessingToManagement";
import ExpensesCards from "./ExpensesCards";
import PaymentProcessing from "../../../components/selling/selling components/data/PaymentProcessing";

interface ExpensesInvoiceProps {
  setTaxAdded: (value: boolean) => void;
  setTaxZero: (value: boolean) => void;
  setTaxExempt: (value: boolean) => void;
  showTax: boolean;
  setShowTax: (value: boolean) => void;
  taxAdded: boolean;
  taxZero: boolean;
  taxExempt: boolean;
  setStage: (value: number) => void;
}

const ExpensesInvoice: React.FC<ExpensesInvoiceProps> = ({
  setTaxAdded,
  setTaxZero,
  setTaxExempt,
  showTax,
  setShowTax,
  taxAdded,
  taxZero,
  taxExempt,
  setStage,
  invoiceNumber,
  majorExpensesOption,
  setMajorExpensesOption,
  files,
  setFiles,
  paymentData,
  setPaymentData,
  selectedItem,
  setSelectedItem,
}) => {
  console.log("🚀 ~ file: ExpensesInvoice.tsx:51 ~ files:", files);
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ file: AddSubExpensesPolicies.tsx:43 ~ userData:", userData);
  const isRTL = useIsRTL();
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [cardFrontKey, setCardFronKey] = useState("");
  const [cardFrontKeyAccept, setCardFrontKeyAccept] = useState("");
  const [sellingFrontKey, setSellingFrontKey] = useState("");
  const [cardDiscountPercentage, setCardDiscountPercentage] = useState(0);
  const [editData, setEditData] = useState<Payment_TP>();
  const [card, setCard] = useState<string | undefined>("");
  console.log("🚀 ~ file: ExpensesInvoice.tsx:72 ~ card:", card);
  const [cardImage, setCardImage] = useState<string | undefined>("");
  console.log("🚀 ~ file: ExpensesInvoice.tsx:74 ~ cardImage:", cardImage);

  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [cardId, setCardId] = useState("");

  const {
    data: subExpensesOption,
    isSuccess,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
    isFetching,
  } = useFetch({
    endpoint: `/expenses/api/v1/sub-expence/${userData?.branch_id}`,
    queryKey: ["subExpensesOption"],
    select: (data) =>
      data.map((item) => {
        return {
          id: item.id,
          value: item.id || "",
          label: item.name_ar || "",
        };
      }),
  });

  return (
    <div className="overflow-hidden">
      <div className="relative h-full p-10">
        <h2 className="mb-4 text-base font-bold">{t("add expense bond")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <div className="mb-8">
              <div className="flex items-center gap-8 lg:gap-16">
                <div className="flex items-center gap-5">
                  <h2>
                    {t("expense bond number")} -{" "}
                    {`${invoiceNumber?.length + 1}`}
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 items-end gap-12 mb-6">
              <BaseInputField
                placeholder={`${t("expense price")}`}
                id="expense_price"
                name="expense_price"
                label="expense price"
                type="text"
                required
                className="w-80"
              />

              <BaseInputField
                placeholder={`${t("expense price after tax")}`}
                id="expense_price_after_tax"
                name="expense_price_after_tax"
                label=""
                type="text"
                required
                className="hidden"
              />

              <Button
                action={() => {
                  console.log("add tax");
                }}
                className="border-2 ml-8 justify-self-end bg-mainGreen text-white flex items-center gap-2 w-40 text-center justify-center"
              >
                <span>{t("add tax")}</span>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 items-end lg:grid-cols-3 gap-12">
              <div className="flex items-end gap-1">
                <Select
                  id="sub_expense"
                  label={`${t("sub expense")}`}
                  name="sub_expense"
                  value={majorExpensesOption}
                  placeholder={`${t("sub expense")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  isLoading={isLoading || isRefetching || isFetching}
                  options={subExpensesOption}
                  onChange={(e) => {
                    setMajorExpensesOption(e);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setOpen((prev) => !prev);
                    setModel(true);
                  }}
                  className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                >
                  <IoMdAdd className="fill-mainGreen w-6 h-6" />
                </button>
              </div>

              <DateInputField
                label={`${t("expense date")}`}
                name="expense_date"
                minDate={new Date()}
                icon={<CiCalendarDate />}
                required
                labelProps={{ className: "mb-2" }}
                placeholder={`${formatDate(new Date())}`}
              />

              <div className="justify-self-end ">
                <FilesUpload files={files} setFiles={setFiles} />
              </div>
            </div>

            <div className="flex mt-6 items-end gap-6 w-full">
              <div className="w-full">
                <TextAreaField
                  placeholder={`${t("add description")}`}
                  id="add_description"
                  name="add_description"
                  required
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-6">
          <h2 className="mb-4 text-base font-bold">{t("choose a method")}</h2>

          {/* PAYMENT CARDS */}
          <div>
            {/* <ExpensesCards
              cardImage={cardImage}
              setCardImage={setCardImage}
              card={card}
              setCard={setCard}
              selectedCardId={selectedCardId}
              setSelectedCardId={setSelectedCardId}
            /> */}
            <PaymentProccessingToManagement
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              sellingItemsData={sellingItemsData}
              selectedCardId={selectedCardId}
              setSelectedCardId={setSelectedCardId}
              setCardId={setCardId}
              cardId={cardId}
              setSelectedCardName={setSelectedCardName}
              selectedCardName={selectedCardName}
            />
          </div>

          {/* TABLE */}
          {/* <div>
            <ExpensesInvoiceTable
              paymentData={paymentData}
              setEditData={setEditData}
              setPaymentData={setPaymentData}
            />
          </div> */}
        </div>

        <div className="flex gap-3 justify-end mt-12 pb-8">
          <Back />
          <Button
            type="submit"
            loading={false}
            action={() => {
              setStage(2);
            }}
          >
            {t("add expense bond")}
          </Button>
        </div>

        {model && (
          <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <AddSubExpensesPolicies />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ExpensesInvoice;

// {/* INCLUDED TAX */}
// <div className="">
//   <div className="space-y-2 mb-6">
//     <input
//       type="checkbox"
//       id="include_tax"
//       name="include_tax"
//       onChange={() => {
//         setShowTax((prev) => !prev);
//       }}
//     />

//     <label htmlFor="name" className="ms-2">
//       {t("include tax")}
//     </label>
//   </div>

//   {/* TAX INCLUDE OPTION */}
//   {showTax && (
//     <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end ">
//       <div className="space-y-2">
//         <input
//           type="checkbox"
//           id="name_added"
//           name="name_added"
//           onChange={() => {
//             setTaxAdded(!taxAdded);
//           }}
//         />

//         <label htmlFor="name" className="ms-2">
//           {t("value added tax")}
//         </label>
//       </div>

//       <div className="space-y-2">
//         <input
//           type="checkbox"
//           id="name_zero"
//           name="name_zero"
//           onChange={() => {
//             setTaxZero(!taxZero);
//           }}
//         />

//         <label htmlFor="name" className="ms-2">
//           {t("zero tax")}
//         </label>
//       </div>

//       <div className="space-y-2">
//         <input
//           type="checkbox"
//           id="name_exempt"
//           name="name_exempt"
//           onChange={() => {
//             setTaxExempt(!taxExempt);
//           }}
//         />

//         <label htmlFor="name" className="ms-2">
//           {t("tax exempt")}
//         </label>
//       </div>
//     </div>
//   )}
// </div>

{
  /* <div className="flex items-end my-6 gap-4">
<BaseInputField
  id="value"
  name="value"
  type="text"
  label={
    selectedCardName
      ? `${selectedCardName}  ${
          mainAccountNumber ? `(${mainAccountNumber})` : ""
        }`
      : t("Fund totals")
  }
  placeholder={
    selectedCardName ? selectedCardName : t("Fund totals")
  }
  value={data?.value?.toFixed(2)}
  disabled
  className={`bg-mainDisabled text-mainGreen `}
/>

<div className="relative">
  <p className="absolute left-0 top-1 text-sm font-bold text-mainGreen">
    <span>{t("remaining cost")} : </span>{" "}
    {formatReyal(Number(costRemaining.toFixed(2)))}
  </p>
  <BaseInputField
    id="amount"
    name="amount"
    type="text"
    label={`${t("amount")}`}
    placeholder={`${t("amount")}`}
    onChange={(e) => {
      setFieldValue("cost_after_tax", +e.target.value);
    }}
    className={` ${
      +values.amount > +costRemaining && "bg-red-100"
    }`}
  />
  <div>
    {+values.amount > +costRemaining && (
      <p className="text-mainRed">
        <span>{t("Weight must be less than or equal to")}</span>
        <span> {costRemaining}</span>
      </p>
    )}
  </div>
</div>

<Button
  type="submit"
  className="animate_from_left animation_delay-11  transition-all duration-300 bg-mainOrange h-10"
  disabled={+values.amount > +costRemaining}
>
  {t("confirm")}
</Button>
</div> */
}
