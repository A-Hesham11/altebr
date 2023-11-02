// import {  AiFillEdit } from "react-icons/ai"
import { FaRegEdit } from "react-icons/fa"
type EditProps_TP = {
  className?: string
  action?: () => void
  size?:number
}
export const Edit = ({
  className,
  action,
  size,
  ...props
}: EditProps_TP) => {

  return (
    <FaRegEdit
      size={size}
      className={`cursor-pointer w-5 h-5  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
