import { t } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Button, Label } from "../../atoms";
import { useIsRTL, useMutate } from "../../../hooks";
import { numberFormatterCtx } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import {
  BaseInputField,
  DateInputField,
  OuterFormLayout,
} from "../../molecules";
import { Form, Formik } from "formik";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import * as Yup from "yup";
import { FilesUpload } from "../../molecules/files/FileUpload";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { Cards_Props_TP } from "../banks/ViewBanks";
import { formatDate } from "../../../utils/date";

type AddBankProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: Cards_Props_TP;
};

type bankCardsProps_TP = {
  title: string;
  name: string;
  files: any;
  setFiles: any;
  setShow?: boolean;
};

const AddInvoiceHeaderData = ({ editData, refetch, setShow }: AddBankProps_TP) => {
  const isRTL = useIsRTL();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  console.log("🚀 ~ AddInvoiceHeaderData ~ files:", files);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  ///
  /////////// FUNCTIONS
  ///

  const InvoiceValidatingSchema = () =>
    Yup.object({
      name: Yup.string(),
    });

  const initialValues = {
    InvoiceCompanyName: editData?.InvoiceCompanyName || "",
    InvoiceCompanyLogo: editData?.InvoiceCompanyLogo || "",
  };

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["InvoiceCompany"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["InvoiceCompanyData"]);
      setShow(false)
      refetch()
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  function PostNewCard(values: bankCardsProps_TP) {
    const formData = new FormData();

    formData.append("key", "InvoiceCompanyName");
    formData.append("value", values?.InvoiceCompanyName || "");

    if (files?.[0]) {
      formData.append("key", "InvoiceCompanyLogo");
      formData.append("value", files[0]);
    }
    mutate({
      endpointName: "/companySettings/api/v1/updateInvoiceCompany",
      values: formData,
      method: "post",
      dataType: "formData",
    });
  }

  const PostCardEdit = (values: bankCardsProps_TP) => {
    const formData = new FormData();

    formData.append("name", values?.InvoiceCompanyName || "");

    if (files?.[0]) {
      formData.append("logo", files[0]);
    }

    mutate({
      endpointName: "/companySettings/api/v1/updateInvoiceCompany",
      values: formData, // Pass FormData directly
      method: "post",
      dataType: "formData",
    });
  };
  return (
    <>
      <OuterFormLayout header={t("Add invoice data")}>
        <Formik
          validationSchema={() => InvoiceValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            if (editData) {
              PostCardEdit(values);
            } else {
              PostNewCard(values);
            }
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                <div>
                  <BaseInputField
                    id="InvoiceCompanyName"
                    name="InvoiceCompanyName"
                    type="text"
                    label={`${t("name")}`}
                    placeholder={`${t("name")}`}
                    onChange={(e) => {
                      setFieldValue(
                        "InvoiceCompanyName",
                        values.InvoiceCompanyName
                      );
                    }}
                  />
                </div>
                <div className="">
                  <FilesUpload setFiles={setFiles} files={files} />
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

export default AddInvoiceHeaderData;
