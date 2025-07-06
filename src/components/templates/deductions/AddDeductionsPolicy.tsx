import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useIsRTL, useMutate } from "../../../hooks";
import * as Yup from "yup";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { Button } from "../../atoms";
import { t } from "i18next";

const AddDeductionsPolicy = ({ title, editData, setShow, refetch }: any) => {
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
      type: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    name_ar: editData?.name_ar || "",
    name_en: editData?.name_en || "",
    type: editData?.type || "",
  };

  const typeOption = [
    { id: 0, value: "نسبة", label: "نسبة" },
    { id: 1, value: "نقدي", label: "نقدي" },
  ];

  const taxOption = [
    { id: 0, value: 0, label: "معفاه" },
    { id: 1, value: 1, label: "ضريبة" },
  ];

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["deductions"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["deductions"]);
    },
    onError: (error) => {
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values) {
    mutate({
      endpointName: "/employeeSalary/api/v1/deductions",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values) => {
    mutate({
      endpointName: `/employeeSalary/api/v1/deductions/${editData?.id}`,
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
      <OuterFormLayout header={t("add deductions policy")}>
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
                    label={`${t("deductions name in arabic")}`}
                    placeholder={`${t("deductions name in arabic")}`}
                  />
                </div>
                <div className="relative">
                  <BaseInputField
                    id="name_en"
                    type="text"
                    name="name_en"
                    label={`${t("deductions name in english")}`}
                    placeholder={`${t("deductions name in english")}`}
                    className="relative"
                  />
                </div>
                <Select
                  id="type"
                  label={`${t("type")}`}
                  name="type"
                  placeholder={`${t("type")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={typeOption}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-fit"
                  loading={editLoading}
                  // action={() => setShow(false)}
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

export default AddDeductionsPolicy;
