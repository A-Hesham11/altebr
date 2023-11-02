
/////////// IMPORTS
///

import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { CFile_TP, CImageFile_TP } from "../../../types"
import { pdfOrImage } from "../../../utils/helpers"
import { PDFSvgIcon, SvgDeleteIcon, ViewSvgIcon } from "../../atoms/icons"
import { Modal } from "../Modal"
import { CLightbox } from "./CLightbox"
import { PdfViewer } from "./PdfViewer"

///
/////////// Types
///
type FilesPreviewProps_TP = {
  images: CImageFile_TP[]
  pdfs: CFile_TP[]
  formikFieldName?: string
  preview?: boolean
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const FilesPreview = ({
  images,
  pdfs,
  formikFieldName,
  preview,
}: FilesPreviewProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, values } = useFormikContext<{
    [key: string]: any
  }>()
  ///
  /////////// STATES
  ///
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [manyPdfsOpen, setManyPdfsOpen] = useState(false)
  const [activePdf, setActivePdf] = useState<CFile_TP | null>()
  ///
  /////////// SIDE EFFECTS
  ///
  // change lightbox open state to false if images.length === 0
  useEffect(() => {
    if (images.length === 0) {
      setLightboxOpen(false)
    }
  }, [images.length])
  // change pdfs modal open state to false if pdfs.length === 0
  useEffect(() => {
    if (pdfs.length === 0) {
      setManyPdfsOpen(false)
    }
  }, [pdfs.length])
  // set first active pdf file
  useEffect(() => {
    setActivePdf(pdfs[0])
  }, [JSON.stringify(pdfs)])

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  // Delete file (image or pdf)
  const deleteFileHandler = (id: string) => {
    if (formikFieldName) {
      const currFilesState: CFile_TP[] = values[formikFieldName]
      setFieldValue(
        formikFieldName,
        currFilesState.filter((file) => file.id !== id)
      )
    }
  }

  // Delete all images
  const deleteAllImagesHandler = () => {
    if (formikFieldName) {
      const currFilesState: CFile_TP[] = values[formikFieldName]
      setFieldValue(
        formikFieldName,
        currFilesState.filter((file) => pdfOrImage(file) === "pdf")
      )
    }
  }

  // Delete all pdfs
  const deleteAllPdfsHandler = () => {
    if (formikFieldName) {
      const currFilesState: CFile_TP[] = values[formikFieldName]
      setFieldValue(
        formikFieldName,
        currFilesState.filter((file) => pdfOrImage(file) === "image")
      )
    }
  }
   const imagePreview = images.map(image => ({
    preview: image?.type === 'image' ? image?.path : image?.preview,
    path: image.preview,
    type: 'image'
  }))
  
  return (
    <>
      <div
        className={`flex flex-${preview ? "row" : "col"} gap-${
          preview ? "6" : "1"
        }`}
      >
        {/* images*/}
        <div className="flex items-center justify-center gap-2 m-3">
          {!!images.length && (
            <>
              <div className="flex flex-col  gap-1 justify-center">
                <span className="text-[8px] text-gray-700 text-center">
                  الصور
                </span>
                <div className="bg-lightGray rounded-md p-1 relative ">
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="cursor-pointer flex items-center justify-center p-2 "
                  >
                    <span className=" absolute -top-1 -right-3 bg-mainGreen px-2 py-1 text-[7px] rounded-full text-white">
                      {images.length}
                    </span>
                    <ViewSvgIcon stroke="#292D32" />
                  </div>
                </div>
              </div>
              {!preview && (
                <div className="flex flex-col  gap-1 justify-center">
                  <span className="text-[8px] text-gray-700 text-center">
                    حذف الكل
                  </span>
                  <div className="bg-lightGray rounded-md p-3 ">
                    <SvgDeleteIcon
                      action={deleteAllImagesHandler}
                      stroke="#ef4444"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* pdfs*/}
        <div className="flex items-center justify-center gap-2 m-3">
          {!!pdfs.length && (
            <>
              <div className="flex flex-col  gap-1 justify-center">
                <span className="text-[8px] text-gray-700 text-center">
                  الملفات
                </span>
                <div className="bg-lightGray rounded-md p-1 relative">
                  <div
                    onClick={() => setManyPdfsOpen(true)}
                    className="cursor-pointer flex items-center justify-center p-2 "
                  >
                    <span className=" absolute -top-1 -right-3 bg-mainGreen px-2 py-1 text-[7px] rounded-full text-white">
                      {pdfs.length}
                    </span>
                    <PDFSvgIcon stroke="#292D32" />
                  </div>
                </div>
              </div>
              {!preview && (
                <div className="flex flex-col  gap-1 justify-center">
                  <span className="text-[8px] text-gray-700 text-center">
                    حذف الكل
                  </span>
                  <div className="bg-lightGray rounded-md p-3 ">
                    <SvgDeleteIcon
                      action={deleteAllPdfsHandler}
                      stroke="#ef4444"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* preview */}

      {/* images*/}
      {!!images.length && lightboxOpen && (
        <CLightbox
          preview={preview}
          deleteFileHandler={deleteFileHandler}
          open={lightboxOpen}
          closeHandler={() => setLightboxOpen(false)}
          images={imagePreview}
        />
      )}
      {/* pdfs*/}
      {!!pdfs.length && manyPdfsOpen && (
        <Modal isOpen={manyPdfsOpen} onClose={setManyPdfsOpen}>
          <div className="grid grid-cols-5 gap-2 w-full mt-8">
            <div className=" col-span-1 scrollbar ">
              {pdfs.map((pdf) => (
                <div key={pdf.id}>
                  <div className="grid grid-flow-row-dense grid-cols-2 items-center justify-center gap-8">
                    <div className=" col-span-1 w-full">
                      <PdfViewer
                        preview={preview}
                        deleteFileHandler={() => deleteFileHandler(pdf.id)}
                        action={() => setActivePdf(pdf)}
                        file={pdf}
                        showControls={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-span-4 scrollbar">
              {activePdf && <PdfViewer preview file={activePdf} />}
              {!!!activePdf && (
                <span className=" h-full w-full  text-center flex items-center justify-center text-mainGreen">
                  إختر ملف ليتم عرضه
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
