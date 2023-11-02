///
/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import * as Yup from "yup"
import { useIsRTL, useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../atoms"
import { BaseInputField } from "../../../molecules"
import { Dispatch, SetStateAction } from "react"
import { ViewColors_TP } from "../view/ViewColors"

///
/////////// Types
///
type ColorsProps_TP = {
  value?: string
  onAdd?: (value: string) => void
  editData?: ViewColors_TP
  setDataSource?: Dispatch<SetStateAction<ViewColors_TP[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?:string
}

type InitialValues_TP = {
  [x: string]: string
}

///
/////////// HELPER VARIABLES & FUNCTIONS
///

const requiredTranslation = () => `${t("required")}`
const validatingSchema = Yup.object({
  name_en: Yup.string().trim().required(requiredTranslation),
  name_ar: Yup.string().trim().required(requiredTranslation),
})

const StonesColors = ({
  value,
  onAdd,
  editData,
  setDataSource,
  setShow,
  title,
}: ColorsProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()

  const isRTL = useIsRTL()

  const initialValues: InitialValues_TP = {
    name_ar: editData ? editData.name : !isRTL ? value! : "",
    name_en: editData ? "" : !isRTL ? value! : "",
  }

  const {
    mutate,
    isLoading,
    error: errorQuery,
  } = useMutate<ViewColors_TP>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success")
      queryClient.setQueryData(["colors"], (old: any) => {
        return [...(old || []), { name: data?.name }]
      })
      if (value && onAdd) {
        onAdd(value)
      }
      if (setDataSource && setShow && !editData && !errorQuery) {
        setDataSource((prev: any) => [...prev, data])
        setShow(false)
      }
      if (setDataSource && setShow && editData && !errorQuery) {
        setShow(false)
        setDataSource((prev: any) =>
          prev.map((p: ViewColors_TP) => (p.id === data?.id ? data : p))
        )
      }
    },
    onError: (error) => {
      console.log(error)
      notify("error")
    },
  })
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const PostNewValue = (values: InitialValues_TP) => {
    mutate({
      endpointName: editData
        ? `/stones/api/v1/colors/${editData.id}`
        : `/stones/api/v1/colors`,
      values: {
        name_en: values.name_en,
        name_ar: values.name_ar,
        ...(editData && { _method: "put" }),
      },
      method: "post",
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => PostNewValue(values)}
      validationSchema={validatingSchema}
    >
      <Form>
        <HandleBackErrors errors={errorQuery?.response.data.errors}>
          <div className="flex flex-col">
            {/* <h2 className="text-xl font-bold mb-4">{t("stones colors")}</h2> */}
            <div className="grid grid-cols-4 mb-4 gap-3 text-start">
              <BaseInputField
                id="stones_colors_ar"
                label={`${t("name colors in arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("name colors in arabic")}`}
                defaultValue={editData ? editData.name : ""}
              />
              <BaseInputField
                id="stones_colors_en"
                label={`${t("name colors in english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("name colors in english")}`}
              />
            </div>
            <Button type="submit" className="self-end" loading={isLoading}>
              {t("add")}
            </Button>
          </div>
        </HandleBackErrors>
      </Form>
    </Formik>
  )
}

export default StonesColors
