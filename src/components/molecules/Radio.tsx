import { useIsRTL } from "../../hooks/useIsRTL"
import { BaseInput, Label } from "../atoms"

type RadioProps_TP = {
  label: string
  name: string
  id: string
  className?: string
  disabled?: boolean
  checked?: boolean
}

type Props_TP = {
  [key: string]: any
}

export const Radio = ({
  label,
  name,
  id,
  className,
  disabled,
  defaultChecked,
  ...props
}: RadioProps_TP & Props_TP) => {
  const isRTL = useIsRTL()
  const marginClass = isRTL ? "ms-2 " : "ml-2 "
  return (
    <div className="flex items-center justify-center ">
      <BaseInput
        id={id}
        {...props}

        {...{
          type: "radio",
          name,
          className: className,
          disabled,
          defaultChecked,
        }}

      />
      <Label htmlFor={id} className={marginClass}>
        {label}
      </Label>
    </div>
  )
}
