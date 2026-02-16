/////////// IMPORTS
///
import { Helmet } from "react-helmet-async";
import { LoginSecurityForm } from "@/components/templates/LoginSecurityForm";
///
/////////// Types
///
type LoginProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Auth = ({ title }: LoginProps_TP) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <LoginSecurityForm />
    </>
  );
};
