import { tv } from "tailwind-variants"
import { View } from "../atoms/icons/View"

const showButton = tv({
  base: "w-full cursor-pointer border border-lightBlack  flex items-center justify-center gap-2 relative text-lightBlack  active:top-[1px] py-2 px-8 font-bold rounded-md  bg-opacity-20 ",
  variants: {
    color: {
      primary: "bg-mainOrange",
      secondary: "bg-green ",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      className: "bg-mainOrange",
    },

    {
      color: "secondary",
      className: "bg-green text-mainGreen",
    },
  ],
  defaultVariants: {
    color: "primary",
  },
})

type ShowButton_TP = {
  viewLabel: string
  action: () => void
  variant?: "primary" | "secondary"
}

export const ShowButton = ({ viewLabel, variant, action }: ShowButton_TP) => {
  return (
    <div
      className={showButton({
        color: variant,
      })}
      onClick={action}
    >
      <View />
      <p className=" text-sm ">{viewLabel}</p>
    </div>
  )
}
