import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { tv, type VariantProps } from "tailwind-variants"

const linkButton = tv({
  base: "border-transparent bg-transparent underline py-2",
  variants: {
    color: {
      primary: "text-blue-600",
      danger: "text-mainRed",
    },
    disabled: {
      true: "text-gray-200 active:top-0 cursor-not-allowed",
    },
  },
})

type LinkButtonVariants_TP = VariantProps<typeof linkButton>

export const LinkButton = ({
  children,
  className,
  disabled,
  color = "primary",
  to,
  ...props
}: LinkButtonVariants_TP & {
  children: ReactNode
  className?: string
  disabled?: boolean
  to: string
}) => {
  return (
    <Link
      to={to}
      className={linkButton({
        color,
        disabled,
      })}
      {...props}
    >
      {children}
    </Link>
  )
}
