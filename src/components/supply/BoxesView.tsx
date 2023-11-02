import { t } from "i18next"
import { numberContext } from "../../context/settings/number-formatter"
import { BoxesDataBase } from "../atoms/card/BoxesDataBase"

export type Box_TP = {
  title: string
  value: number
  unit: string
}

export type BoxesView_TP = {
  boxes: Box_TP[]
}

export const BoxesView = ({boxes}: BoxesView_TP) => {
  const { formatGram, formatReyal } = numberContext()
  

  return (
    <div className="grid-cols-4 grid gap-8">
      {boxes.map(box => (
        <div className="col-span-1">
          <BoxesDataBase>
            <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl" >{t(`${box.title}`)}</p>
            {box.unit == 'gram' ? (
              <p className="bg-white p-2 text-black h-[35%] rounded-b-xl">
                {formatGram(box.value)} {t(box.unit)}
              </p>
            ) : box.unit == 'reyal' ? (
              <p className="bg-white p-2 text-black h-[35%] rounded-b-xl">
                {formatReyal(box.value)} {t(box.unit)}
              </p>
            ) : box.unit == 'item' ? (
              <p className="bg-white p-2 text-black h-[35%] rounded-b-xl">
                {box.value} {t("item")}
              </p>
            ) : (
              <p className="bg-white p-2 text-black h-[35%] rounded-b-xl">
                {box.value} {t("Karat")}
              </p>
            )}
            {/* <p>{box.value} {t(`${box.unit}`)}</p> */}
          </BoxesDataBase>
        </div>
      ))}
    </div>
  )
}
