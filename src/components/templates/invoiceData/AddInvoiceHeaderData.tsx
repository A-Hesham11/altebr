import { t } from "i18next";
import { useEffect, useState } from "react";
import { Button, Label } from "../../atoms";
import { useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { BaseInputField, Checkbox, OuterFormLayout } from "../../molecules";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FilesUpload } from "../../molecules/files/FileUpload";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { Cards_Props_TP } from "../banks/ViewBanks";

type AddBankProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: Cards_Props_TP;
  refetch: () => void;
  setShow: (val: boolean) => void;
};

const AddInvoiceHeaderData = ({
  editData,
  refetch,
  setShow,
}: AddBankProps_TP) => {
  console.log("🚀 ~ editData:", editData);
  const isRTL = useIsRTL();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [QRFiles, setQRFiles] = useState<File[]>([]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const InvoiceValidatingSchema = Yup.object({
    InvoiceCompanyName: Yup.string().required(t("Required")),
  });

  const initialValues = {
    InvoiceCompanyName: editData?.InvoiceCompanyName || "",
    is_include_header_footer:
      Number(editData?.is_include_header_footer) || false,
  };

  const { mutate, isLoading: editLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["InvoiceCompany"],
    onSuccess: () => {
      notify("success");
      queryClient.refetchQueries(["InvoiceCompanyData"]);
      setShow(false);
      refetch();
    },
    onError: (error) => {
      console.error(error);
      notify("error");
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append("name", values.InvoiceCompanyName);
    formData.append(
      "is_include_header_footer",
      values.is_include_header_footer ? 1 : 0
    );

    if (files.length > 0) {
      formData.append("logo", files[0]);
    }

    if (QRFiles.length > 0) {
      formData.append("QR_Code", QRFiles[0]);
    }

    mutate({
      endpointName: "/companySettings/api/v1/updateInvoiceCompany",
      values: formData,
      method: "post",
      dataType: "formData",
    });
  };

  return (
    <OuterFormLayout header={t("Add invoice data")}>
      <Formik
        validationSchema={InvoiceValidatingSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
              <div>
                <BaseInputField
                  id="InvoiceCompanyName"
                  name="InvoiceCompanyName"
                  type="text"
                  label={t("name")}
                  placeholder={t("name")}
                  value={values.InvoiceCompanyName}
                  onChange={(e) =>
                    setFieldValue("InvoiceCompanyName", e.target.value)
                  }
                />
              </div>
              <div>
                <p className="pb-1">{t("invoice logo")}</p>
                <FilesUpload setFiles={setFiles} files={files} />
              </div>
              <div>
                <p className="pb-1">{t("barcode logo")}</p>
                <FilesUpload setFiles={setQRFiles} files={QRFiles} />
              </div>
              <div>
                <Checkbox
                  name="is_include_header_footer"
                  id="is_include_header_footer"
                  label={t("include header and footer")}
                  labelClassName="text-md cursor-pointer font-semibold"
                  className="cursor-pointer w-5 h-5"
                  checked={values.is_include_header_footer}
                  onChange={() =>
                    setFieldValue(
                      "is_include_header_footer",
                      !values.is_include_header_footer
                    )
                  }
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
  );
};

export default AddInvoiceHeaderData;
