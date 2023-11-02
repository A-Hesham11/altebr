/////////// IMPORTS
///
//import classes from './ViewSvg.module.css'
///
/////////// Types
///
type ViewSvg_TP = {
  stroke: string
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const ViewSvg = ({ stroke }: ViewSvg_TP) => {
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
    <>
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1985_10605)">
          <path
            d="M6.00065 14.6666H10.0007C13.334 14.6666 14.6673 13.3333 14.6673 9.99992V5.99992C14.6673 2.66659 13.334 1.33325 10.0007 1.33325H6.00065C2.66732 1.33325 1.33398 2.66659 1.33398 5.99992V9.99992C1.33398 13.3333 2.66732 14.6666 6.00065 14.6666Z"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.7793 12.6333L5.06596 10.4267C5.59263 10.0733 6.35263 10.1133 6.82596 10.52L7.04596 10.7133C7.56596 11.16 8.40596 11.16 8.92596 10.7133L11.6993 8.33333C12.2193 7.88667 13.0593 7.88667 13.5793 8.33333L14.666 9.26667M5.9993 6.66667C6.35292 6.66667 6.69206 6.52619 6.94211 6.27614C7.19215 6.02609 7.33263 5.68696 7.33263 5.33333C7.33263 4.97971 7.19215 4.64057 6.94211 4.39052C6.69206 4.14048 6.35292 4 5.9993 4C5.64567 4 5.30654 4.14048 5.05649 4.39052C4.80644 4.64057 4.66596 4.97971 4.66596 5.33333C4.66596 5.68696 4.80644 6.02609 5.05649 6.27614C5.30654 6.52619 5.64567 6.66667 5.9993 6.66667Z"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1985_10605">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}
