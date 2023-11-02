/////////// IMPORTS
///
///
/////////// Types
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import { Permission_TP } from "../../../context/auth-and-perm/auth-permissions-types"
import { PermissionGroup_TP } from "../../../pages/administrativeStructure/types-and-schemas"
import { BaseInputField, InnerFormLayout } from "../../molecules"
import { PermissionGroup } from "./PermissionGroup"

/////////// HELPER VARIABLES & FUNCTIONS
///
type PermissionProps_TP = {
  permissions: PermissionGroup_TP[]
  editData?: PermissionGroup_TP | undefined
}
///
export const PermissionForm = ({
  permissions,
  editData,
}: PermissionProps_TP) => {
  /////////// VARIABLES
  ///
  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, values } = useFormikContext()
  ///
  /////////// STATES
  ///
  const checkedStatus = !!!Object.entries(values).find(([key, value]) => (key !== 'name' && (value === false || value === '')))?.length

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (!!editData) {
     editData?.permissions.forEach((permission) => {
       setFieldValue(permission.id, true)
     })
   }
   }, [])

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <InnerFormLayout>
      <div className="flex items-center relative top-[104px]" >
        <input type="checkbox" id='check_all' checked={checkedStatus}  onChange={(e) => {
          Object.keys(values).map(value => {
            if (value !== 'name')
              setFieldValue(value, e.target.checked)
          }
          )
        }} className="ml-2 text-mainGreen rounded"/>
        <label htmlFor="check_all" className="text-md">{t('select all')}</label>
      </div>
      <div className="col-span-2 mx-auto">
        <BaseInputField
          placeholder="مدير"
          type="text"
          id="name"
          label="الإسم"
          name="name"
        />
      </div>

      <div className="flex flex-col gap-1 col-span-4">
        <h4 className="flex items-center justify-center text-2xl underline  underline-offset-2 decoration-1 mb-5">
          الصلاحيات
        </h4>

        <div className=" flex flex-col justify-center items-start gap-8">
          {permissions.map(
            ({
              id,
              name,
              permissions,
            }: {
              id: string
              name: string
              permissions: Permission_TP[]
            }) => (
              <PermissionGroup
                key={crypto.randomUUID()}
                name={name}
                permissions={permissions}
                editData={editData}
              />
            )
          )}
        </div>
      </div>
    </InnerFormLayout>
  )
}
