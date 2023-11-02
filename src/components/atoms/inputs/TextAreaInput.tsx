export interface TextAreaInputProp_TP
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  override?: boolean
  autocomplete?: string
}

const BASE_CLASS_NAME =
  "form-textarea w-full rounded-md border-transparent px-4 py-[.30rem] outline-none focus:!border-2 focus:!border-mainGreen shadows"

export const TextAreaInput = ({
  name,
  id,
  className,
  disabled,
  override,
  autocomplete,
  ...props
}: TextAreaInputProp_TP) => {
  var newClassName = `${BASE_CLASS_NAME} ${className || ""}`
  if (override) {
    newClassName = className || ""
  }
  return (
    <textarea
      name={name}
      id={id}
      disabled={disabled}
      className={newClassName}
      autoComplete={autocomplete}
      {...props}
    />
  )
}
