/////////// IMPORTS
///
//import classes from './Districts.module.css'
///
/////////// Types
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik, FormikValues, useFormikContext } from "formik"
import { t } from "i18next"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SingleValue } from "react-select"
import * as Yup from "yup"
import { useFetch, useMutate } from "../../../hooks"
import { SelectOption_TP } from "../../../types"
import { requiredTranslation } from "../../../utils/helpers"
import { mutateData } from "../../../utils/mutateData"
import { notify } from "../../../utils/toast"
import { HandleBackErrors } from "../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../atoms"
import { BaseInputField, Select } from "../../molecules"
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler"

///
type Districts_TP = {
  city: SingleValue<SelectOption_TP>
  setDistrictId: Dispatch<SetStateAction<SingleValue<SelectOption_TP>>>
  distractName?: string
  label?: string
  marketName?: string

  fieldKey?: "id" | "value" | undefined
  editData?: {
    [key: string]: any
  }
  isSuccessPost?: boolean
  resetSelect?: () => void
}
type districtsMutate_TP = {
  name: string
  id: string
  city_id: string
  city_name: string
  country_name: string
}
type District_TP = {
  districts: {
    id: string
    name: string
    city_id: string
    city_name: string
    country_name: string
  }[]
}
const validationSchema = Yup.object({
  name_ar: Yup.string().trim().required(requiredTranslation),
  name_en: Yup.string().trim().required(requiredTranslation),
})
/////////// HELPER VARIABLES & FUNCTIONS
///
const NewDistrictOptionComponent = ({
  value,
  onAdd,
  cityId,
  city_name,
}: {
  value: string
  onAdd: (value: string) => void
  cityId: string
  city_name: string
}) => {
  const initialValues = {
    name_ar: value,
    name_en: "",
    city_id: cityId,
  }
  const queryClient = useQueryClient()
  const { mutate, error, isLoading } = useMutate<districtsMutate_TP>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData([`districts/${cityId}`], (old: any) => {
        console.log("first", old)
        if (old && !old.districts) {
          old.districts = []
        }
        return {
          ...(old || {
            id: cityId,
            name: city_name,
          }),
          districts: [
            ...(old.districts || []),
            {
              id: data?.id,
              name: data?.name,
              city_id: cityId,
              city_name,
              country_name: data?.country_name,
            },
          ],
        }
      })

      //change type
      notify("success")
      onAdd(value)
    },
  })
  const handleSubmit = (values: FormikValues) => {
    mutate({
      endpointName: "/governorate/api/v1/districts",
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
        city_id: cityId,
      },
    })
  }
  
  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
        validationSchema={validationSchema}
      >
        <HandleBackErrors errors={error?.response.data.errors}>
          <Form className="w-full">
            <div className="flex gap-x-8 items-center">
              <BaseInputField
                id="name_ar"
                label={`${t("district name arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("district name arabic")}`}
              />

              <BaseInputField
                id="name_en"
                label={`${t("district name english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("district name english")}`}
              />
            </div>
            <div className="text-end">
              <Button
                type="submit"
                className="mr-auto mt-8"
                disabled={isLoading}
                loading={isLoading}
              >
                {t("submit")}
              </Button>
            </div>
          </Form>
        </HandleBackErrors>
      </Formik>
    </div>
  )
}

///
export const Districts = ({
  city,
  setDistrictId,
  distractName = "district_id",
  marketName = "market_id",
  fieldKey,
  label = "district",
  editData,
  isSuccessPost,
  resetSelect,
}: Districts_TP) => {
  /////////// VARIABLES
  ///
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>()
  const { setFieldValue, values } = useFormikContext()

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setNewValue({
      id: editData?.nationalAddress?.district.id || editData?.district_id || "",
      value:
        editData?.nationalAddress?.district.name ||
        editData?.district_name ||
        "",
      label:
        editData?.nationalAddress?.district.name ||
        editData?.district_name ||
        "اختر المدينه اولا ",
    })
  }, [])

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const {
    data: districts,
    isLoading: districtsLoading,
    failureReason,
    refetch,
  } = useFetch<SelectOption_TP[], District_TP>({
    queryKey: [`districts/${city?.id}`],
    endpoint: `governorate/api/v1/cities/${city?.id}?per_page=10000`,
    select: ({ districts }) =>
      districts.map((district) => ({
        ...district,
        id: district.id,
        value: district.name,
        label: district.name,
      })),
    enabled: editData ? true : !!city?.id,
  })

  //change value
  useEffect(() => {
    if (districts && !editData) {
      setNewValue({
        id: "",
        value: "",
        label: "اختر الحي ",
      })
      setDistrictId({
        id: "",
        label: "",
        value: "",
        name: "",
      })
      setFieldValue(distractName, null)
    }
  }, [JSON.stringify(districts)])

  useEffect(() => {
    if (!editData) {
      setNewValue({
        id: "",
        value: "",
        label: "اختر المدينة اولا",
      })

      if (resetSelect) resetSelect()
    }
  }, [isSuccessPost])

  return (
    <div className="flex flex-col gap-1 justify-center">
      <Select
        id={distractName}
        label={t(`${label}`).toString()}
        name={distractName}
        isDisabled={editData ? false : !!!city?.id}
        modalTitle={`${t("add district")}`}
        loadingPlaceholder={`${!city?.id ? "اختر المدينه أولا" : t("loading")}`}
        loading={districtsLoading}
        required
        // placeholder={
        //   city?.id &&
        //   `
        //   ${districts?.length !== 0 ? "اختر الحي" : "لا يوجد "}
        //   `
        // }
        placeholder={
          city?.id
            ? districts?.length !== 0
              ? " اختر الحي"
              : " لا يوجد"
            : " اختر المدينه اولا"
        }
        options={districts}
        value={newValue}
        //@ts-ignore
        onChange={(option: SingleValue<SelectOption_TP>) => {
          if (distractName && editData) {
            setFieldValue(distractName, option?.id)
            setFieldValue("district_value", option!.value)
          }

          // if (marketName && editData) setFieldValue(marketName, editData?.market_id)
          setDistrictId(option)
          setNewValue(option)
        }}
        creatable={true}
        CreateComponent={({ value, onAdd }) => {
          return NewDistrictOptionComponent({
            cityId: city?.id as string,
            city_name: city?.name as string,
            value,
            onAdd,
          })
        }}
        fieldKey={fieldKey}
        // {...{...(values?.district_value && { value:{
        //   value: values?.district_value || "",
        //   label: values?.district_value || ""
        // }})}}
      />
      <RefetchErrorHandler
        failureReason={failureReason}
        isLoading={districtsLoading}
        refetch={refetch}
      />
    </div>
  )
}
