/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useFetch, useIsRTL, useMutate } from "../../../hooks"
import { SelectOption_TP } from "../../../types"
import { mutateData } from "../../../utils/mutateData"
import { notify } from "../../../utils/toast"
import { HandleBackErrors } from "../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../atoms"
import { CreateCity } from "../../CreateCity"
import { CreateCountry } from "../../CreateCountry"
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
  Select,
} from "../../molecules"
import { ViewDistricts_TP } from "./view/ViewDistricts"
import { requiredTranslation } from "../../../utils/helpers"
import { Country_city_distract_markets } from "../reusableComponants/Country_city_distract_markets"
import { DistrictMainData } from "./DistrictMainData"

///
/////////// Types
///
type InitialValues_TP = {
  name_ar: string
  name_en: string
  city_id: string
  country_id: string
}
type AddDistrictProps_TP = {
  editData?: ViewDistricts_TP
  setDataSource?: Dispatch<SetStateAction<ViewDistricts_TP[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?: string
}
type CityType = {
  country_name: any
  name_en: string
  name_ar: string
  id: string
  city_id: string
  city_name: string
  country_id: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AddDistrict = ({
  editData,
  setDataSource,
  setShow,
  title,
}: AddDistrictProps_TP) => {
  /////////// VARIABLES
  ///
  const isRTL = useIsRTL()
  const initialValues: InitialValues_TP = {
    name_ar: editData ? editData?.name_ar : "",
    name_en: editData ? editData?.name_en : "",
    country_id: editData ? editData.country_name : "",
    city_id: editData ? editData.city_id : "",
  }
  const districtValidatingSchema = Yup.object({
    name_ar: Yup.string().trim().required(requiredTranslation),
    country_id: Yup.string().trim().required(requiredTranslation),
    name_en: Yup.string().trim().required(requiredTranslation),
    city_id: Yup.string().trim().required(requiredTranslation),
  })

  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient()

  const {
    mutate,
    error: errorQuery,
    isLoading,
    isSuccess,
    reset,
  } = useMutate<CityType>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success")
      if (data) {
        queryClient.setQueryData(["districts"], (old: any) => {
          return [
            ...(old || []),
            {
              id: data.id,
              name: isRTL ? data.name_ar : data.name_en,
              city_id: data.city_id,
              city_name: data.city_name,
              country_id: data.country_name,
            },
          ]
        })
      }
      if (setDataSource && setShow && !editData && !errorQuery) {
        // setDataSource((prev: any) => [...prev, data])
        queryClient.refetchQueries(["AllDistricts"])
        setShow(false)
      }
      if (setDataSource && setShow && editData && !errorQuery) {
        setShow(false)
        queryClient.refetchQueries(["AllDistricts"])
        // setDataSource((prev: any) =>
        //   prev.map((p: ViewDistricts_TP) => (p.id === data?.id ? data : p))
        // )
      }
    },
    onError: (error) => {
      notify("error")
    },
  })
  ///
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

  const handleSubmit = (values: InitialValues_TP) => {
    mutate({
      endpointName: editData
        ? `governorate/api/v1/districts/${editData.id}`
        : `governorate/api/v1/districts`,
      values: {
        city_id: values.city_id,
        name_ar: values.name_ar,
        name_en: values.name_en,
        ...(editData && { _method: "put" }),
      },
      method: "post",
    })
  }

  ///
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={districtValidatingSchema}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        <Form>
          <HandleBackErrors errors={errorQuery?.response.data.errors}>
            <DistrictMainData
              editData={editData}
              title={title}
              isLoading={isLoading}
              isSuccessPost={isSuccess}
              resetSelect={reset}
            />
          </HandleBackErrors>
        </Form>
      </Formik>
    </>
  )
}
