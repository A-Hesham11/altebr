/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { t } from "i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { useFetch, useMutate } from "../../../../hooks"
import { formatDate } from "../../../../utils/date"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { Loading } from "../../../organisms/Loading"
import { PartnerMainData } from "./PartnerMainData"

import {
  InitialValues_TP,
  requiredTranslation,
} from "./validation-and-types-partner"
import { isValidPhoneNumber } from "react-phone-number-input"
///
/////////// Types
///
type AddPartners_props = {
  title: string
  dataSource?: any
  editData?: any
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AddPartners = ({
  title,
  dataSource,
  editData,
}: AddPartners_props) => {
  /////////// VARIABLES
  ///
  const initialValues: InitialValues_TP = {
    name: editData?.name || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    end_date: editData ? new Date(editData?.end_date) : new Date(),
    start_date: editData ? new Date(editData?.start_date) : new Date(),
    country_id_out: editData ? editData?.country?.id : "",
    city_id_out: editData ? editData?.city?.id : "",
    country_id: editData?.country?.id || "",
    city_id: editData?.city?.id || "",
    nationality_name: editData?.nationality_name || "",
    nationality_id: editData?.nationality.id || "",
    national_image: !!editData?.national_image
      ? [
          {
            path: editData?.national_image,
            type: "image",
          },
        ]
      : [],
    // document type
    docType: "",
    docName: "",
    docNumber: "",
    endDate: new Date(),
    reminder: "",
    files: [],
    //national Address
    district_id: editData?.nationalAddress?.district.id || "",
    district_id_out: editData?.nationalAddress?.district.id || "",
    building_number: editData?.nationalAddress?.building_number || "",
    street_number: editData?.nationalAddress?.street_number || "",
    sub_number: editData?.nationalAddress?.sub_number || "",
    zip_code: editData?.nationalAddress?.zip_code || "",
    address: editData?.nationalAddress?.address || "",
  }

  const partnerValidatingSchema = () =>
    Yup.object({
      name: Yup.string().trim().required(requiredTranslation),
      email: Yup.string().email().trim().required(requiredTranslation),
      // phone: Yup.string().trim().required(requiredTranslation),
      phone: !!!editData
        ? Yup.string()
            .trim()
            .required(requiredTranslation)
            .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
              return isValidPhoneNumber(value || "")
            })
        : Yup.string().trim(),
      end_date: Yup.date().required(requiredTranslation),
      start_date: Yup.date().required(requiredTranslation),
      // x_city: Yup.string().trim().required(requiredTranslation),
      // x_country: Yup.string().trim().required(requiredTranslation),
      nationality_id: Yup.string().trim().required(requiredTranslation),
      building_number: Yup.string().trim().required(requiredTranslation),
      country_id: Yup.string().trim().required(requiredTranslation),
      country_id_out: Yup.string().trim().required(requiredTranslation),
      city_id: Yup.string().trim().required(requiredTranslation),
      city_id_out: Yup.string().trim().required(requiredTranslation),
      district_id: Yup.string().trim().required(requiredTranslation),
      street_number: Yup.string().trim().required(requiredTranslation),
      address: Yup.string().trim().required(requiredTranslation),
      sub_number: Yup.string().trim().required(requiredTranslation),
      zip_code: Yup.string().trim().required(requiredTranslation),
      //  national_image: Yup.string().trim().required(requiredTranslation),
    })

  ///
  /////////// CUSTOM HOOKS
  ///
  const incomingData = !!editData
    ? editData!.document.map((item) => ({
        ...item.data,
        endDate: new Date(item.data.endDate),
        files: item?.files || [],
        id: item.id,
      }))
    : []
  ///
  /////////// STATES
  ///
  const [docsFormValues, setDocsFormValues] =
    useState<InitialValues_TP[]>(incomingData)

  const {
    data: checkOperations,
    isLoading: checkOperationsLoading,
    refetch: checkOperationsTitles,
    failureReason: checkOperationsErrorReason,
  } = useFetch<{ status: string }>({
    endpoint: "partner/api/v1/check",
    queryKey: ["checkSupplier"],
  })

  const navigate = useNavigate()

  ///
  /////////// SIDE EFFECTS
  ///
  const {
    mutate,
    isLoading,
    error: errorQuery,
    isSuccess,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["partner"])
      notify("success")
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const queryClient = useQueryClient()

  if (checkOperationsLoading)
    return (
      <Loading
        mainTitle={`${t("loading")}`}
        subTitle={`${t("checking accounts operations")}`}
      />
    )

  if (!checkOperations?.status)
    return (
      <div className="h-screen flex justify-center items-center  bg-flatWhite ">
        <h2
          className="font-bold text-2xl p-8 rounded-lg bg-mainGreen text-white cursor-pointer"
          onClick={() => navigate("/testSystem")}
        >
          {t(
            "please complete accounts operations first click to complete the operation"
          )}
        </h2>
      </div>
    )
  ///
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={partnerValidatingSchema}
        onSubmit={(values) => {
          let editedValues = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            end_date: formatDate(values.end_date),
            start_date: formatDate(values.start_date),
            country_id: values.country_id_out,
            city_id: values.city_id_out,
            district_id: values.district_id,
            nationality_name: values.nationality_name,
            national_image: values.national_image[0],
            nationality_id: values.nationality_id,
            // district_id: values.district_id,
            nationalAddress: {
              address: values.address,
              country_id: values.country_id,
              city_id: values.city_id,
              district_id: values.district_id || values.district_id_out,
              building_number: values.building_number,
              street_number: values.street_number,
              sub_number: values.sub_number,
              zip_code: values.zip_code,
            },
            document: docsFormValues,
          }

          if (!!editData) {
            let { document, ...editedValuesWithoutDocument } = editedValues
            if (docsFormValues.length > editData.document.length)
              editedValues = {
                ...editedValues,
                document: editedValues.document.slice(editData.document.length),
              }
            if (docsFormValues.length === editData.document.length)
              editedValues = editedValuesWithoutDocument
            if (
              JSON.stringify(values.national_image[0].path) ===
              JSON.stringify(editData.national_image)
            )
              delete editedValues.national_image
            console.log("editedValues---->", editedValues)
            mutate({
              endpointName: `partner/api/v1/partners/${editData.id}`,
              values: editedValues,
              dataType: "formData",
              editWithFormData: true,
            })
          } else {
            mutate({
              endpointName: "partner/api/v1/partners",
              values: editedValues,
              dataType: "formData",
            })
          }
        }}
      >
        <HandleBackErrors errors={errorQuery?.response?.data?.errors}>
          <Form>
            <PartnerMainData
              isLoading={isLoading}
              title={title}
              editData={editData}
              isSuccessPost={isSuccess}
              restData={reset}
              setDocsFormValues={setDocsFormValues}
              docsFormValues={docsFormValues}
            />
          </Form>
        </HandleBackErrors>
      </Formik>
    </>
  )
}
