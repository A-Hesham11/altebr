import { useFormikContext } from "formik"
import { forwardRef, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { tv } from "tailwind-variants"
import { BaseInput, FormikError, Label } from "../../atoms"

const dateInputField = tv({
  base: "direction-rtl",
  variants: {
    active: {
      true: "!rounded-md !border-2 !border-mainGreen !ring-0",
    },
    error: {
      true: "!rounded-md !border-2 !border-mainRed",
    },
  },
})

const DatePickerInput = forwardRef(({ ...props }, ref?: any) => {
  return <BaseInput ref={ref} {...props} />
})

export const DateInputField = ({
  label,
  name,
  maxDate,
  minDate,
  labelProps,
  value,
}: {
  label: string
  name: string
  maxDate?: Date
  minDate?: Date
  value?: Date
  labelProps?: {
    [key: string]: any
  }
}) => {
  const { setFieldValue, errors, touched, handleBlur, values } =
    useFormikContext<{
      [key: string]: any
    }>()
  const [dateActive, setDateActive] = useState(false)

  return (
    <div className="col-span-1">
      <div className="flex flex-col gap-1">
        <Label htmlFor={name} {...labelProps}>
          {label}
        </Label>
        <DatePicker
          selected={values[name]}
          onChange={(date: Date) => {
            setFieldValue(name, date)
          }}
          onBlur={handleBlur(name)}
          className={dateInputField({
            active: dateActive,
            error: touched[name] && !!errors[name],
          })}
          onCalendarOpen={() => {
            setDateActive(true)
          }}
          onCalendarClose={() => {
            setDateActive(false)
          }}
          maxDate={maxDate}
          dateFormat="dd/MM/yyyy"
          minDate={minDate}
          customInput={<DatePickerInput />}
          isClearable={true}
          name={name}
          value={
            // date to string
            values[name]
              ? values[name]?.toLocaleDateString()
              : value?.toLocaleDateString()
          }
        />
      </div>
      <FormikError name={name} />
    </div>
  )
}
