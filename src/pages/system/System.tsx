// /////////// IMPORTS
// ///
// import { t } from "i18next";
// import { useState } from "react";
// import { Helmet } from "react-helmet-async";
// import { useNavigate } from "react-router-dom";
// import { Modal } from "../../components/molecules";
// import { AddEmployee } from "../../components/templates/employee/AddEmployee";
// import { CreateBranch } from "../../components/templates/reusableComponants/branches/CreateBranch";
// import { AccountingTree } from "../../components/templates/systemEstablishment/AccountingTree/AccountingTree";
// import { AddPartners } from "../../components/templates/systemEstablishment/partners/AddPartners";
// import AddSupplier from "../../components/templates/systemEstablishment/supplier/AddSupplier";
// import { SystemCard } from "../../components/templates/systemEstablishment/SystemCard";
// import { AddAdministrativeStructure } from "../administrativeStructure/AddAdministrativeStructure";
// import { Card_TP, FormNames_TP } from "./types-and-helpers";
// import AddDesimalNumber from "../../components/templates/DecimalNumber/AddDecimalNumber";
// import { GlobalAndStones } from "./GlobalAndStones";
// import AddBankCards from "../../components/templates/bankCards/AddBankCards";
// import AddBanks from "../../components/templates/banks/AddBanks";
// import AddAccountsBank from "../../components/templates/accountsBank/AddAccountsBank";
// import AddBankCardsData from "../../components/templates/bankCards/AddBankCardsData";
// import AddSellingPolicies from "../../components/templates/sellingPolicies/AddSellingPolicies";
// import AddExcludedItems from "../../components/templates/excludedItems/AddExcludedItems";
// import AddInvoiceData from "../../components/templates/invoiceData/AddInvoiceData";
// import AddBuyingPolicies from "../../components/templates/buyingPolicies/AddBuyingPolicies";
// import GoldPrice from "../../components/templates/goldPrice/GoldPrice";
// import AddTaxPolicy from "../../components/templates/sellingPolicies/AddTaxPolicy";
// import AddExpensesPolicies from "../../components/templates/expensesPolicy/AddExpensesPolicies";
// import AddSubExpensesPolicies from "../../components/templates/subExpensesPolicy/AddSubExpensesPolicies";
// import AddTaxExpensesPolicy from "../../components/templates/taxExpensesPolicy/AddTaxExpensesPolicy";
// import { CreateClassification } from "../../components/templates/reusableComponants/classifications/create/CreateClassification";
// import CreateKarat from "../../components/templates/reusableComponants/karats/create/CreateKarat";
// import CreateCategory from "../../components/templates/reusableComponants/categories/create/CreateCategory";
// import CreateColor from "../../components/templates/reusableComponants/CreateColor";
// ///
// /////////// Types
// ///
// type SystemProps_TP = {
//   title: string;
// };
// /////////// HELPER VARIABLES & FUNCTIONS
// ///

// ///
// export const System = ({ title }: SystemProps_TP) => {
//   /////////// VARIABLES
//   ///
//   const navigate = useNavigate();

//   const [popupIsOpen, setPopupIsOpen] = useState({
//     partners: false,
//     add_account: false,
//     add_supplier: false,
//     add_administrative_structure: false,
//     add_employee: false,
//     add_branch: false,
//     add_decimal_number: false,
//     add_typeCards: false,
//     add_cards: false,
//     add_banks: false,
//     add_accountBank: false,
//     selling_policies: false,
//     buying_policies: false,
//     main_expenses_policies: false,
//     sub_expenses_policies: false,
//     tax_expenses_policies: false,
//     gold_price: false,
//     excluded_items: false,
//     invoice_data: false,
//     Tax_Policy: false,
//     colors: false,
//     classifications: false,
//     categories: false,
//     karats: false,
//   });
//   const systemCards: Card_TP<FormNames_TP>[] = [
//     // بيانات هيكل الشركة
//     {
//       id: crypto.randomUUID(),
//       title: t("company data"),
//       viewLabel: `${t("view company data")}`,
//       viewHandler: () => navigate("company-profile"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("partners"),
//       name: "partners",
//       addLabel: `${t("add Partner")}`,
//       viewLabel: `${t("view partners")}`,
//       addComponent: <AddPartners title={`${t("add Partner")}`} />,
//       viewHandler: () => navigate("partners"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: `${t("administrative-structure")}`,
//       name: "add_administrative_structure",
//       addLabel: `${t("add administrative structure")}`,
//       viewLabel: `${t("view administrative structure")}`,
//       viewHandler: () => navigate("administrative-structure"),
//       addComponent: (
//         <AddAdministrativeStructure
//           title={`${t("add administrative structure")}`}
//         />
//       ),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("branch"),
//       name: "add_branch",
//       addLabel: `${t("add branch")}`,
//       viewLabel: `${t("view branches")}`,
//       viewHandler: () => navigate("branches"),
//       addComponent: <CreateBranch title={`${t("add branch")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("employees"),
//       name: "add_employee",
//       addLabel: `${t("add employee")}`,
//       viewLabel: `${t("view employees")}`,
//       viewHandler: () => navigate("employees"),
//       addComponent: <AddEmployee title={`${t("add employee")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("supplier"),
//       name: "add_supplier",
//       addLabel: `${t("add supplier")}`,
//       viewLabel: `${t("View Suppliers")}`,
//       addComponent: <AddSupplier title={`${t("add supplier")}`} />,
//       viewHandler: () => navigate("suppliers"),
//     },
//     // **************************************************************
//     // بيانات البنوك
//     {
//       id: crypto.randomUUID(),
//       title: t("banks"),
//       name: "add_banks",
//       addLabel: `${t("add banks")}`,
//       viewLabel: `${t("view banks")}`,
//       viewHandler: () => navigate("/system/banks"),
//       addComponent: <AddBanks title={`${t("add banks")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("bank accounts"),
//       name: "add_accountBank",
//       addLabel: `${t("add bank account")}`,
//       viewLabel: `${t("view bank accounts")}`,
//       viewHandler: () => navigate("/system/accountsBank"),
//       addComponent: <AddAccountsBank title={`${t("add bank account")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("cards types banks"),
//       name: "add_typeCards",
//       addLabel: `${t("add type card")}`,
//       viewLabel: `${t("view types cards")}`,
//       viewHandler: () => navigate("/system/bankCards"),
//       addComponent: <AddBankCards title={`${t("add type card")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("add card bank"),
//       name: "add_cards",
//       addLabel: `${t("add card bank")}`,
//       viewLabel: `${t("view cards banks")}`,
//       viewHandler: () => navigate("/system/cardsData"),
//       addComponent: <AddBankCardsData title={`${t("add card bank")}`} />,
//     },
//     // **************************************************************
//     // خصائص الأصناف

//     {
//       id: crypto.randomUUID(),
//       title: t("classifications"),
//       name: "classifications",
//       addLabel: `${t("add classification")}`,
//       addComponent: (
//         <CreateClassification title={`${t("add classification")}`} />
//       ),
//       viewLabel: `${t("view classifications")}`,
//       viewHandler: () => navigate("/system/global-and-stones/classifications"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("karats"),
//       name: "karats",
//       addLabel: `${t("add karat")}`,
//       addComponent: <CreateKarat title={`${t("add karat")}`} />,
//       viewLabel: `${t("view karats")}`,
//       viewHandler: () => navigate("/system/global-and-stones/karats"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("categories"),
//       name: "categories",
//       addLabel: `${t("add category")}`,
//       addComponent: <CreateCategory title={`${t("add category")}`} />,
//       viewLabel: `${t("view categories")}`,
//       viewHandler: () => navigate("/system/global-and-stones/categories"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("gold colors"),
//       name: "colors",
//       addLabel: `${t("add color")}`,
//       addComponent: <CreateColor title={`${t("add color")}`} />,
//       viewLabel: `${t("view colors")}`,
//       viewHandler: () => navigate("/system/global-and-stones/colors"),
//     },

//     // **************************************************************
//     // سياسة المبيعات والمشتريات
//     {
//       id: crypto.randomUUID(),
//       title: t("Tax policy"),
//       name: "Tax_Policy",
//       addLabel: `${t("Add Tax Policy")}`,
//       addComponent: <AddTaxPolicy title={`${t("Add Tax Policy")}`} />,
//       viewLabel: `${t("View Tax Policy")}`,
//       viewHandler: () => navigate("/system/TaxPolicy"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("excluded items"),
//       name: "excluded_items",
//       addLabel: `${t("add excluded category")}`,
//       addComponent: (
//         <AddExcludedItems title={`${t("add excluded category")}`} />
//       ),
//       viewLabel: `${t("view excluded items")}`,
//       viewHandler: () => navigate("/system/excludedItems"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("selling policies"),
//       name: "selling_policies",
//       addLabel: `${t("add selling policy")}`,
//       addComponent: <AddSellingPolicies title={`${t("add selling policy")}`} />,
//       viewLabel: `${t("view selling policies")}`,
//       viewHandler: () => navigate("/system/policiesSelling"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("buying policies"),
//       name: "buying_policies",
//       addLabel: `${t("add buying policy")}`,
//       addComponent: <AddBuyingPolicies title={`${t("add buying policy")}`} />,
//       viewLabel: `${t("view buying policies")}`,
//       viewHandler: () => navigate("/system/policiesBuying"),
//     },

//     {
//       id: crypto.randomUUID(),
//       title: t("main expenses policies"),
//       name: "main_expenses_policies",
//       addLabel: `${t("add main expenses policy")}`,
//       addComponent: (
//         <AddExpensesPolicies title={`${t("add main expenses policy")}`} />
//       ),
//       viewLabel: `${t("view main expenses policies")}`,
//       viewHandler: () => navigate("/system/mainExpensesPolicies"),
//     },

//     // SUB EXPENSES POLICIES
//     {
//       id: crypto.randomUUID(),
//       title: t("sub expenses policies"),
//       name: "sub_expenses_policies",
//       addLabel: `${t("add sub expenses policy")}`,
//       addComponent: (
//         <AddSubExpensesPolicies title={`${t("add sub expenses policy")}`} />
//       ),
//       viewLabel: `${t("view sub expenses policies")}`,
//       viewHandler: () => navigate("/system/subExpensesPolicies"),
//     },

//     // TAX EXPENSES POLICIES
//     {
//       id: crypto.randomUUID(),
//       title: t("tax expenses policies"),
//       name: "tax_expenses_policies",
//       addLabel: `${t("add tax expenses policy")}`,
//       addComponent: (
//         <AddTaxExpensesPolicy title={`${t("add tax expenses policy")}`} />
//       ),
//       viewLabel: `${t("view tax expenses policies")}`,
//       viewHandler: () => navigate("/system/taxExpensesPolicies"),
//     },

//     // **************************************************************
//     // سياسات المصاريف

//     // **************************************************************
//     // إدارة الحسابات
//     {
//       id: crypto.randomUUID(),
//       title: t("add_account"),
//       name: "add_account",
//       addLabel: `${t("add account")}`,
//       viewLabel: `${t("view accounts")}`,
//       addComponent: <AccountingTree />,
//       viewHandler: () => navigate("accounts"),
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("operations"),
//       viewLabel: `${t("view operations")}`,
//       viewHandler: () => navigate("operations"),
//     },

//     // **************************************************************
//     //  أخري

//     {
//       id: crypto.randomUUID(),
//       title: t("decimal numbers"),
//       name: "add_decimal_number",
//       addLabel: `${t("add decimal number")}`,
//       addComponent: <AddDesimalNumber title={`${t("add decimal number")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("gold price"),
//       name: "gold_price",
//       addLabel: `${t("add the price of 24 karat gold")}`,
//       addComponent: <GoldPrice title={`${t("gold price")}`} />,
//     },
//     {
//       id: crypto.randomUUID(),
//       title: t("manage congratulatory sentences"),
//       name: "invoice_data",
//       addLabel: `${t("add sentence congratulatory")}`,
//       addComponent: (
//         <AddInvoiceData title={`${t("add sentence congratulatory")}`} />
//       ),
//       viewLabel: `${t("view sentence congratulatory")}`,
//       viewHandler: () => navigate("/system/invoiceData"),
//     },
//   ];
//   //   // XXX
//   // ]
//   ///
//   /////////// CUSTOM HOOKS
//   ///

//   ///
//   /////////// STATES
//   ///

//   ///
//   /////////// SIDE EFFECTS
//   ///

//   ///
//   /////////// FUNCTIONS | EVENTS | IF CASES
//   ///
//   const openPopup = (formName: FormNames_TP) =>
//     setPopupIsOpen((prev) => ({ ...prev, [formName]: true }));

//   const closePopupHandler = (formName: FormNames_TP) =>
//     setPopupIsOpen((prev) => ({ ...prev, [formName]: false }));
//   ///
//   return (
//     <>
//       <Helmet>
//         <title>{title}</title>
//       </Helmet>

//       <h2 className="font-extrabold text-lg mb-5 text-center bg-mainGreen text-white py-2 w-[250px] m-auto rounded-xl">
//         {t("system establishment")}
//       </h2>
//       <div className="my-10">
//         <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
//           <h2 className="under bold text-lg ">
//             {t("Company structure data")}
//           </h2>
//           <p className="text-sm">
//             (1 {t("from")} 6) {t("From the founding")}{" "}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {systemCards
//             .slice(0, 6)
//             .map(
//               ({
//                 id,
//                 title,
//                 addComponent,
//                 addLabel,
//                 viewHandler,
//                 viewLabel,
//                 name,
//               }) => (
//                 <SystemCard
//                   key={id}
//                   viewHandler={viewHandler}
//                   viewLabel={viewLabel}
//                   title={title}
//                   addLabel={addLabel}
//                   addHandler={() => openPopup(name as FormNames_TP)}
//                 />
//               )
//             )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
//           <h2 className="under bold text-lg ">
//             {t("Bank data")}
//           </h2>
//           <p className="text-sm">
//             (2 {t("from")} 6) {t("From the founding")}{" "}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {systemCards
//             .slice(6, 10)
//             .map(
//               ({
//                 id,
//                 title,
//                 addComponent,
//                 addLabel,
//                 viewHandler,
//                 viewLabel,
//                 name,
//               }) => (
//                 <SystemCard
//                   key={id}
//                   viewHandler={viewHandler}
//                   viewLabel={viewLabel}
//                   title={title}
//                   addLabel={addLabel}
//                   addHandler={() => openPopup(name as FormNames_TP)}
//                 />
//               )
//             )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
//           <h2 className="under bold text-lg ">
//             {t("Item characteristics")}
//           </h2>
//           <p className="text-sm">
//             (3 {t("from")} 6) {t("From the founding")}{" "}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {systemCards
//             .slice(10, 14)
//             .map(
//               ({
//                 id,
//                 title,
//                 addComponent,
//                 addLabel,
//                 viewHandler,
//                 viewLabel,
//                 name,
//               }) => (
//                 <SystemCard
//                   key={id}
//                   viewHandler={viewHandler}
//                   viewLabel={viewLabel}
//                   title={title}
//                   addLabel={addLabel}
//                   addHandler={() => openPopup(name as FormNames_TP)}
//                 />
//               )
//             )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
//           <h2 className="under bold text-lg ">
//             {t("Sales and purchasing policy")}
//           </h2>
//           <p className="text-sm">
//             (4 {t("from")} 6) {t("From the founding")}{" "}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {systemCards
//             .slice(14, 18)
//             .map(
//               ({
//                 id,
//                 title,
//                 addComponent,
//                 addLabel,
//                 viewHandler,
//                 viewLabel,
//                 name,
//               }) => (
//                 <SystemCard
//                   key={id}
//                   viewHandler={viewHandler}
//                   viewLabel={viewLabel}
//                   title={title}
//                   addLabel={addLabel}
//                   addHandler={() => openPopup(name as FormNames_TP)}
//                 />
//               )
//             )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
//           <h2 className="under bold text-lg ">
//             {t("Expense policies")}
//           </h2>
//           <p className="text-sm">
//             (5 {t("from")} 6) {t("From the founding")}{" "}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {systemCards
//             .slice(18, 21)
//             .map(
//               ({
//                 id,
//                 title,
//                 addComponent,
//                 addLabel,
//                 viewHandler,
//                 viewLabel,
//                 name,
//               }) => (
//                 <SystemCard
//                   key={id}
//                   viewHandler={viewHandler}
//                   viewLabel={viewLabel}
//                   title={title}
//                   addLabel={addLabel}
//                   addHandler={() => openPopup(name as FormNames_TP)}
//                 />
//               )
//             )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
//           <h2 className="under bold text-lg ">
//             {t("Account management")}
//           </h2>
//           <p className="text-sm">
//             (6 {t("from")} 6) {t("From the founding")}{" "}
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {systemCards
//             .slice(21, 23)
//             .map(
//               ({
//                 id,
//                 title,
//                 addComponent,
//                 addLabel,
//                 viewHandler,
//                 viewLabel,
//                 name,
//               }) => (
//                 <SystemCard
//                   key={id}
//                   viewHandler={viewHandler}
//                   viewLabel={viewLabel}
//                   title={title}
//                   addLabel={addLabel}
//                   addHandler={() => openPopup(name as FormNames_TP)}
//                 />
//               )
//             )}
//         </div>
//       </div>

//       <div className="my-8 bg-mainBlack h-[1px] rounded"></div>
//       <GlobalAndStones title={t("Another")} />

//       {systemCards.map(({ id, name, addComponent }) => {
//         if (name && addComponent) {
//           return (
//             <Modal
//               key={id}
//               isOpen={popupIsOpen[name as keyof typeof popupIsOpen]}
//               onClose={() =>
//                 closePopupHandler(name as keyof typeof popupIsOpen)
//               }
//             >
//               {addComponent}
//             </Modal>
//           );
//         }
//       })}
//     </>
//   );
// };

// ************************************************************************

/////////// IMPORTS
///
import { t } from "i18next";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/molecules";
import { AddEmployee } from "../../components/templates/employee/AddEmployee";
import { CreateBranch } from "../../components/templates/reusableComponants/branches/CreateBranch";
import { AccountingTree } from "../../components/templates/systemEstablishment/AccountingTree/AccountingTree";
import { AddPartners } from "../../components/templates/systemEstablishment/partners/AddPartners";
import AddSupplier from "../../components/templates/systemEstablishment/supplier/AddSupplier";
import { SystemCard } from "../../components/templates/systemEstablishment/SystemCard";
import { AddAdministrativeStructure } from "../administrativeStructure/AddAdministrativeStructure";
import { Card_TP, FormNames_TP } from "./types-and-helpers";
import AddDesimalNumber from "../../components/templates/DecimalNumber/AddDecimalNumber";
import { GlobalAndStones } from "./GlobalAndStones";
import AddBankCards from "../../components/templates/bankCards/AddBankCards";
import AddBanks from "../../components/templates/banks/AddBanks";
import AddAccountsBank from "../../components/templates/accountsBank/AddAccountsBank";
import AddBankCardsData from "../../components/templates/bankCards/AddBankCardsData";
import AddSellingPolicies from "../../components/templates/sellingPolicies/AddSellingPolicies";
import AddExcludedItems from "../../components/templates/excludedItems/AddExcludedItems";
import AddInvoiceData from "../../components/templates/invoiceData/AddInvoiceData";
import AddBuyingPolicies from "../../components/templates/buyingPolicies/AddBuyingPolicies";
import GoldPrice from "../../components/templates/goldPrice/GoldPrice";
import AddTaxPolicy from "../../components/templates/sellingPolicies/AddTaxPolicy";
import AddExpensesPolicies from "../../components/templates/expensesPolicy/AddExpensesPolicies";
import AddSubExpensesPolicies from "../../components/templates/subExpensesPolicy/AddSubExpensesPolicies";
import AddTaxExpensesPolicy from "../../components/templates/taxExpensesPolicy/AddTaxExpensesPolicy";
import { CreateClassification } from "../../components/templates/reusableComponants/classifications/create/CreateClassification";
import CreateKarat from "../../components/templates/reusableComponants/karats/create/CreateKarat";
import CreateCategory from "../../components/templates/reusableComponants/categories/create/CreateCategory";
import CreateColor from "../../components/templates/reusableComponants/CreateColor";
import EstablishingSystem from "./EstablishingSystem";
///
/////////// Types
///
type SystemProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const System = ({ title }: SystemProps_TP) => {
  /////////// VARIABLES
  ///
  const navigate = useNavigate();

  const [popupIsOpen, setPopupIsOpen] = useState({
    partners: false,
    add_account: false,
    add_supplier: false,
    add_administrative_structure: false,
    add_employee: false,
    add_branch: false,
    add_decimal_number: false,
    add_typeCards: false,
    add_cards: false,
    add_banks: false,
    add_accountBank: false,
    selling_policies: false,
    buying_policies: false,
    main_expenses_policies: false,
    sub_expenses_policies: false,
    tax_expenses_policies: false,
    gold_price: false,
    excluded_items: false,
    invoice_data: false,
    Tax_Policy: false,
    colors: false,
    classifications: false,
    categories: false,
    karats: false,
  });
  const systemCards: Card_TP<FormNames_TP>[] = [
    // بيانات هيكل الشركة
    {
      id: crypto.randomUUID(),
      title: `${t("company data")}`,
      viewLabel: `${t("view company data")}`,
      viewHandler: () => navigate("company-profile"),
    },
    {
      id: crypto.randomUUID(),
      title: `${t("partners")}`,
      name: "partners",
      addLabel: `${t("add Partner")}`,
      viewLabel: `${t("view partners")}`,
      addComponent: <AddPartners title={`${t("add Partner")}`} />,
      viewHandler: () => navigate("partners"),
    },
    {
      id: crypto.randomUUID(),
      title: `${t("administrative-structure")}`,
      name: "add_administrative_structure",
      addLabel: `${t("add administrative structure")}`,
      viewLabel: `${t("view administrative structure")}`,
      viewHandler: () => navigate("administrative-structure"),
      addComponent: (
        <AddAdministrativeStructure
          title={`${t("add administrative structure")}`}
        />
      ),
    },
    {
      id: crypto.randomUUID(),
      title: `${t("branch")}`,
      name: "add_branch",
      addLabel: `${t("add branch")}`,
      viewLabel: `${t("view branches")}`,
      viewHandler: () => navigate("branches"),
      addComponent: <CreateBranch title={`${t("add branch")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: `${t("employees")}`,
      name: "add_employee",
      addLabel: `${t("add employee")}`,
      viewLabel: `${t("view employees")}`,
      viewHandler: () => navigate("employees"),
      addComponent: <AddEmployee title={`${t("add employee")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: `${t("supplier")}`,
      name: "add_supplier",
      addLabel: `${t("add supplier")}`,
      viewLabel: `${t("View Suppliers")}`,
      addComponent: <AddSupplier title={`${t("add supplier")}`} />,
      viewHandler: () => navigate("suppliers"),
    },
    // **************************************************************
    // بيانات البنوك
    {
      id: crypto.randomUUID(),
      title: t("banks"),
      name: "add_banks",
      addLabel: `${t("add banks")}`,
      viewLabel: `${t("view banks")}`,
      viewHandler: () => navigate("/system/banks"),
      addComponent: <AddBanks title={`${t("add banks")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("bank accounts"),
      name: "add_accountBank",
      addLabel: `${t("add bank account")}`,
      viewLabel: `${t("view bank accounts")}`,
      viewHandler: () => navigate("/system/accountsBank"),
      addComponent: <AddAccountsBank title={`${t("add bank account")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("cards types banks"),
      name: "add_typeCards",
      addLabel: `${t("add type card")}`,
      viewLabel: `${t("view types cards")}`,
      viewHandler: () => navigate("/system/bankCards"),
      addComponent: <AddBankCards title={`${t("add type card")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("add card bank"),
      name: "add_cards",
      addLabel: `${t("add card bank")}`,
      viewLabel: `${t("view cards banks")}`,
      viewHandler: () => navigate("/system/cardsData"),
      addComponent: <AddBankCardsData title={`${t("add card bank")}`} />,
    },
    // **************************************************************
    // خصائص الأصناف

    {
      id: crypto.randomUUID(),
      title: t("classifications"),
      name: "classifications",
      addLabel: `${t("add classification")}`,
      addComponent: (
        <CreateClassification title={`${t("add classification")}`} />
      ),
      viewLabel: `${t("view classifications")}`,
      viewHandler: () => navigate("/system/global-and-stones/classifications"),
    },
    {
      id: crypto.randomUUID(),
      title: t("karats"),
      name: "karats",
      addLabel: `${t("add karat")}`,
      addComponent: <CreateKarat title={`${t("add karat")}`} />,
      viewLabel: `${t("view karats")}`,
      viewHandler: () => navigate("/system/global-and-stones/karats"),
    },
    {
      id: crypto.randomUUID(),
      title: t("categories"),
      name: "categories",
      addLabel: `${t("add category")}`,
      addComponent: <CreateCategory title={`${t("add category")}`} />,
      viewLabel: `${t("view categories")}`,
      viewHandler: () => navigate("/system/global-and-stones/categories"),
    },
    {
      id: crypto.randomUUID(),
      title: t("gold colors"),
      name: "colors",
      addLabel: `${t("add color")}`,
      addComponent: <CreateColor title={`${t("add color")}`} />,
      viewLabel: `${t("view colors")}`,
      viewHandler: () => navigate("/system/global-and-stones/colors"),
    },

    // **************************************************************
    // سياسة المبيعات والمشتريات
    {
      id: crypto.randomUUID(),
      title: t("Tax policy"),
      name: "Tax_Policy",
      addLabel: `${t("Add Tax Policy")}`,
      addComponent: <AddTaxPolicy title={`${t("Add Tax Policy")}`} />,
      viewLabel: `${t("View Tax Policy")}`,
      viewHandler: () => navigate("/system/TaxPolicy"),
    },
    {
      id: crypto.randomUUID(),
      title: t("excluded items"),
      name: "excluded_items",
      addLabel: `${t("add excluded category")}`,
      addComponent: (
        <AddExcludedItems title={`${t("add excluded category")}`} />
      ),
      viewLabel: `${t("view excluded items")}`,
      viewHandler: () => navigate("/system/excludedItems"),
    },
    {
      id: crypto.randomUUID(),
      title: t("selling policies"),
      name: "selling_policies",
      addLabel: `${t("add selling policy")}`,
      addComponent: <AddSellingPolicies title={`${t("add selling policy")}`} />,
      viewLabel: `${t("view selling policies")}`,
      viewHandler: () => navigate("/system/policiesSelling"),
    },
    {
      id: crypto.randomUUID(),
      title: t("buying policies"),
      name: "buying_policies",
      addLabel: `${t("add buying policy")}`,
      addComponent: <AddBuyingPolicies title={`${t("add buying policy")}`} />,
      viewLabel: `${t("view buying policies")}`,
      viewHandler: () => navigate("/system/policiesBuying"),
    },

    {
      id: crypto.randomUUID(),
      title: t("main expenses policies"),
      name: "main_expenses_policies",
      addLabel: `${t("add main expenses policy")}`,
      addComponent: (
        <AddExpensesPolicies title={`${t("add main expenses policy")}`} />
      ),
      viewLabel: `${t("view main expenses policies")}`,
      viewHandler: () => navigate("/system/mainExpensesPolicies"),
    },

    // SUB EXPENSES POLICIES
    {
      id: crypto.randomUUID(),
      title: t("sub expenses policies"),
      name: "sub_expenses_policies",
      addLabel: `${t("add sub expenses policy")}`,
      addComponent: (
        <AddSubExpensesPolicies title={`${t("add sub expenses policy")}`} />
      ),
      viewLabel: `${t("view sub expenses policies")}`,
      viewHandler: () => navigate("/system/subExpensesPolicies"),
    },

    // TAX EXPENSES POLICIES
    {
      id: crypto.randomUUID(),
      title: t("tax expenses policies"),
      name: "tax_expenses_policies",
      addLabel: `${t("add tax expenses policy")}`,
      addComponent: (
        <AddTaxExpensesPolicy title={`${t("add tax expenses policy")}`} />
      ),
      viewLabel: `${t("view tax expenses policies")}`,
      viewHandler: () => navigate("/system/taxExpensesPolicies"),
    },

    // **************************************************************
    // سياسات المصاريف

    // **************************************************************
    // إدارة الحسابات
    {
      id: crypto.randomUUID(),
      title: t("add_account"),
      name: "add_account",
      addLabel: `${t("add account")}`,
      viewLabel: `${t("view accounts")}`,
      addComponent: <AccountingTree />,
      viewHandler: () => navigate("accounts"),
    },
    {
      id: crypto.randomUUID(),
      title: t("operations"),
      viewLabel: `${t("view operations")}`,
      viewHandler: () => navigate("operations"),
    },

    // **************************************************************
    //  أخري

    {
      id: crypto.randomUUID(),
      title: t("decimal numbers"),
      name: "add_decimal_number",
      addLabel: `${t("add decimal number")}`,
      addComponent: <AddDesimalNumber title={`${t("add decimal number")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("gold price"),
      name: "gold_price",
      addLabel: `${t("add the price of 24 karat gold")}`,
      addComponent: <GoldPrice title={`${t("gold price")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("manage congratulatory sentences"),
      name: "invoice_data",
      addLabel: `${t("add sentence congratulatory")}`,
      addComponent: (
        <AddInvoiceData title={`${t("add sentence congratulatory")}`} />
      ),
      viewLabel: `${t("view sentence congratulatory")}`,
      viewHandler: () => navigate("/system/invoiceData"),
    },
  ];
  //   // XXX
  // ]
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const openPopup = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: true }));

  const closePopupHandler = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: false }));
  ///

  const titleStyle = "under bold text-lg";
  const descriptionStyle = "text-sm";

  const renderSection = (titleKey, index, startIdx, endIdx) => {

    return (

    );
  };

  // const EstablishingSystemCard = [
  //   {renderSection("Company structure data", 1, 0, 6)},
  //   {renderSection("Bank data", 2, 6, 10)},
  //   {renderSection("Item characteristics", 3, 10, 14)},
  //   {renderSection("Sales and purchasing policy", 4, 14, 18)},
  //   {renderSection("Expense policies", 5, 18, 21)},
  //   {renderSection("Account management", 6, 21, 23)}
  // ]

  const EstablishingSystemCard = [
    {
      titleKey: "Company structure data",
      index: 1,
      startIdx: 0,
      endIdx: 6
    },
    {
      titleKey: "Bank data",
      index: 2,
      startIdx: 6,
      endIdx: 10
    },
    {
      titleKey: "Item characteristics",
      index: 3,
      startIdx: 10,
      endIdx: 14
    },
    {
      titleKey: "Sales and purchasing policy",
      index: 4,
      startIdx: 14,
      endIdx: 18
    },
    {
      titleKey: "Expense policies",
      index: 5,
      startIdx: 18,
      endIdx: 21
    },
    {
      titleKey: "Account management",
      index: 6,
      startIdx: 21,
      endIdx: 23
    },
  ]
  console.log("🚀 ~ System ~ EstablishingSystemCard:", EstablishingSystemCard)

  const xxx = EstablishingSystemCard?.map((item) => {
    console.log("🚀 ~ xxx ~ item:", item)
    
  })
  console.log("🚀 ~ xxx ~ xxx:", xxx)

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <h2 className="font-extrabold text-lg mb-5 text-center bg-mainGreen text-white py-2 w-[250px] m-auto rounded-xl">
        {t("system establishment")}
      </h2>


     { EstablishingSystemCard?.map((item) => {
      console.log("🚀 ~ {EstablishingSystemCard?.map ~ item:", item)
      return (
        <EstablishingSystem
        
        />
      )
     })
     }

      <div className="my-8 bg-mainBlack h-[1px] rounded"></div>
      <GlobalAndStones title={t("Another")} />

      {systemCards.map(({ id, name, addComponent }) => {
        if (name && addComponent) {
          return (
            <Modal
              key={id}
              isOpen={popupIsOpen[name as keyof typeof popupIsOpen]}
              onClose={() =>
                closePopupHandler(name as keyof typeof popupIsOpen)
              }
            >
              {addComponent}
            </Modal>
          );
        }
      })}
    </>
  );
};
