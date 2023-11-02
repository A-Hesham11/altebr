/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useMutate } from "../../../../../hooks"
import { requiredTranslation } from "../../../../../utils/helpers"
import { mutateData } from "../../../../../utils/mutateData"
import { notify } from "../../../../../utils/toast"
import { HandleBackErrors } from "../../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../../atoms"
import { BaseInputField } from "../../../../molecules/formik-fields/BaseInputField"
import { ViewKarats_TP } from "../../../systemEstablishment/view/Viewkarats"
import { InnerFormLayout, OuterFormLayout } from "../../../../molecules"
import { KaratMainData } from "./KaratMainData"

///
/////////// Types
///
type CreateKaratProps_TP = {
  value?: string
  onAdd?: (value: string) => void
  editData?: ViewKarats_TP
  setDataSource?: Dispatch<SetStateAction<ViewKarats_TP[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?: string
}

type InitialValues_TP = {
  name: string
  equivalent: number
}

const karatsRateMax = () => `${t("karats rate max is 1")}`
const validationSchema = Yup.object({
  name: Yup.string().required(requiredTranslation),
  equivalent: Yup.number().min(0.1, requiredTranslation).max(1, karatsRateMax),
})

const CreateKarat = ({
  value = "",
  onAdd,
  editData,
  setDataSource,
  setShow,
  title,
}: CreateKaratProps_TP) => {
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const initialValues: InitialValues_TP = {
    name: editData ? editData.name : value!,
    equivalent: editData ? editData.equivalent : 0,
  }
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  const { mutate, isLoading, error, isSuccess, reset } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.refetchQueries(["AllKarats"])

      notify("success")

      if (value && onAdd) {
        onAdd(value)
        queryClient.setQueryData(["AllKarats"], (old: any) => {
          return [...(old || []), data]
        })
      }
      if (setDataSource && setShow && !editData && !error) {
        // setDataSource((prev: any) => [...prev, data])
        queryClient.refetchQueries(["AllKarats"])
        setShow(false)
      }
      if (setDataSource && setShow && editData && !error) {
        setShow(false)
        queryClient.refetchQueries(["AllKarats"])
        // setDataSource((prev: any) =>
        //   prev.map((p: ViewKarats_TP) => (p.id === data?.id ? data : p))
        // )
      }
    },
  })

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  function PostNewValue(values: InitialValues_TP) {
    mutate({
      endpointName: editData
        ? `classification/api/v1/karats/${editData.id}`
        : `classification/api/v1/karats`,
      values: {
        name: values.name,
        equivalent: values.equivalent,
        ...(editData && { _method: "put" }),
      },
      method: "post",
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
            <KaratMainData
              editData={editData}
              title={title}
              isLoading={isLoading}
              isSuccessPost={isSuccess}
              resetData={reset}
            />
          </HandleBackErrors>
        </Form>
      </Formik>
    </div>
  )
}

export default CreateKarat
