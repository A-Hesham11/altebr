import { GrView } from "react-icons/gr"
import { MdInsertPhoto } from "react-icons/md"
type ImageProps_TP = {
  className?: string
  action?: () => void
  size?:number
}
export const Image = ({
  className,
  action,
  size,
  ...props
}: ImageProps_TP) => {
  return (
    <MdInsertPhoto
      size={size}
      className={` cursor-pointer  ${className}`}
      onClick={action}
      {...props}
    />
  )
}
