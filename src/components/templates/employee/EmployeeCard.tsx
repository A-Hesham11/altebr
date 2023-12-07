/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { t } from "i18next"
import { Dispatch, SetStateAction, useState } from "react"
import { useNavigate } from "react-router-dom"
import blankPerson from "../../../assets/blank-person-image.png"
import { useMutate } from "../../../hooks"
import { Employee_TP } from "../../../pages/employees/employees-types"
import { mutateData } from "../../../utils/mutateData"
import { notify } from "../../../utils/toast"
import { Button } from "../../atoms"
import { DeleteIcon, EditIcon, ViewIcon } from "../../atoms/icons"
import { Modal } from "../../molecules"
import { AddEmployee } from "./AddEmployee"
import { InitialValues_TP } from "./validation-and-types"


///
/////////// Types
///
interface EmployeeCardProps_TP
  extends Pick<Employee_TP, "id" | "name" | "img"> {
    setEditEmployeeData:Dispatch<SetStateAction<InitialValues_TP | undefined>>
    rest:any
    editEmployeeData:InitialValues_TP | undefined
  }
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const EmployeeCard = ({ id, img, name , setEditEmployeeData , rest , editEmployeeData }: EmployeeCardProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const {
      mutate,
      error: errorQuery,
      isLoading: deleteLoading
  } = useMutate({
      mutationFn: mutateData,
      onSuccess: (data) => {
        queryClient.setQueriesData(['employees'], (old:any)=>{
          return old.filter((item:any)=> id !== item.id)
         })
         notify('success',`${t('deleted successfully')}`)
      },
      onError:(error) => {
          notify("error")
      }
  })

  ///
  /////////// STATES
  ///
  const [open, setOpen] = useState<boolean>(false)

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const deleteHandler = (id:string)=>{
    mutate({
      endpointName: `employee/api/v1/employees/${id}`,
      method:"delete"
  })
  }
  ///
  return (
    <div className="col-span-1 shadow-md shadow-slate-400 px-9 py-5 rounded-lg m-5">
      {/* Employee img */}
      <div className=" w-32  bg-gray-100 mx-auto mb-10 p-2 rounded-md">
        <img
          src={img || blankPerson}
          alt={`employee: ${name}`}
          className="  object-cover rounded-md w-full"
        />
      </div>
      {/* Employee name */}
      <h2 className="text-center mb-5 font-bold text-2xl">{name}</h2>
      {/* Employee actions */}
      <div className="flex items-center justify-center">
        <Button
          action={() => navigate(`${id}`)}
          className="flex items-center mx-1"
        >
          <ViewIcon />
          {/* عرض */}
        </Button>
        <Button
          bordered
          className="flex items-center mx-1"
          action={() => {
            setEditEmployeeData({
              ...rest,
              img,
              id,
              name,
            })
            setOpen(true)
          }}
        >
          <EditIcon />
          {/* تعديل */}
        </Button>
        <Button
          variant="danger"
          className="flex items-center mx-1"
          action={() => deleteHandler(id)}
          loading={deleteLoading}
        >
          <DeleteIcon />
          {/* حذف */}
        </Button>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <AddEmployee
          title={`${
            editEmployeeData ? t("edit employee") : t("add employee")
          }`}
          editEmployeeData={editEmployeeData}
        />
      </Modal>
    </div>
  )
}
