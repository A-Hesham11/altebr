import { AiOutlineDelete } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
type DeleteProps_TP = {
  className?: string
  action?: () => void
  size?:number
}
export const Delete = ({
  className,
  action,
  size,
  ...props
}: DeleteProps_TP) => {

  return (
    <RiDeleteBin6Line
      size={size}
      className={` fill-red-500 cursor-pointer w-[21.5px] h-[21.5px] ${className}`}
      onClick={action}
      {...props}
    />
  )
}
