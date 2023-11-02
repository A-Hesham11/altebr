import { AiOutlineCheck } from "react-icons/ai"
type LineCheckProps_TP = {
  className?: string
  action?: () => void
  size?: number
}
export const LineCheck = ({
  className,
  action,
  size,
  ...props
}: LineCheckProps_TP) => {
  return (
    <AiOutlineCheck
      size={size}
      className={` cursor-pointer  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
