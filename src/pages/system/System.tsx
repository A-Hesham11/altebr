// /////////// IMPORTS
// ///
// import { t } from "i18next";
// import { useContext, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import { useNavigate } from "react-router-dom";
// import { Modal } from "../../components/molecules";
// import { AddEmployee } from "../../components/templates/employee/AddEmployee";
// import { CreateBranch } from "../../components/templates/reusableComponants/branches/CreateBranch";
// import { AccountingTree } from "../../components/templates/systemEstablishment/AccountingTree/AccountingTree";
// import { AddPartners } from "../../components/templates/systemEstablishment/partners/AddPartners";
// import AddSupplier from "../../components/templates/systemEstablishment/supplier/AddSupplier";
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
// import EstablishingSystem from "./EstablishingSystem";
// import AddWorkHours from "../../components/templates/workHours/AddWorkHours";
// import AddSalariesPolicies from "../../components/templates/salaries/AddSalariesPolicies";
// import AddEntitlementsPolicies from "../../components/templates/entitlements/AddEntitlementsPolicies";
// import AddDeductionsPolicy from "../../components/templates/deductions/AddDeductionsPolicy";
// import AddEmployeeBenefits from "../../components/templates/employeeBenefits/AddEmployeeBenefits";
// import AddEmployeeDeductions from "../../components/templates/employeeDeductions/AddEmployeeDeductions";
// import AddCommision from "../../components/templates/commision/AddCommision";
// import { AllowedAccess } from "react-permission-role";
// import { Spinner } from "../../components/atoms";
// import { authCtx } from "../../context/auth-and-perm/auth";
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
//   const { userData } = useContext(authCtx);
//   console.log("🚀 ~ System ~ userData:", userData);

//   const permissionsName = userData?.roles[0]?.permissions?.map(
//     (role) => role.group
//   );

//   console.log("🚀 ~ System ~ permissionsName:", permissionsName);

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
//     work_hours: false,
//     salary_policies: false,
//     entitlements_policies: false,
//     deductions_policies: false,
//     employee_benefits_policies: false,
//     employee_deductions_policies: false,
//     commission_policies: false,
//   });

//   const systemCards: Card_TP<FormNames_TP>[] = {
//     // بيانات هيكل الشركة
//     Company_structure: [
//       {
//         id: crypto.randomUUID(),
//         title: `${t("company data")}`,
//         viewLabel: `${t("view company data")}`,
//         viewHandler: () => navigate("company-profile"),
//         permission_id: "companies",
//         permission: userData?.roles[0]?.permissions?.filter(
//           (permission) => permission.group === "companies"
//         ),
//       },
//       {
//         id: crypto.randomUUID(),
//         title: `${t("partners")}`,
//         name: "partners",
//         addLabel: `${t("add Partner")}`,
//         viewLabel: `${t("view partners")}`,
//         addComponent: <AddPartners title={`${t("add Partner")}`} />,
//         viewHandler: () => navigate("partners"),
//         permission_id: "partners",
//         permission: userData?.roles[0]?.permissions?.filter(
//           (permission) => permission.group === "partners"
//         ),
//       },
//       {
//         id: crypto.randomUUID(),
//         title: `${t("administrative-structure")}`,
//         name: "add_administrative_structure",
//         addLabel: `${t("add administrative structure")}`,
//         viewLabel: `${t("view administrative structure")}`,
//         viewHandler: () => navigate("administrative-structure"),
//         addComponent: (
//           <AddAdministrativeStructure
//             title={`${t("add administrative structure")}`}
//           />
//         ),
//         permission_id: "administrative",
//         permission: userData?.roles[0]?.permissions?.filter(
//           (permission) => permission.group === "administrative"
//         ),
//       },
//       {
//         id: crypto.randomUUID(),
//         title: `${t("branch")}`,
//         name: "add_branch",
//         addLabel: `${t("add branch")}`,
//         viewLabel: `${t("view branches")}`,
//         viewHandler: () => navigate("branches"),
//         addComponent: <CreateBranch title={`${t("add branch")}`} />,
//         permission_id: "branches",
//         permission: userData?.roles[0]?.permissions?.filter(
//           (permission) => permission.group === "branches"
//         ),
//       },
//       {
//         id: crypto.randomUUID(),
//         title: `${t("employees")}`,
//         name: "add_employee",
//         addLabel: `${t("add employee")}`,
//         viewLabel: `${t("view employees")}`,
//         viewHandler: () => navigate("employees"),
//         addComponent: <AddEmployee title={`${t("add employee")}`} />,
//         permission_id: "employees",
//         permission: userData?.roles[0]?.permissions?.filter(
//           (permission) => permission.group === "employees"
//         ),
//       },
//       {
//         id: crypto.randomUUID(),
//         title: `${t("supplier")}`,
//         name: "add_supplier",
//         addLabel: `${t("add supplier")}`,
//         viewLabel: `${t("View Suppliers")}`,
//         addComponent: <AddSupplier title={`${t("add supplier")}`} />,
//         viewHandler: () => navigate("suppliers"),
//         permission_id: "suppliers",
//         permission: userData?.roles[0]?.permissions?.filter(
//           (permission) => permission.group === "suppliers"
//         ),
//       },
//     ],
//     // **************************************************************
//     // بيانات البنوك
//     banks_data: [
//       {
//         id: crypto.randomUUID(),
//         title: t("banks"),
//         name: "add_banks",
//         addLabel: `${t("add banks")}`,
//         viewLabel: `${t("view banks")}`,
//         viewHandler: () => navigate("/system/banks"),
//         addComponent: <AddBanks title={`${t("add banks")}`} />,
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("bank accounts"),
//         name: "add_accountBank",
//         addLabel: `${t("add bank account")}`,
//         viewLabel: `${t("view bank accounts")}`,
//         viewHandler: () => navigate("/system/accountsBank"),
//         addComponent: <AddAccountsBank title={`${t("add bank account")}`} />,
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("cards types banks"),
//         name: "add_typeCards",
//         addLabel: `${t("add type card")}`,
//         viewLabel: `${t("view types cards")}`,
//         viewHandler: () => navigate("/system/bankCards"),
//         addComponent: <AddBankCards title={`${t("add type card")}`} />,
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("add card bank"),
//         name: "add_cards",
//         addLabel: `${t("add card bank")}`,
//         viewLabel: `${t("view cards banks")}`,
//         viewHandler: () => navigate("/system/cardsData"),
//         addComponent: <AddBankCardsData title={`${t("add card bank")}`} />,
//         permission_id: "",
//       },
//     ],
//     // **************************************************************
//     // خصائص الأصناف
//     classification_features: [
//       {
//         id: crypto.randomUUID(),
//         title: t("classifications"),
//         name: "classifications",
//         addLabel: `${t("add classification")}`,
//         addComponent: (
//           <CreateClassification title={`${t("add classification")}`} />
//         ),
//         viewLabel: `${t("view classifications")}`,
//         viewHandler: () =>
//           navigate("/system/global-and-stones/classifications"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("karats"),
//         name: "karats",
//         addLabel: `${t("add karat")}`,
//         addComponent: <CreateKarat title={`${t("add karat")}`} />,
//         viewLabel: `${t("view karats")}`,
//         viewHandler: () => navigate("/system/global-and-stones/karats"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("categories"),
//         name: "categories",
//         addLabel: `${t("add category")}`,
//         addComponent: <CreateCategory title={`${t("add category")}`} />,
//         viewLabel: `${t("view categories")}`,
//         viewHandler: () => navigate("/system/global-and-stones/categories"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("gold colors"),
//         name: "colors",
//         addLabel: `${t("add color")}`,
//         addComponent: <CreateColor title={`${t("add color")}`} />,
//         viewLabel: `${t("view colors")}`,
//         viewHandler: () => navigate("/system/global-and-stones/colors"),
//         permission_id: "",
//       },
//     ],

//     // **************************************************************
//     // سياسة المبيعات والمشتريات
//     sales_purchasing_policy: [
//       {
//         id: crypto.randomUUID(),
//         title: t("Tax policy"),
//         name: "Tax_Policy",
//         addLabel: `${t("Add Tax Policy")}`,
//         addComponent: <AddTaxPolicy title={`${t("Add Tax Policy")}`} />,
//         viewLabel: `${t("View Tax Policy")}`,
//         viewHandler: () => navigate("/system/TaxPolicy"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("excluded items"),
//         name: "excluded_items",
//         addLabel: `${t("add excluded category")}`,
//         addComponent: (
//           <AddExcludedItems title={`${t("add excluded category")}`} />
//         ),
//         viewLabel: `${t("view excluded items")}`,
//         viewHandler: () => navigate("/system/excludedItems"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("selling policies"),
//         name: "selling_policies",
//         addLabel: `${t("add selling policy")}`,
//         addComponent: (
//           <AddSellingPolicies title={`${t("add selling policy")}`} />
//         ),
//         viewLabel: `${t("view selling policies")}`,
//         viewHandler: () => navigate("/system/policiesSelling"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("buying policies"),
//         name: "buying_policies",
//         addLabel: `${t("add buying policy")}`,
//         addComponent: <AddBuyingPolicies title={`${t("add buying policy")}`} />,
//         viewLabel: `${t("view buying policies")}`,
//         viewHandler: () => navigate("/system/policiesBuying"),
//         permission_id: "",
//       },
//     ],

//     // **************************************************************
//     // سياسات المصاريف
//     expense_policies: [
//       {
//         id: crypto.randomUUID(),
//         title: t("main expenses policies"),
//         name: "main_expenses_policies",
//         addLabel: `${t("add main expenses policy")}`,
//         addComponent: (
//           <AddExpensesPolicies title={`${t("add main expenses policy")}`} />
//         ),
//         viewLabel: `${t("view main expenses policies")}`,
//         viewHandler: () => navigate("/system/mainExpensesPolicies"),
//         permission_id: "",
//       },

//       // SUB EXPENSES POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("sub expenses policies"),
//         name: "sub_expenses_policies",
//         addLabel: `${t("add sub expenses policy")}`,
//         addComponent: (
//           <AddSubExpensesPolicies title={`${t("add sub expenses policy")}`} />
//         ),
//         viewLabel: `${t("view sub expenses policies")}`,
//         viewHandler: () => navigate("/system/subExpensesPolicies"),
//         permission_id: "",
//       },

//       // TAX EXPENSES POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("tax expenses policies"),
//         name: "tax_expenses_policies",
//         addLabel: `${t("add tax expenses policy")}`,
//         addComponent: (
//           <AddTaxExpensesPolicy title={`${t("add tax expenses policy")}`} />
//         ),
//         viewLabel: `${t("view tax expenses policies")}`,
//         viewHandler: () => navigate("/system/taxExpensesPolicies"),
//         permission_id: "",
//       },
//     ],

//     // **************************************************************
//     // إدارة الحسابات
//     salaries: [
//       // WORK HOURS
//       {
//         id: crypto.randomUUID(),
//         title: t("add work shift policy"),
//         name: "work_hours",
//         addLabel: `${t("add work hours")}`,
//         addComponent: <AddWorkHours title={`${t("add work shift policy")}`} />,
//         viewLabel: `${t("view work hours policy")}`,
//         viewHandler: () => navigate("/system/workHours"),
//         permission_id: "",
//       },

//       // SALARY POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("salary policies"),
//         name: "salary_policies",
//         addLabel: `${t("add salary policy")}`,
//         addComponent: (
//           <AddSalariesPolicies title={`${t("add salary policy")}`} />
//         ),
//         viewLabel: `${t("view salary policy")}`,
//         viewHandler: () => navigate("/system/salaryPolicies"),
//         permission_id: "",
//       },

//       // ENTITITLEMENTS POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("entitlements policies"),
//         name: "entitlements_policies",
//         addLabel: `${t("add entitlements policy")}`,
//         addComponent: (
//           <AddEntitlementsPolicies title={`${t("add entitlements policy")}`} />
//         ),
//         viewLabel: `${t("view entitlements policy")}`,
//         viewHandler: () => navigate("/system/entitlementsPolicies"),
//         permission_id: "",
//       },

//       // DEDUCTIONS POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("deductions policies"),
//         name: "deductions_policies",
//         addLabel: `${t("add deductions policy")}`,
//         addComponent: (
//           <AddDeductionsPolicy title={`${t("add deductions policy")}`} />
//         ),
//         viewLabel: `${t("view deductions policy")}`,
//         viewHandler: () => navigate("/system/deductionsPolicies"),
//         permission_id: "",
//       },

//       // EMPLOYEE BENEFITS POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("employee benefits policies"),
//         name: "employee_benefits_policies",
//         addLabel: `${t("add employee benefits policy")}`,
//         addComponent: (
//           <AddEmployeeBenefits title={`${t("add employee benefits policy")}`} />
//         ),
//         viewLabel: `${t("view employee benefits policy")}`,
//         viewHandler: () => navigate("/system/employeeBenefitsPolicies"),
//         permission_id: "",
//       },

//       // EMPLOYEE DEDUCTIONS POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("employee deductions policies"),
//         name: "employee_deductions_policies",
//         addLabel: `${t("add employee deductions policy")}`,
//         addComponent: (
//           <AddEmployeeDeductions
//             title={`${t("add employee deductions policy")}`}
//           />
//         ),
//         viewLabel: `${t("view employee deductions policy")}`,
//         viewHandler: () => navigate("/system/employeeDeductionsPolicies"),
//         permission_id: "",
//       },

//       // COMMISION POLICIES
//       {
//         id: crypto.randomUUID(),
//         title: t("commission"),
//         name: "commission_policies",
//         addLabel: `${t("add commission")}`,
//         addComponent: <AddCommision title={`${t("add commission")}`} />,
//         viewLabel: `${t("view commission")}`,
//         viewHandler: () => navigate("/system/commisionPolicies"),
//         permission_id: "",
//       },
//     ],

//     // **************************************************************
//     //  أخري
//     account_management: [
//       {
//         id: crypto.randomUUID(),
//         title: t("add_account"),
//         name: "add_account",
//         addLabel: `${t("add account")}`,
//         viewLabel: `${t("view accounts")}`,
//         addComponent: <AccountingTree />,
//         viewHandler: () => navigate("accounts"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("operations"),
//         viewLabel: `${t("view operations")}`,
//         viewHandler: () => navigate("operations"),
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("decimal numbers"),
//         name: "add_decimal_number",
//         addLabel: `${t("add decimal number")}`,
//         addComponent: <AddDesimalNumber title={`${t("add decimal number")}`} />,
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("gold price"),
//         name: "gold_price",
//         addLabel: `${t("add the price of 24 karat gold")}`,
//         addComponent: <GoldPrice title={`${t("gold price")}`} />,
//         permission_id: "",
//       },
//       {
//         id: crypto.randomUUID(),
//         title: t("manage congratulatory sentences"),
//         name: "invoice_data",
//         addLabel: `${t("add sentence congratulatory")}`,
//         addComponent: (
//           <AddInvoiceData title={`${t("add sentence congratulatory")}`} />
//         ),
//         viewLabel: `${t("view sentence congratulatory")}`,
//         viewHandler: () => navigate("/system/invoiceData"),
//         permission_id: "",
//       },
//     ],
//   };

//   const openPopup = (formName: FormNames_TP) =>
//     setPopupIsOpen((prev) => ({ ...prev, [formName]: true }));

//   const closePopupHandler = (formName: FormNames_TP) =>
//     setPopupIsOpen((prev) => ({ ...prev, [formName]: false }));
//   ///

//   const EstablishingSystemCard = [
//     {
//       titleKey: "Company structure data",
//       range: systemCards?.Company_structure,
//     },
//     {
//       titleKey: "Bank data",
//       range: systemCards?.banks_data,
//     },
//     {
//       titleKey: "Item characteristics",
//       range: systemCards?.classification_features,
//     },
//     {
//       titleKey: "Sales and purchasing policy",
//       range: systemCards?.sales_purchasing_policy,
//     },
//     {
//       titleKey: "Expense policies",
//       range: systemCards?.expense_policies,
//     },
//     {
//       titleKey: "Salary policies",
//       range: systemCards?.salaries,
//     },
//     {
//       titleKey: "Account management",
//       range: systemCards?.account_management,
//     },
//   ];
//   console.log("🚀 ~ System ~ EstablishingSystemCard:", EstablishingSystemCard);

//   return (
//     <>
//       <Helmet>
//         <title>{title}</title>
//       </Helmet>

//       <h2 className="font-extrabold text-lg mb-8 text-center bg-mainGreen text-white py-2 w-[250px] m-auto rounded-xl">
//         {t("system establishment")}
//       </h2>

//       {EstablishingSystemCard?.map((item, index) => {
//         const { range, titleKey } = item;

//         const filterEmptyPermission = range?.filter(
//           (item) => item.permission_id === ""
//         );

//         const filterEqualPermission = range?.filter((item) =>
//           permissionsName.includes(item.permission_id)
//         );

//         const permissionsData = [
//           ...filterEqualPermission,
//           ...filterEmptyPermission,
//         ];
//         console.log("🚀 ~ permissionsData:", permissionsData);

//         return (
//           <EstablishingSystem
//             key={index}
//             titleKey={titleKey}
//             index={index + 1}
//             systemCards={permissionsData}
//             openPopup={openPopup}
//             total={EstablishingSystemCard.length}
//           />
//         );
//       })}

//       <div className="my-8 bg-mainBlack h-[1px] rounded"></div>
//       <GlobalAndStones title={t("Another")} />

//       {EstablishingSystemCard?.range?.map(({ id, name, addComponent }) => {
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
import AddWorkHours from "../../components/templates/workHours/AddWorkHours";
import AddSalariesPolicies from "../../components/templates/salaries/AddSalariesPolicies";
import AddEntitlementsPolicies from "../../components/templates/entitlements/AddEntitlementsPolicies";
import AddDeductionsPolicy from "../../components/templates/deductions/AddDeductionsPolicy";
import AddEmployeeBenefits from "../../components/templates/employeeBenefits/AddEmployeeBenefits";
import AddEmployeeDeductions from "../../components/templates/employeeDeductions/AddEmployeeDeductions";
import AddCommision from "../../components/templates/commision/AddCommision";
import AddInvoiceHeaderData from "../../components/templates/invoiceData/AddInvoiceHeaderData";
import AddZakatIncome from "../../components/templates/zakatIncome/AddZakatIncome";
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
    zakat_income: false,
    main_expenses_policies: false,
    sub_expenses_policies: false,
    tax_expenses_policies: false,
    gold_price: false,
    excluded_items: false,
    invoice_data: false,
    invoice_image: false,
    Tax_Policy: false,
    colors: false,
    classifications: false,
    categories: false,
    karats: false,
    work_hours: false,
    salary_policies: false,
    entitlements_policies: false,
    deductions_policies: false,
    employee_benefits_policies: false,
    employee_deductions_policies: false,
    commission_policies: false,
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
      title: t("Zakat and income"),
      name: "zakat_income",
      addLabel: `${t("Add Zakat and Income")}`,
      addComponent: <AddZakatIncome title={`${t("Add Zakat and Income")}`} />,
      viewLabel: `${t("Trial version on Zakat and Income")}`,
      viewHandler: () => navigate("/system/zakatIncome_demo"),
    },

    // **************************************************************
    // سياسات المصاريف

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

    // WORK HOURS
    {
      id: crypto.randomUUID(),
      title: t("add work shift policy"),
      name: "work_hours",
      addLabel: `${t("add work hours")}`,
      addComponent: <AddWorkHours title={`${t("add work shift policy")}`} />,
      viewLabel: `${t("view work hours policy")}`,
      viewHandler: () => navigate("/system/workHours"),
    },

    // SALARY POLICIES
    {
      id: crypto.randomUUID(),
      title: t("salary policies"),
      name: "salary_policies",
      addLabel: `${t("add salary policy")}`,
      addComponent: <AddSalariesPolicies title={`${t("add salary policy")}`} />,
      viewLabel: `${t("view salary policy")}`,
      viewHandler: () => navigate("/system/salaryPolicies"),
    },

    // ENTITITLEMENTS POLICIES
    {
      id: crypto.randomUUID(),
      title: t("entitlements policies"),
      name: "entitlements_policies",
      addLabel: `${t("add entitlements policy")}`,
      addComponent: (
        <AddEntitlementsPolicies title={`${t("add entitlements policy")}`} />
      ),
      viewLabel: `${t("view entitlements policy")}`,
      viewHandler: () => navigate("/system/entitlementsPolicies"),
    },

    // DEDUCTIONS POLICIES
    {
      id: crypto.randomUUID(),
      title: t("deductions policies"),
      name: "deductions_policies",
      addLabel: `${t("add deductions policy")}`,
      addComponent: (
        <AddDeductionsPolicy title={`${t("add deductions policy")}`} />
      ),
      viewLabel: `${t("view deductions policy")}`,
      viewHandler: () => navigate("/system/deductionsPolicies"),
    },

    // EMPLOYEE BENEFITS POLICIES
    {
      id: crypto.randomUUID(),
      title: t("employee benefits policies"),
      name: "employee_benefits_policies",
      addLabel: `${t("add employee benefits policy")}`,
      addComponent: (
        <AddEmployeeBenefits title={`${t("add employee benefits policy")}`} />
      ),
      viewLabel: `${t("view employee benefits policy")}`,
      viewHandler: () => navigate("/system/employeeBenefitsPolicies"),
    },

    // EMPLOYEE DEDUCTIONS POLICIES
    {
      id: crypto.randomUUID(),
      title: t("employee deductions policies"),
      name: "employee_deductions_policies",
      addLabel: `${t("add employee deductions policy")}`,
      addComponent: (
        <AddEmployeeDeductions
          title={`${t("add employee deductions policy")}`}
        />
      ),
      viewLabel: `${t("view employee deductions policy")}`,
      viewHandler: () => navigate("/system/employeeDeductionsPolicies"),
    },

    // COMMISION POLICIES
    {
      id: crypto.randomUUID(),
      title: t("commission"),
      name: "commission_policies",
      addLabel: `${t("add commission")}`,
      addComponent: <AddCommision title={`${t("add commission")}`} />,
      viewLabel: `${t("view commission")}`,
      viewHandler: () => navigate("/system/commisionPolicies"),
    },

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
    {
      id: crypto.randomUUID(),
      title: t("Invoice data"),
      name: "invoice_image",
      addLabel: `${t("Add invoice data")}`,
      addComponent: (
        <AddInvoiceHeaderData title={`${t("Add invoice data")}`} />
      ),
      viewLabel: `${t("View invoice data")}`,
      viewHandler: () => navigate("/system/invoiceHeader"),
    },
  ];
  console.log("🚀 ~ System ~ systemCards:", systemCards.length);

  const openPopup = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: true }));

  const closePopupHandler = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: false }));
  ///

  const EstablishingSystemCard = [
    {
      titleKey: "Company structure data",
      range: [0, 6],
    },
    {
      titleKey: "Bank data",
      range: [6, 10],
    },
    {
      titleKey: "Item characteristics",
      range: [10, 14],
    },
    {
      titleKey: "Sales and purchasing policy",
      range: [14, 19],
    },
    {
      titleKey: "Expense policies",
      range: [19, 22],
    },
    {
      titleKey: "Salary policies",
      range: [22, 28],
    },
    {
      titleKey: "Account management",
      range: [28, 35],
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <h2 className="font-extrabold text-lg mb-8 text-center bg-mainGreen text-white py-2 w-[250px] m-auto rounded-xl">
        {t("system establishment")}
      </h2>

      {EstablishingSystemCard?.map((item, index) => {
        const { range, titleKey } = item;

        return (
          <EstablishingSystem
            key={index}
            titleKey={titleKey}
            index={index + 1}
            start={range[0]}
            end={range[1]}
            systemCards={systemCards}
            openPopup={openPopup}
            total={EstablishingSystemCard.length}
          />
        );
      })}

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

// ************************************************************************
