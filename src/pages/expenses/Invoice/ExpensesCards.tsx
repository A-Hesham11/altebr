import React, { useContext, useEffect, useState } from "react";
import { Payment_TP } from "../../Payment/PaymentProccessingToManagement";
import { useFetch, useIsRTL } from "../../../hooks";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
import { t } from "i18next";
import { FormikSharedConfig, useFormikContext } from "formik";
import { authCtx } from "../../../context/auth-and-perm/auth";
import cashImg from "../../../assets/cash.png";

interface ExpensesCardsProps {
  setSelectedCardId: Function;
  setCard: Function;
  setCardImage: Function;
  card: any;
  cardImage: any;
  selectedCardFrontKey: any;
  setSelectedCardFrontKey: Function;
  setCardItem: Function;
  setCardDiscountPercentage: Function;
  editData: any;
  setEditData: Function;
}

const ExpensesCards: React.FC<ExpensesCardsProps> = ({
  setSelectedCardId,
  setCard,
  setCardImage,
  card,
  cardImage,
  selectedCardFrontKey,
  setSelectedCardFrontKey,
  setCardItem,
  setCardDiscountPercentage,
  editData,
  setEditData,
}) => {
  const [dataSource, setDataSource] = useState<Payment_TP[]>([]);
  const [bankAccountCards, setBankAccountCards] = useState<Payment_TP[]>([]);
  const [slidesToShow, setSlidesToShow] = useState(2);
  const { userData } = useContext(authCtx);

  const { setFieldValue } = useFormikContext<FormikSharedConfig>();

  const isRTL = useIsRTL();

  const cardOfCash = [
    {
      id: 2,
      front_key: "cash",
      name_ar: "نقدي",
      name_en: "cash",
      discount_percentage: 0,
      card: {
        bank_id: 1,
        name_ar: "نقدي",
        name_en: "cash",
        front_key: "cash",
        images: [{ preview: `${cashImg}` }],
      },
    },
  ];

  //   const cardReimbursement = [
  //     {
  //       front_key: "cash",
  //       name_ar: "نقدي",
  //       name_en: "cash",
  //       discount_percentage: 0,
  //       bank_id: 10005,
  //       card: {
  //         id: 10005,
  //         name_ar: "نقدي",
  //         name_en: "cash",
  //         front_key: "cash",
  //         images: [{ preview: `${cashImg}` }],
  //       },
  //     },
  //   ];

  const {
    data: AcountsData,
    isSuccess: isSuccessPaymentAccount,
    isFetching: isFetchingPaymentAccount,
    isLoading: isPaymentLoadingAccount,
  } = useFetch<Cards_Props_TP[]>({
    endpoint: `/selling/api/v1/get_bank_accounts/${userData?.branch_id}`,
    queryKey: ["CardsBank-account"],
    pagination: true,
    onSuccess(data) {
      setBankAccountCards(data.data);
      data?.data?.push(...cardOfCash);
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
    //   enabled: fetchShowMainCards ? false : true,
  });
  const updateSlidesToShow = () => {
    if (window.innerWidth >= 1024) {
      setSlidesToShow(3);
    } else {
      setSlidesToShow(2);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateSlidesToShow);
    updateSlidesToShow();
    return () => {
      window.removeEventListener("resize", updateSlidesToShow);
    };
  }, []);

  const handleCardSelection = (
    selectedCardType: string,
    selectedCardImage: string
  ) => {
    setCard(selectedCardType);
    setCardImage(selectedCardImage);
  };

  const handleActiveSelect = (id: number) => {
    setSelectedCardFrontKey(id);
  };

  const handleChooseCard = (frontKey: number) => {
    if (selectedCardFrontKey === frontKey) {
      setSelectedCardFrontKey(null);
      // onSelectCard(null);
    } else {
      const selectNewCard = bankAccountCards.filter(
        (item) => item.front_key === frontKey
      );
      const selectCradIDOrBankId = selectNewCard[0]?.id;

      setSelectedCardId(selectCradIDOrBankId);
      setSelectedCardFrontKey(frontKey);
    }
  };

  const cardID = bankAccountCards?.filter(
    (item) => item.id === editData?.selectedCardId
  );

  useEffect(() => {
    if (editData) {
      setSelectedCardId(cardID[0]?.id);
    }
  }, [cardID, editData]);

  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    nextArrow: <GrNext size={30} />,
    prevArrow: <GrPrevious size={30} />,
  };
  if (isFetchingPaymentAccount)
    return (
      <p className="font-bold text-center mt-8">{t("cards loading")}...</p>
    );
  return (
    <div>
      {(isSuccessPaymentAccount && AcountsData) ||
      (bankAccountCards && isSuccess) ? (
        <ul className={` py-1 cursor-pointer w-full mb-2`}>
          <Slider {...sliderSettings}>
            {bankAccountCards?.map((item: any) => (
              <li
                key={item.id}
                className={`flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md`}
                onClick={() => {
                  setCardItem(item);
                  handleChooseCard(item?.front_key);
                  handleActiveSelect(item?.front_key);
                  setCardDiscountPercentage?.(item?.discount_percentage);
                  handleCardSelection(
                    item?.front_key,
                    item?.card?.images[0]?.preview
                  );
                  //   handleChooseCard(item?.front_key, item.id)
                }}
              >
                <span
                  className={`bg-white px-6 border-2  flex items-center justify-center h-[65%] rounded-t-xl text-white 
                  ${
                    selectedCardFrontKey === item.front_key
                      ? "border-2 border-mainGreen"
                      : "border-transparent"
                  }`}
                >
                  (
                  <img
                    src={item?.card?.images[0]?.preview}
                    alt="img"
                    className="h-full"
                  />
                  )
                </span>
                <p
                  className={`${
                    item?.front_key === selectedCardFrontKey
                      ? "bg-mainGreen text-white"
                      : "bg-flatWhite"
                  } py-2 text-black h-[35%] rounded-b-xl `}
                >
                  {item?.name_ar
                    ? `${item?.name_ar}  ${
                        item?.bank_name ? `(${item?.bank_name})` : ""
                      }`
                    : ""}
                </p>
              </li>
            ))}
          </Slider>
        </ul>
      ) : (
        <p className="font-bold text-center mt-8">
          {t("there is no available cards yet")}
        </p>
      )}
    </div>
  );
};

export default ExpensesCards;
