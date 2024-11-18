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
  setStage: (value: number) => void;
  invoiceNumber: string;
  subExpensesOption: any;
  setSubExpensesOption: (value: any) => void;
  files: any[];
  setFiles: (value: any[]) => void;
  paymentData: any[];
  setPaymentData: (value: any[]) => void;
  selectedCardId: string;
  setSelectedCardId: (value: string) => void;
  setClientData: (value: any) => void;
  sellingItemsData: any[];
  setSellingItemsData: (value: any[]) => void;
  taxType: any;
  setTaxType: (value: any) => void;
}

const ExpensesInvoice: React.FC<ExpensesInvoiceProps> = ({
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
  taxType,
  setTaxType,
}) => {
  console.log("🚀 ~ files:", files);
  console.log("🚀 ~ paymentData:", paymentData);
  const { setFieldValue, values } = useFormikContext<Payment_TP>();
  console.log("🚀 ~ values:", values);
  const { userData } = useContext(authCtx);

  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const [cardId, setCardId] = useState("");
  const [selectedCardName, setSelectedCardName] = useState(null);

  const totalPaymentAmount = paymentData?.reduce((acc: any, item: any) => {
    return acc + +item.amount;
  }, 0);

  const {
    data: taxExpensesData,
    isLoading: taxExpensesIsLoading,
    isRefetching: taxExpensesIsRefetching,
    isFetching: taxExpensesIsFetching,
  } = useFetch({
    endpoint: `/expenses/api/v1/expence-tax/${userData?.branch_id}`,
    queryKey: ["taxExpenses"],
    select: (data) =>
      data.map((item: any) => {
        return {
          expencetax_id: item.id,
          label: item.name,
          value: item.name === "ضريبة معفاه" ? null : item.value,
        };
      }),
  });

  const {
    data: subExpensesOptionData,
    isLoading,
    isRefetching,
    isFetching,
  } = useFetch({
    endpoint: `/expenses/api/v1/sub-expence/${userData?.branch_id}`,
    queryKey: ["subExpensesOption"],
    select: (data: any) =>
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
                  type="number"
                  required
                  onChange={(e) => {
                    setFieldValue("expense_price", +e.target.value);
                  }}
                />
              </div>

              <div>
                <Select
                  id="tax_type"
                  label={`${t("tax type")}`}
                  name="tax_type"
                  value={taxType}
                  placeholder={`${t("tax type")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  isLoading={
                    taxExpensesIsLoading ||
                    taxExpensesIsRefetching ||
                    taxExpensesIsFetching
                  }
                  options={taxExpensesData}
                  onChange={(e: any) => {
                    setTaxType(e);

                    const taxModified = +e.value / 100 + 1;
                    const taxCalculate =
                      +values.expense_price -
                      +values.expense_price / taxModified;

                    setFieldValue(
                      "expense_price_after_tax",
                      taxCalculate.toFixed(2)
                    );
                  }}
                />
              </div>

              <div>
                <BaseInputField
                  placeholder={`${t("tax")}`}
                  id="expense_price_after_tax"
                  name="expense_price_after_tax"
                  label={`${t("tax")}`}
                  type="text"
                  disabled
                  className="bg-mainDisabled border-mainDisabled"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 items-end lg:grid-cols-4 gap-8">
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
                  onChange={(e: any) => {
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

              <div>
                <BaseInputField
                  placeholder={`${t("directed to")}`}
                  id="directed_to"
                  name="directed_to"
                  label={`${t("directed to")}`}
                  type="text"
                  required
                  onChange={(e) => {
                    setFieldValue("directed_to", +e.target.value);
                  }}
                />
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
              expensePrice={values?.expense_price}
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
                notify("info", `${t("please enter expense price")}`);
                return;
              }

              if (values.expense_date === "") {
                notify("info", `${t("please enter expense date")}`);
                return;
              }

              if (values.sub_expense === "") {
                notify("info", `${t("please select sub expense")}`);
                return;
              }

              if (values.add_description === "") {
                notify("info", `${t("please enter description")}`);
                return;
              }

              if (totalPaymentAmount > +values.expense_price) {
                notify(
                  "info",
                  `${t(
                    "the amount of payment is greater than the value of the bond"
                  )}`
                );
                return;
              }

              if (files?.length === 0) {
                notify("info", `${t("attachments is required")}`);
                return;
              }
              if (paymentData?.length === 0) {
                notify("info", `${t("please add amount")}`);
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
