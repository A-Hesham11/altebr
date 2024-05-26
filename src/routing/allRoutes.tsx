import { t } from "i18next";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AddClients } from "../components/selling/clients/AddClients";
import ClientsData from "../components/selling/clients/ClientsData";
import ReservePiece from "../components/selling/clients/reservePiece";
import { AllHonestBonds } from "../components/selling/honest/AllHonestBonds";
import { AllRetrieveHonestBonds } from "../components/selling/honest/AllRetrieveHonestBonds";
import { HonestBondAccountingRestriction } from "../components/selling/honest/HonestBondAccountingRestriction";
import { NewHonest } from "../components/selling/honest/NewHonest";
import { RetrieveHonestEntryScreen } from "../components/selling/honest/RetrieveHonestEntryScreen";
import { ReturnHonestRestriction } from "../components/selling/honest/ReturnHonestRestriction";
import PayoffEntryScreen from "../components/selling/payoff/PayoffentryScreen";
import RecieveItems from "../components/selling/recieve items/RecieveItems";
import BranchAccountingTree from "../components/selling/reports/BranchAccountingTree";
import { SellingFinalPreview } from "../components/selling/selling components/SellingFinalPreview";
import SellingSecondpage from "../components/selling/selling components/SellingSecondpage";
import ViewBankCards from "../components/templates/bankCards/ViewBankCards";
import ViewBankCardsData from "../components/templates/bankCards/ViewBankCardsData";
import ViewExcludedItems from "../components/templates/excludedItems/ViewExcludedItems";
import { OneBranches } from "../components/templates/reusableComponants/branches/OneBranches";
import { ViewBranches } from "../components/templates/reusableComponants/branches/ViewBranches";
import { ViewStoneColor } from "../components/templates/reusableComponants/stones/view/ViewStoneColor";
import { ViewStoneNature } from "../components/templates/reusableComponants/stones/view/ViewStoneNature";
import { ViewStonePurity } from "../components/templates/reusableComponants/stones/view/ViewStonePurity";
import { ViewStoneQuality } from "../components/templates/reusableComponants/stones/view/ViewStoneQuality";
import { ViewStoneShape } from "../components/templates/reusableComponants/stones/view/ViewStoneShape";
import { ViewStoneType } from "../components/templates/reusableComponants/stones/view/ViewStoneType";
import ViewSellingPolicies from "../components/templates/sellingPolicies/ViewSellingPolicies";
import AccountingTree from "../components/templates/systemEstablishment/AccountingTree/view/AccountingTree";
import { ViewCompanyDetails } from "../components/templates/systemEstablishment/partners/ViewCompanyDetails";
import { ViewMinerals } from "../components/templates/systemEstablishment/view/Diamond/ViewMinerals";
import { ViewMineralsKarats } from "../components/templates/systemEstablishment/view/Diamond/ViewMineralsKarats";
import { ViewCategories } from "../components/templates/systemEstablishment/view/ViewCategories";
import { ViewCities } from "../components/templates/systemEstablishment/view/ViewCities";
import { ViewClassifications } from "../components/templates/systemEstablishment/view/ViewClassifications";
import { ViewCountries } from "../components/templates/systemEstablishment/view/ViewCountries";
import { ViewDistricts } from "../components/templates/systemEstablishment/view/ViewDistricts";
import { ViewMarkets } from "../components/templates/systemEstablishment/view/ViewMarkets";
import { ViewNationalities } from "../components/templates/systemEstablishment/view/ViewNationalities";
import { ViewSizes } from "../components/templates/systemEstablishment/view/ViewSizes";
import { ViewKarats } from "../components/templates/systemEstablishment/view/Viewkarats";
import { authCtx } from "../context/auth-and-perm/auth";
import { PermissionCtxProvider } from "../context/auth-and-perm/permissions";
import Management from "../pages//selling/Management";
import { Login } from "../pages/Login";
import { Settings } from "../pages/Settings";
import { AdministrativeStructure } from "../pages/administrativeStructure/AdministrativeStructure";
import { OneAdminRoles } from "../pages/administrativeStructure/OneAdminRoles";
import BranchSettingPage from "../pages/branchSetting/BranchSettingPage";
import { BranchBonds } from "../pages/coding/BranchBonds";
import { Coding } from "../pages/coding/Coding";
import { AccessoriesCoding } from "../pages/coding/accessories/AccessoriesCoding";
import { AccessoriesCodingWrapper } from "../pages/coding/accessories/AccessoriesCodingWrapper";
import { DiamondCoding } from "../pages/coding/diamond/DiamondCoding";
import { DiamondCodingWrapper } from "../pages/coding/diamond/DiamondCodingWrapper";
import { GoldCoding } from "../pages/coding/gold/GoldCoding";
import { GoldCodingWrapper } from "../pages/coding/gold/GoldCodingWrapper";
import { Employees } from "../pages/employees/Employees";
import { OneEmployee } from "../pages/employees/OneEmployee";
// import { Home } from "../pages/home/Home"
import { Operation } from "../pages/operation/Operation";
import { AllPartner } from "../pages/partner/AllPartner";
import { OnePartner } from "../pages/partner/OnePartner";
import Clients from "../pages/selling/Clients";
import Honest from "../pages/selling/Honest";
import ItemInformation from "../pages/selling/ItemInformation";
import { NeighborsPage } from "../pages/selling/NeighborsPage";
import PaymentSellingPage from "../pages/selling/PaymentSellingPage";
import Payoff from "../pages/selling/Payoff";
import Reports from "../pages/selling/Reports";
import { SellingBranchIdentity } from "../pages/selling/SellingBranchIdentity";
import { AllSuppliers } from "../pages/suppliers/AllSuppliers";
import { OneSupplier } from "../pages/suppliers/OneSupplier";
import { Bond } from "../pages/supply/Bond";
import { Bonds } from "../pages/supply/Bonds";
import { Supply } from "../pages/supply/Supply";
import { GlobalAndStones } from "../pages/system/GlobalAndStones";
import { System } from "../pages/system/System";
import { ErrorPage } from "./ErrorPage";
import { Root } from "./Root";
import ViewAccountsBank from "../components/templates/accountsBank/ViewAccountsBank";
import ViewBanks from "../components/templates/banks/ViewBanks";
import { AllRetrievalRestrictions } from "../components/selling/honest/AllRetrievalRestrictions";
import { OneRetrievalRestrictions } from "../components/selling/honest/OneRetrievalRestrictions";
import ViewInvoiceData from "../components/templates/invoiceData/viewInvoiceData";
import AddSellingInvoice from "../components/selling/selling components/sellingWrapper/AddSellingInvoice";
import ViewSellingInvoice from "../components/selling/selling components/sellingWrapper/ViewSellingInvoice";
import SellingRestrictionsInvoice from "../pages/selling/sellingRestrictionsInvoice";
import AddTaxPolicy from "../components/templates/sellingPolicies/AddTaxPolicy";
import ViewTaxPolicy from "../components/templates/sellingPolicies/ViewTaxPolicy";
import PaymentToManagement from "../pages/Payment/PaymentToManagement";
import { Home } from "../pages/home/Home";
import PaymentRestrictions from "../pages/Payment/PaymentRestrictions";
import { PiecesSoldPage } from "../pages/selling/PiecesSoldPage";
import CodedIdentities from "../pages/coding/coded_identities/CodedIdentities";
import BranchBondsReact from "../pages/coding/branch_bonds_react/BranchBondsReact";
import ReturnBondsReact from "../pages/coding/ReturnBondsReact/ReturnBondsReact";
import BuyingPage from "../pages/Buying/BuyingPage";
import ViewBuyingPolicies from "../components/templates/buyingPolicies/ViewBuyingPolicies";
import BuyingInvoice from "../pages/Buying/BuyingInvoice";
import WeightAdjustment from "../pages/Buying/WeightAdjustment/WeightAdjustment";
import BuyingRestrictionsInvoice from "../pages/Buying/BuyingRestrictionsInvoice";
import PaymentToManagementPage from "../pages/Payment/PaymentToManagementPage";
import VeiwPaymentToManagement from "../pages/Payment/VeiwPaymentToManagement";
import PurchaseBonds from "../pages/Buying/Bonds/PurchaseBonds";
import WeightAdjustmentBonds from "../pages/Buying/Bonds/WeightAdjustmentBonds";
import PaymentBonds from "../pages/coding/branch bonds/PaymentBonds";
import ViewBondsFromBranchs from "../pages/coding/branch bonds/ViewBondsFromBranchs";
import { ViewBonds } from "../pages/coding/branch bonds/ViewBonds";
import Expenses from "../pages/expenses/Expenses";
import ExpensesInvoice from "../pages/expenses/Invoice/ExpensesInvoice";
import ExpensesBonds from "../pages/expenses/Bonds/ExpensesBonds";
import ViewExpensesPolicies from "../components/templates/expensesPolicy/ViewExpensesPolicies";
import ViewSubExpensesPolicies from "../components/templates/subExpensesPolicy/ViewSubExpensesPolicies";
import ViewTaxExpensesPolicies from "../components/templates/taxExpensesPolicy/ViewTaxExpensesPolicies";
import ExpensesPage from "../pages/expenses/ExpensesPage";
import ViewWorkHours from "../components/templates/workHours/ViewWorkHours";
import ViewSalariesPolicies from "../components/templates/salaries/ViewSalariesPolicies";
import ViewEtitlementsPolicies from "../components/templates/entitlements/ViewEtitlementsPolicies";
import ViewDeductionsPolicy from "../components/templates/deductions/ViewDeductionsPolicy";
import ViewEmployeeBenefits from "../components/templates/employeeBenefits/ViewEmployeeBenefits";
import ViewEmployeeDeductions from "../components/templates/employeeDeductions/ViewEmployeeDeductions";
import SalariesPage from "../pages/expenses/salaries/SalariesPage";
import AttendanceDeparture from "../components/selling/continuity/AttendanceDeparture";
import ContinuityPage from "../pages/selling/ContinuityPage";
import ViewCommision from "../components/templates/commision/ViewCommision";
import SellingSalaries from "../pages/selling/SellingSalaries";
import Print from "../pages/Print";
import Support from "../pages/Support/Support";
import CategoryLink from "../pages/Support/CategoryLink";
import SearchSupportLink from "../pages/Support/SearchSupportLink";
import AddSupport from "../pages/Support/AddSupport/AddSupport";
import ViewSupport from "../pages/Support/viewSupport/ViewSupport";
import AddSupportArticle from "../pages/Support/AddSupport/AddSupportArticle";
import ViewSupportArticle from "../pages/Support/viewSupport/ViewSupportArticle";
import SalesReturnPage from "../pages/salesReturn/SalesReturnPage";
import ImportTotals from "../pages/coding/coded_identities/ImportTotals";
import Stocks from "../pages/selling/Stocks";
import EdaraStocks from "../pages/stocksInEdara/edaraStocks";
import BranchStocks from "../pages/stocksInEdara/branchStocks";
import SalesReturnRestrictions from "../pages/salesReturn/SalesReturnRestrictions";
import PurchaseInvoice from "../pages/reserveGold/invoices/purchaseInvoice/PurchaseInvoice";
import SellingInvoice from "../pages/reserveGold/invoices/sellingInvoice/supplier/SellingInvoiceSupplier";
import ReversePurchaseBonds from "../pages/reserveGold/bonds/purchaseBonds/ReservePurchaseBonds";
import ReservePurchaseBonds from "../pages/reserveGold/bonds/purchaseBonds/ReservePurchaseBonds";
import SellingBond from "../pages/reserveGold/invoices/sellingInvoice/SellingBond";
import ReverseSellingBonds from "../pages/reserveGold/bonds/sellingBonds/ReserveSellingBonds";
import ReserveSellingSupplierEntry from "../pages/reserveGold/invoices/sellingInvoice/supplier/ReserveSellingSupplierEntry";
import ReservePurchaseSupplierEntry from "../pages/reserveGold/invoices/purchaseInvoice/supplier/ReservePurchaseSupplierEntry";
import PurchaseInvoiceSecondPage from "../pages/reserveGold/invoices/purchaseInvoice/supplier/PurchaseInvoiceSecondPage";
import SellingInvoiceSecondPage from "../pages/reserveGold/invoices/sellingInvoice/supplier/SellingInvoiceSecondPage";
import PurchaseBond from "../pages/reserveGold/invoices/purchaseInvoice/PurchaseBond";
import SupplierPayment from "../pages/SupplyPayment/SupplierPayment";
import SupplierPaymentBonds from "../pages/SupplyPayment/SupplierPaymentBonds";
import SupplyPayoff from "../pages/SupplyPayoffInEdara/SupplyPayoff";
import SupplyPayoffBonds from "../pages/SupplyPayoffInEdara/SupplyPayoffBonds";
import ActivityLog from "../pages/ActivityLog/ActivityLog";

export const AllRoutesProvider = () => {
  const { permissions, userData } = useContext(authCtx);

  return (
    <PermissionCtxProvider userPermissions={permissions || [""]}>
      <Routes>
        <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
          {/* @ts-ignore */}
          <Route index element={<Home title={t("home")} />} />
          <Route
            path="/settings"
            element={<Settings title={t("settings")} />}
          />

          {/* CODING */}
          <Route path="/coding" element={<Coding title={t("coding")} />} />
          <Route
            path="/branch-bonds"
            element={<BranchBonds title={t("branch bonds")} />}
          />
          <Route path="/payment-bonds" element={<PaymentBonds />} />
          <Route path="/view-bonds" element={<ViewBonds />} />
          <Route
            path="/accept-branchBonds"
            element={<ViewBondsFromBranchs />}
          />
          <Route
            path="/branch-bonds"
            element={<BranchBonds title={t("branch bonds")} />}
          />
          {/* REACT */}
          <Route
            path="/coding-react"
            element={
              <CodedIdentities title={t("identity and numbering management")} />
            }
          />
          <Route path="/coding/total/import" element={<ImportTotals />} />
          <Route
            path="/branch-bonds-react"
            element={<BranchBondsReact title={t("branch bonds")} />}
          />
          <Route
            path="/return-bonds-react"
            element={<ReturnBondsReact title={t("return bonds")} />}
          />
          {/* REACT */}
          <Route
            path="/coding/gold"
            element={<GoldCoding title={t("gold coding")} />}
          />
          <Route
            path="/coding/diamond"
            element={<DiamondCoding title={t("diamond coding")} />}
          />
          <Route
            path="/coding/accessories"
            element={<AccessoriesCoding title={t("accessories coding")} />}
          />

          <Route
            path="/coding/gold/:sanadId"
            element={<GoldCodingWrapper title="ترقيم سند ذهب" />}
          />
          <Route
            path="/coding/diamond/:sanadId"
            element={<DiamondCodingWrapper title="ترقيم سند الالماس" />}
          />
          <Route
            path="/coding/accessories/:sanadId"
            element={<AccessoriesCodingWrapper title="ترقيم سند المتفرقات" />}
          />
          <Route path="/activity-log" element={<ActivityLog />} />

          <Route path="/system" element={<System title={t("system")} />} />

          {/* START SUPPORT */}
          <Route
            path="/support"
            element={<Support title={t("helper center")} />}
          />
          <Route path="/supportLinks/:supportId" element={<CategoryLink />} />
          <Route
            path="/searchLinks/:searchLinksId"
            element={<SearchSupportLink />}
          />

          <Route path="/addSupport" element={<AddSupport />} />
          <Route path="/viewSupport" element={<ViewSupport />} />

          <Route path="/addSupportArticle" element={<AddSupportArticle />} />
          <Route path="/viewSupportArticle" element={<ViewSupportArticle />} />
          {/* END SUPPORT */}

          {/* START RESERVE GOLDS */}
          {/* PURCHASE */}
          <Route path="/addPurchaseBond" element={<PurchaseBond />} />
          <Route
            path="/reservePurchaseBondInvoice"
            element={<PurchaseInvoiceSecondPage />}
          />
          <Route path="/viewPurchaseBonds" element={<ReservePurchaseBonds />} />
          <Route
            path="/addPurchaseBond/entry"
            element={<ReservePurchaseSupplierEntry />}
          />

          {/* SELLING */}
          <Route path="/addSellingBond" element={<SellingBond />} />
          <Route
            path="/reserveSellingBondInvoice"
            element={<SellingInvoiceSecondPage />}
          />
          <Route path="/viewSellingBonds" element={<ReverseSellingBonds />} />
          <Route
            path="/addSellingBond/entry"
            element={<ReserveSellingSupplierEntry />}
          />
          {/* END RESERVE GOLDS */}

          <Route
            path="/system/company-profile"
            element={<ViewCompanyDetails />}
          />
          <Route
            path="/system/partners"
            element={<AllPartner title="الشركاء" />}
          />
          <Route path="/system/partners/:partnerID" element={<OnePartner />} />

          <Route path="/system/accounts" element={<AccountingTree />} />
          <Route
            path="/system/suppliers"
            element={<AllSuppliers title="كل الموردين" />}
          />
          <Route
            path="/system/suppliers/:supplierID"
            element={<OneSupplier title="المورد" />}
          />
          <Route
            path="/system/operations"
            element={<Operation title="كل العمليات" />}
          />
          <Route
            path="/system/branches"
            element={<ViewBranches title="كل الفروع" />}
          />
          <Route path="/system/banks" element={<ViewBanks />} />

          <Route path="/system/accountsBank" element={<ViewAccountsBank />} />

          <Route path="/system/bankCards" element={<ViewBankCards />} />

          <Route
            path="/system/policiesSelling"
            element={<ViewSellingPolicies />}
          />

          <Route path="/system/excludedItems" element={<ViewExcludedItems />} />
          <Route path="/system/TaxPolicy" element={<ViewTaxPolicy />} />

          <Route path="/system/excludedItems" element={<ViewExcludedItems />} />

          <Route path="/system/invoiceData" element={<ViewInvoiceData />} />
          <Route path="/system/invoiceData" element={<ViewInvoiceData />} />

          <Route
            path="/system/branches/:branchesID"
            element={<OneBranches title="الفرع" />}
          />
          {/* ------- عام واحجار -------- */}
          <Route
            path="/system/global-and-stones"
            element={<GlobalAndStones title="تاسيس عام واحجار" />}
          />
          <Route
            path="/system/global-and-stones/countries"
            element={<ViewCountries />}
          />
          <Route
            path="/system/global-and-stones/cities"
            element={<ViewCities />}
          />
          <Route
            path="/system/global-and-stones/districts"
            element={<ViewDistricts />}
          />
          <Route
            path="/system/global-and-stones/nationalities"
            element={<ViewNationalities />}
          />
          <Route
            path="/system/global-and-stones/colors"
            element={<ViewStoneColor />}
          />
          <Route
            path="/system/global-and-stones/classifications"
            element={<ViewClassifications />}
          />
          <Route
            path="/system/global-and-stones/karats"
            element={<ViewKarats />}
          />
          <Route
            path="/system/global-and-stones/categories"
            element={<ViewCategories />}
          />
          <Route
            path="/system/global-and-stones/sizes"
            element={<ViewSizes title="عرض المقاسات" />}
          />
          <Route
            path="/system/global-and-stones/markets"
            element={<ViewMarkets />}
          />

          {/* الالماس */}

          <Route
            path="/system/global-and-stones/minerals"
            element={<ViewMinerals />}
          />

          <Route
            path="/system/global-and-stones/minerals_karats"
            element={<ViewMineralsKarats />}
          />

          {/* الاحجار */}
          <Route
            path="/system/global-and-stones/stones-types"
            element={<ViewStoneType />}
          />
          <Route
            path="/system/global-and-stones/stones-colors"
            element={<ViewStoneColor />}
          />

          <Route
            path="/system/global-and-stones/stones-shapes"
            element={<ViewStoneShape />}
          />
          <Route
            path="/system/global-and-stones/stones-qualities"
            element={<ViewStoneQuality />}
          />
          <Route
            path="/system/global-and-stones/stones-purities"
            element={<ViewStonePurity />}
          />
          <Route
            path="/system/global-and-stones/stones-natures"
            element={<ViewStoneNature />}
          />
          {/* ./SYSTEM */}
          <Route
            path="system/administrative-structure"
            element={
              <AdministrativeStructure title={t("administrative-structure")} />
            }
          />
          <Route
            path="/administrative/api/v1/roles/:id"
            element={<OneAdminRoles title={t("Roles")} />}
          />
          <Route
            path="system/employees"
            element={<Employees title={t("employees")} />}
          />
          <Route
            path="system/employees/:employeeID"
            element={<OneEmployee />}
          />
          <Route
            path="/bonds/gold"
            element={<Supply title={t("gold supply")} />}
          />
          <Route
            path="/bonds/diamond"
            element={<Supply title={t("diamond supply")} />}
          />
          <Route
            path="/bonds/accessories"
            element={<Supply title={t("accessories supply")} />}
          />
          <Route
            path="/gold-bonds"
            element={<Bonds title={t("gold bonds")} />}
          />
          <Route
            path="/gold-bonds/:bondID"
            element={<Bond title={t("gold bond")} />}
          />
          <Route
            path="/diamond-bonds"
            element={<Bonds title={t("diamond bonds")} />}
          />
          <Route
            path="/diamond-bonds/:bondID"
            element={<Bond title={t("diamond bond")} />}
          />
          <Route
            path="/accessory-bonds"
            element={<Bonds title={t("accessory bonds")} />}
          />

          <Route path="/supplier-payment" element={<SupplierPayment />} />

          <Route
            path="/bonds/supplier-payment"
            element={<SupplierPaymentBonds />}
          />

          <Route path="/supply-return" element={<SupplyPayoff />} />

          <Route
            path="/bonds/supply-return"
            element={<SupplyPayoffBonds />}
          />
          <Route
            path="/accessory-bonds/:bondID"
            element={<Bond title={t("accessory bond")} />}
          />

          {/* المبعات */}
          <Route path="/selling" element={<PaymentSellingPage />} />

          <Route path="/selling/addInvoice" element={<AddSellingInvoice />} />
          <Route path="/selling/viewInvoice" element={<ViewSellingInvoice />} />

          <Route path="/payment" element={<SellingSecondpage />} />
          <Route
            path="selling/clients/customersData/addClients"
            element={<AddClients />}
          />
          <Route
            path="/selling/finalPreview"
            element={<SellingFinalPreview />}
          />
          <Route path="/selling/buying" element={<BuyingPage />} />
          <Route path="/selling/management" element={<Management />} />
          <Route path="/selling/exchange" element={<Expenses />} />
          <Route path="/selling/salaries" element={<SellingSalaries />} />
          <Route path="/selling/clients" element={<Clients />} />
          <Route path="/selling/customersData" element={<ClientsData />} />
          <Route path="/selling/reservePiece" element={<ReservePiece />} />
          <Route path="/selling/payoff" element={<Payoff />} />
          {/* <Route path="/selling/reimbursement" element={<>reimbursement</>} /> */}
          {/* neighbors start */}
          <Route path="/selling/neighbors" element={<NeighborsPage />} />
          <Route path="/selling/neighbors/loaning" element={<>loaning</>} />
          <Route path="/selling/neighbors/recover" element={<>recover</>} />
          <Route
            path="/selling/neighbors/neighbors-data"
            element={<>neighbors-data</>}
          />
          <Route path="/selling/neighbors/payment" element={<>payment</>} />
          {/* neighbors end */}
          <Route path="/selling/reports" element={<Reports />} />
          <Route path="/selling/continuity" element={<ContinuityPage />} />
          <Route path="/selling/reports/stocks" element={<Stocks />} />
          <Route path="/credits/edara" element={<EdaraStocks />} />
          <Route path="/credits/branch" element={<BranchStocks />} />
          <Route
            path="/selling/reports/accounting-tree"
            element={<BranchAccountingTree />}
          />
          <Route
            path="/selling/continuity/AttendanceDeparture"
            element={<AttendanceDeparture />}
          />
          <Route
            path="/selling/item-information"
            element={<ItemInformation />}
          />
          <Route path="/selling/continuity" element={<>continuity</>} />
          <Route path="/selling/trading" element={<>trading</>} />
          {/* honest start */}
          <Route path="/selling/honesty" element={<Honest />} />
          <Route path="/selling/honesty/new-honest" element={<NewHonest />} />
          <Route
            path="/selling/honesty/return-honest"
            element={<RetrieveHonestEntryScreen />}
          />
          <Route
            path="/selling/honesty/all-honest"
            element={<AllHonestBonds />}
          />
          <Route
            path="/selling/honesty/all-return-honest"
            element={<AllRetrieveHonestBonds />}
          />
          <Route
            path="/selling/honesty/all-honest/:bondId"
            element={<HonestBondAccountingRestriction />}
          />
          <Route
            path="/selling/honesty/return-honest/:bondId"
            element={<ReturnHonestRestriction />}
          />
          {/* honest end */}
          <Route path="/selling/bank" element={<>bank</>} />
          <Route
            path="/selling/branch-identity"
            element={<SellingBranchIdentity />}
          />
          <Route path="/selling/Pieces-Sold" element={<PiecesSoldPage />} />
          <Route
            path="/selling/management/receive-money"
            element={<>receive-money</>}
          />
          <Route
            path="/selling/management/receive-items"
            element={<RecieveItems />}
          />
          <Route path="/selling/payoff/payoff" element={<Payoff />} />
          <Route
            path="/selling/branchSetting"
            element={<BranchSettingPage />}
          />
          <Route path="/system/cardsData" element={<ViewBankCardsData />} />
          <Route
            path="/selling/payoff/supply-payoff"
            element={<PayoffEntryScreen />}
          />

          {/* المبعات */}

          <Route path="/selling" element={<PaymentSellingPage />} />
          <Route path="/payment" element={<SellingSecondpage />} />
          <Route
            path="/selling/invoice-restrictions"
            element={<SellingRestrictionsInvoice />}
          />
          <Route
            path="selling/clients/customersData/addClients"
            element={<AddClients />}
          />
          <Route
            path="/selling/finalPreview"
            element={<SellingFinalPreview />}
          />
          <Route
            path="/selling/return-entry"
            element={<SalesReturnRestrictions />}
          />

          {/* <Route path="/selling/buying/test" element={<>butingh</>} /> */}
          <Route path="/selling/management" element={<Management />} />
          {/* <Route path="/selling/exchange" element={<>exchange</>} /> */}
          <Route path="/selling/clients" element={<Clients />} />
          <Route path="/selling/payoff" element={<Payoff />} />
          <Route
            path="/selling/payment"
            element={<PaymentToManagementPage />}
          />
          <Route
            path="/selling/reimbursement"
            element={<PaymentToManagement />}
          />
          <Route
            path="/selling/viewPayment"
            element={<VeiwPaymentToManagement />}
          />
          {/* neighbors start */}
          <Route path="/selling/neighbors" element={<NeighborsPage />} />
          <Route path="/selling/neighbors/loaning" element={<>loaning</>} />
          <Route path="/selling/neighbors/recover" element={<>recover</>} />
          <Route
            path="/selling/neighbors/neighbors-data"
            element={<>neighbors-data</>}
          />
          <Route path="/selling/neighbors/payment" element={<>payment</>} />
          {/* neighbors end */}
          <Route path="/selling/reports" element={<Reports />} />
          <Route
            path="/selling/reports/accounting-tree"
            element={<BranchAccountingTree />}
          />
          <Route
            path="/selling/item-information"
            element={<ItemInformation />}
          />
          <Route path="/selling/continuity" element={<>continuity</>} />
          <Route path="/selling/trading" element={<>trading</>} />
          {/* honest start */}
          <Route path="/selling/honesty" element={<Honest />} />
          <Route path="/selling/honesty/new-honest" element={<NewHonest />} />
          <Route
            path="/selling/honesty/all-honest"
            element={<AllHonestBonds />}
          />
          <Route
            path="/selling/honesty/all-honest/:bondId"
            element={<HonestBondAccountingRestriction />}
          />
          <Route
            path="/selling/honesty/all-retrieval-restrictions"
            element={<AllRetrievalRestrictions />}
          />
          <Route
            path="/selling/honesty/all-retrieval-restrictions/:bondId"
            element={<OneRetrievalRestrictions />}
          />
          {/* honest end */}
          <Route path="/selling/bank" element={<>bank</>} />
          <Route
            path="/selling/branch-identity"
            element={<SellingBranchIdentity />}
          />
          <Route
            path="/selling/management/receive-money"
            element={<>receive-money</>}
          />
          <Route
            path="/selling/management/receive-items"
            element={<RecieveItems />}
          />
          <Route
            path="/selling/management/edit-items-weight"
            element={<Print />}
          />
          <Route
            path="/selling/payoff/sales-return"
            element={<SalesReturnPage />}
          />
          <Route
            path="/selling/payoff/sales-return"
            element={<SalesReturnPage />}
          />
          <Route path="/selling/payoff/payoff" element={<Payoff />} />
          <Route
            path="/selling/branchSetting"
            element={<BranchSettingPage />}
          />
          {/* BUYING START */}
          <Route path="/buying/purchaseInvoice" element={<BuyingInvoice />} />
          <Route
            path="/system/policiesBuying"
            element={<ViewBuyingPolicies />}
          />
          <Route
            path="/buying/weightAdjustment"
            element={<WeightAdjustment />}
          />
          <Route path="/expenses/Salaries" element={<SalariesPage />} />
          <Route path="/buying/purchaseBonds" element={<PurchaseBonds />} />
          <Route
            path="/buying/weightAdjustmentBonds"
            element={<WeightAdjustmentBonds />}
          />
          <Route
            path="/buying/invoice-restrictions"
            element={<BuyingRestrictionsInvoice />}
          />
          {/* BUYING END */}
          {/* EXPENSES START */}
          <Route
            path="/system/mainExpensesPolicies"
            element={<ViewExpensesPolicies />}
          />
          <Route path="/expenses/expensesInvoice" element={<ExpensesPage />} />
          <Route path="/expenses/expensesBonds" element={<ExpensesBonds />} />

          {/* TAX EXPENSES */}
          <Route
            path="/system/taxExpensesPolicies"
            element={<ViewTaxExpensesPolicies />}
          />

          {/* SUB EXPENSES */}
          <Route
            path="/system/subExpensesPolicies"
            element={<ViewSubExpensesPolicies />}
          />

          {/* WORK HOURS */}
          <Route path="/system/workHours" element={<ViewWorkHours />} />

          {/* SALARIES */}
          <Route
            path="/system/salaryPolicies"
            element={<ViewSalariesPolicies />}
          />

          {/* ENTITLEMENTS */}
          <Route
            path="/system/entitlementsPolicies"
            element={<ViewEtitlementsPolicies />}
          />

          {/* DEDUCTIONS */}
          <Route
            path="/system/deductionsPolicies"
            element={<ViewDeductionsPolicy />}
          />

          {/* EMPLOYEE BENEFITS */}
          <Route
            path="/system/employeeBenefitsPolicies"
            element={<ViewEmployeeBenefits />}
          />

          {/* EMPLOYEE DEDUCTIONS */}
          <Route
            path="/system/employeeDeductionsPolicies"
            element={<ViewEmployeeDeductions />}
          />

          {/* COMMISION */}
          <Route path="/system/commisionPolicies" element={<ViewCommision />} />

          {/* EXPENSES END */}
          <Route path="/system/cardsData" element={<ViewBankCardsData />} />
          <Route
            path="/selling/payoff/supply-payoff"
            element={<PayoffEntryScreen />}
          />
          <Route
            path="/selling/payment/restrictions"
            element={<PaymentRestrictions />}
          />
        </Route>
        <Route
          errorElement={<ErrorPage />}
          path="/login"
          element={<Login title={t("login")} />}
        />
      </Routes>
    </PermissionCtxProvider>
  );
};
