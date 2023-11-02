/////////// IMPORTS
///
import { t } from "i18next"
import { numberContext } from "../../context/settings/number-formatter"
import { Box_TP } from "../../pages/supply/Bond"
import { Back } from "../../utils/utils-components/Back"
///
/////////// Types
///
type BondTotalsProps_TP = {
  boxesData: Box_TP[]
  balance?: boolean
  title?:string
}
/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const BondTotals = ({
  boxesData,
  balance,
  title,
}: BondTotalsProps_TP) => {
  const { formatGram, formatReyal } = numberContext()

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title ? t(`${title}`) : t('bond total')}</h2>
        <div>
          <Back />
        </div>
      </div>
      <ul
        className={
          balance
            ? `grid grid-cols-3  gap-56  pr-0`
            : `grid grid-cols-4  gap-5  pr-0`
        }
      >
        {boxesData.map(
          (box, i) =>
            box.value !== null && (
              <li
                key={box.id}
                className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md "
              >
                <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">{t(box.account)}</p>
                {box.unit_id == 'gram' ? (
                  <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                    {formatGram(box.value)} {t(box.unit_id)}
                  </p>
                ) : (
                  <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                    {formatReyal(box.value)} {t(box.unit_id)}
                  </p>
                )}
              </li>
            )
        )}
      </ul>
    </div>
  )
}
