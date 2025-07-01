import { t, use } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { requiredTranslation } from "../../../utils/helpers";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Button } from "../../atoms";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { SelectOption_TP } from "../../../types";

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
 * Component for adding sub expenses policies.
 *
 * @param {BuyingPoliciesProps_TP} props - The component props.
 * @param {string} props.title - The title of the component.
 * @param {any} props.editData - The data to be edited.
 * @param {function} props.setShow - The function to control the visibility of the component.
 * @returns {JSX.Element} The rendered component.
 */
const AddSubExpensesPolicies = ({
  title,
  editData,
  setShow,
  refetch: refetchTable,
  idInBranch,
}: BuyingPoliciesProps_TP) => {
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [newValue, setNewValue] = useState<any>(null);
  const [branchId, setBranchId] = useState<any>(null);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      name_ar: Yup.string().trim().required(requiredTranslation),
      name_en: Yup.string().trim().required(requiredTranslation),
      major_id: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    name_ar: editData?.name_ar || "",
    name_en: editData?.name_en || "",
    major_id: editData?.major_id || "",
    branch_id: idInBranch || editData?.branch_id,
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
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/expenses/api/v1/subexpences",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values: PoliciesProps_TP) => {
    mutate({
      endpointName: `/expenses/api/v1/subexpences/${editData?.id}`,
      values: {
        ...values,
        _method: "put",
      },
    });
  };

  useEffect(() => {
    if (editData && isSuccessData) {
      setShow(false);
      refetchTable();
    }
  }, [isSuccessData]);

  const {
    data: mainExpensesOption,
    isSuccess,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
    isFetching,
  } = useFetch({
    endpoint: `/expenses/api/v1/majorexpences?per_page=10000`,
    queryKey: ["mainExpensesOption"],
    select: (data) =>
      data.map((item) => {
        return {
          id: item.id,
          value: item.id || "",
          label: item.name_ar || "",
        };
      }),
  });

  useEffect(() => {
    if (branchId) {
      refetch();
    }
  }, [branchId]);

  useEffect(() => {
    const best = {
      id: editData?.id || "",
      value: editData?.major_name || "",
      label: editData?.major_name || `${t("choose type of expenses")}`,
    };
    setNewValue(best);
  }, []);

  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "/branch/api/v1/branches?per_page=10000",
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

  return (
    <>
      <OuterFormLayout header={t("add sub expenses policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            if (editData) {
              PostCardEdit({
                ...values,
                branch_id: idInBranch ? idInBranch : branchId,
              });
            } else {
              PostNewCard({
                ...values,
                branch_id: idInBranch ? idInBranch : branchId,
              });
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                {!idInBranch && (
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

                <div className="">
                  <Select
                    id="major_id"
                    label={`${t("main expense")}`}
                    name="major_id"
                    value={newValue}
                    // value={values?.major_id}
                    placeholder={`${t("main expense")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    isLoading={isLoading || isRefetching || isFetching}
                    options={mainExpensesOption}
                    onChange={(e) => {
                      setNewValue(e);
                    }}
                  />
                </div>
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

export default AddSubExpensesPolicies;
