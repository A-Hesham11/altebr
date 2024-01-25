import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useIsRTL, useMutate } from "../../../hooks";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import * as Yup from "yup";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import {
  BaseInputField,
  DateInputField,
  OuterFormLayout,
  Select,
} from "../../molecules";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { Button } from "../../atoms";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";

const AddWorkHours = ({ title, editData, setShow, refetch }) => {
  // Various state variables and hooks
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();

  // Effect hook to handle RTL layout
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  // Form validation schema
  const cardsValidatingSchema = () =>
    Yup.object({
      shift_from: Yup.string().trim().required(requiredTranslation),
      shift_to: Yup.string().trim().required(requiredTranslation),
      shift_name: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
    });

  const shiftOptions = [
    { value: 1, label: "الفترة الاولى" },
    { value: 2, label: "الفترة الثانية" },
  ];

  // Initial form values
  const initialValues = {
    shift_name: editData?.shift_name,
    shift_from: editData?.shift_from,
    shift_to: editData?.shift_to,
    branch_id: editData?.branch_id,
  };

  // Mutation hook for mutating data
  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["workHours"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["work"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message);
    },
  });

  // Function to post a new card
  function PostNewCard(values) {
    mutate({
      endpointName: "/employeeSalary/api/v1/shifts",
      values,
      method: "post",
    });
  }

  // Function to edit a card
  const PostCardEdit = (values) => {
    mutate({
      endpointName: `/employeeSalary/api/v1/shifts/${editData?.id}`,
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

  // Return the component JSX
  return (
    <>
      <OuterFormLayout header={t("add work shift policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
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
                <SelectBranches
                  required
                  name="branch_id"
                  editData={{
                    branch_id: editData?.branch_id,
                    branch_name: editData?.branch_name,
                  }}
                />
                <div>
                  <BaseInputField
                    type="text"
                    id="shift_name"
                    label={`${t("shift")}`}
                    name="shift_name"
                    placeholder={`${t("shift")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    onChange={(e) => {}}
                  />
                </div>
                <div>
                  <BaseInputField
                    type="time"
                    id="shift_from"
                    name="shift_from"
                    label={`${t("shift from")}`}
                    placeholder={`${t("shift from")}`}
                    onChange={(e) => {}}
                  />
                </div>
                <div>
                  <BaseInputField
                    type="time"
                    id="shift_to"
                    name="shift_to"
                    label={`${t("shift to")}`}
                    placeholder={`${t("shift to")}`}
                    onChange={(e) => {}}
                  />
                </div>
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

export default AddWorkHours;
