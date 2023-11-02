/////////// IMPORTS
///
import { t } from "i18next"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CiFolderOn } from "react-icons/ci"
import { Button } from "../../../atoms"
import { Delete } from "../../../atoms/icons/Delete"
import { Edit } from "../../../atoms/icons/Edit"
import { InnerFormLayout, Modal } from "../../../molecules"
import { DocsData } from "./DocsData"
import { DocumentForm } from "./DocumentForm"
import { FormikSharedConfig, useFormikContext } from "formik"
///
/////////// Types
///
type DocumentsProps_TP = {
  docsFormValues: any
  setDocsFormValues: Dispatch<SetStateAction<any[]>>
  editable?: boolean
  isSuccessPost?: any
  restData?:any
}
export type DocType_TP = {
  id: string
  value: string
  label: string
}
export type allDocs_TP = {
  docName: string
  docNumber: string
  files: any
  docType: DocType_TP
  endDate: Date
  reminder: string
  id: string
}

export const  Documents = ({
  setDocsFormValues,
  docsFormValues,
  editable = false,
  isSuccessPost,
  restData,
}: DocumentsProps_TP) => {
  ///
  /////////// STATES
  ///
  const [addDocPopup, setAddDocPopup] = useState(false)
  const [show, setShow] = useState(false)
  const [docsData, setDocsData] = useState<allDocs_TP>()
  const [editableData, setEditableData] = useState<allDocs_TP>()

  ///
  /////////// SIDE EFFECTS
  ///
  const { resetForm } = useFormikContext<FormikSharedConfig>()

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  useEffect(() => {
    if (isSuccessPost) {
      resetForm()
      restData && restData()
    }
  }, [isSuccessPost])
  function handleOpenAddDoc() {
    setAddDocPopup(true)
  }

  function deleteDocHandler(id: string) {
    setDocsFormValues((prev: any) =>
      prev.filter((doc: allDocs_TP) => doc.id !== id)
    )
  }

  return (
    <>
      <InnerFormLayout
        title={t("documents")}
        leftComponent={
          <Button action={handleOpenAddDoc} >
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
                    {!editable && (
                      <Edit
                        action={() => {
                          setAddDocPopup(true)
                          setEditableData(item)
                        }}
                      />
                    )}
                    <Delete action={() => deleteDocHandler(item.id)} />
                  </div>
                  <CiFolderOn
                    className="text-[4rem] text-mainGreen cursor-pointer mx-5"
                    onClick={() => {
                      setDocsData(item)
                      setShow(true)
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
  )
}
