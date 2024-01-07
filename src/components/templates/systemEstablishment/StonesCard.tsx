/////////// IMPORTS
///
//import classes from './StonesCard.module.css'
///
/////////// Types
import { BiPlus } from "react-icons/bi"
import { BsEye } from "react-icons/bs"
///
type SystemCardProps_TP = {
  addHandler: () => void
  viewHandler?: () => void
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const StonesCard = ({ addHandler, title, viewHandler }: SystemCardProps_TP) => {
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
      <h3>{title}</h3>
      <div className="flex gap-3 rounded-lg bg-green bg-opacity-20 p-2">
        <BiPlus onClick={addHandler} className="cursor-pointer"/>
        {viewHandler && (
          <BsEye  onClick={viewHandler} className="cursor-pointer"/>
        )}
      </div>
    </>
  )
}
