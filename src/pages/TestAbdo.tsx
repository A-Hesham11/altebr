/////////// IMPORTS
///
import { Helmet } from "react-helmet-async"
import { AddCities } from "../components/templates/systemEstablishment/AddCities"
import { AddCountry } from "../components/templates/systemEstablishment/AddCountry"
import { AddDistrict } from "../components/templates/systemEstablishment/AddDistrict"
import { SelectNationality } from "../components/templates/systemEstablishment/SelectNationality"
import { AddPartners } from "../components/templates/systemEstablishment/partners/AddPartners"
import { Form, Formik } from "formik"
import { SelectStoneShape } from "../components/templates/systemEstablishment/stones/SelectStoneShape"
import { SelectStonesQualities } from "../components/templates/systemEstablishment/stones/SelectStonesQualities"
import { ViewCompanyDetails } from "../components/templates/systemEstablishment/partners/ViewCompanyDetails"
import { AllSuppliers } from "./suppliers/AllSuppliers"
import { OneSupplier } from "./suppliers/OneSupplier"
import { AllPartner } from "./partner/AllPartner"
///
/////////// Types
///
type TestAbdo_TP = {
  title:string
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const TestAbdo = ({ title }: TestAbdo_TP) => {
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
      {/* <AddPartners /> */}
      {/* <AddCountry/> */}
      {/* <AddCities/> */}
      {/* <AddDistrict/> */}
      <AddPartners title="add partner"  />
      {/* <ViewCompanyDetails/> */}
      {/* <OneSupplier/> */}
      {/* <AllSuppliers title=""/> */}
      {/* <AllPartner title="partner"/> */}

      <Formik
        initialValues={{ shape: "" }}
        onSubmit={(value: any) => {
          console.log(value)
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            {/* <SelectNationality
              name="national_id"
            /> */}
            {/* <SelectColor modalTitle="اضافة لون حجر" name="color" label="color stones" /> */}
            {/* <SelectStoneShape name='shape'/> */}
            {/* <SelectStonesQualities name='shape'/> */}
          </Form>
        )}
      </Formik>
    </>
  )
}
