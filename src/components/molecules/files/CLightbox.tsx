/////////// IMPORTS
///
import { RiDeleteBin3Fill } from "react-icons/ri";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { CImageFile_TP } from "../../types";
///
/////////// Types
///

type CLightboxProps_TP = {
  images: CImageFile_TP[];
  deleteFileHandler?: (id: string) => void;
  preview?: boolean;
  open: boolean;
  closeHandler: () => void;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const CLightbox = ({
  images,
  open,
  preview,
  deleteFileHandler,
  closeHandler,
}: CLightboxProps_TP) => {
  /////////// VARIABLES
  ///
  const editedImages: SlideImageWithId_TP[] = images.map((image) => ({
    id: image.id,
    src: image.preview,
  }));

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
  interface SlideImageWithId_TP extends SlideImage {
    id?: string;
  }
  ///
  return (
    <Lightbox
      plugins={[Fullscreen, Slideshow, Zoom, Thumbnails]}
      open={open}
      close={closeHandler}
      slides={editedImages}
      carousel={{ finite: true }}
      // index={Math.round(editedImages.length / 2)}
      render={{
        thumbnail: ({ slide }: { slide: SlideImageWithId_TP }) => {
          if (!slide.src) return null;
          return (
            <>
              {!preview && (
                <RiDeleteBin3Fill
                  className="absolute top-2 start-2 z-30 w-5 fill-red-700 cursor-crosshair"
                  onClick={deleteFileHandler?.bind(null, slide.id)}
                />
              )}
              <div className="relative max-h-full" key={slide.id}>
                <img src={slide?.src} className="object-cover w-full" alt="" />
              </div>
            </>
          );
        },
      }}
    />
  );
};
