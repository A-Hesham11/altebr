/////////// IMPORTS
///

import { useNavigate, useNavigation } from "react-router-dom";
import { Button } from "../../components/atoms";
import { t } from "i18next";

///
/////////// Types
///
type BackProps_TP = {
  path?: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Back = ({ path, className }: BackProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const navigate = useNavigate();
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
    <Button
      className={`transition-all duration-500 hover:-translate-y-1 ${className}`}
      action={() => (path ? navigate(path) : navigate(-1))}
      bordered
    >
      {t("back")}
    </Button>
  );
};
