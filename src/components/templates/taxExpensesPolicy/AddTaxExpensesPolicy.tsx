// Importing necessary libraries and components
import { t } from "i18next"; // Internationalization library
import { useContext, useEffect, useState } from "react"; // React hooks
import { useIsRTL, useMutate } from "../../../hooks"; // Custom hooks
import { notify } from "../../../utils/toast"; // Toast notification utility
import { authCtx } from "../../../context/auth-and-perm/auth"; // Authentication context
import { Form, Formik } from "formik"; // Formik for form handling
import * as Yup from "yup"; // Yup for form validation
import { useQueryClient } from "@tanstack/react-query"; // React Query for server state management
import { mutateData } from "../../../utils/mutateData"; // Utility for mutating data
import { requiredTranslation } from "../../../utils/helpers"; // Helper for required translations
import { BaseInputField, OuterFormLayout } from "../../molecules"; // Custom components
import { Button } from "../../atoms"; // Custom components
import { SelectBranches } from "../reusableComponants/branches/SelectBranches"; // Custom components

// Type definitions for the props
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
 * AddTaxExpensesPolicy component is used to add a new tax expenses policy.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the policy.
 * @param {Object} props.editData - The data to be edited (optional).
 * @param {function} props.setShow - The function to control the visibility of the component.
 * @param {function} props.refetch - The function to refetch data after adding the policy.
 */
const AddTaxExpensesPolicy = ({
  title,
  editData,
  setShow,
  refetch,
}: BuyingPoliciesProps_TP) => {
  // Various state variables and hooks
  const queryClient = useQueryClient();
  const { userData } = useContext(authCtx);
  const isRTL = useIsRTL();
  const [taxAdded, setTaxAdded] = useState<boolean>(false);
  console.log("🚀 ~ taxAdded:", taxAdded);
  const [taxZero, setTaxZero] = useState<boolean>(false);
  const [taxExempt, setTaxExempt] = useState<boolean>(false);
  const dataSend = [];
  let inputContent;

  // Effect hook to handle RTL layout
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  // Form validation schema
  const cardsValidatingSchema = () =>
    Yup.object({
      branch_id: Yup.string().trim().required(requiredTranslation),
    });

  // Initial form values
  const initialValues = {
    value_added:
      editData?.name === "ضريبة القيمة المضافه" ? editData?.value : "",
    value_zero:
      editData?.name === "ضريبة صفريه" || editData?.value == 0
        ? editData?.value
        : "",
    value_exempt: "",
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
    mutationKey: ["taxExpensesPolicy"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["taxExpensesPolicy"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message);
    },
  });

  // Function to post a new card
  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/expenses/api/v1/add-expence-tax",
      values,
      method: "post",
    });
  }

  // Function to edit a card
  const PostCardEdit = (values: PoliciesProps_TP) => {
    mutate({
      endpointName: `/expenses/api/v1/edit-expence-tax/${editData?.id}`,
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
      <OuterFormLayout header={t("add tax expenses policy")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            if (!taxAdded && !taxZero && !taxExempt) {
              notify("error", t("please select a tax type"));
              return;
            }

            const taxTypes = [
              {
                condition: taxAdded,
                name: "ضريبة القيمة المضافه",
                value: values?.value_added,
              },
              {
                condition: taxZero,
                name: "ضريبة صفريه",
                value: values?.value_zero,
              },
              { condition: taxExempt, name: "ضريبة معفاه", value: "" },
            ];

            const createData = (name, value) => ({
              name,
              value: +value,
              branch_id: values?.branch_id,
            });

            if (editData) {
              const data = taxTypes.find((taxType) => taxType.condition);
              if (data) {
                await PostCardEdit(createData(data.name, data.value));
              }
            } else {
              taxTypes.forEach((taxType) => {
                if (taxType.condition) {
                  // if (
                  //   taxType.name === "ضريبة القيمة المضافه" &&
                  //   taxType.value === ""
                  // ) {
                  //   notify("error", "يجب ادخال قيمة ضريبة القيمة المضافة");
                  //   return;
                  // }
                  dataSend.push(createData(taxType.name, taxType.value));
                }
              });
              await PostNewCard({ expenses: dataSend });
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-4 gap-x-6 gap-y-4 items-end mb-8">
                <SelectBranches
                  required
                  name="branch_id"
                  editData={{
                    branch_id: editData?.branch_id,
                    branch_name: editData?.branch_name,
                  }}
                />
                {editData && editData.name === "ضريبة القيمة المضافه" && (
                  <div className="space-y-2">
                    <input
                      type="checkbox"
                      id="name_added"
                      name="name_added"
                      required
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
                )}

                {editData && editData.name === "ضريبة صفريه" && (
                  <div className="space-y-2">
                    <input
                      type="checkbox"
                      id="name_zero"
                      required
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
                )}

                {/* {editData && editData.name === "ضريبة معفاه" && (
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
                )} */}

                {!editData && (
                  <>
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
                        placeholder={`${t("tax exempt")}`}
                        onChange={(e) => {
                          setFieldValue("value_exempt", null);
                        }}
                        className={`relative disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-500`}
                      />
                    </div>
                  </>
                )}
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

export default AddTaxExpensesPolicy;

// import { t } from "i18next";
// import { ChangeEvent, useContext, useEffect, useState } from "react";
// import { useFetch, useIsRTL, useMutate } from "../../../hooks";
// import { notify } from "../../../utils/toast";
// import { authCtx } from "../../../context/auth-and-perm/auth";
// import { Form, Formik, useFormikContext } from "formik";
// import * as Yup from "yup";
// import { useQueryClient } from "@tanstack/react-query";
// import { mutateData } from "../../../utils/mutateData";
// import { requiredTranslation } from "../../../utils/helpers";
// import {
//   BaseInputField,
//   CheckBoxField,
//   OuterFormLayout,
//   Select,
// } from "../../molecules";
// import { Button } from "../../atoms";
// import { SelectBranches } from "../reusableComponants/branches/SelectBranches";

// type PoliciesProps_TP = {
//   title: string;
//   job_id: string;
//   job_type: string;
//   max_buy_type_id: string;
//   max_buy_type: string;
//   max_buy_rate: string;
//   max_buy_cash: string;
//   return_days: string;
//   sales_return: string;
//   branch_id: string;
//   branch_name: string;
// };

// type BuyingPoliciesProps_TP = {
//   title: string;
//   value?: string;
//   onAdd?: (value: string) => void;
//   editData?: PoliciesProps_TP;
// };

// /**
//  * Component for adding a tax expenses policy.
//  *
//  * @param title - The title of the tax expenses policy.
//  * @param editData - The data for editing an existing tax expenses policy.
//  * @param setShow - Function to control the visibility of the component.
//  * @param refetch - Function to refetch data after adding a tax expenses policy.
//  */
// const AddTaxExpensesPolicy = ({
//   title,
//   editData,
//   setShow,
//   refetch,
// }: BuyingPoliciesProps_TP) => {
//   console.log("🚀 ~ editData:", editData);
//   const queryClient = useQueryClient();
//   const { userData } = useContext(authCtx);
//   const isRTL = useIsRTL();
//   const [taxAdded, setTaxAdded] = useState<boolean>(false);
//   const [taxZero, setTaxZero] = useState<boolean>(false);
//   const [taxExempt, setTaxExempt] = useState<boolean>(false);
//   const dataSend = [];
//   let inputContent;

//   useEffect(() => {
//     document.documentElement.dir = isRTL ? "rtl" : "ltr";
//     document.documentElement.lang = isRTL ? "ar" : "en";
//   }, [isRTL]);

//   const cardsValidatingSchema = () =>
//     Yup.object({
//       branch_id: Yup.string().trim().required(requiredTranslation),
//     });

//   const initialValues = {
//     value_added:
//       editData?.name === "ضريبة القيمة المضافه" ? editData?.value : "",
//     value_zero:
//       editData?.name === "ضريبة صفريه" || editData?.value == 0
//         ? editData?.value
//         : "",
//     value_exempt: "",
//     branch_id: editData?.branch_id,
//   };

//   const {
//     mutate,
//     isLoading: editLoading,
//     data,
//     isSuccess: isSuccessData,
//     reset,
//   } = useMutate({
//     mutationFn: mutateData,
//     mutationKey: ["taxExpensesPolicy"],
//     onSuccess: (data) => {
//       notify("success");
//       queryClient.refetchQueries(["taxExpensesPolicy"]);
//     },
//     onError: (error) => {
//       console.log(error);
//       notify("error", error?.response?.data?.errors?.msg);
//     },
//   });

//   function PostNewCard(values: PoliciesProps_TP) {
//     mutate({
//       endpointName: "/expenses/api/v1/add-expence-tax",
//       values,
//       method: "post",
//     });
//   }

//   const PostCardEdit = (values: PoliciesProps_TP) => {
//     mutate({
//       endpointName: `/expenses/api/v1/edit-expence-tax/${editData?.id}`,
//       values: {
//         ...values,
//         _method: "put",
//       },
//     });
//   };

//   return (
//     <>
//       <OuterFormLayout header={t("add tax expenses policy")}>
//         <Formik
//           validationSchema={() => cardsValidatingSchema()}
//           initialValues={initialValues}
//           onSubmit={async (values, { resetForm }) => {
//             if (editData) {
//               let data;
//               if (taxAdded) {
//                 data = {
//                   name: "ضريبة القيمة المضافه",
//                   value: +values?.value_added,
//                   branch_id: values?.branch_id,
//                 };
//               }

//               if (taxZero) {
//                 data = {
//                   name: "ضريبة صفريه",
//                   value: +values?.value_zero,
//                   branch_id: values?.branch_id,
//                 };
//               }

//               if (taxExempt) {
//                 data = {
//                   name: "ضريبة معفاه",
//                   value: "",
//                   branch_id: values?.branch_id,
//                 };
//               }

//               console.log(data);
//               await PostCardEdit(data);
//               setShow(false);
//               refetch();
//             } else {
//               if (taxAdded) {
//                 if (values?.value_added === "") {
//                   console.log(values?.value_added);
//                   notify("error", "يجب ادخال قيمة ضريبة القيمة المضافة");
//                   return;
//                 }

//                 const data = {
//                   name: "ضريبة القيمة المضافه",
//                   value: +values?.value_added,
//                   branch_id: values?.branch_id,
//                 };

//                 dataSend.push(data);
//               }

//               if (taxZero) {
//                 const data = {
//                   name: "ضريبة صفريه",
//                   value: +values?.value_zero,
//                   branch_id: values?.branch_id,
//                 };

//                 dataSend.push(data);
//               }

//               if (taxExempt) {
//                 const data = {
//                   name: "ضريبة معفاه",
//                   value: "",
//                   branch_id: values?.branch_id,
//                 };

//                 dataSend.push(data);
//               }

//               console.log({ expenses: dataSend });
//               await PostNewCard({ expenses: dataSend });
//               setShow(false);
//               refetch();
//             }
//           }}
//         >
//           {({ values, setFieldValue, resetForm }) => (
//             <Form>
//               <div className="grid grid-cols-4 gap-x-6 gap-y-4 items-end mb-8">
//                 {editData && editData.name === "ضريبة القيمة المضافه" && (
//                   <div className="space-y-2">
//                     <input
//                       type="checkbox"
//                       id="name_added"
//                       name="name_added"
//                       required
//                       onChange={() => {
//                         setTaxAdded(!taxAdded);
//                       }}
//                     />

//                     <label htmlFor="name" className="ms-2">
//                       {t("value added tax")}
//                     </label>
//                     <BaseInputField
//                       className=""
//                       id="value_added"
//                       type="text"
//                       name="value_added"
//                       placeholder={`${t("value")}`}
//                       onChange={(e) => {
//                         setFieldValue("value_added", values?.value_added);
//                       }}
//                       className={`relative`}
//                     />
//                   </div>
//                 )}

//                 {editData && editData.name === "ضريبة صفريه" && (
//                   <div className="space-y-2">
//                     <input
//                       type="checkbox"
//                       id="name_zero"
//                       required
//                       name="name_zero"
//                       onChange={() => {
//                         setTaxZero(!taxZero);
//                       }}
//                     />

//                     <label htmlFor="name" className="ms-2">
//                       {t("zero tax")}
//                     </label>
//                     <BaseInputField
//                       className=""
//                       id="value_zero"
//                       type="text"
//                       name="value_zero"
//                       placeholder={`${t("value")}`}
//                       onChange={(e) => {
//                         setFieldValue("value_zero", values?.value_zero);
//                       }}
//                       className="relative"
//                     />
//                   </div>
//                 )}

//                 {/* {editData && editData.name === "ضريبة معفاه" && (
//                   <div className="space-y-2">
//                     <input
//                       type="checkbox"
//                       id="name_exempt"
//                       name="name_exempt"
//                       onChange={() => {
//                         setTaxExempt(!taxExempt);
//                       }}
//                     />

//                     <label htmlFor="name" className="ms-2">
//                       {t("tax exempt")}
//                     </label>
//                     <BaseInputField
//                       className=""
//                       id="value_exempt"
//                       type="text"
//                       name="value_exempt"
//                       disabled
//                       placeholder={`${t("value")}`}
//                       onChange={(e) => {
//                         setFieldValue("value_exempt", null);
//                       }}
//                       className={`relative disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-500`}
//                     />
//                   </div>
//                 )} */}

//                 {!editData && (
//                   <>
//                     <div className="space-y-2">
//                       <input
//                         type="checkbox"
//                         id="name_added"
//                         name="name_added"
//                         onChange={() => {
//                           setTaxAdded(!taxAdded);
//                         }}
//                       />

//                       <label htmlFor="name" className="ms-2">
//                         {t("value added tax")}
//                       </label>
//                       <BaseInputField
//                         className=""
//                         id="value_added"
//                         type="text"
//                         name="value_added"
//                         placeholder={`${t("value")}`}
//                         onChange={(e) => {
//                           setFieldValue("value_added", values?.value_added);
//                         }}
//                         className={`relative`}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <input
//                         type="checkbox"
//                         id="name_zero"
//                         name="name_zero"
//                         onChange={() => {
//                           setTaxZero(!taxZero);
//                         }}
//                       />

//                       <label htmlFor="name" className="ms-2">
//                         {t("zero tax")}
//                       </label>
//                       <BaseInputField
//                         className=""
//                         id="value_zero"
//                         type="text"
//                         name="value_zero"
//                         placeholder={`${t("value")}`}
//                         onChange={(e) => {
//                           setFieldValue("value_zero", values?.value_zero);
//                         }}
//                         className="relative"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <input
//                         type="checkbox"
//                         id="name_exempt"
//                         name="name_exempt"
//                         onChange={() => {
//                           setTaxExempt(!taxExempt);
//                         }}
//                       />

//                       <label htmlFor="name" className="ms-2">
//                         {t("tax exempt")}
//                       </label>
//                       <BaseInputField
//                         className=""
//                         id="value_exempt"
//                         type="text"
//                         name="value_exempt"
//                         disabled
//                         placeholder={`${t("value")}`}
//                         onChange={(e) => {
//                           setFieldValue("value_exempt", null);
//                         }}
//                         className={`relative disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-500`}
//                       />
//                     </div>
//                   </>
//                 )}

//                 <SelectBranches
//                   required
//                   name="branch_id"
//                   editData={{
//                     branch_id: editData?.branch_id,
//                     branch_name: editData?.branch_name,
//                   }}
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <Button
//                   type="submit"
//                   className="w-fit"
//                   loading={editLoading}
//                   // action={() => setShow(false)}
//                 >
//                   {t("save")}
//                 </Button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </OuterFormLayout>
//     </>
//   );
// };

// export default AddTaxExpensesPolicy;
