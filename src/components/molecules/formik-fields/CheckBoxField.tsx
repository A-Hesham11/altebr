import { useFormikContext } from "formik"
import { Dispatch, SetStateAction, memo } from "react"
import { PermissionGroup_TP } from "../../../pages/administrativeStructure/types-and-schemas"
import { FormikError } from "../../atoms"
import { Checkbox } from "../Checkbox"

// props type
type Props_TP = {
  [key: string]: any
  editData?: PermissionGroup_TP | undefined
  checked?: boolean
  setChecked?: Dispatch<SetStateAction<boolean>>
}

export const CheckBoxField = memo(({
  label,
  id,
  name,
  editData,
  checked,
  ...props
}: { label?: string; name: string } & Props_TP) => {

  const { setFieldValue, setFieldTouched, errors, values } = useFormikContext<{
    [key: string]: any
  }>()


  return (
    <div>
      <Checkbox
        label={label}
        id={id}
        name={name}
        value={values[name]}
        className={`${errors[name] && "border-2 border-mainRed"}`}
        checked={values[name]}
        onChange={(e) => {
          setFieldValue(name, e.target.checked)
        }}
        onBlur={() => {
          setFieldTouched(name, true)
        }}
        {...props}
      />
      <FormikError name={name} />
    </div>
  )
})