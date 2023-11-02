/////////// IMPORTS
///
//import classes from './PDFSvg.module.css'
///
/////////// Types
///
type PDFSvg_TP = {
  stroke: string
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const PDFSvg = ({ stroke }: PDFSvg_TP) => {
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

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
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
        <g clipPath="url(#clip0_2030_9944)">
          <path
            d="M14.6673 6.66658V9.99992C14.6673 13.3333 13.334 14.6666 10.0007 14.6666H6.00065C2.66732 14.6666 1.33398 13.3333 1.33398 9.99992V5.99992C1.33398 2.66659 2.66732 1.33325 6.00065 1.33325H9.33398"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.66602 8.66659H8.66602M4.66602 11.3333H7.33268M14.666 6.66659H11.9993C9.99935 6.66659 9.33268 5.99992 9.33268 3.99992V1.33325L14.666 6.66659Z"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2030_9944">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}
