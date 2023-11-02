/////////// IMPORTS
///
import { Helmet } from "react-helmet-async"
import { AccessoriesCodingSanadPicker } from "./AccessoriesCodingSanadPicker"
///
/////////// Types
///
type AccessoriesCodingProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AccessoriesCoding = ({ title }: AccessoriesCodingProps_TP) => {
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
      <AccessoriesCodingSanadPicker />
    </>
  )
}
