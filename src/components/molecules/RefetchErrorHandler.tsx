/////////// IMPORTS
///
//import classes from './RefetchErrorHandler.module.css'
///
/////////// Types

import { AiOutlineReload } from "react-icons/ai";
import { CError_TP } from "../../types";
import { t } from "i18next";

///
type RefetchErrorHandlerPrp_TP = {
  failureReason: CError_TP | null;
  isLoading: boolean;
  refetch: () => void;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const RefetchErrorHandler = ({
  failureReason,
  isLoading,
  refetch,
}: RefetchErrorHandlerPrp_TP) => {
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
      {failureReason && (
        <div className="flex  justify-between items-center">
          {!isLoading && (
            <span className="text-mainRed">{t("An error occurred while fetching data")}</span>
          )}
          {!isLoading && (
            <AiOutlineReload
              onClick={() => refetch()}
              className="cursor-pointer hover:animate-spin font-bold  text-xl text-mainGreen "
              title="إعادة التحميل"
            />
          )}
        </div>
      )}
    </>
  );
};
