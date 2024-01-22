import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { Button } from "../../atoms";
import { t } from "i18next";
import * as Yup from "yup";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import { SelectOption_TP } from "../../../types";

const AddSalariesPolicies = ({ title, editData, setShow, refetch }) => {
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
      employee_id: Yup.string().trim().required(requiredTranslation),
      working_hours: Yup.string().trim().required(requiredTranslation),
      salary: Yup.string().trim().required(requiredTranslation),
      housing_allowance: Yup.string().trim().required(requiredTranslation),
      transport_allowance: Yup.string().trim().required(requiredTranslation),
      insurance_allowance: Yup.string().trim().required(requiredTranslation),
    });

  // Initial form values
  const initialValues = {
    employee_id: editData?.employee_id,
    salary: editData?.salary,
    working_hours: editData?.working_hours,
    housing_allowance: editData?.housing_allowance,
    transport_allowance: editData?.transport_allowance,
    insurance_allowance: editData?.insurance_allowance,
  };

  const {
    data: employeesOptions,
    isLoading: employeeLoading,
    refetch: refetchEmployees,
    failureReason: employeesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "/employee/api/v1/employees",
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
  console.log("🚀 ~ AddSalariesPolicies ~ employeesOptions:", employeesOptions);

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
      console.log(error);
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
                <div>
                  <BaseInputField
                    type="text"
                    id="working_hours"
                    name="working_hours"
                    label={`${t("working hours")}`}
                    placeholder={`${t("working hours")}`}
                    onChange={(e) => {}}
                  />
                </div>
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
                <div>
                  <BaseInputField
                    type="text"
                    id="housing_allowance"
                    name="housing_allowance"
                    label={`${t("housing allowance")}`}
                    placeholder={`${t("housing allowance")}`}
                    onChange={(e) => {}}
                  />
                </div>
                <div>
                  <BaseInputField
                    type="text"
                    id="transport_allowance"
                    name="transport_allowance"
                    label={`${t("transport allowance")}`}
                    placeholder={`${t("transport allowance")}`}
                    onChange={(e) => {}}
                  />
                </div>
                <div className="relative">
                  <BaseInputField
                    type="text"
                    id="insurance_allowance"
                    name="insurance_allowance"
                    label={`${t("insurance allowance")}`}
                    placeholder={`${t("insurance allowance")}`}
                    onChange={(e) => {}}
                    className="relative"
                  />
                  <span className="absolute left-3 top-9 font-bold text-mainGreen">
                    %
                  </span>
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

export default AddSalariesPolicies;
