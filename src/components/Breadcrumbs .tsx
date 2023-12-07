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
