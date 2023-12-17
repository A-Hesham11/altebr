import { useFormikContext } from "formik"
import { createContext, useContext, useMemo, useState } from "react"
import { FormikError } from "../atoms"
import { Radio } from "./Radio"

const RadioContext = createContext(
  {} as [string, (value: string) => void, string]
)

function useRadioContext() {
  const context = useContext(RadioContext)
  if (!context) {
    throw new Error(
      `Radio compound components cannot be rendered outside the Radio component`
    )
  }
  return context
}

function RadioGroup({
  children,
  onChange,
  name,
}: {
  children: React.ReactNode
  onChange?: (value: string) => void
  name: string
  disabled?: boolean
}) {
  const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>()
  const [state, setState] = useState("")

  const memoizedState = useMemo(() => {
    return values[name] || state
  }, [values[name]])

  function handleOnChange(value: string) {
    setState(value)
    onChange && onChange(value)
    setFieldValue(name, value)
  }


  return (
    <RadioContext.Provider value={[memoizedState, handleOnChange, name]}>
      <div className="flex flex-row gap-4" role="radiogroup" data-name={name}>
        {children}
        <FormikError name={name} />
      </div>
    </RadioContext.Provider>
  )
}

function RadioButton({
  value,
  label,
  id,
  disabled,
  isChecked
}: {
  value: string
  label: string
  id: string
  disabled?: boolean
}) {
  const { setFieldTouched } = useFormikContext<{ [key: string]: any }>()
  const [state, onChange, name] = useRadioContext()
  // const checked = value === state
  const checked = isChecked !== undefined ? isChecked : value === state;
  return (
    <Radio
      value={value}
      checked={checked}
      name={name}
      label={label}
      id={id}
      onChange={(e: any) => {
        onChange(e.target.value)
      }}
      onBlur={() => {
        setFieldTouched(name, true)
      }}
      disabled={disabled}
    />
  )
}
RadioGroup.RadioButton = RadioButton

function RadioField({
  name,
  options,
  handleChange,
}: {
  name: string
  options: { value: string; label: string }[]
  handleChange?: (value: string) => void
}) {
  return (
    <RadioGroup onChange={handleChange} name={name}>
      {options.map((option: { value: string; label: string }) => (
        <RadioGroup.RadioButton
          key={option.value}
          value={option.value}
          label={option.label}
          id={`${name}-${option.value}`}
        />
      ))}
    </RadioGroup>
  )
}

export default RadioGroup
export { RadioField }
