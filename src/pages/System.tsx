/////////// IMPORTS
///
import { Form, Formik } from "formik"
import { Helmet } from "react-helmet-async"
import * as Yup from "yup"
import { Example } from "../try-ahmed/Example"
///
/////////// Types
///
type SystemProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///
export const initialValues = {
  type: "",
  weight: "",
  karat: "",
  stock: "",
  goldTaxes: "",
}

const validation = Yup.object().shape({
  type: Yup.string().trim().required(),
  weight: Yup.number().required().typeError("ارقام فقط"),
  karat: Yup.string().trim().required(),
  stock: Yup.string().trim().required(),
  goldTaxes: Yup.number().required().typeError("ارقام فقط"),
})
///
export const System = ({ title }: SystemProps_TP) => {
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
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Formik
        onSubmit={(values) => console.log("values", values)}
        initialValues={initialValues}
        validationSchema={validation}
      >
        {({ values, errors }) => (
          <Form>
            <Example />
            <button type="submit">OKK</button>
          </Form>
        )}
      </Formik>
    </>
  )
}
