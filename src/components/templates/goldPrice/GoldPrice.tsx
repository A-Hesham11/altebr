import { t } from "i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { Form, Formik, FormikContext, useFormikContext } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { requiredTranslation } from "../../../utils/helpers";
import { BaseInputField, OuterFormLayout, Select } from "../../molecules";
import { Button } from "../../atoms";

type PoliciesProps_TP = {
  title: string;
  job_id: string;
  job_type: string;
  max_buy_type_id: string;
  max_buy_type: string;
  max_buy_rate: string;
  max_buy_cash: string;
  return_days: string;
  sales_return: string;
  branch_id: string;
  branch_name: string;
};

type BuyingPoliciesProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: PoliciesProps_TP;
};

const GoldPrice = ({ title }: BuyingPoliciesProps_TP) => {
  const [goldType, setGoldType] = useState();
  console.log("🚀 ~ file: GoldPrice.tsx:37 ~ GoldPrice ~ goldType:", goldType)
  const [editData, setEditData] = useState();

  const queryClient = useQueryClient();
  const isRTL = useIsRTL();

  const { userData } = useContext(authCtx);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
  }, [isRTL]);

  const cardsValidatingSchema = () =>
    Yup.object({
      gold_type: Yup.string().trim().required(requiredTranslation),
      gold_price: Yup.string().trim(),
    });

  const {
    mutate,
    isLoading: editLoading,
    data,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["gold_price"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["all_gold_price"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  function PostNewCard(values: PoliciesProps_TP) {
    mutate({
      endpointName: "/buyingUsedGold/api/v1/gold-price",
      values,
      method: "post",
    });
  }

  const {
    data: goldPriceData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
    isSuccess,
  } = useFetch({
    queryKey: ["static-price"],
    endpoint: "/buyingUsedGold/api/v1/show-gold-price",
    onSuccess: (data) => {
      setEditData(data);
    },
  });

  useEffect(() => {
    const best = {
      id: editData?.gold_type || "",
      value: editData?.gold_type || "",
      label: editData?.gold_type || t("type"),
    };
    setGoldType(best);
  }, [editData]);

  const goldTypeOption = [
    {
      id: "kilo",
      label: t("kilo"),
      value: "كيلو",
    },
    {
      id: "gram",
      label: t("gram"),
      value: "جرام",
    },
  ];

  const initialValues = {
    gold_type: editData?.gold_type || "",
    gold_price: editData?.gold_price,
  };

  return (
    <>
      <OuterFormLayout header={t("gold price")}>
        <Formik
          validationSchema={() => cardsValidatingSchema()}
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            PostNewCard({
              ...values,
            });
          }}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8">
                <Select
                  id="gold_type"
                  label={`${t("type")}`}
                  name="gold_type"
                  placeholder={`${t("type")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={goldTypeOption}
                  fieldKey="id"
                  value={goldType}
                  onChange={(option: any) => {
                    setFieldValue("gold_type", option!.value);
                    setGoldType(option);
                  }}
                />

                <BaseInputField
                  id="gold_price"
                  name="gold_price"
                  type="text"
                  label={`${t("gold price")}`}
                  placeholder={
                    editData
                      ? editData?.gold_price
                      : `${t("gold price")} (${t("monetary")})`
                  }
                  onChange={() => {
                    setFieldValue("gold_price", values?.gold_price);
                  }}
                />
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

export default GoldPrice;
