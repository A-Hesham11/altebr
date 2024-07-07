import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { requiredTranslation } from "../../../utils/helpers";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Button } from "../../atoms";
import RadioGroup from "../../molecules/RadioGroup";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { PermissionGroup_TP } from "../../../pages/administrativeStructure/types-and-schemas";

type PoliciesProps_TP = {
  title: string;
  job_id: string;
  job_type: string;
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

const AddSellingPolicies = ({ editData }: SellingPoliciesProps_TP) => {
  const [jobType, setJobType] = useState();
  const [minSellingType, setMinSellingType] = useState();
  //   const [positionEmployee, setPositionEmployee] = useState();
  //   console.log("🚀 ~ positionEmployee:", positionEmployee);

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
      min_selling_type: Yup.string().trim().required(requiredTranslation),
      min_discount_rate: Yup.string().trim(),
      min_discount_cash: Yup.string().trim(),
      return_days: Yup.string().trim().required(requiredTranslation),
      sales_return: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    job_type: editData?.job_type || "",
    min_selling_type: editData?.min_selling_type || "",
    min_discount_rate: editData?.min_discount_rate || "",
    min_discount_cash: editData?.min_discount_cash || "",
    return_days: editData?.return_days || "",
    sales_return: editData?.sales_return || "",
    branch_id: editData?.branch_id,
  };

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["minSelling"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["allMinimum_Selling"]);
    },
    onError: (error) => {
      notify("info", error?.response?.data?.errors?.msg);
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/create_minimum_selling",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values: PoliciesProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/minimum_selling/${editData?.id}`,
      values: {
        ...values,
        _method: "put",
      },
    });
  };

  const {
    data: jobTitle,
    isSuccess,
    isFetching,
  } = useFetch<PermissionGroup_TP[]>({
    endpoint: "administrative/api/v1/roles?per_page=10000",
    queryKey: ["allRolesEmployee"],
    select: (data) => {
      return data?.map((item) => ({
        value: item.name,
        label: item.name,
        id: item.id,
        is_selling: item.is_selling
      }));
    },
  });
  
  const filterJobTitle = jobTitle?.filter((item) => item.is_selling !== 0)

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

  return (
    <>
      <OuterFormLayout header={t("add selling policy")}>
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
                  values?.min_selling_type === "نسبة" &&
                  values.min_discount_rate,
                min_discount_cash:
                  values?.min_selling_type === "نقدي" &&
                  values.min_discount_cash,
              });
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => {
            console.log("🚀 ~ AddSellingPolicies ~ values:", values)
            
            return(
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                <Select
                  id="job_type"
                  label={`${t("job title")}`}
                  name="job_type"
                  placeholder={`${t("job title")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={filterJobTitle}
                  fieldKey="id"
                  value={jobType}
                  onChange={(option: any) => {
                    setFieldValue("job_type", option!.id);
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
                      label={`${t(
                        "Sales price difference from the international price"
                      )} (${t("monetary")})`}
                      placeholder={`${t(
                        "Sales price difference from the international price"
                      )}`}
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
                      label={`${t(
                        "Sales price difference from the international price"
                      )} (${t("rate")})`}
                      placeholder={`${t(
                        "Sales price difference from the international price"
                      )}`}
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
                <div>
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
          )}}
        </Formik>
      </OuterFormLayout>
    </>
  );
};

export default AddSellingPolicies;
