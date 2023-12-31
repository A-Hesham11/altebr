import { t } from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { useFetch, useIsRTL, useMutate } from '../../../hooks'
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
import { Cards_Props_TP } from './ViewSellingPolicies'
import { Table } from '../reusableComponants/tantable/Table'
import { ColumnDef } from '@tanstack/react-table'
import { SvgDelete } from '../../atoms/icons/SvgDelete'
import { EditIcon } from '../../atoms/icons'
import { SelectOption_TP } from '../../../types'


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
    setSelectBranch?: any
    includeTaxFilter?: any
    setEditData?: any
}

const AddTaxPolicy = ({
    editData,
}: SellingPoliciesProps_TP) => {
    console.log("🚀 ~ file: AddTaxPolicy.tsx:45 ~ editData:", editData)
    const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([])
    // const [editTax, setEditTax] = useState([])
    // const [addTaxes, setAddTaxes] = useState([]);
    const [selectBranch, setSelectBranch] = useState("")
    console.log("🚀 ~ file: AddTaxPolicy.tsx:50 ~ selectBranch:", selectBranch)
  
    const includeTaxFilter = dataSource?.filter((item) => item.branch_id == selectBranch)
    console.log("🚀 ~ file: AddTaxPolicy.tsx:52 ~ includeTaxFilter:", includeTaxFilter)

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
    id:"",
    tax_rate: editData?.tax_rate || "",
    branch_id:editData?.branch_id || "",
    branch_name: editData?.branch_name || "",
    include_tax: editData?.include_tax || "",
    include_tax_value: editData?.include_tax_value || "",
    karat_id: editData?.karat_id || "",
    category_id: editData?.category_id || "",
  }

//   const handleDeleteRow = (itemId) => {
//     addTaxes?.findIndex((item) => {
//       return item.id == itemId;
//     });

//     const newData = addTaxes?.filter((item) => {
//       return item.id !== itemId;
//     });

//     setAddTaxes(newData);
//   };

//   const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
//     () => [
//         {
//             header: () => <span>{t("branch")} </span>,
//             accessorKey: "branch_name",
//             cell: (info) => info.getValue() || "---",
//         },
//         {
//           header: () => <span>{t("karat")} </span>,
//           accessorKey: "karat_name",
//           cell: (info) => info.getValue() || "---",
//         },
//         {
//           header: () => <span>{t("category")} </span>,
//           accessorKey: "category_name",
//           cell: (info) => info.getValue() || "---",
//         },
//         {
//             header: () => <span>{t("tax rate")} </span>,
//             accessorKey: "tax_rate",
//             cell: (info) => `${info.row.original.tax_rate} %`,
//         },
//         {
//             header: () => <span>{t("Tax policy")} </span>,
//             accessorKey: "include_tax",
//             cell: (info) => `${info.row.original.include_tax === 0 ? t("selling price does not include tax") : t("Selling price includes tax")}` || "---",
//         },
//         {
//             header: () => <span>{t("actions")}</span>,
//             accessorKey: "action",
//             cell: (info) => {
//             console.log("🚀 ~ file: AddTaxPolicy.tsx:126 ~ info:", info.row.original) 
//             return (
//                 <div className="flex items-center justify-center gap-4">
//                 <EditIcon
//                     action={() => {
//                         // setEditData((prev) => [...prev, info.row.original])
//                         setEditTax(info?.row?.original)
//                         setAction({
//                             edit: true,
//                             delete: false,
//                             view: false,
//                         })
//                     }}
//                     className='fill-mainGreen'
//                 />
//                 <SvgDelete
//                     action={() => {
//                         handleDeleteRow(info.row.original.id)
//                     }}
//                     stroke="#ef4444"
//                 />
//                 </div>
//             )
//             },
//         },
//     ],
//     [addTaxes]
//   )

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

  const { isSuccess, refetch } =
  useFetch<Cards_Props_TP[]>({
    endpoint:`/selling/api/v1/tax_includes`,
    queryKey: ["allTaxes_Selling"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data)
    },
  })

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/create-tax-include",
      values,
      method: "post",
    });
  }

  const PostCardEdit = (values : PoliciesProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/update-tax-include/${editData?.id}`,
      values: {
        ...values,
        _method: "post"
      },
    });
  };

  const {
    data: branchesOptions,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["branches"],
    select: (branches) =>
      branches.map((branch) => {
        return {
          id: branch.id,
          value: branch.name || "",
          label: branch.name || "",
        }
      }),
    onError: (err) => console.log(err),
  })
 
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
                            // PostCardEdit({...values , karat_id:editData?.karat_id, category_id:editData?.category_id})
                            PostCardEdit(values)
                            console.log("🚀 ~ file: AddTaxPolicy.tsx:241 ~ values:",values)
                            // console.log("🚀 ~ file: AddTaxPolicy.tsx:241 ~ values:",{...values, karat_id:editData?.karat_id, category_id:editData?.category_id})

                        } else {
                            PostNewCard(values)
                            console.log("🚀 ~ file: AddTaxPolicy.tsx:231 ~ values:", values)
                            // const items = addTaxes.map((item) => {
                            //     return {
                            //         ...item
                            //     };
                            //   });
                            //   PostNewCard(items)
                        }
                    }}
                >
                    {({ values, setFieldValue, resetForm }) => {

                        return(
                            <Form>
                                <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-12">
                                <Select
                                    id="branch"
                                    label={`${t('branch')}`}
                                    name="branch_id"
                                    placeholder="اختر فرع"
                                    loadingPlaceholder={`${t('loading')}`}
                                    options={branchesOptions}
                                    onChange={(option) => {
                                        console.log("🚀 ~ file: AddTaxPolicy.tsx:259 ~ option:", option)
                                        setFieldValue("branch_name", option?.value);
                                        setFieldValue("branch_id", option?.id);
                                        setSelectBranch(option?.id)
                                    }}
                                    value={{
                                        id: values?.branch_id,
                                        value: values?.branch_id,
                                        label: values?.branch_name || "اختر فرع",
                                    }}
                                />
{/* 
                                <SelectBranches
                                    required
                                    name="branch_id"
                                    editData={{
                                    branch_id: editData?.branch_id,
                                    branch_name: editData?.branch_name,
                                    }}
                                /> */}
                                    <SelectKarat
                                        field="id"
                                        name="karat_id"
                                        noMb={true}
                                        placement="top"
                                        label={`${t('karats')}`}
                                        onChange={(option) => {
                                            setFieldValue("karat_name", option!.value);
                                            setFieldValue("karat_id", option!.id);
                                        }}
                                        value={{
                                            id: values?.karat_id || editData?.karat_id,
                                            value: values?.karat_id || editData?.karat_id,
                                            label: values?.karat_name || editData?.karat_name || t("karat value"),
                                        }}
                                    />
                                    <SelectCategory
                                        name="category_id"
                                        noMb={true}
                                        placement="top"
                                        label={`${t("categories")}`}
                                        all={true}
                                        value={{
                                            value: values?.category_id || editData?.category_id,
                                            id: values?.category_id || editData?.category_id,
                                            label: values?.category_name || editData?.category_name || t("classification"),
                                        }}
                                        onChange={(option) => {
                                            setFieldValue("category_name", option!.value);
                                            setFieldValue("category_id", option!.id);
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
                                                    isChecked={(values?.branch_id && includeTaxFilter.length !== 0) ? (+includeTaxFilter[0]?.include_tax == 0 ? false : true) : editData ? ( editData?.include_tax == 0 ? false : true) : ""}
                                                />
                                                <RadioGroup.RadioButton
                                                    id="0"
                                                    value="0"
                                                    label={`${t("selling price does not include tax")}`}
                                                    isChecked={(values?.branch_id && includeTaxFilter.length !== 0) ? (+includeTaxFilter[0]?.include_tax != 0 ? false : true) : editData ? ( editData?.include_tax != 0 ? false : true) : ""}
                                                />
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    {/* <div>
                                        <Button 
                                        className='bg-mainOrange w-full'
                                            action={() => {
                                                const index = addTaxes?.length
                                                setAddTaxes((prev) => [...prev, {...values, id: index + 1}])
                                                setFieldValue("category_id", "");
                                                setFieldValue("category_name", "");
                                                setFieldValue("karat_id", "");
                                                setFieldValue("karat_name", "");
                                            }}
                                        >
                                            {t("confirm")}
                                        </Button>
                                    </div> */}

                                </div>

                                {/* <div className='my-6'>
                                    {addTaxes.length ? (
                                            <Table data={addTaxes} columns={columns}></Table>
                                        )
                                        : ""
                                    }
                                </div> */}

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
                        )
                    }}
                </Formik>
            </OuterFormLayout>
        </>
    )
}

export default AddTaxPolicy