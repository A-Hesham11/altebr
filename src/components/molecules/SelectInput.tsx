/////////// IMPORTS
import Select, { Theme } from "react-select"
import makeAnimated from "react-select/animated"
import { Label, Spinner } from "../atoms"
import { Sub_AccountSelectOption_TP } from "../templates/systemEstablishment/operation/OperationDetails"
///
/////////// Types
//

type options_TP = {
  label: string
  name: string
  numeric_system: number
  value: string
}
type Select_TP = {
  options: options_TP[] | undefined
  label?: string
  name?: string
  placeholder?: string
  loading?: boolean
  id?: string
  isDisabled?: boolean
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectInput = ({
  options,
  label,
  name,
  loading,
  isDisabled,
  placeholder,
  id,
  ...props
}: Select_TP) => {
  /////////// VARIABLES
  ///
  const animatedComponents = makeAnimated()
  const selectTheme = (theme: Theme) => ({
    ...theme,
    borderRadius: 5,
    colors: {
      ...theme.colors,
      neutral80: "#295E56",
      primary25: "#e9eeed",
      primary: "#295E56",
    },
  })

  var selectProps = {
    ...props,
    components: {
      ...animatedComponents,
      LoadingIndicator: () => <Spinner className="ml-2" size="medium" />,
    },

    name: name,
    placeholder: placeholder,
    options: options,
    isLoading: loading && !isDisabled,
    isDisabled: loading || isDisabled,
    theme: selectTheme,

  }

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <div className="col-span-1 flex w-full flex-col gap-1">
        {label && <Label htmlFor={id ? id : ""}>{label}</Label>}
        <div className="col-span-1 flex w-full flex-col ">
          <Select {...selectProps} />
        </div>
      </div>
    </>
  )
}
