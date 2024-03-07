import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import React, { ChangeEvent, useEffect, useState } from "react";
import { BsImageFill } from "react-icons/bs";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { ViewSvgIcon } from "../../atoms/icons";
import { CLightbox } from "./CLightbox";

type FilesUploadProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: any;
};

export const FilesUpload: React.FC<FilesUploadProps> = ({
  files,
  setFiles,
}: FilesUploadProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const queryClient = useQueryClient();
  const {
    mutate,
    data,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["image"]);
      notify("success");
    },
  });

  // useEffect(() => {
  //     const formData = new FormData();
  //     files.forEach((file, index) => {
  //         formData.append(`file${index}`, file);
  //     })
  //     try {
  //         mutate({
  //             endpointName: `/branchManage/api/v1/reject-items`,
  //             method: "post",
  //             values: formData || [],
  //             dataType:'formData'
  //         });
  //     } catch (error) {
  //         console.error("Error uploading files:", error);
  //         notify("error");
  //     }
  // }, [files?.length])

  useEffect(() => {
    if (files?.length === 0) {
      setLightboxOpen(false);
    }
  }, [files?.length]);

  const imagePreview = files?.map((image) => {
    const imageURL = URL.createObjectURL(image);
    return {
      preview: imageURL,
      path: imageURL,
      type: "image",
    };
  });

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-end gap-9">
          <label className="w-full">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <span className="icon flex gap-4 items-center bg-mainGray px-6 py-2 rounded-lg cursor-pointer border-2 border-dashed border-[#0000001A] ">
              <BsImageFill size={20} />
              <span className="text-base font-medium">{t("attachments")}</span>
            </span>
          </label>
          <div className="flex items-center gap-2  w-fit ">
            {!!files?.length && (
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
                        {files?.length}
                      </span>
                      <ViewSvgIcon stroke="#292D32" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* images*/}
        {!!files?.length && lightboxOpen && (
          <CLightbox
            // preview={preview}
            open={lightboxOpen}
            closeHandler={() => setLightboxOpen(false)}
            images={imagePreview}
          />
        )}
      </form>
    </>
  );
};
