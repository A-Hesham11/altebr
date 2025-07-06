/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import { EmployeeMainData } from "..";
import { useMutate } from "../../../hooks";
import { formatDate, getDayBefore } from "../../../utils/date";
import { requiredTranslation } from "../../../utils/helpers";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { HandleBackErrors } from "../../../utils/utils-components/HandleBackErrors";
import { allDocs_TP } from "../reusableComponants/documents/Documents";
import { Email_TP, InitialValues_TP } from "./validation-and-types";
///
/////////// Types
///
type AddEmployeeProps_TP = {
  title: string;
  editEmployeeData?: InitialValues_TP | undefined;
};

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AddEmployee = ({
  title,
  editEmployeeData,
}: AddEmployeeProps_TP) => {
  // validation
  const employeeValidatingSchema = () =>
    Yup.object({
      // employee main data validation
      name: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
      role_id: Yup.string().trim().required(requiredTranslation),
      address_out: Yup.string().trim().required(requiredTranslation),
      address: Yup.string().trim().required(requiredTranslation),
      mobile: !!!editEmployeeData
        ? Yup.string()
            .trim()
            .required(requiredTranslation)
            .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
              return isValidPhoneNumber(value || "");
            })
        : Yup.string().trim(),
      phone: !!!editEmployeeData
        ? Yup.string().trim().required(requiredTranslation)
        : Yup.string().trim(),
      nationality_id: Yup.string().required(requiredTranslation),
      date_of_birth: Yup.date().required(requiredTranslation),
      national_expire_date: Yup.date().required(requiredTranslation),
      email: Yup.string().trim().required(requiredTranslation),
      national_number: Yup.string().trim().required(requiredTranslation),
      username: Yup.string().trim().required(requiredTranslation),
      password: !!!editEmployeeData
        ? Yup.string().trim().required(requiredTranslation)
        : Yup.string().trim(),
      national_image: Yup.array()
        .required(requiredTranslation)
        .min(1, "can not be empty"),
      // national address validation
      country_id: Yup.string().trim().required(requiredTranslation),
      city_id: Yup.string().trim().required(requiredTranslation),
      district_id: Yup.string().trim().required(requiredTranslation),
      building_number: Yup.string().trim().required(requiredTranslation),
      street_number: Yup.string().trim().required(requiredTranslation),
      sub_number: Yup.string().trim().required(requiredTranslation),
      is_active: Yup.string().required(requiredTranslation),
      image: Yup.array()
        .required(requiredTranslation)
        .min(1, "can not be empty"),
      zip_code: Yup.string().trim().required(requiredTranslation),
    });

  //@ts-ignore
  const incomingData = !!editEmployeeData
    ? editEmployeeData!.document.map((item) => ({
        ...item.data,
        endDate: new Date(item.data.endDate),
        files: item?.files || [],
        id: item.id,
      }))
    : [];

  /////////// VARIABLES
  ///
  /////////// STATES
  ///
  const [modalOpen, setModalOpen] = useState(false);

  const [docsFormValues, setDocsFormValues] =
    useState<allDocs_TP[]>(incomingData);

  const initialValues: InitialValues_TP = {
    // employee main data initial values
    name: editEmployeeData?.name || "",
    phone: editEmployeeData?.phone || "",
    mobile: editEmployeeData?.mobile || "",
    username: editEmployeeData?.username || "",
    address_out: editEmployeeData?.address || "",
    is_active: editEmployeeData?.is_active ? "Yes" : "No" || "Yes",
    city_id: editEmployeeData?.nationalAddress?.city?.id || "",
    nationality_id: editEmployeeData?.nationality?.id || "",
    country_id: editEmployeeData?.country?.id || "",
    role_id: editEmployeeData?.role?.id || "",
    role_value: editEmployeeData?.role?.name || "",
    date_of_birth: !!editEmployeeData
      ? new Date(editEmployeeData?.date_of_birth)
      : new Date(),
    branch_id: editEmployeeData?.branch?.id || "",
    national_number: editEmployeeData?.national_number || "",
    national_expire_date: new Date(),
    national_image: !!editEmployeeData?.national_image
      ? [
          {
            path: editEmployeeData?.national_image,
            type: "image",
          },
        ]
      : [],
    image: !!editEmployeeData?.img
      ? [
          {
            path: editEmployeeData?.img,
            type: "image",
          },
        ]
      : [],
    email: editEmployeeData?.email || ("" as Email_TP),
    date_of_hiring: new Date(),
    password: "",
    district_id: editEmployeeData?.nationalAddress?.district.id || "",
    district_value: editEmployeeData?.nationalAddress?.district.name || "",
    building_number: editEmployeeData?.nationalAddress?.building_number || "",
    street_number: editEmployeeData?.nationalAddress?.street_number || "",
    sub_number: editEmployeeData?.nationalAddress?.sub_number || "",
    zip_code: editEmployeeData?.nationalAddress?.zip_code || "",
    address: editEmployeeData?.nationalAddress?.address || "",
  };

  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient();
  const { mutate, isLoading, error, isSuccess, reset } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      notify("success");
      queryClient.refetchQueries(["employees"]);
    },
    onError: (error: any) => {
      notify(
        "error",
        error.request.status == "503"
          ? `${t("you do not have access")}`
          : error?.response?.data?.message
      );
    },
  });
  ///

  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          let editedValues = {
            ...values,
            address: values.address_out,
            image: values.image[0],
            national_image: values.national_image[0],
            is_active: values.is_active === "No" ? 0 : 1,
            national_expire_date: formatDate(values.national_expire_date),
            date_of_birth: formatDate(getDayBefore(values.date_of_birth)),
            document: docsFormValues,
            nationalAddress: {
              sub_number: values.sub_number,
              city_id: values.city_id,
              district_id: values.district_id,
              zip_code: values.zip_code,
              address: values.address,
              building_number: values.building_number,
              street_number: values.street_number,
            },
          };
          if (!!editEmployeeData) {
            let { document, ...editedValuesWithoutDocument } = editedValues;
            if (docsFormValues.length > editEmployeeData.document.length)
              editedValues = {
                ...editedValues,
                document: editedValues.document.slice(
                  editEmployeeData.document.length
                ),
              };
            if (docsFormValues.length === editEmployeeData.document.length)
              editedValues = editedValuesWithoutDocument;
            if (
              JSON.stringify(values.national_image[0].path) ===
              JSON.stringify(editEmployeeData.national_image)
            )
              delete editedValues.national_image;

            if (
              JSON.stringify(values.image[0].path) ===
              JSON.stringify(editEmployeeData.img)
            )
              delete editedValues.image;

            if (values.password === "") delete editedValues.password;
            mutate({
              endpointName: `employee/api/v1/employees/${editEmployeeData.id}`,
              values: editedValues,
              dataType: "formData",
              editWithFormData: true,
            });
          } else {
            mutate({
              endpointName: "employee/api/v1/employees",
              values: editedValues,
              dataType: "formData",
            });
          }
        }}
        validationSchema={() => employeeValidatingSchema()}
      >
        <HandleBackErrors errors={error?.response?.data.errors}>
          <Form>
            <EmployeeMainData
              title={title}
              editEmployeeData={editEmployeeData}
              docsFormValues={docsFormValues}
              setDocsFormValues={setDocsFormValues}
              isLoading={isLoading}
              restData={reset}
              isSuccessPost={isSuccess}
              setModalOpen={setModalOpen}
              modalOpen={modalOpen}
            />
          </Form>
        </HandleBackErrors>
      </Formik>
    </>
  );
};
