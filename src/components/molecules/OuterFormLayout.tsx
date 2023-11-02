/////////// IMPORTS
///
import { DefaultTFuncReturn } from "i18next"
import { ReactNode } from "react"
///
/////////// Types

///
type OuterFormLayout_TP = {
  children: ReactNode
  header?: string | DefaultTFuncReturn
  submitComponent?: ReactNode
  leftComponent?: ReactNode
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OuterFormLayout = ({
  children,
  header,
  submitComponent,
  leftComponent,
}: OuterFormLayout_TP) => {
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

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <div className="py-2 px-2 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{header}</h2>
          {leftComponent && leftComponent}
        </div>

        <div className="bg-lightGreen p-4 rounded-lg">{children}</div>
        {!!submitComponent && submitComponent}
      </div>
    </>
  )
}
