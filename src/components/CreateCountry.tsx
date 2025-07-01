/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { useState } from "react";
import * as Yup from "yup";
import { BaseInputField } from "./molecules";
import { useIsRTL, useMutate } from "../hooks";
import { mutateData } from "../utils/mutateData";
import { notify } from "../utils/toast";
import { Button } from "./atoms";
///
/////////// Types
///
type CreateCountryProps_TP = {
  value: string;
  onAdd: (value: string) => void;
};

type InitialValues_TP = {
  name_ar: string;
  name_en: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const CreateCountry = ({ value, onAdd }: CreateCountryProps_TP) => {
  /////////// VARIABLES
  ///
  const initialValues: InitialValues_TP = {
    name_ar: "",
    name_en: "",
  };
  const validationSchema = Yup.object({
    name_ar: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
    name_en: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
  });

  /////////// STATES
  ///
  const [countries, setCountries] = useState(initialValues); ///
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL();

  const queryClient = useQueryClient();
  const { mutate, error: errorQuery } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData(["countries"], (old: any) => {
        return [
          ...(old || []),
          {
            id: crypto.randomUUID(),
            name: isRTL ? data.name : data.name,
          },
          notify("success"),
        ];
      });
    },
    onError: (error) => {
      return {};
      notify("error");
    },
  });
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  function PostNewValue(values: InitialValues_TP) {
    mutate({
      endpointName: "governorate/api/v1/countries",
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
      },
    });
  }
  ///
  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          setCountries(values);
          PostNewValue(values);
          !errorQuery && onAdd(value);
        }}
        validationSchema={validationSchema}
      >
        <Form className="w-full">
          <div className="flex gap-x-8 items-center">
            {/* country ar  start */}
            <BaseInputField
              id="name_ar"
              label={`${t("country in arabic")}`}
              name="name_ar"
              type="text"
              placeholder={`${t("country in arabic")}`}
            />
            {/* country ar  end */}

            {/* country en  start */}
            <BaseInputField
              id="name_en"
              label={`${t("country in english")}`}
              name="name_en"
              type="text"
              placeholder={`${t("country in english")}`}
            />
            {/* country en  end */}
          </div>
          <Button type="submit" className="mr-auto">
            {t("submit")}
          </Button>
        </Form>
      </Formik>
    </div>
  );
};
