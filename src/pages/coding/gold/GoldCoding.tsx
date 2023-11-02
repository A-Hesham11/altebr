/////////// IMPORTS
///
import { Helmet } from "react-helmet-async"
import { GoldCodingSanadPicker } from "./GoldCodingSanadPicker"
///
/////////// Types
///
type GoldCodingProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const GoldCoding = ({ title }: GoldCodingProps_TP) => {
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
      <GoldCodingSanadPicker />
    </>
  )
}
