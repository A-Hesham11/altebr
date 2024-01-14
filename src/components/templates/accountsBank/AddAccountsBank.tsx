import { t } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Button, Label } from "../../atoms";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { numberFormatterCtx } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Form, Formik } from "formik";
import { requiredTranslation } from "../systemEstablishment/partners/validation-and-types-partner";
import * as Yup from "yup";
import { FilesUpload } from "../../molecules/files/FileUpload";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { Country_city_distract_markets } from "../reusableComponants/Country_city_distract_markets";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { SelectBanks } from "./SelectBanks";
import { SelectOption_TP } from "../../../types";
import { SingleValue } from "react-select";
import { Cards_Props_TP } from "./ViewAccountsBank";

type AddBankProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: Cards_Props_TP;
};

type bankCardsProps_TP = {
  title: string;
  country_id: string;
  city_id: string;
  purpose: string;
  bank_id: string;
  branch_id: string;
  main_account_number: string;
  iban: string;
  swift: string;
  setShow?: boolean;
};

const AddAccountsBank = ({ title, editData }: AddBankProps_TP) => {
  const [purposeValue, setPurposeValue] = useState();
  const isRTL = useIsRTL();
  const queryClient = useQueryClient();

  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      country_id: Yup.string().trim().required(requiredTranslation),
      city_id: Yup.string().trim().required(requiredTranslation),
      purpose: Yup.string().trim().required(requiredTranslation),
      bank_id: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
      main_account_number: Yup.string().trim().required(requiredTranslation),
      iban: Yup.string().trim().required(requiredTranslation),
      swift: Yup.string().trim(),
    });

  const initialValues = {
    country_id: editData?.country_id || "",
    city_id: editData?.city_id || "",
    purpose: editData?.purpose || "",
    bank_id: editData?.bank_id || "",
    branch_id: editData?.branch_id || "",
    main_account_number: editData?.main_account_number || "",
    iban: editData?.iban || "",
    swift: editData?.swift || "",
  };

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["banksAccounts"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["all-banksAccounts"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  function PostNewCard(values: bankCardsProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/add_bank_account",
      values: {
        country_id: values?.country_id,
        city_id: values?.city_id,
        purpose: values?.purpose,
        bank_id: values?.bank_id,
        branch_id: values?.branch_id,
        main_account_number: values?.main_account_number,
        iban: values?.iban,
        swift: values?.swift,
      },
      method: "post",
    });
  }

  const PostCardEdit = (values: bankCardsProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/bank_accounts/${editData?.id}`,
      values: {
        country_id: values?.country_id,
        city_id: values?.city_id,
        purpose: values?.purpose,
        bank_id: values?.bank_id,
        branch_id: values?.branch_id,
        main_account_number: values?.main_account_number,
        iban: values?.iban,
        swift: values?.swift,
        _method: "put",
      },
    });
  };

  const purposeOptions = [
    {
      id: "company",
      value: "شركة",
      label: "شركة",
    },
    {
      id: "branch",
      value: "فرع",
      label: "فرع",
    },
    {
      id: "supplier",
      value: "مورد",
      label: "مورد",
    },
    {
      id: "gomlaclient",
      value: "عميل جملة",
      label: "عميل جملة",
    },
    {
      id: "sectorclient",
      value: "عميل تجزئه",
      label: "عميل تجزئه",
    },
  ];

  useEffect(() => {
    const best = {
      id: editData?.purpose || "",
      value: editData?.purpose || "",
      label: editData?.purpose || `${t("purpose")}`,
    };
    setPurposeValue(best);
  }, []);

  return (
    <>
      <OuterFormLayout header={t("add bank account")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
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
              <div className="grid grid-cols-4 gap-x-6 gap-y-4 items-end mb-8">
                {/* <Country_city_distract_markets
                  countryName="country_id"
                  countryFieldKey="id"
                  cityName="city_id"
                  cityFieldKey="id"
                  editData={{
                    country_id: editData?.country_id,
                    country_name: editData?.country_name,
                    city_id: editData?.city_id,
                    city_name: editData?.city_name,
                  }}
                /> */}
                  <Country_city_distract_markets
                    cityName="city_id"
                    countryName="country_id"
                    editData={editData}
                    // isSuccessPost={!editData && isSuccessPost}
                    // resetSelect={!editData && restData}
                  />
                <div>
                  <Select
                    id="purpose"
                    label={`${t("purpose")}`}
                    name="purpose"
                    placeholder={`${t("purpose")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={purposeOptions}
                    fieldKey="value"
                    value={purposeValue}
                    onChange={(option) => {
                      setPurposeValue(option);
                    }}
                  />
                </div>
                <div>
                  <SelectBanks
                    name="bank_id"
                    editData={{
                      bank_id: editData?.bank_id,
                      bank_name: editData?.name_ar,
                    }}
                    newValue={newValue}
                    setNewValue={setNewValue}
                  />
                </div>
                <div>
                  <SelectBranches
                    required
                    name="branch_id"
                    editData={{
                      branch_id: editData?.branch_id,
                      branch_name: editData?.branch_name,
                    }}
                  />
                </div>
                <div>
                  <BaseInputField
                    id="main_account_number"
                    name="main_account_number"
                    type="text"
                    label={`${t("primary account number")}`}
                    placeholder={`${t("primary account number")}`}
                    onChange={(e) => {
                      setFieldValue(
                        "main_account_number",
                        e.target.main_account_number
                      );
                    }}
                  />
                </div>
                <div>
                  <BaseInputField
                    id="iban"
                    name="iban"
                    type="text"
                    label={`${t("IBAN number")}`}
                    placeholder={`${t("IBAN number")}`}
                    onChange={(e) => {
                      setFieldValue("iban", e.target.iban);
                    }}
                  />
                </div>
                <div>
                  <BaseInputField
                    id="swift"
                    name="swift"
                    type="text"
                    label={`${t("SWIFT number")}`}
                    placeholder={`${t("SWIFT number")}`}
                    onChange={(e) => {
                      setFieldValue("swift", e.target.swift);
                    }}
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
    </>
  );
};

export default AddAccountsBank;
