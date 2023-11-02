import { ReactNode } from "react"
import { tv } from "tailwind-variants"

const tooltipClasses = tv({
  slots: {
    group: "group relative flex justify-center",
    tooltip: "absolute rounded invisible  group-hover:visible mb-2",
  },
  variants: {
    position: {
      top: {
        tooltip: "bottom-full",
      },
      bottom: {
        tooltip: "top-full",
      },
    }, 
  },
})

export const Tooltip = ({
  children,
  position = "top",
  content,
}: {
  children: ReactNode
  position?: "top" | "bottom"
  content: ReactNode
}) => {
  const { group, tooltip } = tooltipClasses({ position })
  return (
    <div className={group()}>
      {children}
      <div className={tooltip()}>{content}</div>
    </div>
  )
}
