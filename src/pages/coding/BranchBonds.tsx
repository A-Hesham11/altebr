/////////// IMPORTS
///
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
///
/////////// Types
///
type BranchBondsProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const BranchBonds = ({ title }: BranchBondsProps_TP) => {
  const link = useRef(null);
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
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    link.current.click();
  }, []);
  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <a
        href="https://api-almehaisen.altebr.jewelry/identity/admin/thwelbonds"
        ref={link}
      ></a>
    </>
  );
};
