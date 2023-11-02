/////////// IMPORTS
///

///
/////////// Types
///
type TextLineProps_TP = {
  containerClasses?: string
  boldText: string
  lightString: string | undefined
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const TextLine = ({
  containerClasses,
  lightString,
  boldText,
}: TextLineProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <div className={`${containerClasses} flex w-[17rem]`}>
      <span className="font-bold inline-block me-2">{`${boldText} :`}</span>
      <span>{lightString}</span>
    </div>
  )
}
