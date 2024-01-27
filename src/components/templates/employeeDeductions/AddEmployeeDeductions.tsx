import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import * as Yup from "yup";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import { notify } from "../../../utils/toast";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { Button } from "../../atoms";
import { mutateData } from "../../../utils/mutateData";

const AddEmployeeDeductions = ({ title, editData, setShow, refetch }) => {
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
      deduction_id: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
      //   type: Yup.string().trim().required(requiredTranslation),
      employee_id: Yup.string().trim().required(requiredTranslation),
      value: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    deduction_id: editData?.deduction_id || "",
    branch_id: editData?.branch_id || "",
    employee_id: editData?.employee_id || "",
    // type: editData?.type || "",
    value: editData?.value || "",
  };

  const {
    data: employeeDeductionsData,
    isLoading: isLoadingEmployeeDeductionsData,
    refetch: refetchEmployeeDeductionsData,
  } = useFetch({
    endpoint: "/employeeSalary/api/v1/deductions",
    queryKey: ["employeeDeduction"],
    select: (employeeDeductions) =>
      employeeDeductions.map((employeeDeduction) => {
        return {
          id: employeeDeduction.id,
          value: employeeDeduction.id || "",
          label: employeeDeduction.name_ar || "",
          type: employeeDeduction.type || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const {
    data: employeesOptions,
    isLoading: employeeLoading,
    refetch: refetchEmployees,
    failureReason: employeesErrorReason,
  } = useFetch({
    endpoint: `/employeeSalary/api/v1/employee-per-branch/${branchId}`,
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
    mutationKey: ["employeeDeductions"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["employeeDeductions"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values) {
    mutate({
      endpointName: "/employeeSalary/api/v1/employee-deductions",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values) => {
    mutate({
      endpointName: `/employeeSalary/api/v1/employee-deductions/${editData?.id}`,
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
      <OuterFormLayout header={t("add employee deductions policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {}}
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
                  id="deduction_id"
                  label={`${t("employee deduction")}`}
                  name="deduction_id"
                  placeholder={`${t("employee deduction")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={employeeDeductionsData}
                  onChange={(e) => {
                    if (e.type === "نسبة") {
                      setPercentage(true);
                    } else {
                      setPercentage(false);
                    }
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
                <div className="relative">
                  <BaseInputField
                    id="value"
                    name="value"
                    type="text"
                    label={`${percentage ? t("percentage") : t("value")}`}
                    placeholder={`${percentage ? t("percentage") : t("value")}`}
                  />
                  {percentage && (
                    <span className="absolute left-3 top-9 font-bold text-mainGreen">
                      %
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-fit"
                  loading={editLoading}
                  action={() => {
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

export default AddEmployeeDeductions;
