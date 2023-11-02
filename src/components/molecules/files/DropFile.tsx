/////////// IMPORTS
///
import { ErrorMessage, useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect, useState } from "react"
import Dropzone from "react-dropzone"
import { CFile_TP, CImageFile_TP } from "../../../types"
import { pdfOrImage } from "../../../utils/helpers"
import { Button } from "../../atoms/buttons/Button"
import { UploadSvgIcon } from "../../atoms/icons"
import { FilesPreview } from "./FilesPreview"
///
/////////// Types
///
type DropFileProps_TP = {
  name: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const DropFile = ({ name }: DropFileProps_TP) => {
  /////////// VARIABLES
  ///
  // let images: CImageFile_TP[] = []
  // let pdfs: CFile_TP[] = []
  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, values } = useFormikContext<{
    [key: string]: any
  }>()
  ///
  /////////// STATES
  ///
  const [images, setImages] = useState<CImageFile_TP[]>([])
  const [pdfs, setPdfs] = useState<CFile_TP[]>([])
  ///
  /////////// SIDE EFFECTS
  ///
  // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
  // useEffect(() => {
  //   return () => {
  //     if (values) {
  //       const filesArr = values[name] as CFile_TP[]
  //       filesArr.forEach((file) => URL.revokeObjectURL(file.preview))
  //     }
  //   }
  // }, [])

  // update files and images states
  useEffect(() => {
    const imageFiles: CImageFile_TP[] = values[name]
    const images = imageFiles.filter((file) => pdfOrImage(file) === "image")
    setImages(images)

    const pdfFiles: CFile_TP[] = values[name]
    const pdfs = pdfFiles.filter((file) => pdfOrImage(file) === "pdf")
    setPdfs(pdfs)
  }, [values[name]])
  

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <div className=" grid grid-cols-4 gap-8 rounded-md bg-flatWhite p-3 pr-3 w-full">
      <div className=" col-span-4">
        <Dropzone
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/gif": [".gif"],
            "application/pdf": [".pdf"],
          }}
          onDrop={(acceptedFiles) => {
            setFieldValue(
              name,
              acceptedFiles.map((file) =>{
                return Object.assign(file, {
                  preview: URL.createObjectURL(file),
                  id: crypto.randomUUID(),
                })
              }
                
              )
            )
          }}
        >
          {({ getRootProps, getInputProps, open }) => (
            <div className="flex justify-center items-center gap-8">
              {/* from */}
              <div
                className="flex flex-col justify-center items-center rounded-lg w-full cursor-pointer  p-4 gap-2 shadows bg-gray-100"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <UploadSvgIcon stroke={"#A0A0A0"} />
                <p className="text-gray-500">{t("click to upload")}</p>
                <Button type="button">{`${t('upload filed')}`}</Button>

                <ErrorMessage
                  component="p"
                  name={name}
                  className="text-red-500"
                />
              </div>
              {(!!pdfs.length || !!images.length) && (
                <FilesPreview
                  // preview
                  formikFieldName={name}
                  pdfs={pdfs}
                  images={images}
                />
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  )
}
