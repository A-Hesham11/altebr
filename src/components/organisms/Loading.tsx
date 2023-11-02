/////////// IMPORTS
///
import { t } from "i18next"
import { Spinner } from "../atoms"
///
/////////// Types
///
type LoadingProps_TP = {
  mainTitle: string
  subTitle?: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Loading = ({
  mainTitle,
  subTitle = t("loading").toString(),
}: LoadingProps_TP) => {
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
    <div className="m-auto my-28 flex h-full w-full items-center justify-center">
      <div className="h-ful relative flex w-full max-w-sm  flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700">
        <h5 className=" mt-8 mb-2 text-2xl font-bold tracking-tight text-gray-900 opacity-50 dark:text-white">
          {mainTitle}
        </h5>
        <p className="font-normal text-mainGreen">{subTitle}</p>
        <div
          role="status"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Spinner size="large" />
        </div>
      </div>
    </div>
  )
}
