/////////// IMPORTS
///
//import classes from './Employees.module.css'
import { t } from "i18next"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/atoms"
import { AddIcon } from "../../components/atoms/icons"
import { EmployeeCard } from "../../components/templates/employee/EmployeeCard"
import { Supplier_TP } from "../../components/templates/systemEstablishment/supplier/supplier-types"
import { useFetch } from "../../hooks"
///
/////////// Types
///
type SupplierProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Suppliers = ({ title }: SupplierProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: employees, isSuccess } = useFetch<Supplier_TP[]>({
    endpoint: "employee/api/v1/employees",
    queryKey: ["employees"],
  })

  const navigate = useNavigate() 
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* SUCCESS & > 0 Employees */}
      
        <div className="flex justify-between mb-5" >
          <h2 className="font-bold text-2xl" >{t('employees data')}</h2>
        <Button
        action={() => navigate(`/add-supplier`)}
        className="flex items-center gap-2"
      >
        <AddIcon /> {t("add employee")}
      </Button>
        </div>
      <div className="grid grid-cols-2" >
      {isSuccess &&
        employees.length > 0 && <p>success</p>
      }
      </div>
      {/* SUCCESS & 0 Employees */}
      {isSuccess && employees.length === 0 && (
        <div>
          <p>لا يوجد موظفين</p>
          <Button
            action={() => navigate(`/add-employee`)}
            className="flex items-center gap-2"
          >
            <AddIcon /> {t("add-employee")}
          </Button>
        </div>
      )}

      {/* ERROR */}
      {/* {failureReason && <p>{failureReason}</p>} */}
    </>
  )
}
