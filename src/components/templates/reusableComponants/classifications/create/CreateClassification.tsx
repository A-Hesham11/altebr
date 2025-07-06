/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";
import * as Yup from "yup";
import { useIsRTL, useMutate } from "../../../../../hooks";
import { mutateData } from "../../../../../utils/mutateData";
import { notify } from "../../../../../utils/toast";
import { HandleBackErrors } from "../../../../../utils/utils-components/HandleBackErrors";
import { Button } from "../../../../atoms";
import { BaseInputField } from "../../../../molecules/formik-fields/BaseInputField";
import { ViewClassifications_TP } from "../../../systemEstablishment/view/ViewClassifications";
import { InnerFormLayout, OuterFormLayout } from "../../../../molecules";
import { ClassificationMainData } from "../../../systemEstablishment/ClassificationMainData";

///
/////////// Types
///
type CreateClassificationProps_TP = {
  value?: string;
  onAdd?: (value: string) => void;
  editData?: ViewClassifications_TP;
  setDataSource?: Dispatch<SetStateAction<ViewClassifications_TP[]>>;
  setShow?: Dispatch<SetStateAction<boolean>>;
  title?: string;
};

type InitialValues_TP = {
  [x: string]: string;
};

const requiredTranslation = () => `${t("required")}`;
const validationSchema = Yup.object({
  name_en: Yup.string().trim().required(requiredTranslation),
  name_ar: Yup.string().trim().required(requiredTranslation),
});

export const CreateClassification = ({
  value = "",
  onAdd,
  editData,
  setDataSource,
  setShow,
  title,
}: CreateClassificationProps_TP) => {
  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const isRTL = useIsRTL();
  const initialValues: InitialValues_TP = {
    name_en: editData ? editData.name_en : !isRTL ? value! : "",
    name_ar: editData ? editData.name_ar : isRTL ? value! : "",
  };
  ///
  /////////// CUSTOM HOOKS
  ///
  const queryClient = useQueryClient();
  const { mutate, isLoading, error, isSuccess, reset } =
    useMutate<ViewClassifications_TP>({
      mutationFn: mutateData,
      onSuccess: (data) => {
        notify("success");
        if (value && onAdd) {
          onAdd(value);
          // queryClient.setQueryData(["classifications"], (old: any) => {
          //   return [...old, data]
          // })
          queryClient.refetchQueries(["AllClassifications"]);
        }
        if (setDataSource && setShow && !editData && !error) {
          // setDataSource((prev: any) => [...prev, data])
          queryClient.refetchQueries(["AllClassifications"]);
          setShow(false);
        }
        if (setDataSource && setShow && editData && !error) {
          setShow(false);
          queryClient.refetchQueries(["AllClassifications"]);
          // setDataSource((prev: any) =>
          //   prev.map((p: ViewClassifications_TP) =>
          //     p.id === data?.id ? data : p
          //   )
          // )
        }
      },
      onError: (error) => {
        notify("error");
      },
    });

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  function PostNewValue(values: InitialValues_TP) {
    mutate({
      endpointName: editData
        ? `classification/api/v1/classifications/${editData.id}`
        : `classification/api/v1/classifications`,
      values: {
        name_en: values.name_en,
        name_ar: values.name_ar,
        ...(editData && { _method: "put" }),
      },
      method: "post",
    });
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => PostNewValue(values)}
        validationSchema={validationSchema}
      >
        <Form className="w-full">
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <ClassificationMainData
              editData={editData}
              title={title}
              isLoading={isLoading}
              isSuccessPost={isSuccess}
              resetData={reset}
            />
          </HandleBackErrors>
        </Form>
      </Formik>
    </div>
  );
};
