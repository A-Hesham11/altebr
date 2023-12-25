import React, { useContext, useState } from "react";
import PaymentCard from "../../selling/selling components/data/PaymentCard";
import { Button } from "../../atoms";
import { BaseInputField, OuterFormLayout } from "../../molecules";
import { Form, Formik } from "formik";
import { requiredTranslation } from "../../../utils/helpers";
import * as Yup from "yup";
import { t } from "i18next";
import { useFetch, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { Cards_Props_TP } from "./ViewBankCards";
import { Loading } from "../../organisms/Loading";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { SelectBankAccount } from "./SelectBankAccount";
import { SelectBanks } from "../accountsBank/SelectBanks";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { SingleValue } from "react-select";
import { SelectOption_TP } from "../../../types";
import { SelectBranchCard } from "./SelectBranchCard";

type AddBankCardProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: Cards_Props_TP;
};

type bankCardsProps_TP = {
  title: string;
  name_ar: string;
  discount_percentage: string;
  branch_id: string;
  card_id: number;
  bank_account: string;
  bank_id: string;
  company_id: string;
  selectedCardId: string;
  commission_rate: string;
  main_account_number: string;
  bank_account_id: number;
  bankId?: string;
  card_new_name: string;
  company_name: string;
};

const AddBankCardsData = ({
  title,
  editData,
  value,
  onAdd,
}: AddBankCardProps_TP) => {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [accountNumberId, setAccountNumberId] = useState();

  const [card, setCard] = useState("");

  const [cardId, setCardId] = useState("");

  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>();

  const { userData } = useContext(authCtx);

  const handleCardSelection = (selectedCardType: string) => {
    setCard(selectedCardType);
  };

  const cardsValidatingSchema = () =>
    Yup.object({
      bank_id: Yup.string().trim().required(requiredTranslation),
      bank_account_id: Yup.string().trim().trim().required(requiredTranslation),
      company_name: Yup.string().trim().required(requiredTranslation),
      branch_id: Yup.string().trim().required(requiredTranslation),
      discount_percentage: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    discount_percentage: editData?.discount_percentage || "",
    branch_id: "",
    card_id: cardId,
    bank_account_id: editData?.bank_account_id || "",
    main_account_number: editData?.main_account_number || "",
    bank_id: editData?.bank_id || "",
    company_id: userData?.branch?.company?.id,
    company_name: userData?.branch?.company?.name,
    commission_rate: editData?.commission_rate || "",
  };

  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);
  console.log("🚀 ~ file: AddBankCardsData.tsx:96 ~ dataSource:", dataSource)

  const {
    data,
    isSuccess,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch: refetchCards,
    isFetching,
  } = useFetch<Cards_Props_TP[]>({
    endpoint: `/selling/api/v1/cards`,
    queryKey: ["AllCards"],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data);
    },
    select: (data) => {
      return {
        ...data,
        data: data.data.map((branches, i) => ({
          ...branches,
          index: i + 1,
        })),
      };
    },
  });
    console.log("🚀 ~ file: AddBankCardsData.tsx:124 ~ data:", data)

  function PostNewCard(values: bankCardsProps_TP) {
    mutate({
      endpointName: "/selling/api/v1/add_card",
      values: {
        discount_percentage: values?.discount_percentage,
        branch_id: values?.branch_id,
        card_id: values?.card_id,
        main_account_number: values?.main_account_number,
        bank_account_id: values?.bank_account_id,
        bank_id: values?.bank_id,
        company_id: values?.company_id,
        company_name: values?.company_name,
        commission_rate: values?.commission_rate,
      },
      method: "post",
    });
  }

  const PostCardEdit = (values: bankCardsProps_TP) => {
    mutate({
      endpointName: `/selling/api/v1/add_cards/${editData?.id}`,
      values: {
        discount_percentage: values?.discount_percentage,
        branch_id: values?.branch_id,
        card_id: values?.card_id,
        main_account_number: values?.main_account_number,
        bank_account_id: values?.bank_account_id,
        bank_id: values?.bank_id,
        company_id: values?.company_id,
        company_name: values?.company_name,
        commission_rate: values?.commission_rate,
        _method: "put",
      },
    });
  };

  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: editLoading,
    data: cardsData,
    isSuccess: isSuccessData,
    reset,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["BranchCards"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["all-BranchCards"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  if (dataSource?.length === 0 && isFetching)
    return <Loading mainTitle={t("جاري التحميل")} />;

  return (
    <div>
      <>
        <OuterFormLayout header={title}>
          <Formik
            validationSchema={() => cardsValidatingSchema()}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
            console.log("🚀 ~ file: AddBankCardsData.tsx:191 ~ values:", values)
 
              if (cardId === "") notify("info", "please select a card");

              if (editData) {
                PostCardEdit({
                  ...values,
                  card_id: cardId,
                  discount_percentage: values.discount_percentage / 100,
                });
              } else {
                PostNewCard({
                  ...values,
                  card_id: cardId,
                  discount_percentage: values.discount_percentage / 100,
                });
              }
            }}
          >
            {({ values, setFieldValue, resetForm }) => (
              <Form>
                {!isFetching && isSuccess && dataSource?.length !== 0 ? (
                  <>
                    <PaymentCard
                      selectedCardId={selectedCardId}
                      setSelectedCardId={setSelectedCardId}
                      editData={editData}
                      setCardId={setCardId}
                      fetchShowMainCards
                    />

                    <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end mb-8 mt-8">
                      <div>
                        <SelectBanks
                          name="bank_id"
                          editData={{
                            bank_id: editData?.bank_id,
                            bank_name: editData?.name_ar,
                          }}
                          newValue={newValue}
                          setNewValue={setNewValue}
                        />
                      </div>
                      <div>
                        <SelectBankAccount
                          name="bank_account_id"
                          editData={{
                            bank_account_id: editData?.bank_account_id,
                            main_account_number: editData?.main_account_number,
                          }}
                          bankId={newValue}
                          setAccountNumberId={setAccountNumberId}
                        />
                      </div>
                      <div>
                        <BaseInputField
                          id="company_name"
                          label={`${t("company name")}`}
                          name="name_ar"
                          type="text"
                          placeholder={`${t("company name")}`}
                          required
                          value={values?.company_name}
                        />
                      </div>
                      <div>
                        <SelectBranchCard
                          name="branch_id"
                          required
                          editData={{
                            branch_id: editData?.branch_id,
                            branch_name: editData?.branch_name,
                          }}
                          bankId={newValue}
                          accountNumberId={accountNumberId}
                        />
                      </div>

                      <div>
                        <BaseInputField
                          id="discount_percentage"
                          name="discount_percentage"
                          type="number"
                          label={`${t("discount percentage")}`}
                          placeholder={`${t("discount percentage")}`}
                          onChange={() => {
                            setFieldValue(
                              "discount_percentage",
                              values.discount_percentage
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="w-fit"
                        loading={editLoading}
                      >
                        {t("save")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center font-medium text-lg my-5">{t("The type of cards must be defined first")}</p>
                ) 
                }
                {/* {dataSource.lenght === 0 && "fffff"} */}
              </Form>
            )}
          </Formik>
        </OuterFormLayout>
      </>
    </div>
  );
};

export default AddBankCardsData;
