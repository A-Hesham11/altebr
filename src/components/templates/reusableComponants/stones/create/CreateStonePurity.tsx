///
/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useMutate } from "../../../../../hooks"
import { mutateData } from "../../../../../utils/mutateData"
import { notify } from "../../../../../utils/toast"
import { HandleBackErrors } from "../../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../../atoms"
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
} from "../../../../molecules"
import { StonesPurities } from "../view/ViewStonePurity"
import { StonePurityMainData } from "./StonePurityMainData"
import { SelectStoneyTypePurity } from "./StoneTypePurity"
import SelectStoneType from "../select/SelectStoneType"

///
/////////// Types
///
type CreateStonePurity_TP = {
  item?: StonesPurities
  value?: string
  onAdd?: (value: string) => void
  setDataSource?: Dispatch<SetStateAction<StonesPurities[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?: string
}

type InitialValues_TP = {
  name: string
  stone_id: string
}

const requiredTranslation = () => `${t("required")}`
const validationSchema = Yup.object({
  name: Yup.string().required(requiredTranslation),
  stone_id: Yup.string().required(requiredTranslation),
})

const CreateStonePurity = ({
  item,
  value = '',
  onAdd,
  setDataSource,
  setShow,
  title,
}: CreateStonePurity_TP) => {
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const initialValues: InitialValues_TP = {
    name: value!,
    stone_id: '',
  }
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  const { mutate, isLoading, error, isSuccess, reset } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data: any) => {
      notify("success")
      queryClient.setQueryData(["stone_purity"], (old: any) => {
        return [...old || [], data]
      })
      if (value && onAdd) {
        onAdd(value)
        queryClient.refetchQueries(["view_stones_purities"])
      }
      if (setDataSource && setShow) {
        // setDataSource((prev: StonesPurities[])=> [...prev, data])
        queryClient.refetchQueries(["view_stones_purities"])
        setShow(false)
      }
      if (setDataSource && setShow && item) {
        setShow(false)
        queryClient.refetchQueries(["view_stones_purities"])
        // setDataSource((prev: StonesPurities[]) =>
        //   prev.map((p: StonesPurities) => p.id === data.id ? data : p))
      }
    },
  })

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  function PostNewValue(values: InitialValues_TP) {
    mutate({
      endpointName: item
        ? `stones/api/v1/purities/${item.id}`
        : "stones/api/v1/purities",
      method: item ? "put" : "post",
      values,
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => PostNewValue(values)}
      validationSchema={validationSchema}
    >
      <Form className="col-span-2">
    <OuterFormLayout
      header={title}
      submitComponent={
        <Button loading={isLoading} type="submit" className="ms-auto mt-8">
          {t("submit")}
        </Button>
      }
    >
      <InnerFormLayout title={`${t("main data")}`}>
            <HandleBackErrors errors={error?.response?.data?.errors}>
              <div className="col-span-2 flex gap-x-4">
                <SelectStoneType
                  label={`${t("stones types")}`}
                  name="stone_id"
                  field="id"
                  value={item}
                />
                <BaseInputField
                  id="name"
                  label={`${t("stone purity")}`}
                  name="name"
                  type="text"
                  placeholder={`${t("stone purity")}`} 
                />
              </div>
            </HandleBackErrors>
      </InnerFormLayout>
    </OuterFormLayout>
          </Form>
        </Formik>
  )
}

export default CreateStonePurity
