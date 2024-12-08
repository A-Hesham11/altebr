import React, { useContext, useEffect, useState } from "react";
import PaymentCard from "../selling/selling components/data/PaymentCard";
import { Payment_TP } from "../selling/selling components/data/PaymentProcessing";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { BaseInput, Button, FormikError } from "../atoms";
import SelectKarat from "../templates/reusableComponants/karats/select/SelectKarat";
import { BaseInputField } from "../molecules";
import { useFetch, useMutate } from "../../hooks";
import { numberContext } from "../../context/settings/number-formatter";
import { authCtx } from "../../context/auth-and-perm/auth";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";

const RecycledGoldConvertProcess = ({ refetch, setOpen }: any) => {
  const [card, setCard] = useState<string | undefined>("");
  const [karatID, setKaratID] = useState<number | undefined>(0);
  const [cardImage, setCardImage] = useState<string | undefined>("");
  const [cardFrontKey, setCardFronKey] = useState<string>("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [cardId, setCardId] = useState<string>("");
  const [selectedCardName, setSelectedCardName] = useState<string>("");
  const { formatReyal } = numberContext();
  const { userData } = useContext(authCtx);

  const handleCardSelection = (
    selectedCardType: string,
    selectedCardImage: string,
    karat_id: number
  ) => {
    setCard(selectedCardType);
    setCardImage(selectedCardImage);
    setKaratID(karat_id);
  };

  const { data, refetch: refetchData } = useFetch({
    endpoint: `/sadadSupplier/api/v1/show/${cardId}/${userData?.branch_id}/${cardFrontKey}`,
    queryKey: ["showValueOfCardsRecycleInEdara", cardId],
    onSuccess(data) {
      return data.data;
    },
    enabled: !!cardId && !!userData?.branch_id && !!cardFrontKey,
  });

  const initialValues = {
    value: 0,
    weight: 0,
    karat_name: "",
    Caliber_difference: 0,
    karat_id: 0,
  };

  const {
    mutate,
    error: errorQuery,
    isLoading,
  } = useMutate<any>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      refetch();
      refetchData();
      setOpen(false);
    },
    onError: (error) => {
      notify("error");
    },
  });

  return (
    <div>
      <h2>{t("")}</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("🚀 ~ RecycledGoldConvertProcess ~ values:", values);
          const notifyInfo = (messageKey) => notify("info", `${t(messageKey)}`);

          if (!cardId) {
            notifyInfo("choose type card");
            return;
          }

          const weight = Number(values?.weight);
          const value = Number(values?.value);

          if (weight <= 0) {
            notifyInfo("weight must be greater than 0");
            return;
          }

          if (weight > value) {
            notifyInfo("The weight exceeds the value specified in the box");
            return;
          }

          if (!values?.karat_id) {
            notifyInfo("choose Karats");
            return;
          }

          if (values?.karat_id === karatID) {
            notifyInfo("The weight exceeds the value specified in the box");
            return;
          }

          mutate({
            endpointName: "/tahwilKarat/api/v1/tahwilkarats",
            values: {
              karat_id: karatID,
              karat_from_name: selectedCardId,
              karat_to_name: values?.karat_name,
              total: weight,
              bond_date: new Date(),
              employee_id: userData?.id,
              collectfaqk3yar: values?.Caliber_difference,
            },
          });
        }}
        // enableReinitialize={true}
      >
        {({ values, setFieldValue }) => {
          useEffect(() => {
            if (data?.value && data?.value !== values.value) {
              setFieldValue("value", Number(data?.value) || 0);
            }
          }, [data?.value]);

          const totalCaliberDifference = Math.abs(
            Number(values?.weight) -
              (Number(values?.weight) * Number(selectedCardId)) /
                Number(values.karat_name)
          );

          const totalRemainingWeight = Math.abs(
            (Number(values?.weight) * Number(selectedCardId)) /
              Number(values.karat_name)
          );

          useEffect(() => {
            if (selectedCardId && values?.weight && values.karat_name) {
              setFieldValue(
                "Caliber_difference",
                totalCaliberDifference ? totalCaliberDifference : 0
              );
              setFieldValue(
                "remaining_weight",
                totalRemainingWeight ? totalRemainingWeight : 0
              );
            }
          }, [selectedCardId, totalCaliberDifference, totalRemainingWeight]);

          return (
            <Form>
              <PaymentCard
                onSelectCard={handleCardSelection}
                selectedCardId={selectedCardId}
                setSelectedCardId={setSelectedCardId}
                setCardFronKey={setCardFronKey}
                setCardId={setCardId}
                setSelectedCardName={setSelectedCardName}
              />

              <div className="grid grid-cols-3 gap-3">
                <BaseInputField
                  id="value"
                  name="value"
                  type="text"
                  label={
                    selectedCardName ? `${selectedCardName} ` : t("Fund totals")
                  }
                  placeholder={
                    selectedCardName ? selectedCardName : t("Fund totals")
                  }
                  value={data?.value ? formatReyal(Number(data?.value)) : 0}
                  disabled
                  className={`bg-mainDisabled text-mainGreen ${
                    selectedCardName && "font-semibold"
                  }`}
                />

                <div>
                  <BaseInputField
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder={t("weight")}
                    label={t("weight")}
                  />
                  <p className="text-mainRed mt-0.5">
                    {values?.weight &&
                    Number(values?.weight) > Number(values?.value)
                      ? `${t(
                          "The weight exceeds the value specified in the box"
                        )}`
                      : ""}
                  </p>
                </div>

                <div>
                  <SelectKarat
                    field="id"
                    name="karat_name"
                    noMb={true}
                    placement="top"
                    label={t("Convert karat to")}
                    onChange={(option) => {
                      setFieldValue("karat_name", option!.value);
                      setFieldValue("karat_id", option!.id);
                    }}
                  />
                  <p className="text-mainRed mt-0.5">
                    {values?.karat_id && values?.karat_id == karatID
                      ? `${t("A different caliber must be selected.")}`
                      : ""}
                  </p>
                </div>

                <div>
                  <BaseInputField
                    id="Caliber_difference"
                    name="Caliber_difference"
                    placeholder={t("Caliber difference")}
                    label={t("Caliber difference")}
                    disabled
                    className={`bg-mainDisabled`}
                    value={formatReyal(Number(totalCaliberDifference))}
                  />
                </div>
                <BaseInputField
                  id="remaining_weight"
                  name="remaining_weight"
                  placeholder={t("Weight converted to")}
                  label={t("Weight converted to")}
                  disabled
                  className={`bg-mainDisabled`}
                  value={formatReyal(Number(totalRemainingWeight))}
                />
              </div>
              <div className="flex items-end justify-end mt-5">
                <Button type="submit" loading={isLoading}>
                  {t("save")}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RecycledGoldConvertProcess;
