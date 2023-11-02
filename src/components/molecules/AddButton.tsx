import { IoMdAdd } from "react-icons/io"

type AddButton_TP = {
  addLabel?: string
  action?: () => void
}

export const AddButton = ({ addLabel, action }: AddButton_TP) => {
  return (
    <>
      {addLabel && (
        <div
          className="relative active:top-[1px] py-2 px-8 font-bold rounded-md w-full bg-mainGreen border text-white flex items-center justify-center gap-2 cursor-pointer"
          onClick={action}
        >
          <IoMdAdd className="w-5 h-5 text-white" />
          <p className=" text-sm">{addLabel}</p>
        </div>
      )}
    </>
  )
}
