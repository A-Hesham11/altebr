/////////// IMPORTS
///
//import classes from './AddEmployee.module.css'
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFetch, useMutate } from "../../../../hooks";
import { supplier } from "../../../../pages/suppliers/AllSuppliers";
import { Email_TP } from "../../../../types";
import {
  nationalNumberMax,
  nationalNumberMin,
  requiredTranslation,
} from "../../../../utils/helpers";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors";
import { Loading } from "../../../organisms/Loading";
import { allDocs_TP } from "../../reusableComponants/documents/Documents";
import { SupplierMainData } from "./SupplierMainData";
import { isValidPhoneNumber } from "react-phone-number-input";
import { formatDate } from "../../../../utils/date";

///
/////////// Types
///
type AddSupplierProps_TP = {
  title: string;
  editData?: supplier;
  setDataSource?: Dispatch<SetStateAction<supplier[]>>;
  setShow?: Dispatch<SetStateAction<boolean>>;
};

/////////// HELPER VARIABLES & FUNCTIONS
///
///
const AddSupplier = ({
  title,
  editData,
  setDataSource,
  setShow,
}: AddSupplierProps_TP) => {
  /////////// VARIABLES

  const [supplierType, setSupplierType] = useState("");

  const supplierValidatingSchema = () =>
    Yup.object({
      // supplier validation
      name: Yup.string().trim().required(requiredTranslation),
      type: Yup.string().trim().required(requiredTranslation),
      is_mediator: Yup.boolean(),
      company_name: Yup.string().trim().required(requiredTranslation),
      address_out: Yup.string().trim().required(requiredTranslation),
      // phone: !!!editData
      //   ? Yup.string().trim().required(requiredTranslation)
      //   : Yup.string(),

      phone: !!!editData
        ? Yup.string()
            .trim()
            .required(requiredTranslation)
            .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
              return isValidPhoneNumber(value || "");
            })
        : Yup.string().trim(),

      email: Yup.string().trim().required(requiredTranslation),
      password: !!!editData
        ? Yup.string().trim().required(requiredTranslation)
        : Yup.string(),
      fax: Yup.string().trim(),
      nationality_id: Yup.string().trim().required(requiredTranslation),
      country_id_out: Yup.string().trim().required(requiredTranslation),
      address: Yup.string().trim().required(requiredTranslation),
      national_number: Yup.string()
        .min(10, nationalNumberMin)
        .max(30, nationalNumberMax)
        .required(requiredTranslation),
      national_expire_date: Yup.string().required(requiredTranslation),
      // national address validation
      country_id: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
      city_id: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
      district_id: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
      building_number: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
      street_number: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
      sub_number: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
      zip_code: Yup.string()
        .trim()
        .when("type", {
          is: "local",
          then: (schema) => schema.required(),
        }),
    });

  const outSupplierValidatingSchema = () =>
    Yup.object({
      // supplier validation
      name: Yup.string().trim().required(requiredTranslation),
      company_name: Yup.string().trim().required(requiredTranslation),
      address_out: Yup.string().trim().required(requiredTranslation),
      country_id_out: Yup.string().trim().required(requiredTranslation),
      phone: !!!editData
        ? Yup.string()
            .trim()
            .required(requiredTranslation)
            .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
              return isValidPhoneNumber(value || "");
            })
        : Yup.string().trim(),
      email: Yup.string().trim().required(requiredTranslation),
      password: !!!editData
        ? Yup.string().trim().required(requiredTranslation)
        : Yup.string(),
      fax: Yup.string().trim(),
      nationality_id: Yup.string().trim().required(requiredTranslation),
      national_number: Yup.string(),
      national_expire_date: Yup.string().required(requiredTranslation),
      // type: Yup.string().trim().required(requiredTranslation),
      // wages_tax: Yup.string().trim(),
      // gold_tax: Yup.string().trim(),
      // is_mediator: Yup.boolean(),
      // phone: !!!editData
      //   ? Yup.string().trim().required(requiredTranslation)
      //   : Yup.string(),
      // address: Yup.string().trim()
      //   .min(10, nationalNumberMin)
      //   .max(30, nationalNumberMax)
      //   .required(requiredTranslation),
    });

  const incomingData = !!editData
    ? editData!.document.map((item) => ({
        ...item.data,
        endDate: new Date(item.data.endDate),
        files: item?.files || [],
        id: item.id,
      }))
    : [];
  const initialValues = {
    // supplier data
    name: editData ? editData.name : "",
    type: editData ? editData.type : "local",
    is_mediator: editData ? editData.is_mediator : false,
    country_id_out: editData ? editData?.country?.id : "",

    gold_tax: editData
      ? editData.tax == "gold" || editData.tax == "gold_and_wages"
        ? true
        : false
      : true,
    // gold
    wages_tax: editData
      ? editData.tax == "wages" || editData.tax == "gold_and_wages"
        ? true
        : false
      : true,
    company_name: editData ? editData?.company_name : "",
    country_id: editData ? editData?.country?.id : "",
    city_id: editData ? editData?.city?.id : "",
    address_out: editData ? editData?.address : "",
    mobile: "",
    phone: editData ? editData?.phone : "",
    fax: editData ? editData?.fax : "",
    email: editData ? editData?.email : ("" as Email_TP),
    password: "",
    nationality_id: editData?.nationality.id || "",
    national_number: editData ? editData?.national_number : "",
    national_expire_date: new Date(),
    logo: !!editData?.logo
      ? [
          {
            path: editData?.logo,
            type: "image",
          },
        ]
      : [],
    // national address data
    district_id: editData ? editData?.nationalAddress?.district?.id : "",
    district_value: editData?.nationalAddress?.district.name || "",
    address: editData ? editData?.nationalAddress?.address : "",
    building_number: editData ? editData?.nationalAddress?.building_number : "",
    street_number: editData ? editData?.nationalAddress?.street_number : "",
    sub_number: editData ? editData?.nationalAddress?.sub_number : "",
    zip_code: editData ? editData?.nationalAddress?.zip_code : "",
  };
  ///
  ///
  /////////// CUSTOM HOOKS
  ///

  const {
    data: checkOperations,
    isLoading: checkOperationsLoading,
    refetch: checkOperationsTitles,
    failureReason: checkOperationsErrorReason,
  } = useFetch<{ status: "" }>({
    endpoint: "/supplier/api/v1/check",
    queryKey: ["checkOperations"],
  });
  const queryClient = useQueryClient();
  const {
    mutate,
    isLoading: postLoading,
    error,
    isSuccess,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.refetchQueries(["suppliers"]);
      notify("success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  ///
  /////////// STATES
  ///
  const [docsFormValues, setDocsFormValues] =
    useState<allDocs_TP[]>(incomingData);
  const navigate = useNavigate();
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  if (checkOperationsLoading)
    return (
      <Loading
        mainTitle={`${t("loading")}`}
        subTitle={`${t("checking accounts operations")}`}
      />
    );
  if (!checkOperations?.status)
    return (
      <div className="h-screen flex justify-center items-center  bg-flatWhite ">
        <h2
          className="font-bold text-2xl p-8 rounded-lg bg-mainGreen text-white cursor-pointer"
          onClick={() => navigate("/operation")}
        >
          {t(
            "please complete accounts operations first click to complete the operation"
          )}
        </h2>
      </div>
    );
  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const tax =
            values.gold_tax && values.wages_tax
              ? "gold_and_wages"
              : values.gold_tax
              ? "gold"
              : values.wages_tax
              ? "wages"
              : "no";

          const is_mediator = values.is_mediator ? 1 : 0;
          let editedValues = {
            ...values,
            address: values.address_out,
            country_id: values.country_id_out,
            document: docsFormValues,
            tax,
            is_mediator,
            logo: values.logo[0],
            nationalAddress: {
              country_id: values.country_id,
              city_id: values.city_id,
              district_id: values.district_id,
              building_number: values.building_number,
              address: values.address,
              street_number: values.street_number,
              sub_number: values.sub_number,
              zip_code: values.zip_code,
            },
          };
          if (!!editData) {
            let { document, ...editedValuesWithoutDocument } = editedValues;
            if (docsFormValues.length > editData.document.length)
              editedValues = {
                ...editedValues,
                document: editedValues.document.slice(editData.document.length),
              };
            if (docsFormValues.length === editData.document.length)
              editedValues = editedValuesWithoutDocument;
            if (
              JSON.stringify(values.logo[0].path) ===
              JSON.stringify(editData.logo)
            )
              delete editedValues.logo;
            if (values.password === "") delete editedValues.password;

            mutate({
              endpointName: `supplier/api/v1/suppliers/${editData.id}`,
              values: editedValues,
              dataType: "formData",
              editWithFormData: true,
            });
          } else {
            if (values.type === "global") delete editedValues.nationalAddress;
            delete editedValues.country_id_out;

            mutate({
              endpointName: `supplier/api/v1/suppliers`,
              values: editedValues,
              dataType: "formData",
            });
          }
        }}
        validationSchema={() =>
          (supplierType || editData?.type) === "global"
            ? outSupplierValidatingSchema()
            : supplierValidatingSchema()
        }
      >
        {({ values }) => (
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <Form>
              <SupplierMainData
                postLoading={postLoading}
                title={title}
                editData={editData}
                isSuccessPost={isSuccess}
                restData={reset}
                setDocsFormValues={setDocsFormValues}
                docsFormValues={docsFormValues}
                setSupplierType={setSupplierType}
              />
            </Form>
          </HandleBackErrors>
        )}
      </Formik>
    </>
  );
};

export default AddSupplier;
