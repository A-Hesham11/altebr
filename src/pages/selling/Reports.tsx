import receiveitem from "../../assets/receiveItems.svg"
import receiveMoney from "../../assets/recieveMoney.svg"
import SellingSubCard from "../../components/selling/SellingSubCard"
import { useIsRTL } from "../../hooks"
import { Back } from "../../utils/utils-components/Back"
const Reports = () => {
    const isRTL = useIsRTL()
    const data = [
        {
            icon:receiveMoney,
            title_ar:'ارصدة',
            title_en:'stocks',
            route:'/selling/reports/stocks'
        },
        {
            icon:receiveitem,
            title_ar:'قيود',
            title_en:'bonds',
            route:'/selling/reports/bonds',
        },
        {
            icon:receiveitem,
            title_ar:'الشجرة المحاسبية',
            title_en:'accounting tree',
            route:'/selling/reports/accounting-tree'
        },
    ]
  return (
    <div className="flex md:gap-16 gap-4 management h-screen justify-center items-center relative">
        <div className="p-8 absolute top-0 left-5" >
                <Back/>
            </div>
        {
            data.map(item=>(
                <SellingSubCard icon={item.icon} title={isRTL ? item.title_ar : item.title_en } route={item.route} key={crypto.randomUUID()}/>
            ))
        }
    </div>
  )
}

export default Reports