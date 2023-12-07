///
/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { Dispatch, SetStateAction } from "react"
import * as Yup from "yup"
import { useFetch, useIsRTL, useMutate } from "../../../../../hooks"
import { SelectOption_TP } from "../../../../../types"
import { mutateData } from "../../../../../utils/mutateData"
import { notify } from "../../../../../utils/toast"
import { HandleBackErrors } from "../../../../../utils/utils-components/HandleBackErrors"

import { requiredTranslation } from "../../../../../utils/helpers"
import { CategoryMainData } from "./CategoryMainData"

///
/////////// Types
///
type CreateCategoryProps_TP = {
  value?: string
  onAdd?: (value: string) => void
  editData?: { [key: string]: any }
  setDataSource?: Dispatch<SetStateAction<InitialValues_TP[]>>
  setShow?: Dispatch<SetStateAction<boolean>>
  title?: string
}

type SingleCategory_TP = {
  name_en: string
  name_ar: string
  type: "multi" | "single"
  selling_type: "part" | "all"
  has_selsal: boolean
  has_size: boolean
  category_sizes: SizeProps_TP[]
} & SizeProps_TP

type InitialValues_TP = {
  items: SingleCategory_TP[]
} & SingleCategory_TP

type SizeProps_TP = {
  start: number
  end: number
  increase: number
  size_type: string
}

type SizeProps_TP2 = {
  start: number
  end: number
  increase: number
  type: string
}

const CreateCategory = ({
  value = "",
  onAdd,
  editData,
  setDataSource,
  setShow,
  title,
}: CreateCategoryProps_TP) => {

  ///
  /////////// STATES
  ///
  // const [sizes, setSizes] = useState<SizeProps_TP2[]>(
  //   editData ? (editData?.category_sizes ? editData?.category_sizes : []) : []
  // )

  ///
  /////////// HELPER VARIABLES & FUNCTIONS
  ///
  const isRTL = useIsRTL()

  const handleEditedItems = (items: any) => {
    return items.map((item: any) => {
      return {
        id: item?.id,
        label: item?.name,
        name: item?.name,
        value: item?.id,
      }
    })
  }

  const initialValues: InitialValues_TP = {
    name_ar: editData ? editData.name_ar : isRTL ? value! : "",
    name_en: editData ? editData.name_en : !isRTL ? value! : "",
    type: editData ? editData?.type : "single",
    selling_type: editData ? editData?.selling_type : "part",
    items: editData && editData.items ? handleEditedItems(editData.items) : [],
    has_selsal: editData ? editData?.has_selsal : false,
    has_size: editData ? editData?.has_size : false,
    start: 0,
    end: 0,
    increase: 0,
    size_type: "غير محدد",
    category_sizes: editData
      ? editData?.category_sizes
        ? editData?.category_sizes
        : []
      : [],
  }

  const validatingSchema = Yup.object({
    name_en: Yup.string().trim().required(requiredTranslation),
    name_ar: Yup.string().trim().required(requiredTranslation),
    type: Yup.string().trim().required(requiredTranslation),
    selling_type: Yup.string().trim().required(requiredTranslation),
    has_selsal: Yup.boolean().required(requiredTranslation),
    has_size: Yup.boolean(),
    items: Yup.array().when("type", {
      is: "multi",
      then: (schema) => schema.min(1, requiredTranslation),
    }),
    // category_sizes: Yup.string().when("has_size", {
    //   is: true,
    //   then: (schema) =>
    //     schema.required(`${t("required")}`).typeError(`${t("required")}`),
    // }),
    // start: Yup.number().when("has_size", {
    //   is: true && sizes?.length <= 0,
    //   then: (schema) =>
    //     schema.min(1, requiredTranslation).required(requiredTranslation),
    // }),
    // end: Yup.number().when("has_size", {
    //   is: true && sizes?.length <= 0,
    //   then: (schema) =>
    //     schema.min(1, requiredTranslation).required(requiredTranslation),
    // }),
    // increase: Yup.number().when("has_size", {
    //   is: true && sizes?.length <= 0,
    //   then: (schema) =>
    //     schema.min(1, requiredTranslation).required(requiredTranslation),
    // }),
    // category_sizes: Yup.string().when("has_size", {
    //   is: true,
    //   then: (schema) =>
    //     schema.required(`${t("required")}`).typeError(`${t("required")}`),
    // }),
  })

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: categoryOptions,
    refetch: categoryRefetch,
    isLoading: categoryLoading,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "classification/api/v1/categories?per_page=10000",
    queryKey: ["categories"],
    select: (categories) => {
      return categories.map((category: any) => ({
        id: category.id,
        label: category.name,
        name: category.name,
        value: category.id,
      }))
    },
  })

  const queryClient = useQueryClient()
  const { mutate, isLoading, error, isSuccess, reset } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data: any) => {
      notify("success")
      if (value && onAdd) {
        onAdd(value)
        queryClient.setQueryData(["categories"], (old: any) => {
          return [...(old || []), data]
        })
      }
      if (setDataSource && setShow && !editData && !error) {
        // setDataSource((prev: any) => [...prev, data])
        queryClient.refetchQueries(["AllCategory"])
        setShow(false)
      }
      if (setDataSource && setShow && editData && !error) {
        setShow(false)
        queryClient.refetchQueries(["AllCategory"])
        // setDataSource((prev: any) =>
        //   prev.map((p: any) => (p.id === data?.id ? data : p))
        // )
      }
    },
  })

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  // const addSize = (props: SizeProps_TP) => {
  //   const size = {
  //     start: props.start,
  //     end: props.end,
  //     increase: props.increase,
  //     type: props.size_type,
  //   }
  //   setSizes([...sizes, size])
  //   // const size_gap = props.end - props.start
  //   // if (size_gap > 0 && (size_gap % props.increase === 0)) {
  //   //   const size = {
  //   //     start: props.start,
  //   //     end: props.end,
  //   //     increase: props.increase,
  //   //     type: props.size_type,
  //   //   }
  //   //   setSizes([...sizes, size])
  //   // } else {
  //   //   notify('error', `${t('sizes must be accurate')}`)
  //   // }
  // }

  // const deleteSize = (index: number) => {
  //   const newSizes = sizes.filter((size, i) => index !== i)
  //   setSizes(newSizes)
  // }

  const send = (values: InitialValues_TP) => {
    const sendNewItemsIds = editData ? values?.items?.find((item) => {
      return item
    })?.id || 1.1 : values?.items?.find((item) => {  // 1.1 is just a sign to new ids related to this condition sendNewItemsIds === backItemsIds it is necessary
      return item
    })
    const backItemsIds = editData?.items?.find((item) => {
      return item?.id
    })?.id
    
    const sendNewSizesIds = typeof values?.category_sizes === 'object' ?  values?.category_sizes?.find((item) => {
      return item?.id
    }) : values.category_sizes
    const backSizesIds = editData?.category_sizes?.find((item) => {
      return item?.id
    })
    const multi = values.type === "multi"
    const singleValues = {
      name_en: values.name_en,
      name_ar: values.name_ar,
      type: "single",
      selling_type: values.selling_type,
      has_selsal: values.has_selsal,
      has_size: values.has_size,
      category_sizes: typeof sendNewSizesIds === 'object' ? sendNewSizesIds : [sendNewSizesIds]
    }
    const categorySizes =
      sendNewSizesIds?.id === backSizesIds?.id
        ? { ...singleValues }
        : { ...singleValues, category_sizes: [values.category_sizes] }

    const multiValues =
      sendNewItemsIds === backItemsIds
        ? {
          name_en: values.name_en,
          name_ar: values.name_ar,
          type: "multi",
          selling_type: values.selling_type,
          has_selsal: values.has_selsal,
          has_size: false,
          // items: values.items,
        }
        : {
          name_en: values.name_en,
          name_ar: values.name_ar,
          type: "multi",
          selling_type: values.selling_type,
          has_selsal: values.has_selsal,
          has_size: false,
          ...(values.items.length && { items: values.items })
        }

    mutate({
      endpointName: editData
        ? `/classification/api/v1/categories/${editData.id}`
        : `/classification/api/v1/categories`,
      values: multi
        ? multiValues
        : values.has_size
          ? categorySizes
          : singleValues,
      method: editData ? "put" : "post",
    })

    // multi
    //   ? console.log("multiValues", multiValues)
    //   : console.log(
    //     values.has_size
    //       ? { ...singleValues, category_sizes: values.category_sizes }
    //       : singleValues
    //   )
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => send(values)}
      validationSchema={validatingSchema}
    >
      {(props) => (
        <Form>
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <CategoryMainData
              editData={editData}
              title={title}
              isLoading={isLoading}
              isSuccessPost={isSuccess}
              resetData={reset}
              categoryRefetch={categoryRefetch}
              props={props}
              handleEditedItems={handleEditedItems}
              categoryOptions={categoryOptions}
              categoryLoading={categoryLoading}
            />
          </HandleBackErrors>
        </Form>
      )}
    </Formik>
  )
}

export default CreateCategory
