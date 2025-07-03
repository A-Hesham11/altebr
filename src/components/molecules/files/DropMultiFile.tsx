import { ErrorMessage, useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import imageCompression from "browser-image-compression";
import { CFile_TP, CImageFile_TP } from "../../../types";
import { pdfOrImage } from "../../../utils/helpers";
import { Button } from "../../atoms/buttons/Button";
import { UploadSvgIcon } from "../../atoms/icons";
import { MultiFilesPreview } from "./MultiFilesPreview";

type DropFileProps_TP = {
  name: string;
};

export const DropMultiFile = ({ name }: DropFileProps_TP) => {
  const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();
  const [images, setImages] = useState<CImageFile_TP[]>([]);

  useEffect(() => {
    const imageFiles: CImageFile_TP[] = values[name];
    const images = imageFiles?.filter((file) => pdfOrImage(file) === "image");
    setImages(images);
  }, [values[name]]);

  const handleCompressedFiles = async (acceptedFiles: File[]) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const isImage = file.type.startsWith("image/");
        let finalFile = file;

        if (isImage) {
          try {
            finalFile = await imageCompression(file, options);
          } catch (err) {
            console.warn("Compression failed, using original image", err);
          }
        }

        return Object.assign(finalFile, {
          preview: URL.createObjectURL(finalFile),
          id: crypto.randomUUID(),
        });
      })
    );

    const currentFiles = values[name] || [];
    setFieldValue(name, [...currentFiles, ...compressedFiles]);
  };

  return (
    <div className="grid grid-cols-4 gap-8 rounded-md bg-flatWhite p-3 pr-3 w-full">
      <div className="col-span-4">
        <Dropzone
          accept={{
            "image/*": [],
            // "application/pdf": [".pdf"],
            // "application/msword": [".doc"],
            // "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            // "application/vnd.ms-excel": [".xls"],
            // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
          }}
          onDrop={handleCompressedFiles}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="flex justify-center items-center gap-8">
              <div
                className="flex flex-col justify-center items-center rounded-lg w-full cursor-pointer p-4 gap-2 shadows bg-gray-100"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <UploadSvgIcon stroke={"#A0A0A0"} />
                <p className="text-gray-500">{t("click to upload")}</p>
                <Button type="button">{t("upload filed")}</Button>
                <ErrorMessage
                  component="p"
                  name={name}
                  className="text-red-500"
                />
              </div>

              {!!images?.length && (
                <MultiFilesPreview formikFieldName={name} images={images} />
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};
