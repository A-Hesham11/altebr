/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { requiredTranslation } from "../partners/validation-and-types-partner"
import { ViewKarats_TP } from "../view/Viewkarats"
import { MineralsKaratsMainData } from "./MineralsKaratsMainData"

///
/////////// Types
///
type AddMineralsKaratsProps_TP = {
  value?: string
  onAdd?: (value: string) => void
  editData?: ViewKarats_TP
  setDataSource?: Dispatch<SetStateAction<ViewKarats_TP[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?: string
}

type InitialValues_TP = {
  name: string
  mineral_id: string
  equivalent: string|number
}

const karatsRateMax = () => `${t("karats rate max is 1")}`
const validationSchema = Yup.object({
  mineral_id: Yup.string().required(requiredTranslation),
  name: Yup.string().required(requiredTranslation),
})

const AddMineralsKarats = ({
  value = "",
  onAdd,
  editData,
  setDataSource,
  setShow,
  title,
}: AddMineralsKaratsProps_TP) => {
  console.log("🚀 ~ file: AddMaineralsKarat.tsx:48 ~ editData:", editData)
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const initialValues: InitialValues_TP = {
    mineral_id: editData ? editData.id : value!,
    name: editData ? editData.karatmineral : value!,
    equivalent: editData ? editData.value : "1",
  }
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  const { mutate, isLoading, error, isSuccess, reset } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.refetchQueries(["karatminerals"])

      notify("success")

      if (value && onAdd) {
        onAdd(value)
        queryClient.setQueryData(["karatminerals"], (old: any) => {
          return [...(old || []), data]
        })
      }
      if (setDataSource && setShow && !editData && !error) {
        // setDataSource((prev: any) => [...prev, data])
        queryClient.refetchQueries(["karatminerals"])
        setShow(false)
      }
      if (setDataSource && setShow && editData && !error) {
        setShow(false)
        queryClient.refetchQueries(["karatminerals"])
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
        ? `classification/api/v1/karatminerals/${editData.id}`
        : `classification/api/v1/karatminerals`,
      values: {
       ...values,
        ...(editData && { _method: "put" }),
      },
    })
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("values",values)
          PostNewValue(values)
        } }
        validationSchema={validationSchema}
      >
        <Form className="w-full">
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <MineralsKaratsMainData
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

export default AddMineralsKarats
