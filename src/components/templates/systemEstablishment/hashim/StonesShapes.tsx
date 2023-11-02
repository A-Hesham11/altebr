///
/////////// IMPORTS
///
import { Form, Formik } from "formik"
import { t } from "i18next"
import * as Yup from "yup"
import { Button } from "../../../atoms"
import { BaseInputField } from "../../../molecules"
import { useIsRTL, useMutate } from "../../../../hooks"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { QueryClient, useQueryClient } from "@tanstack/react-query"

///
/////////// Types
///
type shapeProps_TP = {
  value: string
  onAdd: (value: string) => void
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

const StonesShapes = ({ value, onAdd }: shapeProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
    const isRTL = useIsRTL()

    const initialValues: InitialValues_TP = {
      name_ar: isRTL ? value : "",
      name_en: !isRTL ? value : "",
    }
  const queryClient = useQueryClient()
  type shapeType = {
    name: string
    id: string
  }
  const {
    mutate,
    isLoading,
    error: errorQuery,
  } = useMutate<shapeType>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData(["shape"], (old: any) => {
        return [...(old || []), { name: data?.name }]
      })
      notify("success")
      onAdd(value)
    },
    onError: () => {
      notify("error")
    },
  })

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const add = (values: InitialValues_TP) => {
    mutate({
      endpointName: "/stones/api/v1/shapes",
      values: {
        name_en: values.name_en,
        name_ar: values.name_ar,
      },
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => add(values)}
      validationSchema={validatingSchema}
    >
      <Form>
        <HandleBackErrors errors={errorQuery?.response.data.data}>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">{t("stones shapes")}</h2>
            <div className="grid grid-cols-4 mb-4 gap-3 text-start">
              <BaseInputField
                id="stone_shape_ar"
                label={`${t("stones shapes in arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("stones shapes in arabic")}`}
              />
              <BaseInputField
                id="stone_shape_en"
                label={`${t("stones shapes in english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("stones shapes in english")}`}
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

export default StonesShapes
