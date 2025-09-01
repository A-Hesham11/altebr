/////////// IMPORTS
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikValues, useFormikContext } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
///
//import classes from './Cities.module.css'
///
/////////// Types

type Cities_TP = {
  country: {
    [key: string]: any;
  };
  setCityId: Dispatch<SetStateAction<SingleValue<SelectOption_TP>>>;
  editData?: { [key: string]: any };
  cityName?: string | undefined;
  distractName?: string;
  label?: string;
  fieldKey?: "id" | "value" | undefined;
  isSuccessPost?: boolean;
  resetSelect?: () => void;
  disabled?: boolean;
};
type CitiesMutate_TP = {
  name: string;
  id: string;
  country_id: string;
  country_name: string;
};
type City_TP = {
  cities: {
    id: string;
    name: string;
    country_id: string;
    country_name: string;
  }[];
};
/////////// HELPER VARIABLES & FUNCTIONS
///

const validationSchema = Yup.object({
  name_ar: Yup.string().trim().required(requiredTranslation),
  name_en: Yup.string().trim().required(requiredTranslation),
});
const NewCitiesOptionComponent = ({
  value,
  onAdd,
  countryId,
  country_name,
}: {
  value: string;
  onAdd: (value: string) => void;
  countryId: string;
  country_name: string;
}) => {
  const initialValues = {
    name_ar: value,
    name_en: "",
    country_id: countryId,
  };
  const queryClient = useQueryClient();
  const { mutate, error, isLoading } = useMutate<CitiesMutate_TP>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData([`cities/${countryId}`], (old: any) => {
        if (old && !old.cities) {
          old.cities = [];
        }
        return {
          ...(old || {
            id: countryId,
            name: country_name,
          }),
          cities: [
            ...(old.cities || []),
            ,
            {
              id: data?.id,
              name: data?.name,
              country_id: countryId,
              country_name: data?.country_name,
            },
          ],
        };
      });
      notify("success");
      onAdd(value);
    },
  });
  const handleSubmit = (values: FormikValues) => {
    mutate({
      endpointName: "/governorate/api/v1/cities",
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
        country_id: countryId,
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
                label={`${t("city name arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("city name arabic")}`}
              />

              <BaseInputField
                id="name_en"
                label={`${t("city name english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("city name english")}`}
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
export const Cities = ({
  country,
  setCityId,
  cityName = "city_id",
  distractName = "district_id",
  fieldKey,
  label = "city",
  editData,
  isSuccessPost,
  resetSelect,
  setDistrictId,
  disabled,
}: Cities_TP) => {
  /////////// VARIABLES
  ///
  const { setFieldValue, values } = useFormikContext();
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();

  ///
  /////////// SIDE EFFECTS
  ///

  useEffect(() => {
    if (country?.id !== editData?.city_id) {
      setNewValue({
        id: editData?.nationalAddress?.city?.id || editData?.city_id || "",
        value:
          editData?.nationalAddress?.city?.name || editData?.city_name || "",
        label:
          editData?.nationalAddress?.city?.name ||
          editData?.city_name ||
          "اختر الدوله اولا",
      });
    } else {
      setNewValue({
        id: "",
        value: "",
        label: "اختر المدينه ... ",
      });
    }
    // setDistrictId({
    //   id: "",
    //   value: "",
    //   label: "اختر المدينه؟  ",
    // })
    // if (newValue?.id !== editData?.city_id) {
    // }
  }, []);

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  const {
    data: cities,
    isLoading: citiesLoading,
    failureReason,
    refetch,
  } = useFetch<SelectOption_TP[], City_TP>({
    endpoint: `governorate/api/v1/countries/${country?.id}?per_page=10000`,
    queryKey: [`cities/${country?.id}`],
    select: ({ cities }) => {
      return cities.map((city) => ({
        ...city,
        id: city.id,
        value: city.name,
        label: city.name,
        country_name: city.country_name,
      }));
    },
    // enabled: editData ? true : !!country?.id,
    enabled: !!country?.id,
  });

  useEffect(() => {
    if (cities && !editData) {
      setNewValue(null);
      setCityId({ id: "", label: "", value: "", name: "" });
      setFieldValue(cityName, null);
    }
  }, [JSON.stringify(cities)]);

  useEffect(() => {
    if (editData) {
      setCityId({
        id: newValue?.id,
        label: newValue?.label,
        value: newValue?.value,
        name: newValue?.name,
      });
    }
  }, [newValue]);

  useEffect(() => {
    if (!editData) {
      setNewValue({
        id: "",
        value: "",
        label: "اختر الدوله اولا",
      });
      if (editData) {
        setCityId({ id: "", label: "", value: "", name: "" });
      }
      if (resetSelect) resetSelect();
    }
  }, [isSuccessPost]);

  ///
  return (
    <div className="flex flex-col gap-1 justify-center">
      <Select
        id={cityName}
        label={t(`${label}`).toString()}
        name={cityName}
        modalTitle={`${t("add city")}`}
        isDisabled={disabled || (editData ? false : !!!country?.id)}
        loadingPlaceholder={`${
          !country?.id ? "اختر الدولة أولا" : t("loading")
        }`}
        loading={citiesLoading}
        placeholder={
          country?.id &&
          `
        ${cities?.length !== 0 ? "اختر المدينه" : "لا يوجد "}
        `
        }
        options={cities}
        required
        value={newValue}
        //@ts-ignore
        onChange={(option: SingleValue<SelectOption_TP>) => {
          if (cityName && editData) {
            setFieldValue(cityName, option?.id);
            // setFieldValue('city_value', option!.value)
          }
          if (distractName && editData) {
            setFieldValue(distractName, editData?.district_id);
          }

          setNewValue(option);
          setCityId(option);
        }}
        creatable={true}
        CreateComponent={({ value, onAdd }) => {
          return NewCitiesOptionComponent({
            countryId: country?.id,
            country_name: country?.name,
            value,
            onAdd,
          });
        }}
        fieldKey={fieldKey}
        // {...{...(values?.city_value && { value:{
        //   value: values?.city_value || "",
        //   label: values?.city_value || ""
        // }})}}
      />
      {/* <RefetchErrorHandler
        failureReason={failureReason}
        isLoading={citiesLoading}
        refetch={refetch}
      /> */}
    </div>
  );
};
