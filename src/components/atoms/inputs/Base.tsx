import React, { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

type BaseInputVariants_TP = VariantProps<typeof baseInput>;

export interface BaseInputProps_TP
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  autocomplete?: string;
  error?: boolean;
  label?: string;
  ref?: any;
  icon?: React.ReactNode;
}

const GeneralInputClass: string = "form-input px-4 py-[.30rem] w-full shadows";

const baseInput = tv({
  base: `rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen`,
  variants: {
    error: {
      true: "border-mainRed",
    },
    type: {
      checkbox:
        "w-4 h-4 text-mainGreen border-gray-300 rounded focus:ring-mainGreen form-checkbox shadow-none",
      radio:
        "w-5 h-5 form-radio rounded-full focus:ring-mainGreen border-gray-300",
      text: GeneralInputClass,
      email: GeneralInputClass,
      password: GeneralInputClass,
      number: GeneralInputClass,
      date: GeneralInputClass,
      time: GeneralInputClass,
      datetime: GeneralInputClass,
      month: GeneralInputClass,
      week: GeneralInputClass,
      tel: GeneralInputClass,
      url: GeneralInputClass,
      search: GeneralInputClass,
      color: GeneralInputClass,
    },
  },
});

export const BaseInput = forwardRef(
  ({ error, ...props }: BaseInputProps_TP & BaseInputVariants_TP, ref: any) => {
    return (
      <>
        {props.label && <p className="mb-1">{props.label}</p>}
        <input
          {...props}
          type={props.type || "text"}
          name={props.name}
          id={props.id}
          {...(props.placeholder ? { placeholder: props.placeholder } : {})}
          disabled={props.disabled}
          className={baseInput({
            error: error,
            className: props.className,
            type: props.type || "text",
          })}
          autoComplete={props.autoComplete}
          value={props.value}
          ref={ref}
        />
      </>
    );
  }
);
