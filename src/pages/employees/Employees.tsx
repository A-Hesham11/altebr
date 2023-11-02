/////////// IMPORTS
///
//import classes from './Employees.module.css'
import { t } from "i18next"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/atoms"
import { AddIcon } from "../../components/atoms/icons"
import { Modal } from "../../components/molecules"
import { Loading } from "../../components/organisms/Loading"
import { AddEmployee } from "../../components/templates/employee/AddEmployee"
import { EmployeeCard } from "../../components/templates/employee/EmployeeCard"
import { InitialValues_TP } from "../../components/templates/employee/validation-and-types"
import { useFetch } from "../../hooks"
import { Employee_TP } from "./employees-types"
///
/////////// Types
///
type EmployeesProps_TP = {
  title: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Employees = ({ title }: EmployeesProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: employees, isSuccess, isLoading: employeesLoading } = useFetch<Employee_TP[]>({
    endpoint: "employee/api/v1/employees",
    queryKey: ["employees"],
  })

  const navigate = useNavigate()
  ///
  /////////// STATES
  ///
  const [editEmployeeData, setEditEmployeeData] = useState<InitialValues_TP>()
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  if (employeesLoading) return (
    <Loading
      mainTitle={`${t("employees")}`}
      subTitle={`${t("employees data loading")}`}
    />
  )


  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* SUCCESS & > 0 Employees */}

      <div className="flex justify-between mb-5">
        <h2 className="font-bold text-2xl">{t("employees data")}</h2>
        <Button
          action={() => navigate(-1)}
          className="flex items-center gap-2"
          bordered
        >
          {t("back")}
        </Button>
      </div>
      <div className="grid grid-cols-3">
        {isSuccess &&
          employees.length > 0 &&
          employees.map(({ id, name, image, ...rest }) => (
            <EmployeeCard
              id={id}
              name={name}
              img={image}
              key={id}
              rest={rest}
              setEditEmployeeData={setEditEmployeeData}
              editEmployeeData={editEmployeeData}
            />
          ))}
      </div>
      {/* SUCCESS & 0 Employees */}
      {isSuccess && employees.length === 0 && (
        <h2 className="font-bold text-2xl text-center mt-16">
          {" "}
          {t("There ara no employees")}{" "}
        </h2>
      )}

      {/* ERROR */}
      {/* {failureReason && <p>{failureReason}</p>} */}
    </>
  )
}
