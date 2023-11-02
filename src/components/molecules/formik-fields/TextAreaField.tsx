import { useFormikContext } from "formik"
import { TextAreaInputProp_TP } from "../../atoms/inputs/TextAreaInput"

import { FormikError, Label, TextAreaInput } from "../../atoms"

export const TextAreaField = ({
  label,
  name,
  placeholder,
  id,
  required,
  ...props
}: {
  label: string
  id: string
  name: string
  placeholder: string
} & TextAreaInputProp_TP) => {
  const { setFieldValue, setFieldTouched, errors, touched } = useFormikContext<{
    [key: string]: any
  }>()
  return (
    <div  className="relative mb-2 ">
      <Label htmlFor={id} required={required} className="mb-2 text-base">
        {label}
      </Label>
      <TextAreaInput
        placeholder={placeholder}
        id={id}
        className={`${
          touched[name as string] &&
          !!errors[name as string] &&
          "!border-mainRed border-2"
        }`}
        onChange={(e) => {
          setFieldValue(name as string, e.target.value)
        }}
        onBlur={() => {
          setFieldTouched(name as string, true)
        }}
        {...props}
      />

      <FormikError name={name as string} className="whitespace-nowrap absolute" />
    </div>
  )
}
