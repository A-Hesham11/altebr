import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { BaseInput, FormikError, Label } from "../../atoms";

export const BaseInputField = ({
  label,
  id,
  required,
  labelProps,
  noMb = false,
  type = "text",
  icon,
  ...props
}: {
  label?: string;
  icon?: React.ReactNode;
  id: string;
  noMb?: boolean;
  required?: boolean;
  labelProps?: {
    [key: string]: any;
  };
  name: string;
  type: "text" | "number" | "password" | "email";
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { setFieldValue, setFieldTouched, errors, touched, values } =
    useFormikContext<{
      [key: string]: any;
    }>();

  // const [fieldValue, setFieldValueState] = useState(
  //   props.value || values[props.name]
  // )

  // useEffect(() => {
  //   setFieldValue(props.name, fieldValue)
  // }, [fieldValue])

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className={noMb ? "col-span-1 relative" : "col-span-1 relative"}>
      <div className={`${icon ? "mb-4" : "mb-0"} flex flex-col gap-1 relative`}>
        {label && (
          <Label
            htmlFor={id}
            {...labelProps}
            required={required}
            className={`${icon ? "mb-1" : "mb-0"}`}
          >
            <p
              className={`${
                icon
                  ? "!text-black font-normal text-base"
                  : "!text-black text-base"
              }`}
            >
              {label}
            </p>
          </Label>
        )}
        {icon && <span className="text-[#7D7D7D]">{icon}</span>}
        <BaseInput
          type={type}
          id={id}
          {...props}
          // value={fieldValue}
          value={props.value || values[props.name]}
          error={touched[props.name] && !!errors[props.name]}
          autoComplete="off"
          onBlur={() => {
            setFieldTouched(props.name, true);
          }}
          onChange={(e) => {
            props.onChange && props.onChange(e);
            if (props.value === undefined) {
              // setFieldValueState(e.target.value)
              setFieldValue(props.name, e.target.value);
            }
          }}
          onWheel={handleWheel}
        />
      </div>
      <FormikError name={props.name} className="whitespace-nowrap absolute" />
    </div>
  );
};
