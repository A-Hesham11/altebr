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

const StonesQualities = ({ value, onAdd }: shapeProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL()

  const initialValues: InitialValues_TP = {
    name_ar: isRTL ? value : "",
    name_en: !isRTL ? value : "",
  }

  const queryClient = useQueryClient()


  type QualityType = {
    name: string
  }

  const {
    mutate,
    error: errorQuery,
    isLoading,
  } = useMutate<QualityType>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData(["stones Quality"], (old: any) => {
        return [...(old || []), { name: data?.name }]
      })
      notify("success")
      onAdd(value)
    },
    onError: (error) => {
      notify("error")
    },
  })

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const postValue = (values: InitialValues_TP) => {
    mutate({
      endpointName: "/stones/api/v1/qualities",
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
      },
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => postValue(values)}
      validationSchema={validatingSchema}
    >
      <Form>
        <HandleBackErrors >
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">{t("stones qualities")}</h2>
            <div className="grid grid-cols-4 mb-4 gap-3 text-start">
              <BaseInputField
                id="stone_quality_ar"
                label={`${t("stones qualities in arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("stones qualities in arabic")}`}
              />
              <BaseInputField
                id="stone_quality_en"
                label={`${t("stones qualities in english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("stones qualities in english")}`}
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

export default StonesQualities
