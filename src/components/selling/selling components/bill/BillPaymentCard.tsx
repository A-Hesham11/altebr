


import { useState } from "react";
import { useFetch } from '../../../../hooks';
import { Cards_Props_TP } from '../../../templates/bankCards/ViewBankCards';

type Payment_TP = {
    onSelectCard?: any
    selectedCardId?: any
    setSelectedCardId?: any
    dataSource?: any
    fetchShowMainCards?:boolean
};
const BillPaymentCard = ({ 
    onSelectCard,
    selectedCardId, 
    setSelectedCardId, 
    setCardData, 
    cardData ,
    fetchShowMainCards
}: Payment_TP ) => {

    const [dataSource, setDataSource] = useState([])
    const handleChooseCard = (itemId: number) => {
        if (selectedCardId === itemId) {
            setSelectedCardId(null); 
            onSelectCard(null); 
        } else {
            setSelectedCardId(itemId); 
            const selectNewCard = cardsData?.filter((item) => item.id === itemId)
            setCardData(selectNewCard)
            onSelectCard(selectNewCard[0]?.name_ar);
        }
    };

    const { data, isSuccess, isLoading, isError, error, isRefetching, refetch, isFetching } =
    useFetch<Cards_Props_TP[]>({
      endpoint:`/selling/api/v1/cards`,
      queryKey: ["add_Cards"],
      pagination: true,
      onSuccess(data) {
        setDataSource(data.data)
      },
      select: (data) => {
        return {
          ...data,
          data: data.data.map((branches, i) => ({
            ...branches,
            index: i + 1,
          })),
        }
      },
      enabled:fetchShowMainCards
      })

      const { data: bankData } =
      useFetch<Cards_Props_TP[]>({
        endpoint:`/selling/api/v1/add_cards`,
        queryKey: ["add_CardsBank"],
        pagination: true,
        onSuccess(data) {
          setDataSource(data.data)
        },
        select: (data) => {
          return {
            ...data,
            data: data.data.map((branches, i) => ({
              ...branches,
              index: i + 1,
            })),
          }
        },
        enabled: !fetchShowMainCards
        })
 // second api ----> enable : !fetchShowMainCards
    const cardsData = [...dataSource].reverse();


    // const handleChooseCard = (dataId: number) => {
    //     setCardId(dataId)
    // };

// const cardWidth = 100 / cardsData?.length
  return (
    <div>
        <ul className={`grid grid-cols-3 lg:grid-cols-${cardsData?.length} gap-4 py-1 cursor-pointer w-full`}>
            {cardsData?.map((item: any) => (
                <li 
                    className={`flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md`} 
                    onClick={() => handleChooseCard(item.id)}
                >
                    <span className={`bg-white px-6 flex items-center justify-center h-[65%] rounded-t-xl text-white 
                        ${selectedCardId === item.id ? 'border-2 border-mainGreen' : 'bg-white'}`}
                    >
                        {fetchShowMainCards 
                            ? (<img src={item.images[0]?.preview} alt="img" className=''/>)
                            : (<img src={item.card.images[0]?.preview} alt="img" className=''/>)
                        }
                    </span>
                    <p className={` py-2 text-black h-[35%] rounded-b-xl 
                        ${selectedCardId === item.id ? 'bg-mainGreen text-white' : 'bg-flatWhite'}`}
                    >
                        {fetchShowMainCards ? item.name_ar : item.card_new_name}
                    </p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default BillPaymentCard

// grid grid-cols-3 lg:grid-cols-6 gap-4 py-1 cursor-pointer