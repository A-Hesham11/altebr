import { BsEye } from "react-icons/bs"
type ViewProps_TP = {
  className?: string
  action?: () => void
  size?:number
}
export const View = ({size, className, action, ...props }: ViewProps_TP) => {
  return (
    <BsEye
      size={size}
      className={`cursor-pointer ${className}`}
      onClick={action}
      {...props}
    />
  )
}
