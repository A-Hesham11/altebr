/////////// IMPORTS
///
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
///
type Markets_TP = {
  district: SingleValue<SelectOption_TP>;
  marketName?: string;
  label?: string;
  fieldKey?: "id" | "value" | undefined;
  editData?: {
    [key: string]: any;
  };
};
type Market_TP = {
  markets: {
    id: string;
    name: string;
    city_id: string;
    district_id: string;
  }[];
};
type MarketsMutate_TP = {
  name: string;
  id: string;
  district_id: string;
  district_name: string;
  country_name: string;
  city_name: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
const validationSchema = Yup.object({
  name_ar: Yup.string().trim().required(requiredTranslation),
  name_en: Yup.string().trim().required(requiredTranslation),
});
const NewMarketOptionComponent = ({
  value,
  onAdd,
  districtId,
  district_name,
}: {
  value: string;
  onAdd: (value: string) => void;
  districtId: string;
  district_name: string;
}) => {
  const initialValues = {
    name_ar: value,
    name_en: "",
    district_id: districtId,
  };
  const queryClient = useQueryClient();
  const { mutate, error, isLoading } = useMutate<MarketsMutate_TP>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      queryClient.setQueryData([`market/${districtId}`], (old: any) => {
        if (old && !old.markets) {
          old.markets = [];
        }
        return {
          ...(old || {
            id: districtId,
            name: district_name,
          }),
          markets: [
            ...(old.markets || []),
            {
              id: data?.id,
              name: data?.name,
              country_name: data?.country_name,
              city_name: data?.city_name,
              district_name: data?.district_name,
            },
          ],
        };
      });

      //change type
      notify("success");
      onAdd(value);
    },
  });
  const handleSubmit = (values: FormikValues) => {
    mutate({
      endpointName: "/governorate/api/v1/markets",
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
        district_id: districtId,
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
        <HandleBackErrors errors={error?.response?.data?.errors}>
          <Form className="w-full">
            <div className="flex gap-x-8 items-center">
              <BaseInputField
                id="name_ar"
                label={`${t("market in arabic")}`}
                name="name_ar"
                type="text"
                placeholder={`${t("market in arabic")}`}
              />

              <BaseInputField
                id="name_en"
                label={`${t("market in english")}`}
                name="name_en"
                type="text"
                placeholder={`${t("market in english")}`}
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
export const Markets = ({
  district,
  marketName = "market_id",
  fieldKey,
  label = "market",
  editData,
}: Markets_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();
  const { setFieldValue } = useFormikContext();

  ///
  /////////// SIDE EFFECTS
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const {
    data: markets,
    isLoading: marketsLoading,
    failureReason,
    refetch,
  } = useFetch<SelectOption_TP[], Market_TP>({
    queryKey: [`market/${district?.id}`],
    endpoint: `/governorate/api/v1/districts/${district?.id}?per_page=10000`,
    select: ({ markets }) =>
      markets.map((market) => ({
        ...market,
        id: market.id,
        value: market.name,
        label: market.name,
      })),
    enabled: !!district?.id,
  });

  //change value
  useEffect(() => {
    if (markets) {
      setNewValue(null);
    }
  }, [JSON.stringify(markets)]);
  useEffect(() => {
    setNewValue({
      id: editData?.nationalAddress?.market.id || editData?.markets_id || "",
      value:
        editData?.nationalAddress?.market.name || editData?.markets_name || "",
      label:
        editData?.nationalAddress?.market.name ||
        editData?.markets_name ||
        "اختر الحي اولا ",
    });
  }, []);
  ///
  return (
    <div className="flex flex-col gap-1 justify-center">
      <Select
        id={marketName}
        label={t(`${label}`).toString()}
        name={marketName}
        placeholder={
          district?.id
            ? markets?.length !== 0
              ? "اختر السوق"
              : "لايوجد"
            : "اختر الحي اولا"
        }
        isDisabled={editData ? false : !!!district?.id}
        loadingPlaceholder={`${
          !district?.id ? "اختر الحي أولا" : t("loading")
        }`}
        loading={marketsLoading}
        options={markets}
        creatable={true}
        CreateComponent={({ value, onAdd }) => {
          return NewMarketOptionComponent({
            districtId: district?.id as string,
            district_name: district?.name as string,
            value,
            onAdd,
          });
        }}
        value={newValue}
        modalTitle={`${t("add market")}`}
        onChange={(option: any) => {
          setNewValue(option);
        }}
        fieldKey={fieldKey}
        // defaultValue={{
        //   value: editData ? editData?.markets_name : "",
        //   label: editData
        //     ? editData?.markets_name
        //     : markets?.length !== 0
        //     ? "اختر المدينه"
        //     : "لا يوجد",
        // }}
      />
      <RefetchErrorHandler
        failureReason={failureReason}
        isLoading={marketsLoading}
        refetch={refetch}
      />
    </div>
  );
};
