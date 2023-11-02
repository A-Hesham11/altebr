/////////// IMPORTS
///
//import classes from './Home.module.css'
import { useContext } from "react";
import * as Yup from "yup";
import { authCtx } from "../../context/auth-and-perm/auth";
import SellingHome from "../selling/SellingHome";
import { DashboardData } from "./DashboardData";

///
/////////// Types
///
type HomeProps_TP = {
  title: string;
};

/////////// HELPER VARIABLES & FUNCTIONS
///
const validatingSchema = Yup.object({
  category_id: Yup.string().trim().required(),
  size_type: Yup.string()
    .trim()
    .when("sizeIsRequired", {
      is: (val: boolean) => val === true,
      then: (schema) => schema.required(),
    }),
  size_unit_id: Yup.string()
    .trim()
    .when("sizeIsRequired", {
      is: (val: boolean) => val === true,
      then: (schema) => schema.required(),
    }),
});
///
export const Home = () => {
  /////////// VARIABLES
  ///
  const initValues = {
    category_id: "",
    size_type: "",
    size_unit_id: "",
  };

  ///
  /////////// CUSTOM HOOKS
  ///
  const { isLoggedIn, isLoadingUpdatedUserData, userData } = useContext(authCtx)
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///
  ///
  /////////// EVENTS
  ///

  ///
  /////////// FUNCTIONS
  ///

  ///
  return (
    <>
      {
        (isLoggedIn && !isLoadingUpdatedUserData && userData?.branch_id != '1') ?
            <SellingHome />
          :
          <DashboardData />
      }
    </>
  );
};

{/* <h2 className="bg-mainGreen text-white">{t('gold')}</h2> */ }

{/* <SellingHome/> */ }
