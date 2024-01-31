import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import * as Yup from "yup";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { Button } from "../../atoms";
import { t } from "i18next";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";

const AddCommision = ({ title, editData, setShow, refetch }) => {
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [percentage, setPercentage] = useState(false);
  const [branchId, setBranchId] = useState<string>(0);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      branch_id: Yup.string().trim().required(requiredTranslation),
      employee_id: Yup.string().trim().required(requiredTranslation),
      type: Yup.string().trim().required(requiredTranslation),
      commission: Yup.string().trim().required(requiredTranslation),
      target: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    branch_id: editData?.branch_id || "",
    target: editData?.target || "",
    employee_id: editData?.employee_id || "",
    type: editData?.type || "",
    commission: editData?.commission || "",
  };

  const typeOption = [
    { id: 0, value: "نسبة", label: "نسبة" },
    { id: 1, value: "نقدي", label: "نقدي" },
  ];

  const {
    data: employeesOptions,
    isLoading: employeeLoading,
    refetch: refetchEmployees,
    failureReason: employeesErrorReason,
  } = useFetch({
    endpoint: `/employeeSalary/api/v1/employee-per-branch/${branchId}?per_page=10000`,
    queryKey: ["employees"],
    select: (employees) =>
      employees.map((employee) => {
        return {
          id: employee.id,
          value: employee.id || "",
          label: employee.name || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        return {
          id: branch.id,
          value: branch.id || "",
          label: branch.name || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["commission"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["commission"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values) {
    mutate({
      endpointName: "/employeeSalary/api/v1/commissions",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values) => {
    mutate({
      endpointName: `/employeeSalary/api/v1/commissions/${editData?.id}`,
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

  useEffect(() => {
    if (branchId) {
      refetchEmployees();
    }
  }, [branchId]);

  return (
    <>
      <OuterFormLayout header={t("add commission policy")}>
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
                <Select
                  id="branch_id"
                  label={`${t("branches")}`}
                  name="branch_id"
                  placeholder={`${t("branches")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={branchesOptions}
                  isLoading={branchesLoading}
                  onChange={(e) => {
                    setBranchId(e.id);
                  }}
                />

                <Select
                  id="employee_id"
                  label={`${t("employee")}`}
                  name="employee_id"
                  placeholder={`${t("employee")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={employeesOptions}
                  isLoading={employeeLoading}
                  onChange={(e) => {
                    //   setBranchId(e.id);
                  }}
                />

                <Select
                  id="type"
                  label={`${t("type")}`}
                  name="type"
                  placeholder={`${t("type")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={typeOption}
                  onChange={(e) => {
                    if (e.value === "نسبة") {
                      setPercentage(true);
                    } else {
                      setPercentage(false);
                    }
                  }}
                />

                <div className="relative">
                  <BaseInputField
                    id="commission"
                    name="commission"
                    type="text"
                    label={`${t("commission")}`}
                    placeholder={`${t("commission")}`}
                  />
                  {percentage && (
                    <span className="absolute left-3 top-9 font-bold text-mainGreen">
                      %
                    </span>
                  )}
                </div>

                <div>
                  <BaseInputField
                    id="target"
                    name="target"
                    type="text"
                    label={`${t("target")}`}
                    placeholder={`${t("target")}`}
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

export default AddCommision;
