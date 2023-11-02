/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { requiredTranslation } from "../partners/validation-and-types-partner"
import { ViewKarats_TP } from "../view/Viewkarats"
import { MineralsMainData } from "./MineralsMainData"

///
/////////// Types
///

type InitialValues_TP = {
  name_ar: string
  name_en: string
}
type AddMineralsProps_TP = {
  value?: string
  onAdd?: (value: string) => void
  editData?: InitialValues_TP
  setDataSource?: Dispatch<SetStateAction<ViewKarats_TP[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?: string
}


const validationSchema = Yup.object({
  name_ar: Yup.string().required(requiredTranslation),
  name_en: Yup.string().required(requiredTranslation),
  // equivalent: Yup.number().min(0.1, requiredTranslation).max(1, karatsRateMax),
})

const AddMinerals = ({
  value = "",
  onAdd,
  editData,
  setDataSource,
  setShow,
  title,
}: AddMineralsProps_TP) => {
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const initialValues: InitialValues_TP = {
    name_ar: editData ? editData.name_ar : value!,
    name_en: editData ? editData.name_en : value!,
  }
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  const { mutate, isLoading, error, isSuccess, reset } = useMutate({
    mutationKey:['minerals'],
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.refetchQueries(["minerals"])

      notify("success")

      if (value && onAdd) {
        onAdd(value)
        queryClient.setQueryData(["minerals"], (old: any) => {
          return [...(old || []), data]
        })
      }
      if (setDataSource && setShow && !editData && !error) {
        // setDataSource((prev: any) => [...prev, data])
        queryClient.refetchQueries(["minerals"])
        setShow(false)
      }
      if (setDataSource && setShow && editData && !error) {
        setShow(false)
        queryClient.refetchQueries(["minerals"])
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
    console.log(values)
    mutate({
      endpointName: editData
        ? `classification/api/v1/minerals/${editData.id}`
        : `classification/api/v1/minerals`,
      values: {
        ...values,
        ...(editData && { _method: "put" }),
      },
      // method: "post",
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
            <MineralsMainData
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

export default AddMinerals
