/////////// IMPORTS
///
import { Helmet } from "react-helmet-async"
import { DiamondCodingSanadPicker } from "./DiamondCodingSanadPicker"
///
/////////// Types
///
type DiamondCodingProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const DiamondCoding = ({ title }: DiamondCodingProps_TP) => {
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
      <DiamondCodingSanadPicker />
    </>
  )
}
