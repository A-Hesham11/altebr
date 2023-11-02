/////////// IMPORTS
///
import { t } from "i18next"
import { Select } from "../../../molecules"
import { AiOutlineReload } from "react-icons/ai"
import { useFetch } from "../../../../hooks"
import { SelectOption_TP } from "../../../../types"
import { AddAdministrativeStructure } from "../../../../pages/administrativeStructure/AddAdministrativeStructure"
import { useFormikContext } from "formik"
///
/////////// Types
type SelectRoleProps_TP = {
  name: string
  label?: string
  field?: "id" | "value"
  stateValue?: any
  required?:any
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectRole = ({ name, field, required }: SelectRoleProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { values, setFieldValue } = useFormikContext()
  // get job title
  const {
    data: jobTitlesOptions,
    isLoading: jobTitlesLoading,
    refetch: refetchJobTitles,
    failureReason: jobTitlesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "/administrative/api/v1/roles?per_page=10000",
    queryKey: ["allRoles"],
    select: (jobTitles) =>
      jobTitles.map((jobTitle: any) => ({
        id: jobTitle.id,
        value: jobTitle.name,
        label: jobTitle.name,
      })),
  })

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <div className="flex flex-col">
      <Select
        id="role_id"
        label={`${t("job title")}`}
        name={name}
        placeholder={`${t("job title")}`}
        loadingPlaceholder={`${t("loading")}`}
        options={jobTitlesOptions}
        fieldKey={field || "id"}
        loading={jobTitlesLoading}
        required={required}
        creatable
        //@ts-ignore
        CreateComponent={AddAdministrativeStructure}
        isDisabled={!jobTitlesLoading && !!jobTitlesErrorReason}
        {...{
          ...(values?.role_value && {
            value: {
              value: values?.role_value || "",
              label: values?.role_value || "",
            },
          }),
        }}
        onChange={(option) => {
          setFieldValue("role_value", option!.value)
        }}
      />
      {jobTitlesErrorReason && (
        <div className="flex gap-x-2 items-center">
          {!jobTitlesLoading && (
            <span className="text-mainRed">حدث خطأ أثناء جلب الباتات </span>
          )}
          {!jobTitlesLoading && (
            <AiOutlineReload
              onClick={() => refetchJobTitles()}
              className="cursor-pointer hover:animate-spin font-bold  text-xl text-mainGreen "
              title="إعادة التحميل"
            />
          )}
        </div>
      )}
    </div>
  )
}
