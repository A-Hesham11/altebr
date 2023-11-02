/////////// IMPORTS
///
import {
  LocalizationMap, SpecialZoomLevel, Viewer,
  Worker
} from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import ar_AE from "@react-pdf-viewer/locales/lib/ar_AE.json"
import en_US from "@react-pdf-viewer/locales/lib/en_US.json"
import { useIsRTL } from "../../../hooks"
import { CFile_TP } from "../../../types"
// import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail"
import "@react-pdf-viewer/thumbnail/lib/styles/index.css"
// import { pageThumbnailPlugin } from "../../utils/pdf-viewer-custom-plugins"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { DeleteIcon, ViewIcon } from "../../atoms/icons"
///
/////////// Types
///
type PdfViewerProps_TP = {
      showControls?: boolean
      file: CFile_TP
      deleteFileHandler?: () => void
      action?: () => void
      preview?: boolean
    }
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const PdfViewer = ({
  file,
  showControls = true,
  action,
  deleteFileHandler,
  preview
}: PdfViewerProps_TP) => {
  /////////// VARIABLES
  ///
  const defaultLayoutPluginInstance = defaultLayoutPlugin({})
  //   const thumbnailPluginInstance = thumbnailPlugin()
  //   const { Cover } = thumbnailPluginInstance

  //   const pageThumbnailPluginInstance = pageThumbnailPlugin({
  //     PageThumbnail: <Cover getPageIndex={() => 1} />,
  //   })
  ///
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL()
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
    // add hover effect
    // تعديل الهايت هنا
    <div
      className={`cursor-pointer relative  w-full group mb-2 ${
        showControls ? "h-full" : "h-32 w-full max-h-32 pdf-no-scroll"
      }`}
      onClick={() => action && action()}
    >
      {!preview && (
        <DeleteIcon
          className=" hover:fill-red-500 fill-mainRed cursor-pointer"
          action={() => deleteFileHandler && deleteFileHandler()}
        />
      )}

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
        <Viewer
          defaultScale={
            !showControls
              ? SpecialZoomLevel.PageFit
              : SpecialZoomLevel.ActualSize
          }
          localization={isRTL ? ar_AE : (en_US as unknown as LocalizationMap)}
          plugins={
            showControls ? [defaultLayoutPluginInstance] : []
            //   : [pageThumbnailPluginInstance, thumbnailPluginInstance]
          }
          fileUrl={file.preview}
        />
      </Worker>
      {!showControls && (
        <span className="absolute h-[calc(100%-1rem)] w-full top-4 left-0  text-center hidden  group-hover:flex  items-center justify-center">
          <ViewIcon className="w-6 h-6 fill-mainGreen" />
        </span>
      )}
    </div>
  )
}
