/////////// IMPORTS
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikValues, useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import * as Yup from "yup";
import { useFetch, useMutate } from "../../../hooks";
import { SelectOption_TP } from "../../../types";
import { requiredTranslation } from "../../../utils/helpers";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { HandleBackErrors } from "../../../utils/utils-components/HandleBackErrors";
import { Button } from "../../atoms";
import { BaseInputField, Select } from "../../molecules";
import { RefetchErrorHandler } from "../../molecules/RefetchErrorHandler";

/////////// Types
type Countries_TP = {
  setCountry: (value: { id: string; name: string }) => void;
  countryName: string;
  cityName?: string;
  distractName?: string;
  label?: string;
  editData?: { [key: string]: any };
  fieldKey: "id" | "value" | undefined;
  isSuccessPost?: boolean;
  resetSelect?: () => void;
  disabled?: boolean;
};
type CountriesMutate_TP = {
  name: string;
  id: string;
};
type Country_TP = {
  id: string;
  name: string;
};
///

/////////// HELPER VARIABLES & FUNCTIONS
///

// New Country create

const validationSchema = Yup.object({
  name_ar: Yup.string().trim().required(requiredTranslation),
  name_en: Yup.string().trim().required(requiredTranslation),
});
const NewCountryOptionComponent = ({
  value,
  onAdd,
}: {
  value: string;
  onAdd: (value: string) => void;
}) => {
  const initialValues = {
    name_ar: value,
    name_en: "",
  };

  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutate<CountriesMutate_TP>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData(["countries"], (old: any) => {
        return [
          ...(old || []),
          {
            //@ts-ignore
            id: data.id,
            name: data?.name,
          },
        ];
      });
      notify("success");
      onAdd(value);
    },
  });
  const handleSubmit = (values: FormikValues) => {
    mutate({
      endpointName: "governorate/api/v1/countries",
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
      },
    });
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validationSchema={validationSchema}
      >
        <HandleBackErrors errors={error?.response.data.errors}>
          <Form className="w-full">
            <div className="flex gap-x-8 items-center">
              <BaseInputField
                id="name_ar"
                label={`${t("Country name arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("Country name arabic")}`}
              />

              <BaseInputField
                id="name_en"
                label={`${t("Country name english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("Country name english")}`}
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
  );
};
///
export const Countries = ({
  setCountry,
  countryName,
  cityName = "city_id",
  distractName = "district_id",
  fieldKey,
  label,
  editData,
  isSuccessPost,
  setEditData,
  disabled,
  resetSelect,
}: Countries_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, values } = useFormikContext();
  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setNewValue({
      id: editData?.nationalAddress?.country?.id || editData?.country_id || "",
      value:
        editData?.nationalAddress?.country?.name ||
        editData?.country_name ||
        "",
      label:
        editData?.nationalAddress?.country?.name ||
        editData?.country_name ||
        t("select country"),
    });
  }, []);

  useEffect(() => {
    if (
      (!editData || !editData?.nationalAddress?.country?.name) &&
      isSuccessPost
    ) {
      setNewValue({
        id: "",
        value: "",
        label: t("select country"),
      });
      if (resetSelect) resetSelect();
    }
  }, [isSuccessPost]);

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const {
    data: countriesOptions,
    isLoading: countriesLoading,
    failureReason,
    refetch,
  } = useFetch<SelectOption_TP[], Country_TP[]>({
    queryKey: ["countries"],
    endpoint: "governorate/api/v1/countries?per_page=10000",
    select: (data) =>
      data.map((country) => ({
        ...country,
        id: country.id,
        value: country.name,
        label: country.name,
      })),
  });

  const countriesOptionsReverse = countriesOptions?.reverse();
  
  useEffect(() => {
    if (editData) {
      setCountry({
        id: newValue?.id,
        label: newValue?.label,
        value: newValue?.value,
        name: newValue?.name,
      });
    }
  }, [newValue]);

  ///
  return (
    <div className="flex flex-col gap-1 justify-center">
      <Select
        id={countryName}
        label={t(`${label}`).toString()}
        name={countryName}
        placeholder={t(`${label}`).toString()}
        isDisabled={disabled || (!countriesLoading && !!failureReason)}
        loadingPlaceholder={`${t("loading")}`}
        loading={countriesLoading}
        options={countriesOptionsReverse}
        creatable={true}
        CreateComponent={NewCountryOptionComponent}
        fieldKey={fieldKey}
        modalTitle={`${t("add Country")}`}
        value={newValue}
        required
        onChange={(option) => {
          //@ts-ignore
          setFieldValue(countryName, option!.id);
          // setFieldValue('country_value', option!.value)
          // if (cityName && editData) setFieldValue(cityName, editData?.city_id)
          // if (distractName && editData) setFieldValue(distractName,editData?.district_id)
          //@ts-ignore
          setCountry(option);
          setNewValue(option);
        }}
        defaultValue={{
          value: editData ? editData?.country_name : "",
          label: editData ? editData?.country_name : t("choose country"),
        }}
        // {...{...(values?.country_value && { value:{
        //   value: values?.country_value || "",
        //   label: values?.country_value || ""
        // }})}}
      />
      <RefetchErrorHandler
        failureReason={failureReason}
        isLoading={countriesLoading}
        refetch={refetch}
      />
    </div>
  );
};
