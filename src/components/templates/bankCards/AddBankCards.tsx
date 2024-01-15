import { t } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Button, Label } from "../../atoms";
import { useIsRTL, useMutate } from "../../../hooks";
import { numberFormatterCtx } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { BaseInputField, OuterFormLayout } from "../../molecules";
import { Form, Formik } from "formik";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import * as Yup from "yup";
import { FilesUpload } from "../../molecules/files/FileUpload";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { Cards_Props_TP } from "./ViewBankCards";
import RadioGroup from "../../molecules/RadioGroup";

type AddBankProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: Cards_Props_TP;
};

type bankCardsProps_TP = {
  title: string;
  name_ar: string;
  name_en: string;
  is_minimum: number;
  media: any;
  files: any;
  setFiles: any;
  setShow?: boolean;
};

const AddBankCards = ({ title, editData }: AddBankProps_TP) => {
  const [files, setFiles] = useState([]);

  const isRTL = useIsRTL();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  ///
  /////////// FUNCTIONS
  ///
  // const supplierValidatingSchema = () =>
  // Yup.object({
  //     name_ar: Yup.string().trim().required(requiredTranslation),
  //     name_en: Yup.string().trim().required(requiredTranslation),
  //     media: Yup.string(),
  //     // discount_percentage: Yup.string(),
  // //   commission: Yup.string(),
  // })

  const cardsValidatingSchema = () =>
    Yup.object({
      name_ar: Yup.string().trim().required(requiredTranslation),
      name_en: Yup.string().trim().required(requiredTranslation),
      is_minimum: Yup.string().required("برجاء ملئ هذا الحقل"),
      // media: Yup.string(),
    });

  const initialValues = {
    name_ar: editData?.name_ar || "",
    name_en: editData?.name_en || "",
    media: editData?.media || [],
    is_minimum: editData?.is_minimum || 0,
    // discount_percentage: editData?.discount_percentage || "",
    // commission: "",
  };

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["cardsData"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["AllCards"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error", error.response.data.message);
    },
  });

  function PostNewCard(values: bankCardsProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/create",
      values: {
        name_ar: values?.name_ar,
        name_en: values?.name_en,
        media: values?.media,
        is_minimum: values?.is_minimum
      },
      method: "post",
      dataType: "formData",
    });
  }

  const PostCardEdit = (values: bankCardsProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/update/${editData?.id}`,
      values: {
        name_ar: values?.name_ar,
        name_en: values?.name_en,
        media: values?.media,
        is_minimum: values?.is_minimum
      },
      method: "post",
      dataType: "formData",
    });
  };

  return (
    <>
      <OuterFormLayout header={t("add type card")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            if (editData) {
              if (!files.length) {
                delete values.media;
                PostCardEdit(values);

              } else {
                PostCardEdit({ ...values, media: files });
              }
            } else if (files?.length === 0) {
              notify("error", `${t("card photo is required")}`);
            } else {
              PostNewCard({ ...values, media: files });
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              {/* <div className="w-[35rem]"> */}

              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                <div>
                  <BaseInputField
                    id="name_ar"
                    name="name_ar"
                    type="text"
                    label={`${t("card name arabic")}`}
                    placeholder={`${t("card name arabic")}`}
                    onChange={(e) => {
                      setFieldValue("phone", e.target.name_ar);
                    }}
                  />
                </div>
                <div>
                  <BaseInputField
                    id="name_en"
                    name="name_en"
                    type="text"
                    label={`${t("card name english")}`}
                    placeholder={`${t("card name english")}`}
                    onChange={(e) => {
                      setFieldValue("name_en", e.target.name_en);
                    }}
                  />
                </div>
                <div className="mt-4">
                  {<FilesUpload files={files} setFiles={setFiles} />}
                </div>
                <div>
                  <RadioGroup name="is_minimum">
                    <span>
                      {t("Add the minimum card limit")}
                    </span>
                    <div className="flex gap-x-2">
                      <RadioGroup.RadioButton
                        id="yes"
                        value="1"
                        label={`${t("yes")}`}
                        isChecked={ editData ? ( editData?.is_minimum == 0 ? false : true) : ""}
                      />
                      <RadioGroup.RadioButton
                        id="no"
                        value="0"
                        label={`${t("no")}`}
                        isChecked={ editData ? ( editData?.is_minimum != 0 ? false : true) : ""}
                      />
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="w-fit" loading={editLoading}>
                  {t("save")}
                </Button>
              </div>
              {/* </div> */}
            </Form>
          )}
        </Formik>
      </OuterFormLayout>
    </>
  );
};

export default AddBankCards;
