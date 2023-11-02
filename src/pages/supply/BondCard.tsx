import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/atoms'
import { ViewIcon } from '../../components/atoms/icons'
import { Bond_TP } from './Bonds'

export const BondCard = ({id, classification, twred_type, supplier_name, bond_date, total_gold_by_24, total_money, item_count, bond_number}: Bond_TP) => {
  const navigate = useNavigate()
  return (
    <div className="col-span-1 shadow-md shadow-slate-400 px-9 py-5 rounded-lg m-5" >
      <h2 className="text-center mb-5 font-bold text-2xl" >{supplier_name}</h2>
      <div className="flex items-center justify-center">
        <Button
          action={() => navigate(`${id}`)}
          className="flex items-center mx-1"
        >
          <ViewIcon />
          عرض
        </Button>
      </div>
    </div>
  )
}
