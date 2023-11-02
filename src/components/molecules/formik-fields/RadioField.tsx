import { useFormikContext } from "formik"
import { FormikError } from "../../atoms"
import { Radio } from "../Radio"
// props type
type Props_TP = {
  id: string,
  name:string,
  label:string
  [key: string]: any
}

export const RadioField = ({
  label,
  id,
  ...props
}:Props_TP) => {
  const { setFieldValue, setFieldTouched, errors, touched, values } =
    useFormikContext<{
      [key: string]: any
    }>()

  return (
    <div >
      <Radio
        {...props}
        label={label}
        id={id}
        name={props.name}
        className={`${errors[props.name] && "ring-2 ring-mainRed"}`}
        defaultChecked={!!values[props.name]}
        
        onChange={(e: any) => {
          setFieldValue(props.name, e.target.checked)
        }}
        onBlur={() => {
          setFieldTouched(props.name, true)
        }}
      />
      <FormikError name={props.name} />
    </div>
  )
}
