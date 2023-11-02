import { IoAddOutline } from "react-icons/io5"
// import { IoMdAdd } from "react-icons/io"
type AddProps_TP = {
  className?: string
  action?: () => void
  size?: number
}
export const Add = ({
  className,
  action,
  size,
  ...props
}: AddProps_TP) => {
  return (
    <IoAddOutline
      size={size}
      className={` cursor-pointer  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
