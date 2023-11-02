/////////// IMPORTS
///
import { FormikErrors, useFormikContext } from "formik"
import { useEffect } from "react"
import { notify } from "../toast"
///
/////////// Types
///
type HandleBackErrorsProps_TP = {
  children: JSX.Element
  errors?: FormikErrors<{ [key: string]: string[] }> | undefined
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const HandleBackErrors = ({
  children,
  errors,
}: HandleBackErrorsProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldError } = useFormikContext()
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (errors) {
      Object.entries(errors).map(([key, val]) => {
        if (val) {
          /* 
          دلوقتي انا مهندل ان لو رجعلي اراي اوف ايرورز متعلقة بفيلد واحد انا باخد منهم اول ايرور بس
          محتاج اهندل طريقة اني اعرض الباقي
          */
          if (val.length > 1 && typeof val === "object") {
            const err = val.join(" & ")
            setFieldError(key, err)
            notify("error" , err)
          } else {
            const err = val[0]
            setFieldError(key, err)
            notify("error" , err)
          }
        }
      })
    }
  }, [errors])
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return children
}