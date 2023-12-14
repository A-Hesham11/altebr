import { t } from 'i18next'
import { useEffect } from 'react'
import { useIsRTL, useMutate } from '../../../hooks'
import { notify } from '../../../utils/toast'
import { Form, Formik } from 'formik'
import * as Yup from "yup"
import { useQueryClient } from '@tanstack/react-query'
import { mutateData } from '../../../utils/mutateData'
import { requiredTranslation } from '../../../utils/helpers'
import { BaseInputField, OuterFormLayout, Select } from '../../molecules'
import { Button } from '../../atoms'
import RadioGroup from '../../molecules/RadioGroup'
import { SelectBranches } from '../reusableComponants/branches/SelectBranches'
import SelectCategory from '../reusableComponants/categories/select/SelectCategory'
import SelectKarat from '../reusableComponants/karats/select/SelectKarat'


type PoliciesProps_TP = {
    branch_id:string
    branch_name: string
    include_tax: string
    include_tax_value: string
    tax_rate: string
}

type SellingPoliciesProps_TP = {
    title: string
    value?: string
    onAdd?: (value: string) => void
    editData?: PoliciesProps_TP
}

const AddTaxPolicy = ({
    editData,
    setSelectBarnch,
    includeTaxFilter
}: SellingPoliciesProps_TP) => {
    console.log("🚀 ~ file: AddTaxPolicy.tsx:38 ~ includeTaxFilter:", includeTaxFilter)

    const queryClient = useQueryClient()
    const isRTL = useIsRTL()

    useEffect(() => {
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = isRTL ? "ar" : "en"
    }, [isRTL])

    const cardsValidatingSchema = () =>
    Yup.object({
        tax_rate: Yup.string().trim().required(requiredTranslation),
        branch_id:Yup.string().trim().required(requiredTranslation),
        include_tax: Yup.string().trim().required(requiredTranslation),
        karat_id: Yup.string(),
        category_id: Yup.string(),
    });

  const initialValues = {
    tax_rate: editData?.tax_rate || "",
    branch_id:editData?.branch_id || "",
    include_tax: editData?.include_tax || "",
    include_tax_value: editData?.include_tax_value || "",
    karat_id: editData?.karat_id || "",
    category_id: editData?.category_id || "",
  }

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["TaxSelling"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["allTax_Selling"])
    },
    onError: (error) => {
      notify("error", error?.response?.data?.errors?.msg);
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/create-tax-include",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values : PoliciesProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/tax_includes/${editData?.id}`,
      values: {
        ...values,
        _method: "put"
      },
    });
  };

    return (
        <>
            <OuterFormLayout
                header={t("Add Tax Policy")}
            >
                <Formik
                    validationSchema={() => cardsValidatingSchema()}
                    initialValues={initialValues}
                    onSubmit={(values, {resetForm}) => {
                        if (editData) {
                            PostCardEdit(values)
                        } else {
                            PostNewCard(values)
                        }
                    }}
                >
                    {({ values, setFieldValue, resetForm }) => {
                        console.log("🚀 ~ file: AddTaxPolicy.tsx:117 ~ values:", values)

                        setSelectBarnch(values?.branch_id)
                    return(
                        <Form>
                            <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                                <SelectBranches
                                    required
                                    name="branch_id"
                                    editData={{
                                        branch_id: editData?.branch_id,
                                        branch_name: editData?.branch_name,
                                    }}
                                />
                                <SelectKarat
                                    field="id"
                                    name="karat_id"
                                    noMb={true}
                                    placement="top"
                                    label={`${t('karats')}`}
                                    onChange={(option) => {
                                        setFieldValue("karat_name", option!.value);
                                        setFieldValue("category_name", "");
                                    }}
                                    value={{
                                    id: values.karat_id,
                                    value: values.karat_id,
                                    label: values.karat_name || t("karat value"),
                                    }}
                                />
                                <SelectCategory
                                    name="category_id"
                                    noMb={true}
                                    placement="top"
                                    label={`${t("categories")}`}
                                    all={true}
                                    value={{
                                    value: values?.category_id,
                                    label: values?.category_name || t("classification"),
                                    id: values?.category_id,
                                    }}
                                    onChange={(option) => {
                                        setFieldValue("category_name", option!.value);
                                        setFieldValue("karat_name", "");
                                    }}
                                    showItems={true}
                                />

                                <div>
                                    <BaseInputField
                                        id="tax_rate"
                                        name="tax_rate"
                                        type="text"
                                        label={`${t('tax rate')}`}
                                        placeholder={`${t("tax rate")}`}

                                        onChange={(e) => {
                                            // setFieldValue("tax_rate", values?.tax_rate)
                                        setFieldValue("include_tax", +includeTaxFilter[0]?.include_tax);

                                        }}
                                    />
                                </div>
                                <div>
                                    <RadioGroup name="include_tax">
                                        <div className="flex gap-x-2 font-bold">
                                            <RadioGroup.RadioButton
                                                id="1"
                                                value="1"
                                                label={`${t("Selling price includes tax")}`}
                                                isChecked={values?.branch_id && (includeTaxFilter && +includeTaxFilter[0]?.include_tax === 0 ? false : true)}
                                            />
                                            <RadioGroup.RadioButton
                                                id="0"
                                                value="0"
                                                label={`${t("selling price does not include tax")}`}
                                                  isChecked={values?.branch_id && (includeTaxFilter && +includeTaxFilter[0]?.include_tax !== 0 ? false : true)}
                                            />
                                        </div>
                                    </RadioGroup>
                                </div>

                            </div>
                            <div className='flex justify-end'>
                                <Button
                                    type='submit'
                                    className="w-fit"
                                    loading={editLoading}
                                >
                                    {t('save')}
                                </Button>
                            </div>
                        </Form>

                    )}}
                </Formik>
            </OuterFormLayout>
        </>
    )
}

export default AddTaxPolicy