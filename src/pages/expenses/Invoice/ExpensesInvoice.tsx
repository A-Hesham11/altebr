import { t } from "i18next";
import { useFormikContext } from "formik";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
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
import AddSubExpensesPolicies from "../../../components/templates/subExpensesPolicy/AddSubExpensesPolicies";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import PaymentProccessingToManagement, {
  Payment_TP,
} from "../../Payment/PaymentProccessingToManagement";
import { notify } from "../../../utils/toast";

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
  taxAdded,
  taxZero,
  setStage,
  invoiceNumber,
  subExpensesOption,
  setSubExpensesOption,
  files,
  setFiles,
  paymentData,
  setPaymentData,
  selectedCardId,
  setSelectedCardId,
  setClientData,
  sellingItemsData,
  setSellingItemsData,
}) => {
  console.log("🚀 ~ taxZero:", taxZero);
  console.log("🚀 ~ taxAdded:", taxAdded);
  const { userData } = useContext(authCtx);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);

  const totalPaymentAmount = paymentData?.reduce((acc: any, item: any) => {
    return acc + +item.amount;
  }, 0);

  const { setFieldValue, values } = useFormikContext<Payment_TP>();
  console.log("🚀 ~ values:", values);

  const [selectedCardName, setSelectedCardName] = useState(null);
  const [cardId, setCardId] = useState("");
  const [activeTaxBtn, setActiveTaxBtn] = useState(null);

  const {
    data: taxExpensesData,
    isSuccess: taxExpensesIsSuccess,
    isLoading: taxExpensesIsLoading,
    refetch: taxExpensesRefetch,
  } = useFetch({
    endpoint: `/expenses/api/v1/expence-tax/${userData?.branch_id}`,
    queryKey: ["taxExpenses"],
    onSuccess: (data) => {
      console.log("🚀 ~ data:", data);
      data?.map((item: any) => {
        if (item.name === "ضريبة القيمة المضافه") {
          setTaxAdded(item.value);
        }

        if (item.name === "ضريبة صفريه") {
          setTaxZero(item.value);
        }
      });
    },
    // select: (data) =>
    //   data.map((item) => {
    //     return {
    //       id: item.id,
    //       value: item.id || "",
    //       label: item.name_ar || "",
    //     };
    //   }),
  });
  console.log("🚀 ~ taxExpensesData:", taxExpensesData);

  const handleTaxClick = (id: any, taxValue: any, setTaxFunc: any) => {
    if (activeTaxBtn === id) {
      setTaxFunc(false);
      setActiveTaxBtn(null);
      // setTaxAdded(false);
      // setTaxZero(false);
      // setTaxExempt(false);
      setFieldValue("expense_price_tax", 0);
      setFieldValue("expense_price_after_tax", "");
    } else {
      if (taxAdded) {
        setTaxAdded(taxAdded);
      } else if (taxZero) {
        setTaxZero(taxZero);
      } else {
        setTaxExempt(setTaxExempt);
      }
      console.log("🚀 ~ handleTaxClick ~ taxValue:", taxValue);

      setTaxFunc(taxValue);
      setActiveTaxBtn(id);

      const priceTax = +values.expense_price;
      const taxModified = +taxValue / 100 + 1;
      const priceAfterTax =
        +values.expense_price - +values.expense_price / taxModified;
        
        console.log("🚀 ~ handleTaxClick ~ taxModified:", taxModified)
        console.log("🚀 ~ handleTaxClick ~ values.expense_price:", values.expense_price)
      setFieldValue("expense_price_tax", priceTax);
      setFieldValue("expense_price_after_tax", priceAfterTax.toFixed(2));
    }
  };

  const taxButtons = [
    {
      id: 1,
      name: "value added tax",
      handleClick: () => handleTaxClick(1, taxAdded, setTaxAdded),
    },
    {
      id: 2,
      name: "zero tax",
      handleClick: () => handleTaxClick(2, taxZero, setTaxZero),
    },
    {
      id: 3,
      name: "tax exempt",
      handleClick: () => handleTaxClick(3, null, setTaxExempt),
    },
  ];

  const {
    data: subExpensesOptionData,
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
      data.map((item: any) => {
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
              <div>
                <BaseInputField
                  placeholder={`${t("expense price")}`}
                  id="expense_price"
                  name="expense_price"
                  label={`${t("expense price")}`}
                  type="text"
                  required
                  className="w-80"
                  onChange={(e) => {
                    setFieldValue("expense_price", +e.target.value);
                    let taxModified;

                    if (taxAdded) {
                      taxModified = +taxAdded / 100 + 1;
                    }else if (taxZero) {
                      taxModified = +taxZero / 100 + 1;
                    }

                    const priceAfterTax =
                      +e.target.value - +e.target.value / taxModified;

                    if (activeTaxBtn) {
                      setFieldValue(
                        "expense_price_after_tax",
                        priceAfterTax.toFixed(2)
                      );
                    }
                  }}
                />
              </div>

              <div>
                <BaseInputField
                  placeholder={`${t("expense price after tax")}`}
                  id="expense_price_after_tax"
                  name="expense_price_after_tax"
                  label={`${t("expense price after tax")}`}
                  type="text"
                  disabled
                  className="bg-mainDisabled border-mainDisabled"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 items-end lg:grid-cols-3 gap-12">
              <div className="flex items-end gap-1">
                <Select
                  id="sub_expense"
                  label={`${t("sub expense")}`}
                  name="sub_expense"
                  value={subExpensesOption}
                  placeholder={`${t("sub expense")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  isLoading={isLoading || isRefetching || isFetching}
                  options={subExpensesOptionData}
                  onChange={(e) => {
                    console.log("🚀 ~ e:", e);
                    setSubExpensesOption(e);
                    setFieldValue("expense_type_name", e.label);
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

            {/* TAXES BUTTONS */}
            <div className="mt-2">
              <div className="flex gap-4">
                {taxButtons.map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={btn.handleClick}
                    className={`${
                      activeTaxBtn === btn.id
                        ? "bg-mainGreen text-white"
                        : "bg-gray-300 text-mainGreen"
                    } px-4 py-2 rounded-lg`}
                  >
                    {t(`${btn.name}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-6">
          <h2 className="mb-4 text-base font-bold">
            {t("choose a method of payment")}
          </h2>

          {/* PAYMENT CARDS */}
          <div>
            <PaymentProccessingToManagement
              paymentData={paymentData}
              isInExpenses
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
        </div>

        <div className="flex gap-3 justify-end mt-12 pb-8">
          <Back />
          <Button
            type="submit"
            loading={false}
            action={() => {
              if (values.expense_price === "") {
                notify("error", t("please enter expense price"));
                return;
              }

              if (values.expense_date === "") {
                notify("error", t("please enter expense date"));
                return;
              }

              if (values.sub_expense === "") {
                notify("error", t("please select sub expense"));
                return;
              }

              if (values.add_description === "") {
                notify("error", t("please enter description"));
                return;
              }

              if (totalPaymentAmount > +values.expense_price_after_tax) {
                notify(
                  "error",
                  t(
                    "the amount of payment is greater than the value of the bond"
                  )
                );
                return;
              }

              setStage(2);
              setClientData({
                client_value: "ahmed",
                client_id: 1,
                bond_date: values.expense_date,
              });

              setSellingItemsData([values]);
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
            <AddSubExpensesPolicies idInBranch={userData?.branch_id} />
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
