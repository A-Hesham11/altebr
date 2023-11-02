/////////// IMPORTS
///

import useBreadcrumbs from "use-react-router-breadcrumbs"

///
/////////// Types
///

import { useLocation } from "react-router-dom"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Breadcrumbs = () => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const breadcrumbs = useBreadcrumbs()
  //   console.log("🚀 ~ file: Breadcrumbs .tsx:24 ~ Breadcrumbs ~ breadcrumbs:", breadcrumbs)

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
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return <>{breadcrumbs.map(({ breadcrumb }) => {})}</>
}
