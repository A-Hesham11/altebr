/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useIsRTL, useMutate } from "../../../../../hooks"
import { mutateData } from "../../../../../utils/mutateData"
import { notify } from "../../../../../utils/toast"
import { HandleBackErrors } from "../../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../../atoms"
import { BaseInputField } from "../../../../molecules/formik-fields/BaseInputField"
import { StonesTypes } from "../view/ViewStoneType"
import { InnerFormLayout, OuterFormLayout } from "../../../../molecules"
import { StoneTypeMainData } from "./StoneTypeMainData"

///
/////////// Types
///
type CreateStoneTypeProps_TP = {
  item?: StonesTypes
  value?: string
  onAdd?: (value: string) => void
  setDataSource?: Dispatch<SetStateAction<StonesTypes[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?:string
}

type InitialValues_TP = {
  [x: string]: string
}

const requiredTranslation = () => `${t("required")}`
const validationSchema = Yup.object({
  name_en: Yup.string()
    .trim()
    .required(requiredTranslation),
  name_ar: Yup.string()
    .trim()
    .required(requiredTranslation)
})

const CreateStoneType = ({
  item,
  value = "",
  onAdd,
  setDataSource,
  setShow,
  title
}: CreateStoneTypeProps_TP) => {
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const isRTL = useIsRTL()
  const initialValues: InitialValues_TP = {
    name_en: item ? item.name_en: !isRTL ? value! : "",
    name_ar: item ? item.name_ar: isRTL ? value! : "",
  }
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  const { mutate, isLoading, error, isSuccess,reset } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data: any) => {
      notify("success")
      queryClient.setQueryData(["stone_type"], (old: any) => {
        return [...old || [], data]
      })
      if (value && onAdd) {
        onAdd(value)
        queryClient.refetchQueries(["view_stones_types"])
      }
      if (setDataSource && setShow) {
        // setDataSource((prev: any)=> [...prev, data])
        queryClient.refetchQueries(["view_stones_types"])
        setShow(false)
      }
      if (setDataSource && setShow && item) {
        setShow(false)
        queryClient.refetchQueries(["view_stones_types"])
        // setDataSource((prev: StonesTypes[]) =>
        //   prev.map((p: StonesTypes) => p.id === data.id ? data : p))
      }
    },
  })

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  function PostNewValue(values: InitialValues_TP) {
    mutate({
      endpointName: item ? `stones/api/v1/stones/${item.id}` : 'stones/api/v1/stones',
      method: item ? "put" : "post",
      values,
    })
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => PostNewValue(values)}
        validationSchema={validationSchema}
      >
        <Form className="w-full">
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <StoneTypeMainData
              editData={item}
              title={title}
              isSuccessPost={isSuccess}
              resetData={reset}
              isLoading={isLoading}
            />
          </HandleBackErrors>
        </Form>
      </Formik>
    </div>
  )
}

export default CreateStoneType