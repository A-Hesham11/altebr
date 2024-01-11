import { t } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { requiredTranslation } from "../../../utils/helpers";
import {
  BaseInputField,
  CheckBoxField,
  OuterFormLayout,
  Select,
} from "../../molecules";
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

const AddTaxExpensesPolicy = ({
  title,
  editData,
  setShow,
}: BuyingPoliciesProps_TP) => {
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [taxAdded, setTaxAdded] = useState<boolean>(false);
  const [taxZero, setTaxZero] = useState<boolean>(false);
  const [taxExempt, setTaxExempt] = useState<boolean>(false);
  const dataSend = [];

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      branch_id: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    value_added: editData?.value_added || "",
    value_zero: editData?.value_zero || "",
    value_exempt: editData?.value_exempt || "",
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
    mutationKey: ["taxExpensesPolicy"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["taxExpensesPolicy"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.errors?.msg);
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/expenses/api/v1/add-expence-tax",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values: PoliciesProps_TP) => {
    mutate({
      endpointName: `/expenses/api/v1/add-expence-tax/${editData?.id}`,
      values: {
        ...values,
        _method: "put",
      },
    });
  };

  return (
    <>
      <OuterFormLayout header={t("add tax expenses policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            if (editData) {
              if (taxAdded) {
                const data = {
                  name: "ضريبة القيمة المضافه",
                  value: +values?.value_added,
                  branch_id: values?.branch_id,
                };

                dataSend.push(data);
              }

              if (taxZero) {
                const data = {
                  name: "ضريبة صفريه",
                  value: +values?.value_zero,
                  branch_id: values?.branch_id,
                };

                dataSend.push(data);
              }

              if (taxExempt) {
                const data = {
                  name: "ضريبة معفاه",
                  value: "",
                  branch_id: values?.branch_id,
                };

                dataSend.push(data);
              }

              PostCardEdit({ expenses: dataSend });
              console.log({ expenses: dataSend });
            } else {
              if (taxAdded) {
                const data = {
                  name: "ضريبة القيمة المضافه",
                  value: +values?.value_added,
                  branch_id: values?.branch_id,
                };

                dataSend.push(data);
              }

              if (taxZero) {
                const data = {
                  name: "ضريبة صفريه",
                  value: +values?.value_zero,
                  branch_id: values?.branch_id,
                };

                dataSend.push(data);
              }

              if (taxExempt) {
                const data = {
                  name: "ضريبة معفاه",
                  value: "",
                  branch_id: values?.branch_id,
                };

                dataSend.push(data);
              }
            }

            PostNewCard({ expenses: dataSend });
            console.log({ expenses: dataSend });
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-4 gap-x-6 gap-y-4 items-end mb-8">
                <div className="space-y-2">
                  <input
                    type="checkbox"
                    id="name_added"
                    name="name_added"
                    onChange={() => {
                      setTaxAdded(!taxAdded);
                    }}
                  />

                  <label htmlFor="name" className="ms-2">
                    {t("value added tax")}
                  </label>
                  <BaseInputField
                    className=""
                    id="value_added"
                    type="text"
                    name="value_added"
                    placeholder={`${t("value")}`}
                    onChange={(e) => {
                      setFieldValue("value_added", values?.value_added);
                    }}
                    className={`relative`}
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="checkbox"
                    id="name_zero"
                    name="name_zero"
                    onChange={() => {
                      setTaxZero(!taxZero);
                    }}
                  />

                  <label htmlFor="name" className="ms-2">
                    {t("zero tax")}
                  </label>
                  <BaseInputField
                    className=""
                    id="value_zero"
                    type="text"
                    name="value_zero"
                    placeholder={`${t("value")}`}
                    onChange={(e) => {
                      setFieldValue("value_zero", values?.value_zero);
                    }}
                    className="relative"
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="checkbox"
                    id="name_exempt"
                    name="name_exempt"
                    onChange={() => {
                      setTaxExempt(!taxExempt);
                    }}
                  />

                  <label htmlFor="name" className="ms-2">
                    {t("tax exempt")}
                  </label>
                  <BaseInputField
                    className=""
                    id="value_exempt"
                    type="text"
                    name="value_exempt"
                    disabled
                    placeholder={`${t("value")}`}
                    onChange={(e) => {
                      setFieldValue("value_exempt", null);
                    }}
                    className={`relative disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-500`}
                  />
                </div>

                <SelectBranches
                  required
                  name="branch_id"
                  editData={{
                    branch_id: editData?.branch_id,
                    branch_name: editData?.branch_name,
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-fit"
                  loading={editLoading}
                  action={() => setShow(false)}
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

export default AddTaxExpensesPolicy;
