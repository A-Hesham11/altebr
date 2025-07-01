/////////// IMPORTS
///
//import classes from './SizesForm.module.css'
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SingleValue } from "react-select";
import * as Yup from "yup";
import { useFetch, useMutate } from "../../../../hooks";
import { SelectOption_TP } from "../../../../types";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors";
import { SizeFormMainData } from "./SizeFormMainData";
/////////// Types
///
type sizesTypes_TP = {
  category_name: string;
  id: string;
  start: number;
  end: number;
  increase: number;
  type: string;
  units: [{ id: string; size_id: string; value: string }];
};
type categories_TP = {};
type TypesMutate_TP = {
  name: string;
  id: string;
};

/////////// HELPER VARIABLES & FUNCTIONS
///
///

// const NewSizeTypeOptionComponent = ({
//   value,
//   onAdd,
// }: {
//   value: string
//   onAdd: (value: string) => void
// }) => {
//   const initialValues = {
//     name_ar: value,
//     name_en: "",
//   }
//   const validationSchema = Yup.object({
//     name_ar: Yup.string().trim().required(requiredTranslation),
//     name_en: Yup.string().trim().required(requiredTranslation),
//   })
//   const queryClient = useQueryClient()
//   const { mutate, isLoading, error } = useMutate<TypesMutate_TP>({
//     mutationFn: mutateData,
//     onSuccess: (data) => {
//       queryClient.setQueryData(["sizesType"], (old: any) => {
//         return [
//           ...(old || []),
//           {
//             //@ts-ignore
//             id: data.id,
//             name: data?.name,
//           },
//         ]
//       })
//       notify("success")
//       onAdd(value)
//     },
//   })
//   const handleSubmit = (values: FormikValues) => {

//     mutate({
//       endpointName: "",
//       values: {
//         name_ar: values.name_ar,
//         name_en: values.name_en,
//       },
//     })
//   }
//   return (
//     <div className="flex items-center justify-between gap-2">
//       <Formik
//         initialValues={initialValues}
//         onSubmit={(values) => {
//           handleSubmit(values)
//         }}
//         // validationSchema={validationSchema}
//       >
//         <HandleBackErrors errors={error?.response?.data?.errors}>
//           <Form className="w-full">
//             <div className="flex gap-x-8 items-center">
//               <BaseInputField
//                 id="name_ar"
//                 label={`${t("type in arabic")}`}
//                 name="name_ar"
//                 type="text"
//                 placeholder={`${t("type in arabic")}`}
//               />

//               <BaseInputField
//                 id="name_en"
//                 label={`${t("type in english")}`}
//                 name="name_en"
//                 type="text"
//                 placeholder={`${t("type in english")}`}
//               />
//             </div>
//             <Button
//               type="submit"
//               className="ms-auto mt-8"
//               disabled={isLoading}
//               loading={isLoading}
//             >
//               {t("submit")}
//             </Button>
//           </Form>
//         </HandleBackErrors>
//       </Formik>
//     </div>
//   )
// }
type SizeForm_TP = {
  showCategories?: boolean;
  setModel?: Dispatch<SetStateAction<boolean>>;
  editData?: any;
  title?: string;
};

export const SizesForm = ({
  showCategories,
  setModel,
  editData,
  title,
}: SizeForm_TP) => {
  /////////// VARIABLES
  ///
  const validatingSchema = Yup.object().shape({
    start: Yup.number()
      .required("برجاء ملئ هذا الحقل")
      .min(1)
      .typeError(" مسموح بالارقام  فقط  "),
    end: Yup.number()
      .required("برجاء ملئ هذا الحقل")
      .min(1)
      .typeError(" مسموح بالارقام  فقط  "),
    increase: Yup.number()
      .required("برجاء ملئ هذا الحقل")
      .min(0)
      .typeError(" مسموح بالارقام  فقط  "),
    type: !showCategories
      ? Yup.string()
          .trim()
          .required("برجاء ملئ هذا الحقل")
          .typeError("لا يمكن ان يكون الحقل فارغ")
      : Yup.string(),
  });

  const initialValues = {
    // sizeType: "",
    start: editData?.start || "",
    end: editData?.end || "",
    increase: editData?.increase || "",
    type: editData?.type || "",
  };
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient();

  const categoriesOptionsApi = [
    { id: 1, value: "1", label: "سلسله" },
    { id: 4, value: "2", label: "خاتم" },
  ];
  ///
  /////////// STATES
  ///
  const [categoryID, setCategoryID] = useState({ id: "", category_name: "" });
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();
  ///
  /////////// SIDE EFFECTS
  ///
  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///
  const { data: categories, isLoading: loadingClassification } = useFetch<
    SelectOption_TP[],
    categories_TP[]
  >({
    queryKey: ["categories"],
    endpoint: "classification/api/v1/categories?type=all",
    // select: (data) =>
    //   data.map((category) => ({
    //     ...category,
    //     id: category.id,
    //     value: category.category_name,
    //     label: category.category_name,
    //   })),
  });
  const { data: sizeTypes, isLoading: loadingSizeType } = useFetch<
    SelectOption_TP[],
    sizesTypes_TP[]
  >({
    queryKey: ["sizesType"],
    endpoint: `/size/api/v1/category/${categoryID?.id}`,
    select: (data) => {
      return data.map((type) => ({
        ...type,
        id: type.id,
        value: type.type,
        label: type.type,
      }));
    },
    enabled: !!categoryID?.id,
  });

  const {
    mutate: sizesMutate,
    isLoading: isLoadingSizes,
    error,
    isSuccess,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      // queryClient.setQueriesData(["sizes"], (old) => [...old, data])
      // if (setModel) {
      queryClient.refetchQueries(["sizes"]);
      // }
      notify("success");
    },
    onError: (err) => {
      notify("error");
    },
  });

  useEffect(() => {
    if (sizeTypes) {
      setNewValue(null);
    }
  }, [JSON.stringify(sizeTypes)]);

  const handleSubmit = (values: any) => {
    sizesMutate({
      endpointName: editData
        ? `/size/api/v1/sizes/${editData.id}`
        : "/size/api/v1/sizes",
      values: {
        type: !showCategories ? values.type : values.sizeType,
        start: values.start,
        end: values.end,
        increase: values.increase,
      },
      method: editData ? "put" : "post",
    });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={validatingSchema}
      >
        <Form>
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <SizeFormMainData
              editData={editData}
              title={title}
              isLoadingSizes={isLoadingSizes}
              showCategories={showCategories}
              categoryID={categoryID}
              sizeTypes={sizeTypes}
              loadingSizeType={loadingSizeType}
              newValue={newValue}
              setNewValue={setNewValue}
              isSuccessPost={isSuccess}
              resetData={reset}
            />
          </HandleBackErrors>
        </Form>
      </Formik>
    </>
  );
};
