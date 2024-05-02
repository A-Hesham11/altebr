import { FormikSharedConfig, useFormikContext } from "formik";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../../hooks";
import { Cards_Props_TP } from "../../../templates/bankCards/ViewBankCards";
import { t } from "i18next";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
import cashImg from "../../../../assets/cash.png";
import DiscountEarned from "../../../../assets/Discount-earned.jpeg";
import brokenGoldImg from "../../../../assets/Frame 26085625.svg";
import addedTax from "../../../../assets/OIP.jpeg";

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
  setSelectedCardName?: any
  setIsMaxDiscountLimit?: any
  setSalesReturnFrontKey?: any
  setCardFrontKeySadad?: any
};

const PaymentCard = ({
  onSelectCard,
  selectedCardId,
  setSelectedCardId,
  fetchShowMainCards,
  editData,
  setCardFronKey,
  setCardFrontKeyAccept,
  setSellingFrontKey,
  setCardDiscountPercentage,
  setCardId,
  setSalesReturnFrontKey,
  setSelectedCardName,
  setIsMaxDiscountLimit,
  setCardFrontKeySadad
}: Payment_TP) => {
  const [dataSource, setDataSource] = useState<Payment_TP[]>([]);
  const [bankAccountCards, setBankAccountCards] = useState<Payment_TP[]>([]);
  const [slidesToShow, setSlidesToShow] = useState(2);

  const isRTL = useIsRTL();

  const cardOfCash = [
    {
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
    }
  ];

  const cardReimbursement = [
    {
      front_key: "cash",
      name_ar: "نقدي",
      name_en: "cash",
      discount_percentage: 0,
      bank_id: 10005,
      card: {
        id: 10005,
        name_ar: "نقدي",
        name_en: "cash",
        front_key: "cash",
        images: [{ preview: `${cashImg}` }],
      },
    },
    {
      front_key: "18",
      name_ar: "صندوق ذهب الكسر عيار 18",
      name_en: "gold box 18 karat",
      karat: 18,
      discount_percentage: 0,
      bank_id: 10001,
      card: {
        id: 10001,
        name_ar: "صندوق ذهب الكسر عيار 18",
        name_en: "gold box 18 karat",
        front_key: "18",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
    {
      front_key: "21",
      name_ar: "صندوق ذهب الكسر عيار 21",
      name_en: "gold box 21 karat",
      karat: 21,
      discount_percentage: 0,
      bank_id: 10002,
      card: {
        id: 10002,
        name_ar: "صندوق ذهب الكسر عيار 21",
        name_en: "gold box 21 karat",
        front_key: "21",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
    {
      front_key: "22",
      name_ar: "صندوق ذهب الكسر عيار 22",
      name_en: "gold box 22 karat",
      discount_percentage: 0,
      karat: 22,
      bank_id: 10003,
      card: {
        id: 10003,
        name_ar: "صندوق ذهب الكسر عيار 22",
        name_en: "gold box 22 karat",
        front_key: "22",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
    {
      front_key: "24",
      name_ar: "صندوق ذهب الكسر عيار 24",
      name_en: "gold box 24 karat",
      discount_percentage: 0,
      karat: 24,
      bank_id: 10004,
      card: {
        id: 10004,
        name_ar: "صندوق ذهب الكسر عيار 24",
        name_en: "gold box 24 karat",
        front_key: "24",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
  ];

  const cardReimbursementSupplier = [
    {
      front_key: "discount",
      name_ar: "خصم مكتسب",
      name_en: "Discount earned",
      discount_percentage: 0,
      card: {
        bank_id: 2,
        name_ar: "خصم مكتسب",
        name_en: "Discount earned",
        front_key: "discount",
        images: [{ preview: `${DiscountEarned}` }],
      },
    },
    {
      front_key: "total_tax_sadad_supplier",
      name_ar: "ضريبة القيمة المضافه",
      name_en: "Value added tax",
      discount_percentage: 0,
      card: {
        bank_id: 2,
        name_ar: "ضريبة القيمة المضافه",
        name_en: "Value added tax",
        front_key: "total_tax_sadad_supplier",
        images: [{ preview: `${addedTax}` }],
      },
    },
    {
      front_key: "cash",
      name_ar: "نقدي",
      name_en: "cash",
      discount_percentage: 0,
      bank_id: 10005,
      card: {
        id: 10005,
        name_ar: "نقدي",
        name_en: "cash",
        front_key: "cash",
        images: [{ preview: `${cashImg}` }],
      },
    },
    {
      front_key: "18",
      name_ar: "صندوق ذهب الكسر عيار 18",
      name_en: "gold box 18 karat",
      karat: 18,
      discount_percentage: 0,
      bank_id: 10001,
      card: {
        id: 10001,
        name_ar: "صندوق ذهب الكسر عيار 18",
        name_en: "gold box 18 karat",
        front_key: "18",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
    {
      front_key: "21",
      name_ar: "صندوق ذهب الكسر عيار 21",
      name_en: "gold box 21 karat",
      karat: 21,
      discount_percentage: 0,
      bank_id: 10002,
      card: {
        id: 10002,
        name_ar: "صندوق ذهب الكسر عيار 21",
        name_en: "gold box 21 karat",
        front_key: "21",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
    {
      front_key: "22",
      name_ar: "صندوق ذهب الكسر عيار 22",
      name_en: "gold box 22 karat",
      discount_percentage: 0,
      karat: 22,
      bank_id: 10003,
      card: {
        id: 10003,
        name_ar: "صندوق ذهب الكسر عيار 22",
        name_en: "gold box 22 karat",
        front_key: "22",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
    {
      front_key: "24",
      name_ar: "صندوق ذهب الكسر عيار 24",
      name_en: "gold box 24 karat",
      discount_percentage: 0,
      karat: 24,
      bank_id: 10004,
      card: {
        id: 10004,
        name_ar: "صندوق ذهب الكسر عيار 24",
        name_en: "gold box 24 karat",
        front_key: "24",
        images: [{ preview: `${brokenGoldImg}` }],
      },
    },
  ];

  const locationPath = location.pathname;

  const cardCash = locationPath === "/selling/reimbursement" ? cardReimbursement : locationPath === "/supplier-payment" ? cardReimbursementSupplier : cardOfCash

  const bankscard = (locationPath === "/selling/reimbursement" || locationPath === "/expenses/expensesInvoice" || locationPath === "/selling/payoff/sales-return") ? "" :  dataSource 

  const cardsData = fetchShowMainCards
  ? [...dataSource].reverse()
  : [...bankscard, ...bankAccountCards, ...cardCash].reverse();

  const { userData } = useContext(authCtx);

  const { setFieldValue } = useFormikContext<FormikSharedConfig>();

  const handleChooseCard = (frontKey: number) => {
    if (selectedCardId === frontKey) {
      setSelectedCardId(null);
      onSelectCard(null);
    } else {
      const selectNewCard = cardsData?.filter(
        (item) => item?.front_key === frontKey
      );

      const selectCradIDOrBankId = selectNewCard[0]?.bank_id ? selectNewCard[0]?.bank_id : selectNewCard[0]?.id;

      setCardId?.(selectCradIDOrBankId);
      setSelectedCardName?.(isRTL ? selectNewCard[0]?.name_ar : selectNewCard[0]?.name_en);
      setIsMaxDiscountLimit?.(selectNewCard[0]?.is_minimum);
      setSelectedCardId(frontKey);
      setFieldValue(
        "discount_percentage",
        selectNewCard[0]?.discount_percentage * 100
      );
      const cardNameInTable = `${selectNewCard[0]?.name_ar} ${selectNewCard[0]?.bank_name ? `(${selectNewCard[0]?.bank_name})` : ""}`;
      const cardIMageInTable = `${selectNewCard[0]?.card.images[0]?.preview}`;
      onSelectCard(cardNameInTable, cardIMageInTable);
      setCardFronKey(selectNewCard[0]?.front_key);
      if (locationPath === "/selling/addInvoice/") {
        setSellingFrontKey?.(selectNewCard[0]?.selling_front_key || "cash")
      } else if (locationPath === "/selling/payoff/sales-return") {
        setSalesReturnFrontKey?.(selectNewCard[0]?.return_selling_front_key || "cash")
      } else if (locationPath === "/selling/reimbursement") {
        setCardFrontKeySadad?.(selectNewCard[0]?.sadad_aladra_front_key || selectNewCard[0]?.front_key || "cash");
      } else {
        setCardFrontKeyAccept?.(selectNewCard[0]?.front_key_accept || "cash");
      }
    }
  };

  const cardID = cardsData?.filter((item) => item.id === editData?.card_id);

  useEffect(() => {
    if (editData) {
      setSelectedCardId(cardID[0]?.front_key);
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
                    handleChooseCard(item?.front_key, item.id)
                    setCardDiscountPercentage?.({
                      discount_percentage:item?.discount_percentage,
                      max_discount_limit:item?.max_discount_limit,
                      max_discount_limit_value:item?.max_discount_limit_value,
                    })
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
                    {fetchShowMainCards ? item?.name_ar : `${item?.name_ar} ${item?.bank_name ? `(${item?.bank_name})` : item?.main_account_number ? `(${item?.main_account_number})` : ""}`}
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