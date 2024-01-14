import { t } from "i18next";
import { Form, Formik } from "formik";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
import ExpenseHeader from "./ExpenseHeader";
import { BaseInputField } from "../../../components/molecules";

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
}) => {
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              {/* TODO: INPUTS*/}
              <BaseInputField
                placeholder={`${t("expense price")}`}
                id="expense_price"
                name="expense_price"
                type="text"
                required
                className={`text-center`}
              />
            </div>
          </div>
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
