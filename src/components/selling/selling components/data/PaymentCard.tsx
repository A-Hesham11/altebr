import { FormikSharedConfig, useFormikContext } from "formik";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import { Cards_Props_TP } from "../../../templates/bankCards/ViewBankCards";
// import Slider from "react-slick";
import { t } from "i18next";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";

type Payment_TP = {

  onSelectCard?: any
  selectedCardId?: any
  setSelectedCardId?: any
  dataSource?: any
  fetchShowMainCards?: boolean
  setCardDataSelect?: any
  editData?: any
  name_ar?: string
  bank?: string
  discount_percentage?: any
  id?: number
  setCardFronKey?: any
  setCardFrontKeyAccept?: any
  setSellingFrontKey?:any
  setCardId?: any
  setCardDiscountPercentage?: any
};

const PaymentCard = ({
  onSelectCard,
  selectedCardId,
  setSelectedCardId,
  fetchShowMainCards,
  setCardDataSelect,
  editData,
  setCardFronKey,
  setCardFrontKeyAccept,
  setSellingFrontKey,
  setCardDiscountPercentage,
  setCardId
}: Payment_TP) => {
  const [dataSource, setDataSource] = useState<Payment_TP[]>([]);
  const [bankAccountCards, setBankAccountCards] = useState<Payment_TP[]>([]);
  const [slidesToShow, setSlidesToShow] = useState(2);

  const cardCash = {
    front_key: "cash",
    name_ar: "كاش",
    name_en: "cash",
    discount_percentage: 0,
    card: {
      id: 1,
      name_ar: "كاش",
      name_en: "cash",
      front_key: "cash",
      images: [{ preview: "/src/assets/cash.png" }],
    },
  };

  const cardsData = fetchShowMainCards
  ? [...dataSource].reverse()
  : [...dataSource, ...bankAccountCards, cardCash].reverse();
  
  console.log("🚀 ~ file: PaymentCard.tsx:63 ~ cardsData:", cardsData)
  const { userData } = useContext(authCtx);

  const locationPath = location.pathname

  const { setFieldValue } = useFormikContext<FormikSharedConfig>();

  const handleChooseCard = (frontKey: number) => {
    if (selectedCardId === frontKey) {
      setSelectedCardId(null);
      onSelectCard(null);
    } else {
      const selectNewCard = cardsData?.filter(
        (item) => item?.front_key === frontKey
      );
      setCardId?.(selectNewCard[0]?.id);
      setSelectedCardId(frontKey);
      setFieldValue(
        "discount_percentage",
        selectNewCard[0]?.discount_percentage * 100
      );
      const cardNameInTable = `${selectNewCard[0]?.name_ar} ${selectNewCard[0]?.bank_name ? `(${selectNewCard[0]?.bank_name})` : ""
        }`;
      const cardIMageInTable = `${selectNewCard[0]?.card.images[0]?.preview}`;
      onSelectCard(cardNameInTable, cardIMageInTable);
      setCardFronKey(selectNewCard[0]?.front_key);
      if (locationPath === "/selling/addInvoice/") {
        setSellingFrontKey?.(selectNewCard[0]?.selling_front_key || "cash")
      } else {
        setCardFrontKeyAccept?.(selectNewCard[0]?.front_key_accept || "cash");
      }
    }
  };

  const cardID = cardsData?.filter((item) => item.id === editData?.card_id);
  useEffect(() => {
    if (editData) {
      setSelectedCardId(cardID[0]?.id);
    }
  }, [cardID]);

  const { data, isSuccess } = useFetch<Payment_TP[]>({
    endpoint: `/selling/api/v1/cards`,
    queryKey: ["add_Cards"],
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
    enabled: fetchShowMainCards ? true : false,
  });

  const {
    data: bankData,
    isSuccess: isSuccessPayment,
    isFetching: isFetchingPayment,
    isLoading: isPaymentLoading,
  } = useFetch<Cards_Props_TP[]>({
    endpoint: `/selling/api/v1/added_card_per_branch/${userData?.branch_id}`,
    queryKey: ["CardsBank"],
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
    enabled: fetchShowMainCards ? false : true,
  });

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
    enabled: fetchShowMainCards ? false : true,
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

  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow:
      cardsData.length === 2 ? 2 : cardsData.length === 1 ? 1 : slidesToShow,
    speed: 500,
    nextArrow: <GrNext size={30} />,
    prevArrow: <GrPrevious size={30} />,
  };
  if (isFetchingPaymentAccount && isFetchingPayment) return <p className='font-bold text-center mt-8'>{t('cards loading')}...</p>
  return (
    <div>
      {(isSuccessPaymentAccount && AcountsData && bankData) || (data && isSuccess)
        ? (
          <ul className={` py-1 cursor-pointer w-full mb-2`}>
            <Slider {...sliderSettings}>
              {cardsData.map((item: any) => (
                <li
                  key={item.id}
                  className={`flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md`}
                  onClick={() => {
                    handleChooseCard(item?.front_key)
                    setCardDiscountPercentage?.(item?.discount_percentage)
                  }}
                >
                  <span className={`bg-white px-6 flex items-center justify-center h-[65%] rounded-t-xl text-white 
                                    ${selectedCardId === item.front_key ? 'border-2 border-mainGreen' : 'bg-white'}`}
                  >
                    {fetchShowMainCards
                      ? (<img src={item?.images[0]?.preview} alt="img" className='h-full' />)
                      : (<img src={item?.card?.images[0]?.preview} alt="img" className='h-full' />)
                    }
                  </span>
                  <p className={` py-2 text-black h-[35%] rounded-b-xl 
                                    ${selectedCardId === item?.front_key ? 'bg-mainGreen text-white' : 'bg-flatWhite'}`}
                  >
                    {fetchShowMainCards ? item?.name_ar : `${item?.name_ar} ${item?.bank_name ? `(${item?.bank_name})` : ""}`}
                  </p>
                </li>
              ))}
            </Slider>
          </ul>
        )
        : (<p className='font-bold text-center mt-8'>{t("there is no available cards yet")}</p>)
      }
    </div>
  )
}

export default PaymentCard