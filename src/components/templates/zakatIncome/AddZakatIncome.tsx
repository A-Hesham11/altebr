import { t } from "i18next";
import { useEffect, useState } from "react";
import { useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { Form, Formik } from "formik";
import { mutateData } from "../../../utils/mutateData";
import { BaseInputField, OuterFormLayout } from "../../molecules";
import { Button } from "../../atoms";
import RadioGroup, { RadioField } from "../../molecules/RadioGroup";
import { HiQuestionMarkCircle } from "react-icons/hi";

type ZakatProps_TP = {
  otp: string;
  email_address: string;
  common_name: string;
  organizational_unit_name: string;
  organizational_name: string;
  tax_number: string;
  registerd_address: string;
  bussiness_category: string;
  egs_serial_number: string;
  registration_number: string;
};

type BuyingPoliciesProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: ZakatProps_TP;
  setShow?: any;
};

interface ReusableInputWithExampleProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  isExampleVisible: boolean;
  setExampleVisibility: (isVisible: boolean, id: string) => void;
}

const AddZakatIncome = ({
  title,
  editData,
  setShow,
}: BuyingPoliciesProps_TP) => {
  const [visibleExampleIndex, setVisibleExampleIndex] = useState<string | null>(
    null
  );
  const [isActiveZakat, setIsActiveZakat] = useState<number>(0);

  const isRTL = useIsRTL();

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const initialValues = {
    otp: editData?.otp || "",
    email_address: editData?.email_address || "",
    common_name: editData?.common_name || "",
    organizational_unit_name: editData?.organizational_unit_name || "",
    organizational_name: editData?.organizational_name,
    tax_number: editData?.tax_number,
    registerd_address: editData?.registerd_address,
    bussiness_category: editData?.bussiness_category,
    egs_serial_number: editData?.egs_serial_number,
    registration_number: editData?.registration_number,
  };

  const ReusableInputWithExample = ({
    id,
    name,
    label,
    type,
    placeholder,
    isExampleVisible,
    setExampleVisibility,
  }: ReusableInputWithExampleProps) => (
    <div>
      <div className="relative">
        <BaseInputField
          id={id}
          name={name}
          type={type}
          label={`${t(label)}`}
          icon
          placeholder={`${t(placeholder)}`}
        />
        {isExampleVisible && (
          <>
            <div
              className="bg-[#0000001A] w-full h-full fixed top-0 left-0 rounded-2xl z-20"
              onClick={() => setExampleVisibility(false, id)}
            ></div>
            <div className="text-center rounded-xl overflow-hidden absolute bottom-0 left-0 w-full z-50 cursor-pointer">
              <div className="bg-mainGreen text-white p-2.5">
                <p>
                  <span>{t("Example of")}</span> {t(label)}
                </p>
              </div>
              <div className="bg-white p-3.5">
                <p>{placeholder}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className="flex items-center gap-x-2 cursor-pointer -mt-1"
        onClick={() => setExampleVisibility(true, id)}
      >
        <HiQuestionMarkCircle size={32} className="text-[#00000099]" />
        <p className="text-[#00000099]">{t("Click to show an example!")}</p>
      </div>
    </div>
  );

  const inputsData = [
    {
      type: "password",
      name: "otp",
      label: "temporary password",
      placeholder: "369844",
    },
    {
      type: "email",
      name: "email_address",
      label: "Email address",
      placeholder: "Support@hermosaapp.com",
    },
    {
      type: "text",
      name: "common_name",
      label: "Common Name",
      placeholder: "TST-886431145-312345678900003",
    },
    {
      type: "text",
      name: "organizational_unit_name",
      label: "Organizational Unit Name",
      placeholder: "1010182623",
    },
    {
      type: "text",
      name: "organizational_name",
      label: "Organizational name",
      placeholder: "شركة",
    },
    {
      type: "text",
      name: "tax_number",
      label: "Tax Number",
      placeholder: "301005185700003",
    },
    {
      type: "text",
      name: "registerd_address",
      label: "Registered Address",
      placeholder: "RRRD2929",
    },
    {
      type: "text",
      name: "bussiness_category",
      label: "Business Category",
      placeholder: "Supply activities",
    },
    {
      type: "text",
      name: "egs_serial_number",
      label: "Serial Number",
      placeholder: "1-ALTEPR |2-GOLD |3-9d18...",
    },
    {
      type: "text",
      name: "registration_number",
      label: "Registration Number",
      placeholder: "1010182623",
    },
  ];

  const setExampleVisibility = (isVisible: boolean, id: string) => {
    if (isVisible) {
      setVisibleExampleIndex(id);
    } else {
      setVisibleExampleIndex(null);
    }
  };

  const { mutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
    },
  });

  const { mutate: isActiveZakatMutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      localStorage.setItem("isActiveZakat", isActiveZakat);
      notify("success");
    },
  });

  return (
    <>
      <OuterFormLayout header={t("Zakat and income")}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            console.log("🚀 ~ values:", values);
            const hasEmptyFields = Object.values(values).some(
              (value) => !value
            );
            console.log("🚀 ~ hasEmptyFields:", hasEmptyFields);
            if (hasEmptyFields) {
              notify("info", `${t("Please fill out the missing fields")}`);
              return;
            }
            mutate({
              endpointName: "/attachment/api/v1/zatca",
              values: {
                otp: values.otp,
                email_address: values.email_address,
                common_name: values.common_name,
                organizational_unit_name: values.organizational_unit_name,
                organizational_name: values.organizational_name,
                tax_number: values.tax_number,
                registerd_address: values.registerd_address,
                bussiness_category: values.bussiness_category,
                egs_serial_number: values.egs_serial_number,
                registration_number: values.registration_number,
              },
            });
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="border-b-2 border-b-[#0000001A] pt-2 pb-4 flex items-center justify-between">
                <div>
                  <RadioGroup
                    name="add_commission_ratio"
                    onChange={(e) => {
                      setFieldValue("add_commission_ratio", e);
                    }}
                  >
                    <div className="flex gap-x-6 font-semibold">
                      <RadioGroup.RadioButton
                        value="yes"
                        label={`${t("For Test")}`}
                        id="yes"
                      />
                      <RadioGroup.RadioButton
                        value="no"
                        label={`${t("Live Version")}`}
                        id="no"
                      />
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  action={() => {
                    isActiveZakatMutate({
                      endpointName: "/attachment/api/v1/zatca",
                      values: {
                        isActive_Zakat: isActiveZakat,
                      },
                    });
                  }}
                >
                  {t("")}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-x-6 gap-y-12 items-end mb-8 mt-8">
                {inputsData?.map((field, idx) => (
                  <ReusableInputWithExample
                    key={idx}
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    isExampleVisible={visibleExampleIndex === field.name}
                    setExampleVisibility={setExampleVisibility}
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-fit"
                  //   action={() => setShow(false)}
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

export default AddZakatIncome;
