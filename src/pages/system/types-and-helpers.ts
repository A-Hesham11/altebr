// TYPES
export type Card_TP<T> = {
    id: string
    title: string
    name?: T
    addLabel?: string
    viewLabel?: string
    addComponent?: JSX.Element
    viewHandler?: () => void
}

export type FormNames_TP =
  | "partners"
  | "add_supplier"
  | "add_account"
  | "add_employee"
  | "add_administrative_structure"
  | "add_branch"
  | "add_decimal_number"
  | "add_typeCards"
  | "add_cards"
  | "add_banks"
  | "add_accountBank"
  | "selling_policies"
  | "excluded_items"
  | "invoice_data"
  | "invoice_image"
  | "Tax_Policy"
  | "colors"
  | "classifications"
  | "nationalities"
  | "karats"
  | "categories"
  | "markets"

export type GlobalFormNames_TP =
  | "countries"
  | "cities"
  | "districts"
  | "colors"
  | "classifications"
  | "nationalities"
  | "karats"
  | "categories"
  | "markets"
  | "sizes"
  | "minerals"
  | "minerals_karats"
  | "profit_margin"

  export type GlobalFormCards_TP =
  | "selling_policies"
  | "cities"
  | "districts"
  | "colors"


export type StonesFormNames_TP = "stones" |
    "shapes" |
    "qualities" |
    "purities" |
    "natures" | 'colors'
    
export type MineralCardsNames_TP = "minerals" | "minerals_karats" | "profit_margin"
// HELPERS


