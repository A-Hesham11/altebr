/////////// IMPORTS
///
//import classes from './GoldSupplyFirstForm.module.css'
///
/////////// Types

import { Form, Formik } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFetch } from "../../hooks";
import { Employee_TP } from "../../pages/employees/employees-types";
import { Supply_TP, supplierTax_TP } from "../../pages/supply/Supply";
import { SelectOption_TP } from "../../types";
import { getDayBefore } from "../../utils/date";
import { Button } from "../atoms";
import {
  BaseInputField,
  DateInputField,
  InnerFormLayout,
  OuterFormLayout,
  Select,
  TextAreaField,
} from "../molecules";
import RadioGroup from "../molecules/RadioGroup";
import { RefetchErrorHandler } from "../molecules/RefetchErrorHandler";
import { DropFile } from "../molecules/files/DropFile";
import { Supplier_TP } from "../templates/systemEstablishment/supplier/supplier-types";
import {
  FirstFormInitValues_TP,
  diamondValidatingSchema,
  goldValidatingSchema,
} from "./formInitialValues_types";

///
type FirstFormProps_TP = {
  setSupplierTax: Dispatch<SetStateAction<supplierTax_TP>>;
  supply: Supply_TP;
  formValues: FirstFormInitValues_TP | undefined;
  setFormValues: React.Dispatch<
    React.SetStateAction<FirstFormInitValues_TP | undefined>
  >;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  nextBondNumber: string | undefined;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const SupplyFirstForm = ({
  setSupplierTax,
  supply,
  formValues,
  setFormValues,
  setStage,
  nextBondNumber,
}: FirstFormProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  // fetch gold price api to set it as default price
  // fetch buyer api
  // const { data: employees, isLoading: employeesLoading, failureReason: employeeError, refetch: refetchEmployee } = useFetch<SelectOption_TP[], Employee_TP[]>
  //   ({
  //     endpoint: "employee/api/v1/employees?per_page=10000",
  //     queryKey: ["employees"],
  //     select: (employess) => employess.map((employee) => {
  //       return {
  //         id: employee.id,
  //         value: employee.name,
  //         label: employee.name,
  //         name: employee.name
  //       }
  //     })
  //   })

  const [goldPriceToday, setGoldPriceToday] = useState("")
  console.log("🚀 ~ file: SupplyFirstForm.tsx:76 ~ goldPriceToday:", goldPriceToday)

  useEffect(() => {
    setGoldPriceToday("");
  }, []);

  const {
    data: employees,
    isLoading: employeesLoading,
    failureReason: employeeError,
    refetch: refetchEmployee,
  } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "employee/api/v1/employees?per_page=10000",
    queryKey: ["employees"],
    select: (employees) =>
      employees
        .filter((employee) => employee?.branch?.id === 1)
        .map((employee) => ({
          id: employee.id,
          value: employee.name,
          label: employee.name,
          name: employee.name,
        })),
  });

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    failureReason: suppliersErrorReason,
    refetch: refetchSupplier,
  } = useFetch<SelectOption_TP[], Supplier_TP[]>({
    endpoint: "/supplier/api/v1/suppliers?per_page=10000",
    queryKey: ["suppliers"],
    onSuccess(data) {},
    select: (suppliers) =>
      suppliers.map((supplier) => {
        return {
          //@ts-ignore
          id: supplier.id,
          value: supplier.name,
          label: supplier.name,
          name: supplier.name,
          tax: supplier.tax,
        };
      }),
  });

  // Gold Price Api
  const { data: GoldPrice } = useFetch<SelectOption_TP[], Employee_TP[]>({
    endpoint: "/buyingUsedGold/api/v1/get-gold-price",
    queryKey: ["GoldPriceApi"],
    onSuccess: (data) => {
      setGoldPriceToday(data["24"])
    }
  });

  // fetch supplier api

  ///
  /////////// STATES
  ///
  ///
  /////////// VARIABLES
  ///

  const FirstFormInitValues: FirstFormInitValues_TP =
    supply === "gold"
      ? {
          twred_type: formValues?.twred_type || "local",
          bond_date: formValues?.bond_date || getDayBefore(new Date()),
          employee_id: formValues?.employee_id || "",
          supplier_id: formValues?.supplier_id || "",
          employee_value: formValues?.employee_value || "",
          supplier_value: formValues?.supplier_value || "",
          bond_number: formValues?.bond_number || "",
          api_gold_price: formValues?.api_gold_price || goldPriceToday, // comes from api gold price
          entity_gold_price: formValues?.entity_gold_price || "" || "20", // should be api gold price value from api if no entered data
          notes: formValues?.notes || "",
          out_goods_value: formValues?.out_goods_value || "",
          media: formValues?.media || [],
          goods_media: formValues?.goods_media || [],
        }
      : supply === "diamond"
      ? {
          twred_type: formValues?.twred_type || "local",
          bond_date: formValues?.bond_date || getDayBefore(new Date()),
          employee_id: formValues?.employee_id || "",
          supplier_id: formValues?.supplier_id || "",
          currency: formValues?.currency || "ryal",
          factorial: formValues?.factorial || 1,
          employee_value: formValues?.employee_value || "",
          supplier_value: formValues?.supplier_value || "",
          bond_number: formValues?.bond_number || "",
          notes: formValues?.notes || "",
          out_goods_value: formValues?.out_goods_value || "",
          media: formValues?.media || [],
          goods_media: formValues?.goods_media || [],
        }
      : {
          twred_type: formValues?.twred_type || "local",
          bond_date: formValues?.bond_date || getDayBefore(new Date()),
          employee_id: formValues?.employee_id || "",
          supplier_id: formValues?.supplier_id || "",
          currency: formValues?.currency || "ryal",
          factorial: formValues?.factorial || 1,
          employee_value: formValues?.employee_value || "",
          supplier_value: formValues?.supplier_value || "",
          bond_number: formValues?.bond_number || "",
          notes: formValues?.notes || "",
          out_goods_value: formValues?.out_goods_value || "",
          media: formValues?.media || [],
          goods_media: formValues?.goods_media || [],
        };


    console.log("🚀 ~ file: SupplyFirstForm.tsx:140 ~ FirstFormInitValues:", FirstFormInitValues)


  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const handleSubmit = (values: FirstFormInitValues_TP) => {
    setStage((prev) => prev + 1);
    if (supply === "gold") {
    console.log("🚀 ~ file: SupplyFirstForm.tsx:194 ~ handleSubmit ~ values:", values)

      values.twred_type === "global"
        ? setFormValues(values)
        : setFormValues({
            twred_type: values.twred_type,
            bond_date: values.bond_date,
            employee_id: values.employee_id,
            supplier_id: values.supplier_id,
            employee_value: values.employee_value,
            supplier_value: values.supplier_value,
            bond_number: values.bond_number,
            api_gold_price: values.api_gold_price,
            entity_gold_price: values.entity_gold_price,
            notes: values.notes,
            media: values.media,
          });
    } else if (supply === "diamond" || supply === "accessories") {
      values.twred_type === "global"
        ? setFormValues(values)
        : setFormValues({
            twred_type: values.twred_type,
            bond_date: values.bond_date,
            employee_id: values.employee_id,
            supplier_id: values.supplier_id,
            employee_value: values.employee_value,
            supplier_value: values.supplier_value,
            bond_number: values.bond_number,
            notes: values.notes,
            currency: values.currency,
            factorial: values.factorial,
            media: values.media,
          });
    }
  };
  ///
  return (
    <>
      <Formik
        onSubmit={(values) => {
        console.log("🚀 ~ file: SupplyFirstForm.tsx:235 ~ values:", values)

          handleSubmit(values)
        }}
        initialValues={FirstFormInitValues}
        validationSchema={
          supply === "gold" ? goldValidatingSchema : diamondValidatingSchema
        }
      >
        {({ values, setFieldValue }) => {
        console.log("🚀 ~ file: SupplyFirstForm.tsx:490 ~ values:", values)
          
          return (
          <Form>
            {/* <HandleBackErrors errors={}> */}

            <OuterFormLayout
              submitComponent={
                <Button type="submit" className="ms-auto mt-8">
                  {t("next")}
                </Button>
              }
            >
              <InnerFormLayout
                title={`${t("main data")}`}
                leftComponent={
                  <p className="font-bold">
                    {`${t("bond number")}`}/
                    <span className=" text-mainOrange">
                      {nextBondNumber ? nextBondNumber : "تحميل رقم ..."}
                    </span>
                  </p>
                }
              >
                {/* currency start */}

                <div className="col-span-4 flex gap-x-5">
                  <div className="flex gap-x-2 mt-8 col-span-4">
                    <span className="font-bold">{t("supply type")}</span>
                    <RadioGroup name="twred_type">
                      <div className="flex gap-x-2">
                        <RadioGroup.RadioButton
                          value="local"
                          label={`${t("local")}`}
                          id="local"
                        />
                        <RadioGroup.RadioButton
                          value="global"
                          label={`${t("global")}`}
                          id="global"
                        />
                      </div>
                    </RadioGroup>
                  </div>
                  {supply !== "gold" && (
                    <div className="flex gap-x-2 mt-8 col-span-4">
                      <span className="font-bold">{t("currency")}</span>
                      <RadioGroup name="currency">
                        <div className="flex gap-x-2">
                          <RadioGroup.RadioButton
                            value="ryal"
                            label={`${t("ryal")}`}
                            id="ryal"
                          />
                          <RadioGroup.RadioButton
                            value="other_currency"
                            label={`${t("other currency")}`}
                            id="other_currency"
                          />
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
                {/* currency end */}

                {/* document date start */}
                <DateInputField
                  label={`${t("bond date")}`}
                  name="bond_date"
                  maxDate={new Date()}
                />
                {/* document date end */}

                {/* buyer name name start */}
                <div className="flex flex-col">
                  <Select
                    id="employee_id"
                    label={`${t("buyer name")}`}
                    name="employee_id"
                    placeholder={`${t("buyer name")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={employees}
                    fieldKey="id"
                    loading={employeesLoading}
                    isDisabled={!employeesLoading && !!employeeError}
                    onChange={(option: any) => {
                      setFieldValue("employee_value", option!.value);
                      setFieldValue("employee_id", option!.id);
                      setFieldValue("api_gold_price", goldPriceToday);

                    }}
                    value={{
                      value:
                        values.employee_value || formValues?.employee_value,
                      label:
                        values.employee_value ||
                        formValues?.employee_value ||
                        t("buyer name"),
                      id: values.employee_id || values.employee_id,
                    }}
                  />
                  <RefetchErrorHandler
                    failureReason={employeeError}
                    isLoading={employeesLoading}
                    refetch={refetchEmployee}
                  />
                </div>
                {/* buyer name name end */}

                {/* supplier name start */}
                <div className="flex flex-col">
                  <Select
                    id="supplier_id"
                    label={`${t("supplier name")}`}
                    name="supplier_id"
                    placeholder={`${t("supplier name")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={suppliers}
                    fieldKey="id"
                    loading={suppliersLoading}
                    isDisabled={!suppliersLoading && !!suppliersErrorReason}
                    onChange={(option: any) => {
                      setFieldValue("supplier_value", option!.value);
                      setFieldValue("supplier_id", option!.id);
                      setSupplierTax(option.tax);
                    }}
                    value={{
                      value:
                        values.supplier_value || formValues?.supplier_value,
                      label:
                        values.supplier_value ||
                        formValues?.supplier_value ||
                        t("supplier name"),
                      id: values.supplier_id || values.supplier_id,
                    }}
                  />
                  <RefetchErrorHandler
                    failureReason={suppliersErrorReason}
                    isLoading={suppliersLoading}
                    refetch={refetchSupplier}
                  />
                </div>
                {/* supplier name end */}

                {/* document number start */}
                <BaseInputField
                  id="bond_number"
                  label={`${t("bond number")}`}
                  name="bond_number"
                  type="text"
                  placeholder={`${t("bond number")}`}
                  required
                />
                {/* document number end */}

                {/* gold price start */}
                {supply === "gold" && (
                  <BaseInputField
                    id="entity_gold_price"
                    label={`${t("gold price")}`}
                    name="api_gold_price"
                    type="text"
                    value={goldPriceToday ? goldPriceToday : ""}
                    placeholder={`${t("gold price")}`}
                    onChange={(e) => {
                      setGoldPriceToday(e.target.value)
                      setFieldValue("api_gold_price", e.target.value);
                    }}
                    required
                    disabled
                    className="bg-mainDisabled"
                  />
                )}
                {/* gold price end */}

                {/* outer goods amount start */}
                {values.twred_type === "global" && (
                  <BaseInputField
                    id="out_goods_value"
                    label={`${t("out goods value")}`}
                    name="out_goods_value"
                    type="text"
                    placeholder={`${t("out goods value")}`}
                    required
                  />
                )}
                {/* currency factorial start */}
                {values.currency === "other_currency" && (
                  <BaseInputField
                    id="factorial"
                    label={`${t("conversion factorial")}`}
                    name="factorial"
                    type="number"
                    placeholder={`${t("conversion factorial")}`}
                    required
                  />
                )}
                {/* currency factorial end */}
                <div className="col-span-4 flex justify-between gap-x-4">
                  {/*doc file start */}
                  <div
                    className={
                      values.twred_type === "global" ? "w-1/2" : "w-full"
                    }
                  >
                    <h2>{t("attach supplier bond file")}</h2>
                    <DropFile name="media" />
                  </div>
                  {/*doc file end */}

                  {/*doc goods file start */}
                  {values.twred_type === "global" && (
                    <div className="w-1/2">
                      <h2>{t("attach goods bond file")}</h2>
                      <DropFile name="goods_media" />
                    </div>
                  )}
                  {/*doc goods file end */}
                </div>

                {/* gold price start */}
                <div className="col-span-4">
                  <TextAreaField
                    name="notes"
                    className="col-span-4"
                    rows={3}
                    placeholder={`${t("notes")}`}
                    id="notes"
                    label={`${t("notes")}`}
                    defaultValue={formValues?.notes || ""}
                  />
                </div>
                {/* gold price end */}
              </InnerFormLayout>
            </OuterFormLayout>

            {/* </HandleBackErrors> */}
          </Form>
        )}}
      </Formik>
    </>
  );
};
