/////////// IMPORTS
///
//import classes from './TestSystem.module.css'
import { Helmet } from "react-helmet-async"
import { AccountingTreeForm } from "./AccountingTree/AccountingTreeForm"
import { SizesForm } from "./sizeses/SizesForm"
import { AddMarket } from "./markets/AddMarket"
import { Operation } from "../../../pages/operation/Operation"
import { Tests } from "../../../pages/Tests"
import { ViewCities } from "./view/ViewCities"
import { ViewCountries } from "./view/ViewCountries"
import { ViewDistricts } from "./view/ViewDistricts"
import { ViewMarkets } from "./view/ViewMarkets"
import { ViewNationalities } from "./view/ViewNationalities"
import { ViewColors } from "./view/ViewColors"
import { ViewClassifications } from "./view/ViewClassifications"
import { ViewKarats } from "./view/Viewkarats"
import { ViewCategories } from "./view/ViewCategories"
import { ViewPartners } from "./view/ViewPartners"
import { AddCities } from "./AddCities"
import { AddCountry } from "./AddCountry"
import { AddDistrict } from "./AddDistrict"
import { EmptyDataView } from "../reusableComponants/EmptyDataView"
import { AllSuppliers } from "../../../pages/suppliers/AllSuppliers"
import CreateCategory from "../reusableComponants/categories/create/CreateCategory"
import AddSupplier from "./supplier/AddSupplier"
import CreateKarat from "../reusableComponants/karats/create/CreateKarat"
import Select_test from "./hashim/Select_test"
import { ViewStoneColor } from "../reusableComponants/stones/view/ViewStoneColor"
import { ViewStoneQuality } from "../reusableComponants/stones/view/ViewStoneQuality"
import { CreateNationalities } from "../CreateNationalities"
import { CreateClassification } from "../reusableComponants/classifications/create/CreateClassification"
import { AccountingTree } from "./AccountingTree/AccountingTree"

///
/////////// Types
///
type TestSystem_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const TestSystem = ({ title }: TestSystem_TP) => {
  /////////// VARIABLES
  ///

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
  /////////// IF CASES
  ///

  ///
  /////////// EVENTS
  ///

  ///
  /////////// FUNCTIONS
  ///

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* <CreateCategory /> */}
      {/* back error */}
      {/* <ViewCategories /> */}
      {/* <ViewKarats /> */}
      {/* logo and doc */}
      {/* <AddSupplier title={""} /> */}
      {/* <AllSuppliers title={""} /> */}
      {/* no */}
      {/* <AddCountry /> */}
      {/* <ViewCountries /> */}
      {/* <ViewCities /> */}
      {/* <AddCities /> */}
      {/* <AddDistrict /> */}
      {/* <ViewDistricts /> */}
      {/* <ViewMarkets /> */}
      {/* <AddMarket /> */}
      {/* <CreateNationalities /> */}
      {/* <ViewNationalities /> */}
      {/* <CreateClassification /> */}
      {/* <ViewClassifications /> */}
      {/* <ViewColors /> */}
      <Operation title="Operation" />
      {/* <CreateKarat /> */}
      <AccountingTree />
    </>
  )
}
