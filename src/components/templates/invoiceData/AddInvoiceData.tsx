import { t } from 'i18next'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import {Button, Label } from '../../atoms'
import { useIsRTL, useMutate } from '../../../hooks'
import { numberFormatterCtx } from '../../../context/settings/number-formatter'
import { notify } from '../../../utils/toast'
import { authCtx } from '../../../context/auth-and-perm/auth'
import { BaseInputField, DateInputField, OuterFormLayout } from '../../molecules'
import { Form, Formik } from 'formik'
import { requiredTranslation } from '../systemEstablishment/partners/validation-and-types-partner'
import * as Yup from "yup"
import { FilesUpload } from '../../molecules/files/FileUpload'
import { useQueryClient } from '@tanstack/react-query'
import { mutateData } from '../../../utils/mutateData'
import { Cards_Props_TP } from '../banks/ViewBanks'
import { formatDate } from '../../../utils/date'

type AddBankProps_TP = {
    title: string
    value?: string
    onAdd?: (value: string) => void
    editData?: Cards_Props_TP
  }

type bankCardsProps_TP = {
    title: string
    sentence: string
    start_date: string
    expire_date: string
    files: any
    setFiles: any
    setShow?:boolean
}

const AddInvoiceData = ({
    editData,
}: AddBankProps_TP) => {

    const isRTL = useIsRTL()
    const queryClient = useQueryClient()

    useEffect(() => {
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = isRTL ? "ar" : "en"
    }, [isRTL])

    ///
    /////////// FUNCTIONS
    ///

    const InvoiceValidatingSchema = () =>
        Yup.object({
            sentence: Yup.string(),
            start_date: Yup.string(),
            expire_date: Yup.string(),
    });

  const initialValues = {
    sentence: editData?.sentence || "",
    start_date: editData?.start_date ?  new Date(editData?.start_date) : new Date,
    expire_date: editData?.expire_date ? new Date(editData?.expire_date) : new Date,
  }

  const { 
    mutate,
    isLoading: editLoading, 
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["congratulatorySentence"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["congratulatory_sentence"])
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  function PostNewCard(values: bankCardsProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/congratulations",
      values: {
        sentence: values?.sentence,
        start_date: values?.start_date,
        expire_date: values?.expire_date,
      },
      method: "post",
    });
  }

  const PostCardEdit = (values : bankCardsProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/congratulations/${editData?.id}`,
      values: {
        sentence: values?.sentence,
        start_date: values?.start_date,
        expire_date: values?.expire_date,
        _method: "put",
      },
    //   method: "post",
    });
  };

return (
    <>
        <OuterFormLayout
            header={t("add sentence congratulatory")}
        >
            <Formik 
                validationSchema={() => InvoiceValidatingSchema()}
                initialValues={initialValues}
                onSubmit={(values, {resetForm}) => {
                    if (editData) {
                        PostCardEdit(values)
                    }else {
                        PostNewCard(values)
                    }
                }}
            >
                {({ values, setFieldValue, resetForm }) => (
                    <Form>
                        <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                            <div>
                                <BaseInputField
                                    id="sentence"
                                    name="sentence"
                                    type="text"
                                    label={`${t('congratulatory sentence')}`}
                                    placeholder={`${t("congratulatory sentence")}`}
                                    onChange={(e) => {
                                        setFieldValue("sentence", values.sentence)
                                    }}
                                />
                            </div>
                            <div>
                                <DateInputField
                                    label={`${t('congratulation start date')}`}
                                    placeholder={`${t('congratulation start date')}`}
                                    name="start_date"
                                    labelProps={{ className: "mt-10" }}
                                />
                            </div>
                            <div>
                                <DateInputField
                                    label={`${t('congratulation end date')}`}
                                    placeholder={`${t('congratulation end date')}`}
                                    name="expire_date"
                                    labelProps={{ className: "mt-10" }}
                                />
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

                )}
            </Formik>
        </OuterFormLayout>
    </>
)
}

export default AddInvoiceData