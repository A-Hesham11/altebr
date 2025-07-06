import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { Button } from "../../atoms";
import { t } from "i18next";
import * as Yup from "yup";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import { SelectOption_TP } from "../../../types";

const AddSalariesPolicies = ({ title, editData, setShow, refetch }: any) => {
  // Various state variables and hooks
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [branchId, setBranchId] = useState<string>(0);
  const [shifts, setShifts] = useState<SelectOption_TP[]>([]);

  // const []

  // Effect hook to handle RTL layout
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  // Form validation schema
  const cardsValidatingSchema = () =>
    Yup.object({
      employee_id: Yup.string().trim().required(requiredTranslation),
      salary: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
    });

  // Initial form values
  const initialValues = {
    employee_id: editData?.employee_id,
    salary: editData?.salary,
    branch_id: editData?.branch_id,
  };

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
    data: shiftData,
    isLoading: shiftLoading,
    refetch: refetchShifts,
    failureReason: shiftErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: `/employeeSalary/api/v1/shifts-per-branch/${branchId}?per_page=10000`,
    queryKey: ["shifts"],
    select: (shifts) => {
      return shifts.map((shift) => {
        return {
          id: shift.id,
          value: shift.id,
          label: shift.shift_name,
          name: shift.id,
        };
      });
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (branchId) {
      refetchShifts();
      refetchEmployees();
    }
  }, [branchId]);

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

  // Mutation hook for mutating data
  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["salary"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["salary"]);
    },
    onError: (error) => {
      notify("error", error?.response?.data?.message);
    },
  });

  // Function to post a new card
  function PostNewCard(values) {
    mutate({
      endpointName: "/employeeSalary/api/v1/salaries",
      values,
      method: "post",
    });
  }

  // Function to edit a card
  const PostCardEdit = (values) => {
    mutate({
      endpointName: `/employeeSalary/api/v1/salaries/${editData?.id}`,
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

  // useEffect(() => {
  //   const best = {
  //       id: editData?.job_type || "",
  //       value: editData?.job_type || "",
  //       label: editData?.job_type || `${t("job title")}` ,
  //   }
  //   // setJobType(best);
  // }, []);

  // useEffect(() => {
  //   const best = {
  //       id: editData?.max_buy_type || "",
  //       value: editData?.max_buy_type || "",
  //       label: editData?.max_buy_type || `${t("maximum buy type")}` ,
  //   }
  //   // setmaxBuyingType(best);
  // }, []);

  // Return the component JSX
  return (
    <>
      <OuterFormLayout header={t("add salary policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            if (editData) {
              PostCardEdit({
                ...values,
                workingshifts: shifts?.map((shift) => ({ id: shift.id })),
              });
            } else {
              PostNewCard({
                ...values,
                workingshifts: shifts?.map((shift) => ({ id: shift.id })),
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
                <div>
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
                </div>
                <Select
                  id={"workingshifts"}
                  label={`${t("working shifts")}`}
                  name={"workingshifts"}
                  placeholder={`${t("working shifts")}`}
                  loadingPlaceholder={`${t("Loading...")}`}
                  options={shiftData}
                  loading={shiftLoading}
                  isMulti
                  creatable
                  onChange={(e) => {
                    setShifts(e);
                  }}
                />
                <div>
                  <BaseInputField
                    type="text"
                    id="salary"
                    name="salary"
                    label={`${t("salary")}`}
                    placeholder={`${t("salary")}`}
                    onChange={(e) => {}}
                  />
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

export default AddSalariesPolicies;
