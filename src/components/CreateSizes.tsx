/////////// IMPORTS
///
//import classes from './CreateSizes.module.css'
///
/////////// Types
///

import { SelectCategorySize } from "./templates/categories-sizes/SelectCategorySize"
import { SizesForm } from "./templates/systemEstablishment/sizeses/SizesForm"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const CreateSizes = ({editData, setModel , title}:any)=>{
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
  <SizesForm
    showCategories={false}
    title={title}
    editData={editData}
    setModel={setModel}
  />
)
}