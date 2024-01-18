import { t } from 'i18next'
import { useEffect, useState } from 'react'
import {Button } from '../../atoms'
import { useIsRTL, useMutate } from '../../../hooks'
import { notify } from '../../../utils/toast'
import { BaseInputField, OuterFormLayout } from '../../molecules'
import { Form, Formik } from 'formik'
import { requiredTranslation } from '../systemEstablishment/partners/validation-and-types-partner'
import * as Yup from "yup"
import { FilesUpload } from '../../molecules/files/FileUpload'
import { useQueryClient } from '@tanstack/react-query'
import { mutateData } from '../../../utils/mutateData'
import { Cards_Props_TP } from './ViewBanks'

type AddBankProps_TP = {
    title: string
    value?: string
    onAdd?: (value: string) => void
    editData?: Cards_Props_TP
  }

type bankCardsProps_TP = {
    title: string
    name_ar: string
    name_en: string
    media: any
    files: any
    setFiles: any
    setShow?:boolean
}


const AddBanks = ({
    editData,
}: AddBankProps_TP) => {

    const [files, setFiles] = useState([]);
    console.log("🚀 ~ files:", files)

    const isRTL = useIsRTL()
    const queryClient = useQueryClient()

    useEffect(() => {
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = isRTL ? "ar" : "en"
    }, [isRTL])

    ///
    /////////// FUNCTIONS
    ///

    const BanksValidatingSchema = () =>
    Yup.object({
        name_ar: Yup.string().trim().required(requiredTranslation),
        name_en: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    name_ar: editData?.name_ar || "",
    name_en: editData?.name_en || "",
    media: editData?.media || [] ,
  }

  const { 
    mutate,
    isLoading: editLoading, 
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["banksData"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["AllBanks"])
    },
    onError: (error) => {
      notify("error", error?.response?.data?.message);
    },
  });

  function PostNewCard(values: bankCardsProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/create-bank",
      values: {
        name_ar: values?.name_ar,
        name_en: values?.name_en,
        media: values?.media,
      },
      method: "post",
      dataType:'formData'

    });
  }

  const PostCardEdit = (values : bankCardsProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/update-bank/${editData?.id}`,
      values: {
        name_ar: values?.name_ar,
        name_en: values?.name_en,
        media: values?.media,
      },
      method: "post",
      dataType:'formData'
    });
  };

    return (
        <>
            <OuterFormLayout
                header={t("add banks")}
            >
                <Formik 
                    validationSchema={() => BanksValidatingSchema()}
                    initialValues={initialValues}
                    onSubmit={(values, {resetForm}) => {
                      if (editData) {
                          if(!files.length){
                              delete values.media
                              PostCardEdit(values)
                          }else{
                              PostCardEdit({...values, media: files})
                          }
                      } else if (files?.length === 0) {
                          notify("error", `${t("card photo is required")}`)
                      } else {
                          PostNewCard({...values, media: files})
                      }
                  }}
                >
                    {({ values, setFieldValue, resetForm }) => (
                        <Form>

                                <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                                    <div>
                                        <BaseInputField
                                            id="name_ar"
                                            name="name_ar"
                                            type="text"
                                            label={`${t('bank name arabic')}`}
                                            placeholder={`${t("bank name arabic")}`}
                                            onChange={(e) => {
                                                setFieldValue("name_ar", e.target.name_ar)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <BaseInputField
                                            id="name_en"
                                            name="name_en"
                                            type="text"
                                            label={`${t('bank name english')}`}
                                            placeholder={`${t("bank name english")}`}
                                            onChange={(e) => {
                                                setFieldValue("name_en", e.target.name_en)
                                            }}
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        {
                                            <FilesUpload files={files} setFiles={setFiles} />
                                        }
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

export default AddBanks