
import { t } from "i18next"
import { InnerFormLayout } from "../molecules"
import { FirstFormInitValues_TP } from "./formInitialValues_types"
import { Dispatch, SetStateAction } from "react"
import { formatDate, getDayBefore } from "../../utils/date"
import { FilesPreviewOutFormik } from "../molecules/files/FilesPreviewOutFormik"
import { Edit } from "../atoms/icons/Edit"
import { Delete } from "../atoms/icons/Delete"
import { Supply_TP } from "../../pages/supply/Supply"
import { SvgDelete } from "../atoms/icons/SvgDelete"

/////////// HELPER VARIABLES & FUNCTIONS
///
type GoldFirstFormViewProps_TP = {
    supply: Supply_TP
    formValues: FirstFormInitValues_TP | undefined
    setStage: Dispatch<SetStateAction<number>>
    setFormValues: Dispatch<SetStateAction<FirstFormInitValues_TP | undefined>>
}
///
export const FirstFormView = ({ formValues, setStage, setFormValues, supply }: GoldFirstFormViewProps_TP) => {
    /////////// VARIABLES
    ///
    const { 
      bond_date, 
      bond_number, 
      entity_gold_price, 
      api_gold_price, 
      goods_media, 
      media, 
      notes, 
      out_goods_value, 
      twred_type, 
      employee_value, 
      supplier_value 
    } = formValues!
    ///
    /////////// CUSTOM HOOKS
    ///

    ///
    /////////// STATES
    ///

    ///
    /////////// SIDE EFFECTS
    ///

    /////////// FUNCTIONS | EVENTS | IF CASES
    ///
    const resetValues = supply === 'gold' ? {
      bond_date: getDayBefore(new Date()),
      bond_number: "",
      employee_id: "",
      goods_media: [],
      media: [],
      notes: "",
      out_goods_value: "",
      supplier_id: "",
      twred_type: "local",
      api_gold_price: "",
      entity_gold_price: "",
      employee_value: "",
      supplier_value: "",
    } : {
      bond_date: getDayBefore(new Date()),
      bond_number: "",
      employee_id: "",
      goods_media: [],
      media: [],
      notes: "",
      out_goods_value: "",
      supplier_id: "",
      twred_type: "local",
      employee_value: "",
      supplier_value: "",
    }

    ///
    return (
      <>
        <InnerFormLayout
          title={t("main data")}
          leftComponent={
            <div className="flex gap-x-2">
              {/* @ts-ignore */}
              <Edit onClick={() => setStage(1)} />
              {/* @ts-ignore */}
              <Delete
                action={() => {
                  setFormValues(resetValues)
                  setStage(1)
                }}
              />
            </div>
          }
        >
          <div className="col-span-4">
            <ul className="grid grid-cols-3 gap-y-2 list-disc">
              <li className="flex gap-x-2 items-center">
                <strong>{t("bond date")}:</strong>
                {formatDate(bond_date)}
              </li>

              <li className="flex gap-x-2 items-center">
                <strong>{t("bond number")}:</strong>
                {bond_number}
              </li>

              <li className="flex gap-x-2 items-center">
                <strong>{t("buyer name")}:</strong>
                {employee_value}
              </li>

              {supply === 'gold' && 
              <li className="flex gap-x-2 items-center">
                <strong>{t("gold price")}:</strong>
                {api_gold_price}
              </li>}

              {!!out_goods_value && (
                <li className="flex gap-x-2 items-center">
                  <strong>{t("out goods value")}:</strong>
                  <p>{out_goods_value}</p>
                </li>
              )}

              <li className="flex gap-x-2 items-center">
                <strong>{t("supplier name")}:</strong>
                <p>{supplier_value}</p>
              </li>

              <li className="flex gap-x-2 items-center">
                <strong>{t("supply type")}:</strong>
                <p>{`${t(twred_type)}`}</p>
              </li>
              {goods_media ? 
                [...media, ...goods_media].length > 0 && (
                  <li className="flex gap-x-2 items-center col-span-2">
                    <strong>{t("media")}:</strong>
                    <FilesPreviewOutFormik images={[...media, ...goods_media]} />
                  </li>
                )
              : media.length > 0 && (
                <li className="flex gap-x-2 items-center col-span-2">
                  <strong>{t("media")}:</strong>
                  <FilesPreviewOutFormik images={media} />
                </li>
              )}
              <li className="flex gap-x-2 col-span-2">
                <strong>{t("notes")}:</strong>
                <p className="wrapText">
                  {notes ? notes : t('no notes')}
                </p>
              </li>
            </ul>
          </div>
        </InnerFormLayout>
      </>
    )
}