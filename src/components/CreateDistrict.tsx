/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik, FormikSharedConfig, useFormikContext } from "formik"
import { t } from "i18next"
import { useState } from "react"
import * as Yup from "yup"
import { BaseInputField, Select } from "./molecules"
import { useFetch, useMutate } from "../hooks"
import { mutateData } from "../utils/mutateData"
import { notify } from "../utils/toast"
import { Button } from "./atoms"
import { SelectOption_TP } from "../types"
///
/////////// Types
///
type CreateDistrictProps_TP = {
    value: string
    onAdd: (value: string) => void
}

type InitialValues_TP = {
    [x: string]: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const CreateDistrict = ({
    value,
    onAdd
}: CreateDistrictProps_TP) => {
    /////////// VARIABLES
    ///
    const initialValues: InitialValues_TP = {
        district_ar: "",
        district_en: "",
        country_id: "",
        city_id: "",
    }
    const validationSchema = Yup.object({
        district_ar: Yup.string().trim().required('برجاء ملئ هذا الحقل'),
        district_en: Yup.string().trim().required('برجاء ملئ هذا الحقل'),
        country_id: Yup.string().required('برجاء ملئ هذا الحقل'),
        city_id: Yup.string().required('برجاء ملئ هذا الحقل'),
    })


    /////////// STATES
    ///
    const [districts, setDistricts] = useState(initialValues)    ///
    /////////// CUSTOM HOOKS
    ///
    const { setFieldValue } = useFormikContext<FormikSharedConfig>()

    const queryClient = useQueryClient();
    const {
        mutate,
        error: errorQuery,
    } = useMutate({
        mutationFn: mutateData,
        onSuccess: () => {
            queryClient.setQueryData(['districts'], (old: any) => {
                return [...old, {
                    id: crypto.randomUUID(), district_ar: districts.district_ar, district_en: districts.district_en
                }]
            })
        },
        onError: (error) => {
            notify("error")
        }
    })

    // get countries
    const {
        data: countriesOptions,
        isLoading: countriesLoading,
        refetch: refetchCountries,
        failureReason: countriesErrorReason
    } = useFetch<SelectOption_TP[]>({
        endpoint: "countries",
        queryKey: ["countries"],
        select: (countries) => countries.map((country: any) => ({
            id: country.id,
            value: `${country.country_en} - ${country.country_ar}`,
            label: `${country.country_en} - ${country.country_ar}`,
        })),
    })

    // get cities
    const {
        data: citiesOptions,
        isLoading: citiesLoading,
        refetch: refetchCities,
        failureReason: citiesErrorReason
    } = useFetch<SelectOption_TP[]>({
        endpoint: "cities",
        queryKey: ["cities"],
        select: (cities) => cities.map((city: any) => ({
            id: city.id,
            value: `${city.city_en} - ${city.city_ar}`,
            label: `${city.city_en} - ${city.city_ar}`,
        })),
    })
    /////////// SIDE EFFECTS
    ///

    /////////// FUNCTIONS | EVENTS | IF CASES
    ///

    function PostNewValue(values: InitialValues_TP) {

        mutate({
            endpointName: "districts",
            values: {
                id: crypto.randomUUID(), district_en: values.district_en, district_ar: values.district_ar
            }
        })
    }
    ///
    return (
        <div className="flex items-center justify-between gap-2">
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    setDistricts(values)
                    PostNewValue(values)
                    !errorQuery && onAdd(value)
                }
                }
                validationSchema={validationSchema}
            >
                <Form className="w-full">
                    <div className="flex gap-x-8 items-center" >

                        {/* country start */}
                        <div className="flex flex-col" >
                            <Select
                                id="country"
                                label={`${t('country')}`}
                                name="country_id"
                                placeholder={`${t('country')}`}
                                loadingPlaceholder={`${t('loading')}`}
                                options={countriesOptions}
                                //@ts-ignore
                                onChange={(option: SingleValue<SelectOption_TP>) =>
                                    setFieldValue("country_id", option?.id)
                                }
                                loading={countriesLoading}
                                //@ts-ignore
                                isDisabled={!countriesLoading && countriesErrorReason}
                            />
                            {
                                countriesErrorReason &&
                                <div className="flex gap-x-2 items-center" >
                                    {!countriesLoading && <span className="text-mainRed" >حدث خطأ أثناء جلب الباتات  </span>}
                                    {/* @ts-ignore */}
                                    {!countriesLoading && <AiOutlineReload onClick={refetchCountries} className="cursor-pointer hover:animate-spin font-bold  text-xl text-mainGreen " title="إعادة التحميل" />}
                                </div>
                            }
                        </div>
                        {/* country end */}

                        {/* city start */}
                        <div className="flex flex-col" >
                            <Select
                                id="city"
                                label={`${t('city')}`}
                                name="city_id"
                                placeholder={`${t('city')}`}
                                loadingPlaceholder={`${t('loading')}`}
                                options={citiesOptions}
                                //@ts-ignore
                                onChange={(option: SingleValue<SelectOption_TP>) =>
                                    setFieldValue("city_id", option?.id)
                                }
                                loading={citiesLoading}
                                //@ts-ignore
                                isDisabled={!citiesLoading && citiesErrorReason}
                            />
                            {
                                citiesErrorReason &&
                                <div className="flex gap-x-2 items-center" >
                                    {!citiesLoading && <span className="text-mainRed" >حدث خطأ أثناء جلب الباتات  </span>}
                                    {/* @ts-ignore */}
                                    {!citiesLoading && <AiOutlineReload onClick={refetchCities} className="cursor-pointer hover:animate-spin font-bold  text-xl text-mainGreen " title="إعادة التحميل" />}
                                </div>
                            }
                        </div>
                        {/* city end */}

                        {/* district ar  start */}
                        <BaseInputField
                            id="district_ar"
                            label={`${t("district in arabic")}`}
                            name="district_ar"
                            type="text"
                            placeholder={`${t("district in arabic")}`}
                        />
                        {/* district ar  end */}

                        {/* district en  start */}
                        <BaseInputField
                            id="district_en"
                            label={`${t("district in english")}`}
                            name="district_en"
                            type="text"
                            placeholder={`${t("district in english")}`}
                        />
                        {/* district en  end */}
                    </div>
                    <Button
                        type="submit"
                        className="mr-auto"
                    >
                        {t('submit')}
                    </Button>
                </Form>
            </Formik>
        </div>
    )
}