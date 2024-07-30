/////////// IMPORTS
///

import { useEffect, useState } from "react";
import { CFile_TP, CImageFile_TP } from "../../../types";
import { PDFSvgIcon, ViewSvgIcon } from "../../atoms/icons";
import { Modal } from "../Modal";
import { CLightbox } from "./CLightbox";
import { PdfViewer } from "./PdfViewer";

///
/////////// Types
///
type FilesPreviewOutFormikProps_TP = {
  images?: CImageFile_TP[];
  pdfs?: CFile_TP[];
  preview?: boolean;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const FilesPreviewOutFormik = ({
  images = [],
  pdfs = [],
  preview,
  isBudget,
}: FilesPreviewOutFormikProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [manyPdfsOpen, setManyPdfsOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<CFile_TP | null>();
  ///
  /////////// SIDE EFFECTS
  ///
  // change lightbox open state to false if images.length === 0
  useEffect(() => {
    if (images.length === 0) {
      setLightboxOpen(false);
    }
  }, [images.length]);
  // change pdfs modal open state to false if pdfs.length === 0
  useEffect(() => {
    if (pdfs.length === 0) {
      setManyPdfsOpen(false);
    }
  }, [pdfs.length]);
  // set first active pdf file
  useEffect(() => {
    setActivePdf(pdfs[0]);
  }, [JSON.stringify(pdfs)]);

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const imagePreview = images.map((image) => ({
    preview: image?.type === "image" ? image?.path : image?.preview,
    path: image?.preview,
    type: "image",
  }));
  ///
  return (
    <>
      <div className={`flex flex-${preview ? "row" : "col"} `}>
        {/* images*/}
        <div className="flex items-center justify-center gap-2 m-3 h-4">
          {!!images.length && (
            <>
              <div className="flex flex-col  gap-1 justify-center">
                {/* <span className="text-[8px] text-gray-700 text-center">
                  الصور
                </span> */}
                <div className="bg-lightGray rounded-md p-1 relative ">
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="cursor-pointer flex items-center justify-center p-2 "
                  >
                    {!isBudget && (
                      <span className=" absolute -top-1 flex justify-center items-center -right-3 bg-mainGreen px-1 py-1 w-4 h-4 rounded-full text-[8px] text-white">
                        {images.length}
                      </span>
                    )}

                    <ViewSvgIcon stroke="#292D32" />
                  </div>
                </div>
              </div>
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
            </>
          )}
        </div>
      </div>

      {/* preview */}

      {/* images*/}
      {!!images.length && lightboxOpen && (
        <CLightbox
          preview={preview}
          open={lightboxOpen}
          closeHandler={() => setLightboxOpen(false)}
          images={imagePreview}
        />
      )}
      {/* pdfs*/}
      {!!pdfs.length && manyPdfsOpen && (
        <Modal isOpen={manyPdfsOpen} onClose={setManyPdfsOpen}>
          <div className="grid grid-cols-5 gap-2 w-full mt-8">
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
  );
};
