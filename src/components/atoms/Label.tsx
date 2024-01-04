// import { ReactNode } from "react"

// const BASE_CLASS_NAME = "text-[13px]"

// const Colors = {
//   primary: "text-mainGreen",
//   secondary: "text-mainBlack",
//   white: "text-white",
//   red: "text-mainRed",
// }
// type Colors_TP = keyof typeof Colors

// type LabelProps_TP = {
//   label: string | ReactNode
//   htmlFor: string
//   color?: Colors_TP
//   className?: string
//   size?: "sm" | "md" | "lg"
// }

// export const Label = ({
//   htmlFor,
//   color = "secondary",
//   className,
//   label,
//   size = "md",
// }: LabelProps_TP) => {
//   const colorClass = Colors[color as Colors_TP]
//   var newClassName = `${BASE_CLASS_NAME} ${colorClass}`
//   newClassName = className ? `${newClassName} ${className}` : newClassName
//   newClassName = size === "sm" ? `${newClassName} text-[11px]` : newClassName
//   newClassName = size === "lg" ? `${newClassName} text-[15px]` : newClassName

//   return (
//     <label htmlFor={htmlFor} className={newClassName}>
//       {label}
//     </label>
//   )
// }
import { ReactNode } from "react"
import { tv } from "tailwind-variants"

const label = tv({
  base: "inline-block",
  variants: {
    color: {
      primary: "text-mainBlack",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
    },
    required: {
      // true: 'after:content-["*"] after:text-mainRed after:me-1',
    },
  },
  defaultVariants: {
    color: "primary",
    // size: "md",
  },
})

export interface LabelProps_TP extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  children: ReactNode | string
  htmlFor: string
  size?: "xs" | "sm" | "md" | "lg"
  required?: boolean
  requiredAstrict?: boolean
}

export const Label = ({
  htmlFor,
  className,
  children,
  size = "xs",
  required = false,
  requiredAstrict,
}: LabelProps_TP) => {
  return (
    <label
      className={label({
        className,
        size,
        required,
        
      })}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
