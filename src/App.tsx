/////////// IMPORTS
///
import { AllRoutesProvider } from "./routing/allRoutes"
import { useIsRTL } from "./hooks/useIsRTL"
// import { router } from "./routing/allRoutes"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ToastContainer } from "react-toastify"
import {  useLayoutEffect } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Breadcrumbs } from "./components/Breadcrumbs "
///
/////////// Types
///

/////////// HELPER VARIABLES & FUNCTIONS
///

///
const App = () => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL()
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///
  useLayoutEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = isRTL ? "ar" : "en"
  }, [])
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      {/* <Breadcrumbs/> */}
      <AllRoutesProvider />
      <ToastContainer rtl={isRTL} />
      <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
    </>
  )
}
export default App
