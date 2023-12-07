/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik, FormikSharedConfig, useFormikContext } from "formik"
import { t } from "i18next"
import { useState } from "react"
import * as Yup from "yup"
import { Button } from "./atoms"
import { BaseInputField, Select } from "./molecules"
import { notify } from "../utils/toast"
import { useIsRTL, useMutate } from "../hooks"
import { mutateData } from "../utils/mutateData"
import { SelectOption_TP } from "../types"
import { AiOutlineReload } from "react-icons/ai"
///
/////////// Types
///
type CreateCity_TP = {
  value: string
  onAdd: (value: string) => void
}

type InitialValues_TP = {
  [x: string]: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const CreateCity = ({ value, onAdd }: CreateCity_TP) => {
  /////////// VARIABLES
  ///
  const initialValues: InitialValues_TP = {
    name_ar: "",
    name_en: "",
    country: "",
    country_id: "",
    id: "",
  }

  const validationSchema = Yup.object({
    name_en: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
    name_ar: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
  })

  const isRTL = useIsRTL()

  /////////// STATES
  ///
  const [city, setCity] = useState(initialValues)
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()
  type CountryType = {
    name_en: string
    name_ar: string
    id: string
    country_id: string
    country_name: string
  }
  const { mutate, error: errorQuery } = useMutate<CountryType>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["cities"], (old: any) => {
          return [
            ...(old || []),
            {
              id: data.id,
              name: isRTL ? data.name_ar : data.name_en,
              country_id: data.country_id,
              country_name: data.country_name,
            },
            notify("success"),
          ]
        })
      }
    },
    onError: (error) => {
      notify("error")
      console.log("🚀 ~ file: CreateCity.tsx:71 ~ error:", error)
    },
  })
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  function PostNewValue(values: InitialValues_TP) {

    mutate({
      endpointName: "/governorate/api/v1/cities",
      values: {
        country_id: values.country_id,
        name_ar: values.name_ar,
        name_en: values.name_en,
      },
    })
  }
  ///
  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          setCity(values)
          PostNewValue(values)
          !errorQuery && onAdd(value)
        }}
        //validationSchema={validationSchema}
      >
        <Form className="w-full">
          <div className="flex gap-x-8 items-center">
            {/* city ar  start */}
            <BaseInputField
              id="name_ar"
              label={`${t("city in arabic")}`}
              name="name_ar"
              type="text"
              placeholder={`${t("city in arabic")}`}
            />
            {/* city ar  end */}

            {/* city en  start */}
            <BaseInputField
              id="name_en"
              label={`${t("city in english")}`}
              name="name_en"
              type="text"
              placeholder={`${t("city in english")}`}
            />
            {/* city en  end */}
          </div>
          <Button type="submit" className="mr-auto">
            {t("submit")}
          </Button>
        </Form>
      </Formik>
    </div>
  )
}
