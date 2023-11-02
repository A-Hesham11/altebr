import { t } from "i18next"
import { tv } from "tailwind-variants"
import {ReactNode} from 'react'

type boxesDataBase_TP = {
  variant?: "primary" | "secondary"
  children: ReactNode
}

const boxesData = tv({
  base: "flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md",
  variants: {
    color: {
      primary: "bg-transparent",
      secondary: "bg-transparent",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      className: "bg-transparent",
    },

    {
      color: "secondary",
      className: "bg-transparent",
    },
  ],
  defaultVariants: {
    color: "primary",
  },
})
export const BoxesDataBase = ({ variant, children }: boxesDataBase_TP) => {
  return (
    <li
      className={boxesData({
        color: variant,
      })}
    >
      {children}
    </li>
  )
}