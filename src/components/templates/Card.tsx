/////////// IMPORTS
///
///
/////////// Types
type Card_TP = {
  header: string
  headerColor?: "primary" | "secondary"
  addLabel?: string
  viewLabel: string
  variant?: "primary" | "secondary"
  addHandler?: () => void
  viewHandler: () => void

}
///

import { CardHeader } from "../molecules/card/CardHeader"
import { AddButton } from "../molecules/AddButton"
import { ShowButton } from "../molecules/ViewButton"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Card = ({
  header,
  headerColor,
  addLabel,
  viewLabel,
  variant,
  viewHandler,
  addHandler,

}: Card_TP) => {
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
      <div className="col-span-1  w-full  rounded-md p-3 shadow  ">
        <div className=" grid grid-flow-col grid-rows-3 gap-4">
          <CardHeader header={header} headerColor={headerColor} />
          {addLabel && <AddButton addLabel={addLabel} action={addHandler} />}
          {viewLabel && (
            <ShowButton
              viewLabel={viewLabel}
              action={viewHandler}
              variant={variant}
            />
          )}
        </div>
      </div>
    </>
  )
}
