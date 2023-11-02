/////////// IMPORTS
import { BiShowAlt } from "react-icons/bi"
import { IoMdAdd } from "react-icons/io"
import { Button } from "../../atoms"
///
//import classes from './SystemCard.module.css'
///
/////////// Types

///
type SystemCardProps_TP = {
  addHandler: () => void
  viewHandler?: () => void
  addLabel?: string
  viewLabel?: string
  title: string
  forStyle?: boolean
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SystemCard = ({
  addHandler,
  viewHandler,
  addLabel,
  viewLabel,
  title,
  forStyle,
}: SystemCardProps_TP) => {
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
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <div className="col-span-1 w-full rounded-md p-3 shadow-xl ">
      <div className="grid grid-rows-view gap-4">
        <div
          className={`flex w-full items-center justify-center gap-2  rounded-lg  py-2 px-4 text-white ${
            forStyle ? "flex-col bg-mainGreen" : "bg-mainOrange"
          }`}
        >
          <div className="flex w-full items-center justify-center">
            <h3>{title}</h3>
          </div>
        </div>
        {addLabel && addHandler && (
          <Button bordered={true} action={addHandler} className="border-[0.7px] px-2 ">
            <div className="flex justify-center items-center">
              <IoMdAdd className="fill-lightBlack" fill="lightBlack" size={22} />
              <p className="text-sm ms-1">{addLabel}</p>
            </div>
          </Button>
        )}

        {viewLabel && (
          <Button
            bordered={true}
            className={`
              px-2
              border-[0.7px]
              forStyle
                ? "!bg-green !bg-opacity-20	 !text-mainGreen"
                : "!bg-mainOrange !bg-opacity-20"
            `}
            action={viewHandler}
          >
            <div className="flex justify-center items-center">
              <BiShowAlt size={22} />
              <p className="text-sm ms-1">{viewLabel}</p>
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}
