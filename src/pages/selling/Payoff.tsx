import receiveitem from "../../assets/receiveItems.svg"
import receiveMoney from "../../assets/recieveMoney.svg"
import SellingSubCard from "../../components/selling/SellingSubCard"
import { useIsRTL } from "../../hooks"
import { Back } from "../../utils/utils-components/Back"
const Payoff = () => {
    const isRTL = useIsRTL()
    const data = [
        {
            icon:receiveMoney,
            title_ar:'مردود البيع',
            title_en:'selling payoff',
            route:'/selling/payoff/sales-return'
        },
        {
            icon:receiveitem,
            title_ar:'مردود االشراء',
            title_en:'buying payoff',
            route:'/selling/payoff/',
        },
        {
            icon:receiveitem,
            title_ar:'مردود التوريد',
            title_en:'supplying payoff',
            route:'/selling/payoff/supply-payoff'
        },
    ]
  return (<>
    <div className="flex md:gap-16 gap-4 management h-screen justify-center items-center relative">
        <div className="p-8 absolute top-0 left-5" >
                <Back />
            </div>
        {
            data.map(item=>(
                <SellingSubCard icon={item.icon} title={isRTL ? item.title_ar : item.title_en } route={item.route} key={crypto.randomUUID()}/>
            ))
        }
    </div>
  </>
  )
}

export default Payoff