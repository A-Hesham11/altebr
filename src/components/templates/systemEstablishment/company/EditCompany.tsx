/////////// IMPORTS
///
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors";
import { Button } from "../../../atoms";
import { OuterFormLayout } from "../../../molecules";

import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useMutate } from "../../../../hooks";
import { formatDate } from "../../../../utils/date";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";
import { NationalAddress } from "../../NationalAddress";

import { CompanyMainData } from "./CompanyMainData";
import {
  InitialValues_TP,
  companyValidatingSchema,
} from "./validation-and-types-comapny";
import { CompanyDetails_TP } from "../partners/ViewCompanyDetails";
import {
  Documents,
  allDocs_TP,
} from "../../reusableComponants/documents/Documents";
///
/////////// Types
///

type EditCompany_TP = {
  valuesData: CompanyDetails_TP;
  setEditCompanyOpen: Dispatch<SetStateAction<boolean>>;
};

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const EditCompany = ({
  valuesData,
  setEditCompanyOpen,
}: EditCompany_TP) => {

  /////////// VARIABLES
  ///
  const initialValues: InitialValues_TP = {
    name_ar: valuesData.name || "",
    name_en: valuesData.name || "",
    country_id_out: valuesData ? valuesData?.country?.id : "",
    city_id_out: valuesData ? valuesData?.city?.id : "",
    district_id_out: valuesData ? valuesData?.district?.id : "",
    country_id: valuesData.country.id || "",
    // country_value: valuesData.country.name,
    city_id: valuesData.city.id || "",
    // city_value:valuesData.city.name,
    district_id: valuesData.district.id || "",
    // district_value:valuesData.country.name,
    address_out: valuesData.address || "",
    establishment_date: new Date() || valuesData.establishmentDate,
    phone: valuesData.phone || "",
    email: valuesData.email || "",
    fax: valuesData.fax || "",
    tax_number: valuesData.tax_number || "",
    logo: !!valuesData?.logo
      ? [
          {
            path: valuesData?.logo,
            type: "image",
          },
        ]
      : [],

    // docs data initial valuesData
    docType: "",
    docName: "",
    docNumber: "",
    endDate: new Date(),
    reminder: "",
    files: [],
    //national Address
    building_number: valuesData.nationalAddress?.building_number || "",
    address: valuesData.nationalAddress?.address || "",
    street_number: valuesData.nationalAddress?.street_number || "",
    sub_number: valuesData.nationalAddress?.sub_number || "",
    zip_code: valuesData.nationalAddress?.zip_code || "",
  }

  const incomingData = !!valuesData
    ? valuesData!.document.map((item) => ({
        ...item.data,
        endDate: new Date(item?.data?.endDate),
        files: item?.files || [],
        id: item.id,
      }))
    : [];
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient();
  const {
    mutate,
    error: errorQuery,
    isLoading,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData(["viewCompany"], () => {
        return [data];
      });
      setEditCompanyOpen(false);
      notify("success");
    },
    onError: (error) => {
      notify("error");
    },
  });
  ///
  /////////// STATES
  ///
  const [docsFormValues, setDocsFormValues] = useState<allDocs_TP[]>([
    ...incomingData,
  ]);

  const [docData, setDocData] = useState<allDocs_TP[]>([]);

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///
  // const filesData = docsFormValues.map((el) => el.files)

  const updateHandler = (values: InitialValues_TP) => {
    const document = docsFormValues.map(({ id, ...rest }) => ({
      ...rest,
      // docType: rest.docType.id,
    }));
    let editedValues = {
      name_en: values.name_en,
      name_ar: values.name_ar,
      address: values.address_out,
      country_id: values.country_id_out,
      city_id: values.city_id_out,
      district_id: values.district_id_out,
      email: values.email,
      establishment_date: formatDate(values.establishment_date),
      fax: values.fax,
      logo: values.logo[0],
      tax_number: values.tax_number,
      // endDate: formatDate(values.document.endDate),
      phone: values.phone,
      nationalAddress: {
        address: values.address,
        country_id: values.country_id,
        city_id: values.city_id,
        district_id: values.district_id,
        building_number: values.building_number,
        street_number: values.street_number,
        sub_number: values.sub_number,
        zip_code: values.zip_code,
      },
      document,
    }
       if (!!valuesData) {
         let { document, ...editedValuesWithoutDocument } = editedValues
         if (docsFormValues.length > valuesData.document.length)
           editedValues = {
             ...editedValues,
             document: editedValues.document.slice(valuesData.document.length),
           }
         if (docsFormValues.length === valuesData.document.length)
           editedValues = editedValuesWithoutDocument
         if (
           JSON.stringify(values.logo[0].path) ===
           JSON.stringify(valuesData.logo)
         )
           delete editedValues.logo
         mutate({
           endpointName: `companySettings/api/v1/companies/1`,
           values: editedValues,
           dataType: "formData",
           editWithFormData: true,
         })
       } else {
         mutate({
           endpointName: `companySettings/api/v1/companies/1`,
           values: editedValues,
           // method: "post",
           editWithFormData: true,
           dataType: "formData",
         })
       }

    // mutate({
    //   endpointName: `companySettings/api/v1/companies/1`,
    //   values: editedValues,
    //   // method: "post",
    //   editWithFormData: true,
    //   dataType: "formData",
    // });
  };

  ///
  return (
    <>
      <Formik
        initialValues={initialValues}
        // validationSchema={companyValidatingSchema}
        onSubmit={(values: InitialValues_TP) => {
          updateHandler(values)
        }}
      >
        <Form>
          <HandleBackErrors errors={errorQuery?.response?.data?.errors}>
            <OuterFormLayout
              header={`${t("edit company")}`}
              submitComponent={
                <Button
                  type="submit"
                  className="mr-auto mt-8"
                  loading={isLoading}
                >
                  {t("submit")}
                </Button>
              }
            >
              <CompanyMainData valuesData={valuesData} />
              <Documents
                docsFormValues={docsFormValues}
                setDocsFormValues={setDocsFormValues}
              />
              <NationalAddress editData={valuesData} />
            </OuterFormLayout>
          </HandleBackErrors>
        </Form>
      </Formik>
    </>
  )
};
