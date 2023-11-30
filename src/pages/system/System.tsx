/////////// IMPORTS
///
import { t } from "i18next"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Modal } from "../../components/molecules"
import { AddEmployee } from "../../components/templates/employee/AddEmployee"
import { CreateBranch } from "../../components/templates/reusableComponants/branches/CreateBranch"
import { AccountingTree } from "../../components/templates/systemEstablishment/AccountingTree/AccountingTree"
import { AddPartners } from "../../components/templates/systemEstablishment/partners/AddPartners"
import AddSupplier from "../../components/templates/systemEstablishment/supplier/AddSupplier"
import { SystemCard } from "../../components/templates/systemEstablishment/SystemCard"
import { AddAdministrativeStructure } from "../administrativeStructure/AddAdministrativeStructure"
import { Card_TP, FormNames_TP } from "./types-and-helpers"
import AddDesimalNumber from "../../components/templates/DecimalNumber/AddDecimalNumber"
import { GlobalAndStones } from "./GlobalAndStones"
import AddBankCards from "../../components/templates/bankCards/AddBankCards"
import AddBanks from "../../components/templates/banks/AddBanks"
import AddAccountsBank from "../../components/templates/accountsBank/AddAccountsBank"
import AddBankCardsData from "../../components/templates/bankCards/AddBankCardsData"
import AddSellingPolicies from "../../components/templates/sellingPolicies/AddSellingPolicies"
import AddExcludedItems from "../../components/templates/excludedItems/AddExcludedItems"
import AddInvoiceData from "../../components/templates/invoiceData/AddInvoiceData"
import AddBuyingPolicies from "../../components/templates/buyingPolicies/AddBuyingPolicies"
import GoldPrice from "../../components/templates/goldPrice/GoldPrice"
import AddTaxPolicy from "../../components/templates/sellingPolicies/AddTaxPolicy"
///
/////////// Types
///
type SystemProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const System = ({ title }: SystemProps_TP) => {
  /////////// VARIABLES
  ///
  const navigate = useNavigate()


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
    add_banks:false,
    add_accountBank: false,
    selling_policies: false,
    buying_policies: false,
    gold_price: false,
    excluded_items: false,
    invoice_data: false,
    Tax_Policy: false
  })
  const systemCards: Card_TP<FormNames_TP>[] = [
    {
      id: crypto.randomUUID(),
      title: t("company data"),
      viewLabel: `${t("view company data")}`,
      viewHandler: () => navigate("company-profile"),
    },
    {
      id: crypto.randomUUID(),
      title: t("partners"),
      name: "partners",
      addLabel: `${t("add Partner")}`,
      viewLabel: `${t("view partners")}`,
      addComponent: <AddPartners title={`${t("add Partner")}`} />,
      viewHandler: () => navigate("partners"),
    },
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
      title: t("supplier"),
      name: "add_supplier",
      addLabel: `${t("add supplier")}`,
      viewLabel: `${t("View Suppliers")}`,
      addComponent: <AddSupplier title={`${t("add supplier")}`} />,
      viewHandler: () => navigate("suppliers"),
    },
    {
      id: crypto.randomUUID(),
      title: t("employees"),
      name: "add_employee",
      addLabel: `${t("add employee")}`,
      viewLabel: `${t("view employees")}`,
      viewHandler: () => navigate("employees"),
      addComponent: <AddEmployee title={`${t("add employee")}`} />,
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
      title: t("operations"),
      viewLabel: `${t("view operations")}`,
      viewHandler: () => navigate("operations"),
    },
    // {
    //   id: crypto.randomUUID(),
    //   title: t("system establishment"),
    //   viewLabel: `${t("system establishment")}`,
    //   viewHandler: () => navigate("global-and-stones"),
    // },
    {
      id: crypto.randomUUID(),
      title: t("branch"),
      name: "add_branch",
      addLabel: `${t("add branch")}`,
      viewLabel: `${t("view branches")}`,
      viewHandler: () => navigate("branches"),
      addComponent: <CreateBranch title={`${t("add branch")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("decimal numbers"),
      name: "add_decimal_number",
      addLabel: `${t("add decimal number")}`,
      addComponent: <AddDesimalNumber title={`${t("add decimal number")}`} />,
    },
    {
      id: crypto.randomUUID(),
      title: t("banks"),
      name: "add_banks",
      addLabel: `${t("add banks")}`,
      viewLabel: `${t("view banks")}`,
      viewHandler: () => navigate("/system/banks"),
      addComponent: (<AddBanks title={`${t("add banks")}`} />),
    },
    {
      id: crypto.randomUUID(),
      title: t("bank accounts"),
      name: "add_accountBank",
      addLabel: `${t("add bank account")}`,
      viewLabel: `${t("view bank accounts")}`,
      viewHandler: () => navigate("/system/accountsBank"),
      addComponent: (<AddAccountsBank title={`${t("add bank account")}`} />),
    },
    {
      id: crypto.randomUUID(),
      title: t("cards types banks"),
      name: "add_typeCards",
      addLabel: `${t("add type card")}`,
      viewLabel: `${t("view types cards")}`,
      viewHandler: () => navigate("/system/bankCards"),
      addComponent: (<AddBankCards title={`${t("add type card")}`} />),
    },
    {
      id: crypto.randomUUID(),
      title: t("add card bank"),
      name: "add_cards",
      addLabel: `${t("add card bank")}`,
      viewLabel: `${t("view cards banks")}`,
      viewHandler: () => navigate("/system/cardsData"),
      addComponent: (<AddBankCardsData title={`${t("add card bank")}`} />),
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
      title: t("gold price"),
      name: "gold_price",
      addLabel: `${t("add the price of 24 karat gold")}`,
      addComponent: <GoldPrice title={`${t("gold price")}`} />,
      // viewLabel: `${t("view buying policies")}`,
      // viewHandler: () => navigate("/system/policiesBuying"),
     },
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
      addComponent: <AddExcludedItems title={`${t("add excluded category")}`} />,
      viewLabel: `${t("view excluded items")}`,
      viewHandler: () => navigate("/system/excludedItems"),
    },
    {
      id: crypto.randomUUID(),
      title: t("manage congratulatory sentences"),
      name: "invoice_data",
      addLabel: `${t("add sentence congratulatory")}`,
      addComponent: <AddInvoiceData title={`${t("add sentence congratulatory")}`} />,
      viewLabel: `${t("view sentence congratulatory")}`,
      viewHandler: () => navigate("/system/invoiceData"),
    },
  ]
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
    setPopupIsOpen((prev) => ({ ...prev, [formName]: true }))

  const closePopupHandler = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: false }))
  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

        <h2 className="underline underline-offset-8 bold text-2xl mb-5">{t('system establishment')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {systemCards.map(
          ({
            id,
            title,
            addComponent,
            addLabel,
            viewHandler,
            viewLabel,
            name,
          }) => (
            <SystemCard
              key={id}
              viewHandler={viewHandler}
              viewLabel={viewLabel}
              title={title}
              addLabel={addLabel}
              addHandler={() => openPopup(name as FormNames_TP)}
            />
          )
        )}
      </div>
      <div className="my-8 bg-mainBlack h-[1px] rounded"></div>
        <GlobalAndStones title="تاسيس عام واحجار" />

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
          )
        }
      })}
    </>
  )
}
