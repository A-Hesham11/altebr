/////////// IMPORTS
///
import { ReactNode } from "react"
import { TabsIcon } from "../atoms/icons/Tabs"
import { Button } from "../atoms"
///
/////////// Types
///
type InnerFormLayoutProps_TP = {
  title?: string | null | Element
  leftComponent?: ReactNode
  children: ReactNode
  customStyle?: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const InnerFormLayout = ({
  title,
  children,
  leftComponent,
  customStyle

}: InnerFormLayoutProps_TP) => {
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
      <div className="p-2 w-full mb-2">
        {title && (
          <div className="flex items-center justify-between mb-4 relative">
            <div className=" font-bold flex items-center gap-4">
              <TabsIcon />
              <h2 className="text-2xl font-bold w-full">{title}</h2>
            </div>
            {leftComponent &&  leftComponent}
          </div>
        )}
        <div
          className={
            customStyle
              ? customStyle
              : "bg-flatWhite items-center rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 relative"
          }
        >
          {children}
        </div>
      </div>
    </>
  )
}