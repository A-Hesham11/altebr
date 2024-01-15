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

const ExpensesCards = ({
  setCard,
  setCardImage,
  card,
  cardImage,
  selectedCardId,
  setSelectedCardId,
}) => {
  console.log(
    "🚀 ~ file: ExpensesCards.tsx:20 ~ selectedCardId:",
    selectedCardId
  );
  const [dataSource, setDataSource] = useState<Payment_TP[]>([]);
  const [bankAccountCards, setBankAccountCards] = useState<Payment_TP[]>([]);
  console.log(
    "🚀 ~ file: ExpensesCards.tsx:23 ~ bankAccountCards:",
    bankAccountCards
  );
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
    setSelectedCardId(id);
  };

//   const handleChooseCard = (frontKey: number) => {
//     if (selectedCardId === frontKey) {
//       setSelectedCardId(null);
//       onSelectCard(null);
//     } else {
//       const selectNewCard = cardsData?.filter(
//         (item) => item?.front_key === frontKey
//       );

//       const selectCradIDOrBankId = selectNewCard[0]?.bank_id ? selectNewCard[0]?.bank_id : selectNewCard[0]?.id;

//       setCardId?.(selectCradIDOrBankId);
//       setSelectedCardName?.(isRTL ? selectNewCard[0]?.name_ar : selectNewCard[0]?.name_en);
//       setSelectedCardId(frontKey);
//       setMainAccountNumber?.(selectNewCard[0]?.main_account_number)
//       setFieldValue(
//         "discount_percentage",
//         selectNewCard[0]?.discount_percentage * 100
//       );
//       const cardNameInTable = `${selectNewCard[0]?.name_ar} ${selectNewCard[0]?.bank_name ? `(${selectNewCard[0]?.bank_name})` : ""}`;
//       const cardIMageInTable = `${selectNewCard[0]?.card.images[0]?.preview}`;
//       onSelectCard(cardNameInTable, cardIMageInTable);
//       setCardFronKey(selectNewCard[0]?.front_key);
//       if (locationPath === "/selling/addInvoice/") {
//         setSellingFrontKey?.(selectNewCard[0]?.selling_front_key || "cash")
//       } else {
//         setCardFrontKeyAccept?.(selectNewCard[0]?.front_key_accept || "cash");
//       }
//     }
//   };

  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 2,
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
                  handleActiveSelect(item.id);
                  //   handleChooseCard(item?.front_key, item.id)
                  //   setCardDiscountPercentage?.(item?.discount_percentage)
                }}
              >
                <span
                  className={`bg-white px-6 border-2  flex items-center justify-center h-[65%] rounded-t-xl text-white 
                  ${
                    selectedCardId === item.id
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
                    item?.id === selectedCardId
                      ? "bg-mainGreen text-white"
                      : "bg-flatWhite"
                  } py-2 text-black h-[35%] rounded-b-xl `}
                >
                    {item?.name_ar ? `${item?.name_ar}  ${item?.bank_name ? `(${item?.bank_name})` : ""}` : ""}
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
