import { useState } from "react"

type State = Record<string, any>

const useObject = (initialState: State = {}) => {
  const [state, setState] = useState(initialState)

  const setObject = (key: string, value: any) => {
    setState((prevState) => ({ ...prevState, [key]: value }))
  }

  const removeObject = (key: string) => {
    const { [key]: omitted, ...rest } = state
    setState(rest)
  }

  return [state, setObject, removeObject]
}

export default useObject
