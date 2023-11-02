/////////// IMPORTS
///
import { Form, Formik, FormikValues } from "formik"
import { t } from "i18next"
import { useState } from "react"
import * as Yup from "yup"
import { useFetch, useMutate } from "../../../../hooks"
import { SelectOption_TP } from "../../../../types"
import { requiredTranslation } from "../../../../utils/helpers"
import { mutateData } from "../../../../utils/mutateData"
import { notify } from "../../../../utils/toast"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../atoms"
import {
  BaseInputField,
  CheckBoxField,
  InnerFormLayout,
  OuterFormLayout,
  RadioField,
  Select,
} from "../../../molecules"
import { AccountingTreeForm } from "./AccountingTreeForm"
import { useQueryClient } from "@tanstack/react-query"
import { Schema } from "yup"
import { SingleValue } from "react-select"
import RadioGroup from "../../../molecules/RadioGroup"
/////////// Types
///

export type AccountLevel_TP = {
  id: string
  name: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///
const initialValues = {
  name_ar: "",
  name_en: "",
  nature: "creditor",
  numeric_system: "",
  has_child: true,
  unit_id: "",
  tree_id: "",
  account_id: "",
  parent_id: "",
  tree_level: 1,
}
const validatingSchema = Yup.object().shape({
  name_ar: Yup.string().trim().required(requiredTranslation),
  name_en: Yup.string().trim().required(requiredTranslation),
  //   طبيعة الحساب
  nature: Yup.string().trim().required(requiredTranslation),
  //   الدليل المحاسبي
  numeric_system: Yup.string().trim().min(1).required(requiredTranslation),
  //   له حساب فرعي
  has_child: Yup.bool(),
  //   وحدة القياس
  unit_id: Yup.string().trim().required(requiredTranslation),
  tree_id: Yup.string().when("tree_level", {
    is: (val: number) => [2, 3, 4].includes(val),
    then: (schema) => schema.trim().required(requiredTranslation),
    otherwise: (Schema) => Schema.trim(),
  }),

  // حساب المستوي الثاني
  account_id: Yup.string()
    .trim()
    .when("tree_level", {
      is: (val: number) => {
        ;[3, 4].includes(val)
      },
      then: (schema) => schema.trim().required(requiredTranslation),
      otherwise: (Schema) => Schema.trim(),
    }),

  //   حساب المستوي الثالث
  parent_id: Yup.string()
    .trim()
    .when("tree_level", {
      is: 4,
      then: (schema) => schema.trim().required(requiredTranslation),
      otherwise: (Schema) => Schema.trim(),
    }),
})
///
export const AccountingTree = () => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  type level_TP = {
    id: string
    name: string
    value: string
    label: string
  }
  ///
  /////////// STATES
  ///
  const [level, setLevel] = useState<number>(1)
  const [tree_id, setTree_id] = useState({
    id: "",
    name: "",
  })
  const [account_id, setAccount_id] = useState<SingleValue<SelectOption_TP>>({
    id: "",
    name: "",
    value: "",
    label: "",
  })

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  /////////// SIDE EFFECTS
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  // "وحده القياس"
  const { data: unitsData, isLoading: isLoadingUnitsData } = useFetch<
    SelectOption_TP[],
    AccountLevel_TP[]
  >({
    queryKey: ["units"],
    endpoint: "/accounting/api/v1/units",
    select: (units) =>
      units?.map((unit) => ({
        id: unit.id,
        name: unit.name,
        value: unit.name,
        label: unit.name,
      })),
  })

  const {
    mutate: accountingTreeMutate,
    isLoading: isLoadingAccountingTree,
    error,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      console.log("first", data)
      notify("success")
    },
    onError: (err) => {
      notify("error")
      console.log(err)
    },
  })

  const handleSubmit = (values: FormikValues) => {
    // level1
    if (level === 1) {
      const { tree_id, account_id, parent_id, ...filteredValues } = values
      console.log("1", filteredValues)
      accountingTreeMutate({
        endpointName: "/accounting/api/v1/add_account",
        values: filteredValues,
      })
      return
    }
    // level2
    if (level === 2) {
      const { account_id, parent_id, ...filteredValues } = values
      console.log("2", filteredValues)
      accountingTreeMutate({
        endpointName: "/accounting/api/v1/add_account",
        values: filteredValues,
      })
      return
    }
    // level3
    if (level === 3) {
      const { tree_id, parent_id, ...filteredValues } = values
      console.log("3", filteredValues)
      accountingTreeMutate({
        endpointName: "/accounting/api/v1/add_account",
        values: filteredValues,
      })
      return
    }
    // level4
    if (level === 4) {
      const { tree_id, account_id, ...filteredValues } = values
      console.log("4", filteredValues)
      accountingTreeMutate({
        endpointName: "/accounting/api/v1/add_account",
        values: filteredValues,
      })
      return
    }
  }

  ///
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={validatingSchema}
      >
        {({ setFieldValue }) => (
          <Form>
            <HandleBackErrors errors={error?.response.data.errors}>
              <OuterFormLayout
                submitComponent={
                  <Button
                    type="submit"
                    className="ms-auto mt-8"
                    disabled={isLoadingAccountingTree}
                    loading={isLoadingAccountingTree}
                  >
                    {t("submit")}
                  </Button>
                }
              >
                <InnerFormLayout title={`${t("Accounting Tree")}`} >
                  <div className="col-span-2 items-center flex gap-3">
                    <h4 className="col-span-1 flex items-center text-lg font-bold ">
                      مستوي الحساب
                    </h4>
                    <div className="relative col-span-1 flex items-center gap-2 ">
                      <CheckBoxField
                        label={t("has a Sub account")}
                        name="has_child"
                        id="has_child"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span>طبيعة الحساب :</span>
                    <RadioGroup name="nature">
                      <div className="flex gap-3">
                        <RadioGroup.RadioButton
                          value="creditor"
                          label={t("creditor")}
                          id="creditor"
                        />
                        <RadioGroup.RadioButton
                          value="debtor"
                          label={`${t("debtor")}`}
                          id="debtor"
                        />
                      </div>
                    </RadioGroup>
                  </div>
                  <Button
                    action={() => {
                      setLevel(1)
                      setFieldValue("tree_level", 1)
                    }}
                    className={`flex items-center justify-center ${
                      level !== 1 &&
                      "bg-white text-mainGreen border border-mainGreen"
                    }`}
                  >
                    {t("level one")}
                  </Button>
                  <Button
                    action={() => {
                      setFieldValue("tree_level", 2)
                      setLevel(2)
                    }}
                    className={`flex items-center justify-center ${
                      level !== 2 &&
                      "bg-white text-mainGreen border border-mainGreen"
                    }`}
                  >
                    {t("level two")}
                  </Button>
                  <Button
                    action={() => {
                      setFieldValue("tree_level", 3)
                      setLevel(3)
                    }}
                    className={`flex items-center justify-center ${
                      level !== 3 &&
                      "bg-white text-mainGreen border border-mainGreen"
                    }`}
                  >
                    {t("level three")}
                  </Button>
                  <Button
                    action={() => {
                      setFieldValue("tree_level", 4)
                      setLevel(4)
                    }}
                    className={`flex items-center justify-center ${
                      level !== 4 &&
                      "bg-white text-mainGreen border border-mainGreen"
                    }`}
                  >
                    {t("level four")}
                  </Button>
                  <BaseInputField
                    type="text"
                    id="name_ar"
                    label={t("arabic name").toString()}
                    name="name_ar"
                    placeholder={t("arabic name").toString()}
                    required
                  />
                  <BaseInputField
                    type="text"
                    id="name_en"
                    label={t("english name").toString()}
                    name="name_en"
                    placeholder={t("english name").toString()}
                    required
                  />
                  <BaseInputField
                    type="text"
                    id="numeric_system"
                    label={t("numeric system").toString()}
                    name="numeric_system"
                    placeholder={t("numeric system").toString()}
                    required
                  />
                  <Select
                    label={t("unit id").toString()}
                    name="unit_id"
                    id="unit_id"
                    placeholder={t("unit id").toString()}
                    loadingPlaceholder={t("Loading units").toString()}
                    loading={isLoadingUnitsData}
                    options={unitsData}
                    fieldKey="id"
                    isDisabled={isLoadingUnitsData}
                    
                  />

                  <AccountingTreeForm
                    level={level}
                    setAccount_id={setAccount_id}
                    account_id={account_id}
                    tree_id={tree_id}
                    setTree_id={setTree_id}
                  />
                </InnerFormLayout>
              </OuterFormLayout>
            </HandleBackErrors>
          </Form>
        )}
      </Formik>
    </>
  )
}
