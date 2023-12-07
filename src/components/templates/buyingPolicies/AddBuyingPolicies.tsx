import { t } from 'i18next'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useFetch, useIsRTL, useMutate } from '../../../hooks'
import { notify } from '../../../utils/toast'
import { authCtx } from '../../../context/auth-and-perm/auth'
import { Form, Formik } from 'formik'
import * as Yup from "yup"
import { useQueryClient } from '@tanstack/react-query'
import { mutateData } from '../../../utils/mutateData'
import { requiredTranslation } from '../../../utils/helpers'
import { BaseInputField, OuterFormLayout, Select } from '../../molecules'
import { Button } from '../../atoms'
import { SelectBranches } from '../reusableComponants/branches/SelectBranches'


type PoliciesProps_TP = {
    title: string
    job_id: string
    job_type: string
    max_buy_type_id: string
    max_buy_type: string
    max_buy_rate: string
    max_buy_cash: string
    return_days: string
    sales_return: string
    branch_id:string
    branch_name: string
}

type BuyingPoliciesProps_TP = {
    title: string
    value?: string
    onAdd?: (value: string) => void
    editData?: PoliciesProps_TP
}

const AddBuyingPolicies = ({
    title,
    editData,
}: BuyingPoliciesProps_TP) => {

    const [jobType, setJobType] = useState();
    const [maxBuyingType, setmaxBuyingType] = useState();

    const queryClient = useQueryClient()
    const {userData} = useContext(authCtx)
    const isRTL = useIsRTL()


    useEffect(() => {
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = isRTL ? "ar" : "en"
    }, [isRTL])

    const cardsValidatingSchema = () =>
    Yup.object({
        job_type: Yup.string().trim().required(requiredTranslation),
        max_buy_type: Yup.string().trim().required(requiredTranslation),
        max_buy_rate: Yup.string().trim(),
        max_buy_cash: Yup.string().trim(),
        branch_id: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    job_type: editData?.job_type || "",
    max_buy_type: editData?.max_buy_type || "",
    max_buy_rate: editData?.max_buy_rate || "",
    max_buy_cash: editData?.max_buy_cash || "",
    branch_id: userData?.branch_id,
  }

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["maxBuying"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["allMaximum_Buying"])
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.errors?.msg);
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/buyingUsedGold/api/v1/create_maximum_buying",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values : PoliciesProps_TP) => {
    mutate({
      endpointName: `/buyingUsedGold/api/v1/maximum_buying/${editData?.id}`,
      values: {
        ...values,
        _method: "put"
      },
    });
  };

  useEffect(() => {
    const best = {
        id: editData?.job_type || "",
        value: editData?.job_type || "",
        label: editData?.job_type || `${t("job title")}` ,
    }
    setJobType(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editData?.max_buy_type || "",
        value: editData?.max_buy_type || "",
        label: editData?.max_buy_type || `${t("maximum buy type")}` ,
    }
    setmaxBuyingType(best);
  }, []);

    const maxBuyingTypes=[
        {
            id: "percentage",
            label: t("percentage"),
            value: t("percentage"),
        },
        {
            id: "cash",
            label: t("cash"),
            value: t("cash"),
        },
    ]

    const maxBuyingEmployee=[
        {
            id: "branch_manager",
            label: t("branch manager"),
            value: t("branch manager"),
        },
        {
            id: "branch_seller",
            label: t("branch seller"),
            value: t("branch seller"),
        }
    ]

    return (
        <>
            <OuterFormLayout
                header={t("add buying policy")}
            >
                <Formik
                    validationSchema={() => cardsValidatingSchema()}
                    initialValues={initialValues}
                    onSubmit={(values, {resetForm}) => {
                        if (editData) {
                            PostCardEdit({
                                ...values,
                                max_buy_rate: values?.max_buy_type === "نسبة" && values?.max_buy_rate ,
                                max_buy_cash: values?.max_buy_type === "كاش" && values?.max_buy_cash,
                            })
                        } else {
                            PostNewCard({
                                ...values,
                                max_buy_rate: values?.max_buy_type === "نسبة" && values?.max_buy_rate,
                                max_buy_cash: values?.max_buy_type === "كاش" && values?.max_buy_cash,
                            })
                        }
                    }}
                >
                    {({ values, setFieldValue, resetForm }) => (
                        <Form>
                            <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                                <Select
                                    id="job_type"
                                    label={`${t("job title")}`}
                                    name="job_type"
                                    placeholder={`${t("job title")}`}
                                    loadingPlaceholder={`${t("loading")}`}
                                    options={maxBuyingEmployee}
                                    fieldKey="id"
                                    value={jobType}
                                    onChange={(option: any) => {
                                        setFieldValue("job_type", option!.value)
                                        setJobType(option)
                                    }}
                                />
                                <SelectBranches
                                    required
                                    name="branch_id"
                                    editData={{
                                        branch_id: editData?.branch_id,
                                        branch_name: editData?.branch_name,
                                    }}
                                />
                                <Select
                                    id="max_buy_type"
                                    label={`${t("maximum buy type")}`}
                                    name="max_buy_type"
                                    placeholder={`${t("maximum buy type")}`}
                                    loadingPlaceholder={`${t("loading")}`}
                                    options={maxBuyingTypes}
                                    fieldKey="id"
                                    value={maxBuyingType}
                                    onChange={(option: any) => {
                                        setFieldValue("max_buy_type", option!.value)
                                        setFieldValue("max_buy_type_id", option!.id)
                                        setmaxBuyingType(option)
                                    }}
                                />
                                {values?.max_buy_type === "كاش"
                                    ? (
                                        <div>
                                            <BaseInputField
                                                id="max_buy_cash"
                                                name="max_buy_cash"
                                                type="text"
                                                label={`${t('maximum buying')} (${t("monetary")})`}
                                                placeholder={`${t("maximum buying")}`}
                                                onChange={() => {
                                                    setFieldValue("max_buy_cash", values?.max_buy_cash)
                                                }}
                                            />
                                        </div>
                                    )
                                    :(
                                        <div className="relative">
                                            <BaseInputField
                                                id="max_buy_rate"
                                                type="text"
                                                name="max_buy_rate"
                                                label={`${t("maximum buying")} (${t("rate")})`}
                                                placeholder={`${t("maximum buying")}`}
                                                onChange={(e) => {
                                                setFieldValue("max_buy_rate", values?.max_buy_rate);
                                                }}
                                                className="relative"
                                            />
                                            <span className="absolute left-3 top-9 font-bold text-mainGreen">
                                                %
                                            </span>
                                        </div>
                                    )
                                }

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

                    )}
                </Formik>
            </OuterFormLayout>
        </>
    )
}

export default AddBuyingPolicies



// import { ToWords } from 'to-words';
// function NumberToText() {

//     function NumberToArabicText({ number }) {
//         // const toWords = new ToWords();
//         const toWords = new ToWords();
//         let words = toWords.convert(number, {ignoreDecimal: true, language: 'ar' });
//         return <div>{words}</div>;
//     }
//   return (
//     <div>
//         <NumberToArabicText number={1700} />
//     </div>
//   );
// }

// export default NumberToText;

