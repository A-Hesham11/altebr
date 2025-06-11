import { ErrorMessage, useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
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

  return (
    <div className="grid grid-cols-4 gap-8 rounded-md bg-flatWhite p-3 pr-3 w-full">
      <div className="col-span-4">
        <Dropzone
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/gif": [".gif"],
          }}
          onDrop={(acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) => {
              return Object.assign(file, {
                preview: URL.createObjectURL(file),
                id: crypto.randomUUID(),
              });
            });

            const currentFiles = values[name] || [];
            setFieldValue(name, [...currentFiles, ...newFiles]);
          }}
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
