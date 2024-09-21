/////////// IMPORTS
///
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CiFolderOn } from "react-icons/ci";
import { Button } from "../../../atoms";
import { Delete } from "../../../atoms/icons/Delete";
import { Edit } from "../../../atoms/icons/Edit";
import { InnerFormLayout, Modal } from "../../../molecules";
import { DocsData } from "./DocsData";
import { DocumentForm } from "./DocumentForm";
import { FormikSharedConfig, useFormikContext } from "formik";
import { useMutate } from "../../../../hooks";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";
import { useQueryClient } from "@tanstack/react-query";
///
/////////// Types
///
type DocumentsProps_TP = {
  docsFormValues: any;
  setDocsFormValues: Dispatch<SetStateAction<any[]>>;
  editable?: boolean;
  isSuccessPost?: any;
  restData?: any;
};
export type DocType_TP = {
  id: string;
  value: string;
  label: string;
};
export type allDocs_TP = {
  docName: string;
  docNumber: string;
  files: any;
  docType: DocType_TP;
  endDate: Date;
  reminder: string;
  id: string;
};

export const Documents = ({
  setDocsFormValues,
  docsFormValues,
  editable = false,
  isSuccessPost,
  restData,
  setShow: setShowPopup,
}: DocumentsProps_TP) => {
  ///
  /////////// STATES
  ///
  const [addDocPopup, setAddDocPopup] = useState(false);
  console.log("🚀 ~ addDocPopup:", addDocPopup);
  const [show, setShow] = useState(false);
  console.log("🚀 ~ show:", show);
  const [docsData, setDocsData] = useState<allDocs_TP>();
  const [editableData, setEditableData] = useState<allDocs_TP>();
  console.log("🚀 ~ editableData:", editableData);
  const queryClient = useQueryClient();

  ///
  /////////// SIDE EFFECTS
  ///
  const { resetForm } = useFormikContext<FormikSharedConfig>();

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  useEffect(() => {
    if (isSuccessPost) {
      resetForm();
      restData && restData();
    }
  }, [isSuccessPost]);
  function handleOpenAddDoc() {
    setAddDocPopup(true);
  }

  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<any>({
    mutationFn: mutateData,
    onSuccess: () => {
      // setDataSource((prev: ViewCategories_TP[]) =>
      //   prev.filter((p) => p.id !== deleteData?.id)
      // )
      queryClient.refetchQueries(["AllBranches"]);
      // refetch()
      setShowPopup(false);
      notify("success");
    },
  });

  function deleteDocHandler(id: string) {
    // setDocsFormValues((prev: any) =>
    //   prev.filter((doc: allDocs_TP) => doc.id !== id)
    // );
    mutate({
      endpointName: `/branch/api/v1/deleted-item/${id}`,
      method: "post",
    });
  }

  return (
    <>
      <InnerFormLayout
        title={t("documents")}
        leftComponent={
          <Button action={handleOpenAddDoc}>
            {docsFormValues?.length > 0 ? (
              <span>{t("Add another document")}</span>
            ) : (
              <span>{t("Add document")}</span>
            )}
          </Button>
        }
        customStyle={!(docsFormValues?.length > 0) ? "bg-transparent" : ""}
      >
        {docsFormValues?.length > 0 && (
          <div className="col-span-4">
            <h2 className="mb-8 text-center">{t("available documents")}</h2>
            <div className="max-h-96 overflow-y-auto scrollbar flex flex-wrap justify-center items-center">
              {docsFormValues?.map((item: any) => (
                <div
                  className="w-1/4  flex justify-center items-center flex-col my-5"
                  key={item.id}
                >
                  <div className="flex gap-x-4 items-center">
                    {/* {!editable && ( */}
                      <Edit
                        action={() => {
                          setAddDocPopup(true);
                          setEditableData(item);
                        }}
                      />
                    {/* )} */}
                    <Delete action={() => deleteDocHandler(item.id)} />
                  </div>
                  <CiFolderOn
                    className="text-[4rem] text-mainGreen cursor-pointer mx-5"
                    onClick={() => {
                      setDocsData(item);
                      setShow(true);
                    }}
                  />
                  <span>
                    {t("document name")} : {item?.docName}
                  </span>
                  <span>
                    {t("document type")} : {item?.docType.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </InnerFormLayout>
      <Modal isOpen={addDocPopup} onClose={setAddDocPopup.bind(null, false)}>
        <DocumentForm
          setDocsFormValues={setDocsFormValues}
          setAddDocPopup={setAddDocPopup}
          editableData={editableData}
          setEditableData={setEditableData}
          addDocPopup={addDocPopup}
        />
      </Modal>
      <Modal isOpen={show} onClose={setShow.bind(null, false)}>
        <DocsData docsData={docsData} />
      </Modal>
    </>
  );
};
