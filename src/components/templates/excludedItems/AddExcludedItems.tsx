import { t } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { numberFormatterCtx } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { SelectOption_TP } from "../../../types";
import { SingleValue } from "react-select";
import { requiredTranslation } from "../../../utils/helpers";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Button } from "../../atoms";
import { SelectRole } from "../reusableComponants/roles/SelectRole";
import RadioGroup from "../../molecules/RadioGroup";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import SelectCategory from "../reusableComponants/categories/select/SelectCategory";

type PoliciesProps_TP = {
  title: string;
  job_id: string;
  job_type: string;
  category_id: string;
  category_name: string;
  min_selling_type_id: string;
  min_selling_type: string;
  min_discount_rate: string;
  min_discount_cash: string;
  return_days: string;
  sales_return: string;
  branch_id: string;
  branch_name: string;
};

type SellingPoliciesProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: PoliciesProps_TP;
};

const AddExcludedItems = ({ title, editData }: SellingPoliciesProps_TP) => {
  const [jobType, setJobType] = useState();
  const [minSellingType, setMinSellingType] = useState();

  const queryClient = useQueryClient();
  const isRTL = useIsRTL();

  const { userData } = useContext(authCtx);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      job_type: Yup.string().trim().required(requiredTranslation),
      category_id: Yup.string().trim().required(requiredTranslation),
      min_selling_type: Yup.string().trim().required(requiredTranslation),
      min_discount_rate: Yup.string().trim(),
      min_discount_cash: Yup.string().trim(),
      return_days: Yup.string().trim().required(requiredTranslation),
      sales_return: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    job_type: editData?.job_type || "",
    category_id: editData?.category_id || "",
    category_name: editData?.category_name || "",
    min_selling_type: editData?.min_selling_type || "",
    min_discount_rate: editData?.min_discount_rate || "",
    min_discount_cash: editData?.min_discount_cash || "",
    return_days: editData?.return_days || "",
    sales_return: editData?.sales_return || "",
    branch_id: userData?.branch_id,
  };

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["excludedItems"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["allExcludedItems"]);
    },
    onError: (error) => {
      notify("error");
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/excluded_items",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values: PoliciesProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/excluded_items/${editData?.id}`,
      values: {
        ...values,
        _method: "put",
      },
    });
  };

  useEffect(() => {
    const best = {
      id: editData?.job_type || "",
      value: editData?.job_type || "",
      label: editData?.job_type || `${t("job title")}`,
    };
    setJobType(best);
  }, []);

  useEffect(() => {
    const best = {
      id: editData?.min_selling_type || "",
      value: editData?.min_selling_type || "",
      label: editData?.min_selling_type || `${t("minimum sale type")}`,
    };
    setMinSellingType(best);
  }, []);

  const minSellingTypes = [
    {
      id: "percentage",
      label: t("percentage"),
      value: t("percentage"),
    },
    {
      id: "monetary",
      label: t("monetary"),
      value: t("monetary"),
    },
  ];

  const minSellingEmployee = [
    {
      id: "branch_manager",
      label: t("branch manager"),
      value: t("branch manager"),
    },
    {
      id: "branch_seller",
      label: t("branch seller"),
      value: t("branch seller"),
    },
  ];

  return (
    <>
      <OuterFormLayout header={t("add excluded category")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            if (editData) {
              PostCardEdit({
                ...values,
                min_discount_rate:
                  values?.min_selling_type === "نسبة" &&
                  values.min_discount_rate,
                min_discount_cash:
                  values?.min_selling_type === "نقدي" &&
                  values.min_discount_cash,
              });
            } else {
              PostNewCard({
                ...values,
                min_discount_rate:
                  values.min_selling_type === "نسبة" &&
                  values.min_discount_rate,
                min_discount_cash:
                  values.min_selling_type === "نقدي" &&
                  values.min_discount_cash,
              });
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                <Select
                  id="job_type"
                  label={`${t("job title")}`}
                  name="job_type"
                  placeholder={`${t("job title")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={minSellingEmployee}
                  fieldKey="id"
                  value={jobType}
                  onChange={(option: any) => {
                    setFieldValue("job_type", option!.value);
                    setJobType(option);
                  }}
                />
                <SelectBranches
                  required
                  name="branch_id"
                  editData={{
                    branch_id: editData?.branch_id,
                    branch_name: editData?.branch_name,
                  }}
                />
                <SelectCategory
                  id="category_id"
                  name="category_id"
                  label={t("categories")}
                  placement="top"
                  fieldKey="id"
                  value={{
                    id: values.category_id || values.category_id,
                    value: values.category_name || editData?.category_name,
                    label:
                      values.category_name ||
                      editData?.category_name ||
                      t("categories"),
                  }}
                  onChange={(option) => {
                    setFieldValue("category_id", option!.id);
                    setFieldValue("category_name", option!.value);
                  }}
                />
                <Select
                  id="min_selling_type"
                  label={`${t("minimum sale type")}`}
                  name="min_selling_type"
                  placeholder={`${t("minimum sale type")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={minSellingTypes}
                  fieldKey="id"
                  value={minSellingType}
                  onChange={(option: any) => {
                    setFieldValue("min_selling_type", option!.value);
                    setFieldValue("min_selling_type_id", option!.id);
                    setMinSellingType(option);
                  }}
                />
                {values?.min_selling_type === "نقدي" ? (
                  <div>
                    <BaseInputField
                      id="min_discount_cash"
                      name="min_discount_cash"
                      type="text"
                      label={`${t("minimum selling")} (${t("monetary")})`}
                      placeholder={`${t("minimum selling")}`}
                      onChange={() => {
                        setFieldValue(
                          "min_discount_cash",
                          values?.min_discount_cash
                        );
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <BaseInputField
                      id="min_discount_rate"
                      type="text"
                      name="min_discount_rate"
                      label={`${t("minimum selling")} (${t("rate")})`}
                      placeholder={`${t("minimum selling")}`}
                      onChange={(e) => {
                        setFieldValue(
                          "min_discount_rate",
                          values.min_discount_rate
                        );
                      }}
                      className="relative"
                    />
                    <span className="absolute left-3 top-9 font-bold text-mainGreen">
                      %
                    </span>
                  </div>
                )}
                <div>
                  <BaseInputField
                    id="return_days"
                    name="return_days"
                    type="text"
                    label={`${t("number of days response")}`}
                    placeholder={`${t("number of days response")}`}
                    onChange={(e) => {
                      setFieldValue("return_days", values?.return_days);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <RadioGroup name="sales_return">
                    <span>
                      {t("commission rate deduction for sales returns")}
                    </span>
                    <div className="flex gap-x-2">
                      <RadioGroup.RadioButton
                        id="yes"
                        value="yes"
                        label={`${t("yes")}`}
                      />
                      <RadioGroup.RadioButton
                        id="no"
                        value="no"
                        label={`${t("no")}`}
                      />
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="w-fit" loading={editLoading}>
                  {t("save")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </OuterFormLayout>
    </>
  );
};

export default AddExcludedItems;
