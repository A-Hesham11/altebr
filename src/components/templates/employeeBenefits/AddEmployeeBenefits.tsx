import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import * as Yup from "yup";
import { notify } from "../../../utils/toast";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { Button } from "../../atoms";
import { t } from "i18next";
import { mutateData } from "../../../utils/mutateData";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";

const AddEmployeeBenefits = ({
  title,
  editData,
  setShow,
  refetch,
  receivablesData,
}: any) => {
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [percentage, setPercentage] = useState(false);
  const [branchId, setBranchId] = useState(0);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      entitlement_id: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
      employee_id: Yup.string().trim().required(requiredTranslation),
      value: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    entitlement_id: editData?.entitlement_id || "",
    branch_id: editData?.branch_id || "",
    employee_id: editData?.employee_id || "",
    value: editData?.value || "",
  };

  const {
    data: employeeBenefitsData,
    isLoading: isLoadingEmployeeBenefitsData,
    refetch: refetchEmployeeBenefitsData,
  } = useFetch({
    endpoint: "/employeeSalary/api/v1/entitlements?per_page=10000",
    queryKey: ["employeeBenefit"],
    select: (employeeBenefits) =>
      employeeBenefits.map((employeeBenefit) => {
        return {
          id: employeeBenefit.id,
          value: employeeBenefit.id || "",
          label: employeeBenefit.name_ar || "",
          type: employeeBenefit.type || "",
        };
      }),
    onError: (err) => console.log(err),
  });

  const {
    data: employeesOptions,
    isLoading: employeeLoading,
    refetch: refetchEmployees,
    failureReason: employeesErrorReason,
  } = useFetch<SelectOption_TP[]>({
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
          number: branch.number || "",
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
    mutationKey: ["employeeBenefits"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["employeeBenefits"]);
    },
    onError: (error) => {
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values) {
    mutate({
      endpointName: "/employeeSalary/api/v1/employee-entitlements",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values) => {
    mutate({
      endpointName: `/employeeSalary/api/v1/employee-entitlements/${editData?.id}`,
      values: {
        ...values,
        _method: "put",
      },
    });
  };

  useEffect(() => {
    if (branchId) {
      refetchEmployees();
    }
  }, [branchId]);

  useEffect(() => {
    if (editData && isSuccessData) {
      setShow(false);
      refetch();
    }
  }, [isSuccessData]);

  return (
    <>
      <OuterFormLayout header={t("add employee benefits policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {}}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                {!receivablesData && (
                  <Select
                    id="branch_id"
                    label={`${t("branches")}`}
                    name="branch_id"
                    placeholder={`${t("branches")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={branchesOptions}
                    formatOptionLabel={(option) => (
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        {option.number && (
                          <p>
                            {t("Branch")} - <span>{option.number}</span>
                          </p>
                        )}
                      </div>
                    )}
                    isLoading={branchesLoading}
                    onChange={(e) => {
                      setBranchId(e.id);
                    }}
                  />
                )}
                <Select
                  id="entitlement_id"
                  label={`${t("employee benefits")}`}
                  name="entitlement_id"
                  placeholder={`${t("employee benefits")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={employeeBenefitsData}
                  onChange={(e) => {
                    if (e.type === "نسبة") {
                      setPercentage(true);
                    } else {
                      setPercentage(false);
                    }
                  }}
                />
                {!receivablesData && (
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
                )}
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
                      if (receivablesData) {
                        PostCardEdit({
                          ...values,
                          branch_id: receivablesData[0]?.branch_id,
                          employee_id: receivablesData[0]?.employee_id,
                        });
                      } else {
                        PostCardEdit({
                          ...values,
                        });
                      }
                    } else {
                      if (receivablesData) {
                        PostNewCard({
                          ...values,
                          branch_id: receivablesData[0]?.branch_id,
                          employee_id: receivablesData[0]?.employee_id,
                        });
                      } else {
                        PostNewCard({
                          ...values,
                        });
                      }
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

export default AddEmployeeBenefits;
