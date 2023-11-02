/////////// IMPORTS
///
import { t } from "i18next"
import { formatDate } from "../../../../utils/date"
import { FilesPreview } from "../../../molecules/files/FilesPreview"
import { allDocs_TP } from "./Documents"
///
/////////// Types
///
type DocsDataProps_TP = {
  docsData: allDocs_TP | undefined
}

/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const DocsData = ({ docsData }: DocsDataProps_TP) => {

  const images: any = docsData?.files.filter(
    (file: any) => !(file?.preview?.includes('.pdf') || file?.path?.includes('.pdf')
    )) || []
  const pdfs: any = docsData?.files.filter(
    (file: any) => (file?.preview?.includes('.pdf') || file?.path?.includes('.pdf')
    )
  ) || []

  /////////// VARIABLES
  ///

  const imagePreview = images.map(image => ({
    preview: image.preview,
    path: image.preview,
    type: 'image'
  }))
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
  ///
  return (
    <>
      <h2 className="text-xl font-bold text-center mb-5">
        {t("document Details")}
      </h2>
      <div className="grid grid-cols-3 gap-y-8 items-center justify-center">
        {/* document type start */}
        <div className="col-span-1">
          <div className="flex gap-x-2">
            <span className="font-bold">{t("document type")} :</span>
            <span className="font-thin">{docsData?.docType.label}</span>
          </div>
        </div>
        {/* document type end */}

        {/* document name start */}
        <div className="col-span-1">
          <div className="flex gap-x-2">
            <span className="font-bold">{t("document name")} :</span>
            <span className="font-thin">{docsData?.docName}</span>
          </div>
        </div>
        {/* document name end */}

        {/* document number start */}
        <div className="col-span-1">
          <div className="flex gap-x-2">
            <span className="font-bold">{t("document number")} :</span>
            <span className="font-thin">{docsData?.docNumber}</span>
          </div>
        </div>
        {/* document number end */}

        {/* document end date start */}
        <div className="col-span-1">
          <div className="flex gap-x-2">
            <span className="font-bold"> {t("document end date")} :</span>
            <span className="font-thin">{formatDate(docsData!.endDate)}</span>
          </div>
        </div>
        {/* document end date end */}

        {/* document days count start */}
        <div className="col-span-1">
          <div className="flex gap-x-2">
            <span className="font-bold">{t("reminder days count")} :</span>
            <span className="font-thin">{docsData?.reminder}</span>
          </div>
        </div>
        {/* document days count end */}

        {/* media start */}
        {
          docsData?.files.length !== 0 &&
          <div className="col-span-1 flex items-center">
            <span className="font-bold">{t("media")} :</span>
            <FilesPreview preview images={[...imagePreview]} pdfs={pdfs} />
          </div>
        }
        {/* media end */}
      </div>
    </>
  )
}
