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
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";

type PoliciesProps_TP = {
  title: string;
  job_id: string;
  job_type: string;
  max_buy_type_id: string;
  max_buy_type: string;
  max_buy_rate: string;
  max_buy_cash: string;
  return_days: string;
  sales_return: string;
  branch_id: string;
  branch_name: string;
};

type BuyingPoliciesProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: PoliciesProps_TP;
};

/**
 * Component for adding expenses policies.
 *
 * @param {BuyingPoliciesProps_TP} props - The component props.
 * @param {string} props.title - The title of the component.
 * @param {any} props.editData - The data to be edited.
 * @param {function} props.setShow - The function to control the visibility of the component.
 * @returns {JSX.Element} The rendered component.
 */
const AddExpensesPolicies = ({
  title,
  editData,
  setShow,
  refetch,
}: BuyingPoliciesProps_TP) => {
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      name_ar: Yup.string().trim().required(requiredTranslation),
      name_en: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    name_ar: editData?.name_ar || "",
    name_en: editData?.name_en || "",
  };

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["mainExpenses"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["mainExpenses"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/expenses/api/v1/majorexpences",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values: PoliciesProps_TP) => {
    mutate({
      endpointName: `/expenses/api/v1/majorexpences/${editData?.id}`,
      values: {
        ...values,
        _method: "put",
      },
    });
  };

  useEffect(() => {
    if (editData && isSuccessData) {
      setShow(false);
      refetch();
    }
  }, [isSuccessData]);

  return (
    <>
      <OuterFormLayout header={t("add main expenses policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            if (editData) {
              PostCardEdit({
                ...values,
              });
            } else {
              PostNewCard({
                ...values,
              });
              console.log({
                ...values,
              });
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                <div>
                  <BaseInputField
                    id="name_ar"
                    name="name_ar"
                    type="text"
                    label={`${t("expenses name in arabic")}`}
                    placeholder={`${t("expenses name in arabic")}`}
                    onChange={() => {
                      setFieldValue("name_ar", values?.name_ar);
                    }}
                  />
                </div>
                <div className="relative">
                  <BaseInputField
                    id="name_en"
                    type="text"
                    name="name_en"
                    label={`${t("expenses name in english")}`}
                    placeholder={`${t("expenses name in english")}`}
                    onChange={(e) => {
                      setFieldValue("name_en", values?.name_en);
                    }}
                    className="relative"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-fit"
                  loading={editLoading}
                >
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

export default AddExpensesPolicies;
