/////////// IMPORTS
import { useFormikContext } from "formik"
import { default as BasePhoneInput } from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import "react-phone-number-input/style.css"
import { tv } from "tailwind-variants"
import { useIsRTL } from "../../../hooks"
import i18n from "../../../i18n"
import { FormikError } from "../../atoms"
import { Label } from "../../atoms/Label"
import { useEffect } from "react"
///
/////////// Types
///
type PhoneInputs_TP = {
  label: string
  name: "phone" | "mobile"
  placeholder: string
  restData?: any
  isSuccessPost?: any
  required?:any
  value?:string
  disabled?:boolean
}
/////////// HELPER VARIABLES & FUNCTIONS
///
const phoneInput = tv({
  base: "rounded-md border-2 border-transparent focus:border-2 focus:border-mainGreen form-input px-4 py-[.30rem] w-full shadows bg-white",
  variants: {
    error: {
      true: "border-mainRed !rounded-md !border-2",
    },
  },
})
///
export const PhoneInput = ({
  label,
  name,
  placeholder,
  restData,
  required,
  isSuccessPost,
  value,
  disabled
}: PhoneInputs_TP) => {
  /////////// VARIABLES
  ///
  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, errors, touched, handleBlur, resetForm } =
    useFormikContext<any>()
  ///
  /////////// STATES
  ///

  const isRTL = useIsRTL()

  const textDir = isRTL ? "right" : "left"
  const inputPhone = document.querySelector(".PhoneInputInput")
  const phoneStyle = `text-align: ${textDir};`
  if (inputPhone) {
    //@ts-ignore
    inputPhone!.style.cssText = phoneStyle
  }

  ///
  /////////// SIDE EFFECTS
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  // useEffect(() => {
  //   if (isSuccessPost) {
  //     resetForm()
  //     restData()
  //     setFieldValue(name, "")
  //   }
  // }, [isSuccessPost])
  ///
  return (
    <>
      <div className="col-span-1">
        <div className="flex flex-col gap-1">
          <Label htmlFor={name} required={required} className="mb-1 text-base">
            {label}
          </Label>
          <BasePhoneInput
            onBlur={handleBlur(name)}
            className={`${phoneInput({error: touched[name] && !!errors.phone,})} pr-0 ${disabled && "bg-[#f2f2f2]"}`}
            flags={flags}
            value={ value || isSuccessPost && ""}
            placeholder={placeholder}
            name={name}
            onChange={(number: number | string | undefined) => {
              setFieldValue(name, number)
            }}
            style={{ direction: "ltr", ...(disabled && { backgroundColor: "#f2f2f2" }) }}
            disabled={disabled}
            defaultCountry="SA"
          />
        </div>
        <FormikError name={name} />
      </div>
    </>
  )
}