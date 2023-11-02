/////////// IMPORTS
///
import { ReactNode } from "react"
import usePermission from "../../hooks/usePermission"
import { permissionsRule_TP } from "../../types"
///
/////////// Types
///
type CanProps_TP = {
  access: string[]
  fallback?: ReactNode
  children: ReactNode
  rule?: permissionsRule_TP
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Can = ({ access, fallback, children, rule }: CanProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const allowed = usePermission(access, rule)
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  if (allowed) {
    return <>{children}</>
  }
  ///
  return <>{fallback}</>
}
