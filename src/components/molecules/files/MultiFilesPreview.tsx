import { useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import { CFile_TP, CImageFile_TP } from "../../../types";
import { SvgDeleteIcon, ViewSvgIcon } from "../../atoms/icons";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Lightbox from "yet-another-react-lightbox";
import { RiDeleteBin3Fill } from "react-icons/ri";

type FilesPreviewProps_TP = {
  images: CImageFile_TP[];
  formikFieldName?: string;
  preview?: boolean;
};

export const MultiFilesPreview = ({
  images,
  formikFieldName,
  preview,
}: FilesPreviewProps_TP) => {
  const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      setLightboxOpen(false);
    }
  }, [images.length]);

  const deleteFileHandler = (id: string) => {
    if (!formikFieldName) return;
    const current: CFile_TP[] = values[formikFieldName];
    const updated = current.filter((file) => file.id !== id);
    setFieldValue(formikFieldName, updated);
    setLightboxOpen(false);
  };

  const deleteAllImagesHandler = () => {
    if (!formikFieldName) return;
    const current: CFile_TP[] = values[formikFieldName];
    const filtered = current.filter(
      (file) => !file?.type?.startsWith("image/")
    );
    setFieldValue(formikFieldName, filtered);
  };

  const slides = useMemo(() => {
    return images?.map((img) => ({
      id: img.id,
      src: img.preview!,
      type: "image",
    }));
  }, [images]);

  return (
    <>
      <div
        className={`flex flex-${preview ? "row" : "col"} gap-${
          preview ? "6" : "1"
        }`}
      >
        <div className="flex items-center justify-center gap-2 mx-3">
          {!!images.length && (
            <>
              <div className="flex flex-col gap-1 justify-center">
                <span className="text-[8px] text-gray-700 text-center">
                  الصور
                </span>
                <div className="bg-lightGray rounded-md p-1 relative">
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="cursor-pointer flex items-center justify-center p-2"
                  >
                    <span className="absolute -top-1 -right-3 bg-mainGreen px-2 py-1 text-[7px] rounded-full text-white">
                      {images.length}
                    </span>
                    <ViewSvgIcon stroke="#292D32" />
                  </div>
                </div>
              </div>
              {!preview && (
                <div className="flex flex-col gap-1 justify-center">
                  <span className="text-[8px] text-gray-700 text-center">
                    حذف الكل
                  </span>
                  <div className="bg-lightGray rounded-md p-3">
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
      </div>

      {!!images.length && lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          carousel={{ finite: true }}
          plugins={[Fullscreen, Slideshow, Zoom, Thumbnails]}
          render={{
            slide: (slide) => {
              if (!slide?.src) return null;

              return (
                <div className="w-full h-full relative flex items-center justify-center">
                  <img
                    src={slide?.src}
                    alt=""
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                  {!preview && (
                    <button
                      className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 z-50"
                      onClick={() => deleteFileHandler(slide?.id)}
                    >
                      حذف
                    </button>
                  )}
                </div>
              );
            },
          }}
        />
      )}
    </>
  );
};
