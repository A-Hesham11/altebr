import { BaseInput } from "./Base"
type Props_TP = {
  [key: string]: any
}
export const PasswordInput = ({ id, ...props }: { id: string } & Props_TP) => {
  return (
    <BaseInput
      id={id}
      {...{
        ...props,
        type: "password",
      }}
    />
  )
}
